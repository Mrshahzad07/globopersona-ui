import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Trash2, Mail, Users, MousePointerClick, MessageSquare, Calendar, Hash, TrendingUp, CheckCircle } from 'lucide-react';
import { campaignService } from '../../services/mockApi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './CampaignDetails.css';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    try {
      const data = await campaignService.getById(id);
      setCampaign(data);
    } catch (error) {
      console.error('Failed to load campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseResume = async () => {
    setActionLoading(true);
    try {
      const newStatus = campaign.status === 'running' ? 'paused' : 'running';
      const updated = await campaignService.update(id, { status: newStatus });
      setCampaign(updated);
    } catch (error) {
      console.error('Failed to update campaign status:', error);
      alert('Failed to update campaign status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setActionLoading(true);
      try {
        await campaignService.delete(id);
        navigate('/campaigns');
      } catch (error) {
        console.error('Failed to delete campaign:', error);
        alert('Failed to delete campaign');
        setActionLoading(false);
      }
    }
  };

  const handleMarkCompleted = async () => {
    if (window.confirm('Mark this campaign as completed?')) {
      setActionLoading(true);
      try {
        const updated = await campaignService.update(id, { status: 'completed' });
        setCampaign(updated);
      } catch (error) {
        console.error('Failed to mark campaign as completed:', error);
        alert('Failed to mark campaign as completed');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading campaign..." />;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  const stats = [
    { icon: Mail, label: 'Total Sent', value: campaign.sentCount || 0, color: 'primary', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    { icon: Users, label: 'Opened', value: campaign.openCount || 0, rate: campaign.openRate || 0, color: 'success', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { icon: MousePointerClick, label: 'Clicked', value: campaign.clickCount || 0, rate: campaign.clickRate || 0, color: 'accent', gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
    { icon: MessageSquare, label: 'Replied', value: campaign.replyCount || 0, color: 'warning', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  ];

  return (
    <div className="campaign-details-page animate-fadeIn">
      <div className="details-header">
        <button className="btn btn-ghost" onClick={() => navigate('/campaigns')}>
          <ArrowLeft size={20} />
          Back to Campaigns
        </button>
        <div className="details-actions">
          {campaign.status !== 'completed' && (
            <>
              <button 
                className="btn btn-secondary"
                onClick={handlePauseResume}
                disabled={actionLoading}
              >
                {campaign.status === 'running' ? <Pause size={18} /> : <Play size={18} />}
                {actionLoading ? 'Updating...' : (campaign.status === 'running' ? 'Pause' : 'Resume')}
              </button>
              <button 
                className="btn btn-complete"
                onClick={handleMarkCompleted}
                disabled={actionLoading}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none' }}
              >
                <CheckCircle size={18} />
                {actionLoading ? 'Updating...' : 'Mark Completed'}
              </button>
            </>
          )}
          <button 
            className="btn btn-danger" 
            onClick={handleDelete}
            disabled={actionLoading}
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className={`campaign-banner banner-${campaign.status}`}>
        <div className="banner-content">
          <div className="banner-info">
            <h1 className="campaign-title">{campaign.name}</h1>
            <div className="campaign-meta-row">
              <span className="meta-item"><Calendar size={14} /> {new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="meta-item"><Hash size={14} /> {campaign.contactsCount || 0} contacts</span>
              {campaign.senderEmail && <span className="meta-item"><Mail size={14} /> {campaign.senderEmail}</span>}
            </div>
          </div>
          <span className={`badge badge-${getStatusColor(campaign.status)} badge-lg`}>
            <span className={`status-dot dot-${campaign.status}`} />
            {campaign.status}
          </span>
        </div>
      </div>

      <div className="campaign-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`detail-stat-card animate-fadeInUp stagger-${index + 1}`}>
            <div className="detail-stat-icon" style={{ background: stat.gradient }}>
              <stat.icon size={22} color="white" />
            </div>
            <div className="detail-stat-content">
              <p className="detail-stat-label">{stat.label}</p>
              <h3 className="detail-stat-value">{stat.value}</h3>
              {stat.rate !== undefined && (
                <div className="detail-stat-rate">
                  <div className="progress-bar-container" style={{ height: '6px' }}>
                    <div 
                      className={`progress-bar-fill progress-${stat.color}`}
                      style={{ width: `${Math.min(stat.rate, 100)}%` }}
                    />
                  </div>
                  <span className={`rate-percent rate-${stat.color}`}>{stat.rate}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="details-grid">
        {campaign.emailTemplate && (
          <div className="card detail-card animate-fadeInUp stagger-5">
            <div className="card-header detail-card-header">
              <div className="detail-card-title">
                <Mail size={18} className="detail-card-icon" />
                <h3>Email Template</h3>
              </div>
            </div>
            <div className="card-body">
              <div className="email-preview-enhanced">
                <div className="email-subject-bar">
                  <span className="email-label">SUBJECT</span>
                  <span className="email-subject-text">{campaign.emailTemplate.subject || 'No subject'}</span>
                </div>
                <div className="email-body-area">
                  <span className="email-label">BODY</span>
                  <div className="email-body-text">
                    {campaign.emailTemplate.body || 'No email body available'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {campaign.campaignInfo && (
          <div className="card detail-card animate-fadeInUp stagger-6">
            <div className="card-header detail-card-header">
              <div className="detail-card-title">
                <TrendingUp size={18} className="detail-card-icon" />
                <h3>Campaign Information</h3>
              </div>
            </div>
            <div className="card-body">
              <div className="info-grid-enhanced">
                {campaign.campaignInfo.companyDescription && (
                  <div className="info-item-enhanced">
                    <span className="info-label-enhanced">Company</span>
                    <p>{campaign.campaignInfo.companyDescription}</p>
                  </div>
                )}
                {campaign.campaignInfo.productService && (
                  <div className="info-item-enhanced">
                    <span className="info-label-enhanced">Product/Service</span>
                    <p>{campaign.campaignInfo.productService}</p>
                  </div>
                )}
                {campaign.campaignInfo.offer && (
                  <div className="info-item-enhanced">
                    <span className="info-label-enhanced">Offer</span>
                    <p>{campaign.campaignInfo.offer}</p>
                  </div>
                )}
                {campaign.campaignInfo.goal && (
                  <div className="info-item-enhanced">
                    <span className="info-label-enhanced">Goal</span>
                    <p className="capitalize">{campaign.campaignInfo.goal?.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {campaign.targetAudience && (
          <div className="card detail-card animate-fadeInUp stagger-7">
            <div className="card-header detail-card-header">
              <div className="detail-card-title">
                <Users size={18} className="detail-card-icon" />
                <h3>Target Audience</h3>
              </div>
            </div>
            <div className="card-body">
              <div className="info-grid-enhanced">
                {campaign.targetAudience.industries?.length > 0 && (
                  <div className="info-item-enhanced">
                    <span className="info-label-enhanced">Industries</span>
                    <div className="tags-enhanced">
                      {campaign.targetAudience.industries.map((industry, i) => (
                        <span key={i} className="tag-chip tag-primary">{industry}</span>
                      ))}
                    </div>
                  </div>
                )}
                {campaign.targetAudience.jobRoles?.length > 0 && (
                  <div className="info-item-enhanced">
                    <span className="info-label-enhanced">Job Roles</span>
                    <div className="tags-enhanced">
                      {campaign.targetAudience.jobRoles.map((role, i) => (
                        <span key={i} className="tag-chip tag-accent">{role}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = { running: 'success', completed: 'neutral', draft: 'warning', paused: 'info' };
  return colors[status] || 'neutral';
};

export default CampaignDetails;
