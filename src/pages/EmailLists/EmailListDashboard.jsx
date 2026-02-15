import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Trash2, Eye, ListChecks, Users, CalendarDays,
  Upload, ArrowUpRight, Sparkles, Mail, Hash
} from 'lucide-react';
import { emailListService } from '../../services/mockApi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import './EmailLists.css';

const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target == null || isNaN(target)) return;
    const num = Number(target);
    if (num === 0) { setCount(0); return; }

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

const AnimatedValue = ({ value, suffix = '' }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const animated = useCountUp(numericValue);
  return <>{animated.toLocaleString()}{suffix}</>;
};

const EmailListDashboard = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const debounceTimer = useRef(null);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm]);

  const loadLists = async () => {
    setLoading(true);
    try {
      const data = await emailListService.getAll();
      setLists(data);
    } catch (error) {
      console.error('Failed to load email lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLists = useMemo(() => {
    if (!debouncedSearch.trim()) return lists;
    const term = debouncedSearch.toLowerCase();
    return lists.filter(
      (l) =>
        l.name?.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term)
    );
  }, [lists, debouncedSearch]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this email list?')) {
      await emailListService.delete(id);
      loadLists();
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await emailListService.create(newListName.trim(), newListDesc.trim(), []);
    setNewListName('');
    setNewListDesc('');
    setShowCreateModal(false);
    loadLists();
  };

  const totalContacts = lists.reduce((sum, l) => sum + (l.contactsCount || 0), 0);
  const totalFields = lists.reduce((sum, l) => sum + (l.fieldsCount || 0), 0);
  const avgContacts = lists.length ? Math.round(totalContacts / lists.length) : 0;

  const chartColors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6'];
  const growthData = [
    { month: 'Oct', ...lists.reduce((acc, l, i) => ({ ...acc, [l.name]: Math.max(0, (l.contactsCount || 0) - 15 - i * 2) }), {}) },
    { month: 'Nov', ...lists.reduce((acc, l, i) => ({ ...acc, [l.name]: Math.max(0, (l.contactsCount || 0) - 12 - i) }), {}) },
    { month: 'Dec', ...lists.reduce((acc, l, i) => ({ ...acc, [l.name]: Math.max(0, (l.contactsCount || 0) - 8) }), {}) },
    { month: 'Jan', ...lists.reduce((acc, l, i) => ({ ...acc, [l.name]: Math.max(0, (l.contactsCount || 0) - 4) }), {}) },
    { month: 'Feb', ...lists.reduce((acc, l, i) => ({ ...acc, [l.name]: (l.contactsCount || 0) }), {}) },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading email lists..." />;
  }

  const metricCards = [
    { icon: ListChecks, label: 'Total Lists', value: lists.length, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    { icon: Users, label: 'Total Contacts', value: totalContacts, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { icon: Hash, label: 'Data Fields', value: totalFields, gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
    { icon: Mail, label: 'Avg. per List', value: avgContacts, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  ];

  return (
    <div className="email-lists-page animate-fadeIn">
      <header className="el-dashboard-header">
        <div className="el-welcome">
          <div className="el-welcome-greeting">
            <Sparkles size={24} className="el-welcome-icon" />
            <div>
              <h1 className="el-dashboard-title">{getGreeting()}! 📋</h1>
              <p className="el-dashboard-subtitle">Manage your email contact lists</p>
            </div>
          </div>
        </div>
        <div className="el-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
            New List
          </button>
        </div>
      </header>

      <section className="el-metrics-section">
        <div className="el-metrics-grid">
          {metricCards.map((metric, index) => (
            <div key={index} className={`el-metric-card animate-fadeInUp stagger-${index + 1}`}>
              <div className="el-metric-icon" style={{ background: metric.gradient }}>
                <metric.icon size={22} color="white" />
              </div>
              <div className="el-metric-content">
                <p className="el-metric-label">{metric.label}</p>
                <h3 className="el-metric-value">
                  <AnimatedValue value={metric.value} />
                </h3>
              </div>
              <ArrowUpRight size={16} className="el-metric-trend" />
            </div>
          ))}
        </div>
      </section>

      {lists.length > 0 && (
        <section className="el-chart-section">
          <div className="el-chart-card card">
            <h3 className="el-section-title">
              <Users size={18} />
              Contact Growth Trends
            </h3>
            <div className="el-chart-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    {lists.map((list, i) => (
                      <linearGradient key={list.id} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--text-tertiary)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="var(--text-tertiary)"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      padding: '12px'
                    }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                    iconType="line"
                  />
                  {lists.map((list, i) => (
                    <Area
                      key={list.id}
                      type="monotone"
                      dataKey={list.name}
                      stroke={chartColors[i % chartColors.length]}
                      strokeWidth={2.5}
                      fill={`url(#gradient-${i})`}
                      animationDuration={1500}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      <section className="el-lists-section">
        <div className="el-lists-header">
          <h2 className="el-section-title">
            <ListChecks size={18} />
            All Email Lists
          </h2>
          <div className="search-box el-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredLists.length === 0 ? (
          <EmptyState
            icon={Upload}
            title="No email lists yet"
            description="Create your first email list to organize your contacts"
            action={
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                Create Email List
              </button>
            }
          />
        ) : (
          <div className="el-grid">
            {filteredLists.map((list, index) => (
              <div
                key={list.id}
                className={`el-card animate-fadeInUp stagger-${Math.min(index + 1, 7)}`}
                onClick={() => navigate(`/email-lists/${list.id}`)}
              >
                <div className="el-card-accent" />
                <div className="el-card-inner">
                  <div className="el-card-header">
                    <h3 className="el-card-name">{list.name}</h3>
                    <span className="badge badge-info">
                      {list.contactsCount || 0} contacts
                    </span>
                  </div>

                  {list.description && (
                    <p className="el-card-desc">{list.description}</p>
                  )}

                  <div className="el-card-stats">
                    <div className="el-mini-stat">
                      <span className="el-mini-value">{list.contactsCount || 0}</span>
                      <span className="el-mini-label">Contacts</span>
                    </div>
                    <div className="el-mini-stat">
                      <span className="el-mini-value">{list.fieldsCount || 0}</span>
                      <span className="el-mini-label">Fields</span>
                    </div>
                  </div>

                  <div className="el-card-footer">
                    <span className="el-card-date">
                      {new Date(list.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <div className="el-card-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/email-lists/${list.id}`);
                        }}
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="action-btn action-btn-danger"
                        onClick={(e) => handleDelete(list.id, e)}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content el-create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Create Email List</h2>
                <p className="text-muted">Add a new list to organize your contacts</p>
              </div>
              <button className="icon-button" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>List Name</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Sale Campaign"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Describe this email list..."
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateList}
                disabled={!newListName.trim()}
              >
                <Plus size={18} />
                Create List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailListDashboard;
