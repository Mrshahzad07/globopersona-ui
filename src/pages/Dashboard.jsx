import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Mail, Users, MousePointerClick, MessageSquare, Send, BarChart3, ArrowUpRight, Sparkles } from 'lucide-react';
import { dashboardService } from '../services/mockApi';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart,
  Pie, Cell, Legend,
} from 'recharts';
import './Dashboard.css';

const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target == null || isNaN(target)) return;
    const num = Number(target);
    if (num === 0) { setCount(0); return; }
    
    let start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      } else {
        setCount(num);
      }
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return count;
};

const formatNumber = (n) => {
  if (n == null || isNaN(n)) return '0';
  return Number(n).toLocaleString();
};

const AnimatedValue = ({ value, suffix = '' }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const animated = useCountUp(numericValue);
  return <>{formatNumber(animated)}{suffix}</>;
};

const ProgressBar = ({ value, color = 'primary', label }) => (
  <div className="metric-progress">
    {label && <div className="progress-label">{label}</div>}
    <div className="progress-bar-container">
      <div 
        className={`progress-bar-fill progress-${color}`}
        style={{ width: `${Math.min(value || 0, 100)}%` }}
      />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getMetrics(dateRange);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  if (!metrics) {
    return <div>Error loading dashboard</div>;
  }

  const chartData = metrics.chartData || [
    { label: 'Week 1', sent: 120, opens: 85, clicks: 42, replies: 12 },
    { label: 'Week 2', sent: 150, opens: 105, clicks: 52, replies: 15 },
    { label: 'Week 3', sent: 130, opens: 91, clicks: 45, replies: 14 },
    { label: 'Week 4', sent: 180, opens: 126, clicks: 63, replies: 18 },
  ];

  const statusColors = { running: '#10b981', completed: '#6b7280', draft: '#f59e0b', paused: '#3b82f6' };
  const statusChartData = metrics.statusBreakdown
    ? Object.entries(metrics.statusBreakdown).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, color: statusColors[name] || '#9ca3af' }))
    : [];

  const metricCards = [
    { icon: Mail, label: 'Total Campaigns', value: metrics.totalCampaigns, color: 'primary', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    { icon: TrendingUp, label: 'Active Now', value: metrics.activeCampaigns, color: 'success', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { icon: Users, label: 'Total Contacts', value: metrics.totalContacts, color: 'accent', gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
    { icon: Send, label: 'Emails Sent', value: metrics.totalSent, color: 'primary', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  ];

  const rateCards = [
    { label: 'Open Rate', value: metrics.openRate, color: 'success', icon: Mail, target: 100 },
    { label: 'Click Rate', value: metrics.clickRate, color: 'accent', icon: MousePointerClick, target: 100 },
    { label: 'Reply Rate', value: metrics.replyRate, color: 'warning', icon: MessageSquare, target: 100 },
  ];

  return (
    <div className="dashboard animate-fadeIn">
      <header className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-greeting">
            <Sparkles size={24} className="welcome-icon" />
            <div>
              <h1 className="dashboard-title">{getGreeting()}, User! 👋</h1>
              <p className="dashboard-subtitle">Here's what's happening with your campaigns</p>
            </div>
          </div>
        </div>
        <div className="dashboard-actions">
          <select
            className="date-range-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="btn btn-primary" onClick={() => navigate('/campaigns/create')}>
            <Plus size={20} />
            New Campaign
          </button>
        </div>
      </header>

      <section className="dashboard-metrics-section">
        <div className="metrics-grid">
          {metricCards.map((metric, index) => (
            <div key={index} className={`metric-card metric-${metric.color} animate-fadeInUp stagger-${index + 1}`}>
              <div className="metric-icon" style={{ background: metric.gradient }}>
                <metric.icon size={22} color="white" />
              </div>
              <div className="metric-content">
                <p className="metric-label">{metric.label}</p>
                <h3 className="metric-value">
                  <AnimatedValue value={metric.value} />
                </h3>
              </div>
              <ArrowUpRight size={16} className="metric-trend-icon" />
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-rates-section">
        <h2 className="dashboard-section-title">Performance Rates</h2>
        <div className="rates-grid">
          {rateCards.map((rate, index) => (
            <div key={index} className={`rate-card animate-fadeInUp stagger-${index + 5}`}>
              <div className="rate-header">
                <div className={`rate-icon rate-icon-${rate.color}`}>
                  <rate.icon size={20} />
                </div>
                <div className="rate-info">
                  <span className="rate-label">{rate.label}</span>
                  <span className={`rate-value rate-value-${rate.color}`}>
                    <AnimatedValue value={rate.value} suffix="%" />
                  </span>
                </div>
              </div>
              <ProgressBar value={rate.value} color={rate.color} />
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-charts-section">
        <div className="dashboard-chart-card card">
          <div className="card-header">
            <h3><BarChart3 size={20} /> Performance Trend</h3>
            <span className="text-secondary text-sm">Sent, opens, clicks, replies</span>
          </div>
          <div className="card-body chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip
                  formatter={(v) => formatNumber(v)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sent" name="Sent" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="opens" name="Opens" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="replies" name="Replies" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-chart-card card">
          <div className="card-header">
            <h3>Volume by Period</h3>
            <span className="text-secondary text-sm">Last period</span>
          </div>
          <div className="card-body chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData.slice(-7)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip
                  formatter={(v) => formatNumber(v)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="sent" name="Sent" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="opens" name="Opens" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="clicks" name="Clicks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {statusChartData.length > 0 && (
          <div className="dashboard-chart-card card dashboard-pie-card">
            <div className="card-header">
              <h3>Campaign Status</h3>
              <span className="text-secondary text-sm">Distribution</span>
            </div>
            <div className="card-body chart-body">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color || '#9ca3af'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatNumber(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      <section className="dashboard-recent-section">
        <div className="card recent-campaigns-card">
          <div className="card-header">
            <h3>Recent Campaigns</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/campaigns')}>
              View all →
            </button>
          </div>
          <div className="card-body">
            {metrics.recentCampaigns && metrics.recentCampaigns.length > 0 ? (
              <div className="campaign-list">
                {metrics.recentCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className={`campaign-item animate-fadeInUp stagger-${index + 1}`}
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <div className="campaign-item-left">
                      <div className={`campaign-status-dot status-${campaign.status}`} />
                      <div className="campaign-item-content">
                        <h4>{campaign.name}</h4>
                        <p className="text-sm text-secondary">
                          {formatNumber(campaign.contactsCount)} contacts · {formatNumber(campaign.sentCount)} sent · {campaign.openRate}% open
                        </p>
                      </div>
                    </div>
                    <span className={`badge badge-${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-campaigns">
                <Mail size={40} className="empty-icon" />
                <p>No campaigns yet. Create one to get started!</p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/campaigns/create')}>
                  <Plus size={16} /> Create Campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

function getStatusColor(status) {
  const colors = { running: 'success', completed: 'neutral', draft: 'warning', paused: 'info' };
  return colors[status] || 'neutral';
}

export default Dashboard;
