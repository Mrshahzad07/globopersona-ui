import { useState, useEffect } from 'react';
import { TrendingUp, Mail, Users, MousePointerClick, MessageSquare, BarChart3, Activity } from 'lucide-react';
import { dashboardService } from '../../services/mockApi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getMetrics(dateRange);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading analytics..." />;
  }

  const timeSeriesData = metrics?.chartData || [
    { date: 'Week 1', sent: 120, opens: 85, clicks: 42 },
    { date: 'Week 2', sent: 150, opens: 105, clicks: 52 },
    { date: 'Week 3', sent: 130, opens: 91, clicks: 45 },
    { date: 'Week 4', sent: 180, opens: 126, clicks: 63 },
  ];

  const statusData = [
    { name: 'Running', value: metrics?.statusBreakdown?.running || 2, color: '#10b981' },
    { name: 'Completed', value: metrics?.statusBreakdown?.completed || 1, color: '#6b7280' },
    { name: 'Draft', value: metrics?.statusBreakdown?.draft || 1, color: '#f59e0b' },
    { name: 'Paused', value: metrics?.statusBreakdown?.paused || 0, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  const stats = [
    { icon: Mail, label: 'Total Sent', value: metrics?.totalSent || '580', color: 'primary', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    { icon: Users, label: 'Total Opens', value: metrics?.totalOpens || '407', color: 'success', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { icon: MousePointerClick, label: 'Total Clicks', value: metrics?.totalClicks || '202', color: 'accent', gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
    { icon: MessageSquare, label: 'Total Replies', value: metrics?.totalReplies || '42', color: 'warning', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  ];

  return (
    <div className="analytics-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h2 className="page-title">Analytics</h2>
          <p className="page-subtitle">Campaign performance insights & trends</p>
        </div>
        <select
          className="date-range-select"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="analytics-stats">
        {stats.map((stat, index) => (
          <div key={index} className={`analytics-stat-card animate-fadeInUp stagger-${index + 1}`}>
            <div className="as-icon" style={{ background: stat.gradient }}>
              <stat.icon size={22} color="white" />
            </div>
            <div className="as-content">
              <span className="as-label">{stat.label}</span>
              <span className={`as-value as-value-${stat.color}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card chart-card animate-fadeInUp stagger-5">
          <div className="card-header chart-card-header">
            <div className="chart-title-group">
              <Activity size={18} className="chart-title-icon" />
              <h3>Performance Over Time</h3>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Legend />
                <Line type="monotone" dataKey="sent" name="Sent" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }} />
                <Line type="monotone" dataKey="opens" name="Opens" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }} />
                <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card animate-fadeInUp stagger-6">
          <div className="card-header chart-card-header">
            <div className="chart-title-group">
              <BarChart3 size={18} className="chart-title-icon" />
              <h3>Week Comparison</h3>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Legend />
                <Bar dataKey="opens" name="Opens" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="clicks" name="Clicks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card animate-fadeInUp stagger-7">
          <div className="card-header chart-card-header">
            <div className="chart-title-group">
              <TrendingUp size={18} className="chart-title-icon" />
              <h3>Campaign Status</h3>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
