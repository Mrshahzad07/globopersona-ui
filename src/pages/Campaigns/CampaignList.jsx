import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Play, Pause, Trash2, Eye, Mail, Users, TrendingUp } from 'lucide-react';
import { campaignService } from '../../services/mockApi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import './CampaignList.css';

const CampaignList = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  useEffect(() => {
    loadCampaigns();
  }, [statusFilter]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const { data } = await campaignService.getAll({ status: statusFilter, search: '' });
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    if (!debouncedSearch.trim()) return campaigns;
    const term = debouncedSearch.toLowerCase();
    return campaigns.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.subject?.toLowerCase().includes(term)
    );
  }, [campaigns, debouncedSearch]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      await campaignService.delete(id);
      loadCampaigns();
    }
  };

  const handleStatusToggle = async (campaign, e) => {
    e.stopPropagation();
    const newStatus = campaign.status === 'running' ? 'paused' : 'running';
    await campaignService.update(campaign.id, { status: newStatus });
    loadCampaigns();
  };

  const statusCounts = {
    all: campaigns.length,
    running: campaigns.filter(c => c.status === 'running').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading campaigns..." />;
  }

  return (
    <div className="campaign-list-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h2 className="page-title">Campaigns</h2>
          <p className="page-subtitle">
            Manage and monitor your email campaigns
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/campaigns/create')}
        >
          <Plus size={20} />
          New Campaign
        </button>
      </div>

      <div className="campaign-quick-stats">
        <div className="quick-stat">
          <Mail size={18} className="qs-icon qs-icon-primary" />
          <div>
            <span className="qs-value">{campaigns.length}</span>
            <span className="qs-label">Total</span>
          </div>
        </div>
        <div className="quick-stat">
          <TrendingUp size={18} className="qs-icon qs-icon-success" />
          <div>
            <span className="qs-value">{statusCounts.running}</span>
            <span className="qs-label">Active</span>
          </div>
        </div>
        <div className="quick-stat">
          <Users size={18} className="qs-icon qs-icon-accent" />
          <div>
            <span className="qs-value">{campaigns.reduce((a, c) => a + (c.contactsCount || 0), 0)}</span>
            <span className="qs-label">Contacts</span>
          </div>
        </div>
      </div>

      <div className="filters-section card">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="status-filters">
          {['all', 'running', 'paused', 'completed', 'draft'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'filter-btn-active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="filter-count">{statusCounts[status] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No campaigns found"
          description="Get started by creating your first email campaign"
          action={
            <button
              className="btn btn-primary"
              onClick={() => navigate('/campaigns/create')}
            >
              <Plus size={20} />
              Create Campaign
            </button>
          }
        />
      ) : (
        <div className="campaigns-grid">
          {filteredCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className={`campaign-card animate-fadeInUp stagger-${Math.min(index + 1, 7)}`}
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
              <div className={`campaign-card-accent accent-${campaign.status}`} />
              <div className="campaign-card-inner">
                <div className="campaign-card-header">
                  <h3 className="campaign-name">{campaign.name}</h3>
                  <span className={`badge badge-${getStatusColor(campaign.status)}`}>
                    <span className={`status-indicator si-${campaign.status}`} />
                    {campaign.status}
                  </span>
                </div>

                <div className="campaign-stats-row">
                  <div className="mini-stat">
                    <span className="mini-stat-value">{campaign.contactsCount || 0}</span>
                    <span className="mini-stat-label">Contacts</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-stat-value">{campaign.sentCount || 0}</span>
                    <span className="mini-stat-label">Sent</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-stat-value mini-stat-highlight">{campaign.openRate || 0}%</span>
                    <span className="mini-stat-label">Opens</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-stat-value mini-stat-highlight">{campaign.clickRate || 0}%</span>
                    <span className="mini-stat-label">Clicks</span>
                  </div>
                </div>

                <div className="campaign-progress-wrapper">
                  <div className="progress-bar-container progress-bar-campaign">
                    <div 
                      className={`progress-bar-fill progress-${getProgressColor(campaign.status)}`}
                      style={{ width: `${Math.min(campaign.openRate || 0, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="campaign-card-footer">
                  <span className="campaign-date">
                    {new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div className="campaign-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/campaigns/${campaign.id}`);
                      }}
                      title="View details"
                    >
                      <Eye size={15} />
                    </button>
                    {campaign.status !== 'completed' && (
                      <button
                        className="action-btn"
                        onClick={(e) => handleStatusToggle(campaign, e)}
                        title={campaign.status === 'running' ? 'Pause' : 'Resume'}
                      >
                        {campaign.status === 'running' ? <Pause size={15} /> : <Play size={15} />}
                      </button>
                    )}
                    <button
                      className="action-btn action-btn-danger"
                      onClick={(e) => handleDelete(campaign.id, e)}
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
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = { running: 'success', completed: 'neutral', draft: 'warning', paused: 'info' };
  return colors[status] || 'neutral';
};

const getProgressColor = (status) => {
  const colors = { running: 'success', completed: 'primary', draft: 'warning', paused: 'info' };
  return colors[status] || 'primary';
};

export default CampaignList;
