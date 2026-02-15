import { CheckCircle, Sparkles, Target, TrendingUp, MessageSquare, Settings } from 'lucide-react';
import './AIComponents.css';

const AIConfigurationSummary = ({ config, campaignInfo, onEdit, onContinue }) => {
  return (
    <div className="ai-config-summary-page">
      <div className="config-summary-header">
        <div className="header-content">
          <h1>AI Configuration Complete!</h1>
          <p>Your personalized email campaign is ready to be deployed</p>
        </div>
        <div className="config-status-badge">
          <CheckCircle size={20} />
          <span>AI Configured</span>
        </div>
      </div>

      <div className="campaign-quick-info card">
        <div className="info-row">
          <span className="info-label">Campaign Name:</span>
          <strong>{campaignInfo?.name || 'Untitled Campaign'}</strong>
        </div>
        <div className="info-row">
          <span className="info-label">Email List:</span>
          <strong>{campaignInfo?.emailListName || 'Not selected'}</strong>
        </div>
        <div className="info-row">
          <span className="info-label">AI Status:</span>
          <span className="badge badge-success">
            <CheckCircle size={14} />
            Configured
          </span>
        </div>
      </div>

      <div className="config-summary-grid">
        <div className="config-cards-section">
          <h2>Your AI Configuration</h2>

          <div className="config-card card">
            <div className="config-card-header">
              <div className="card-icon gradient-bg-purple">
                <Sparkles size={20} color="white" />
              </div>
              <h3>Company Info</h3>
            </div>
            <p>{config.companyInfo}</p>
          </div>

          <div className="config-card card">
            <div className="config-card-header">
              <div className="card-icon gradient-bg-purple">
                <Target size={20} color="white" />
              </div>
              <h3>Product/Service</h3>
            </div>
            <p>{config.productService}</p>
          </div>

          <div className="config-card card">
            <div className="config-card-header">
              <div className="card-icon gradient-bg-purple">
                <TrendingUp size={20} color="white" />
              </div>
              <h3>Target Audience</h3>
            </div>
            <p>{config.targetAudience}</p>
          </div>

          <div className="config-card card">
            <div className="config-card-header">
              <div className="card-icon gradient-bg-purple">
                <MessageSquare size={20} color="white" />
              </div>
              <h3>Pain Points Addressed</h3>
            </div>
            <p>{config.painPoints}</p>
          </div>

          <div className="config-card card">
            <div className="config-card-header">
              <div className="card-icon gradient-bg-purple">
                <Settings size={20} color="white" />
              </div>
              <h3>Configuration Settings</h3>
            </div>
            <div className="config-settings-grid">
              <div className="setting-item">
                <span className="setting-label">Tone:</span>
                <span className="setting-value capitalize">{config.tone}</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">Call-to-Action:</span>
                <span className="setting-value">{config.callToAction}</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">Value Proposition:</span>
                <span className="setting-value">{config.valueProposition}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-personalization-sidebar">
          <div className="sidebar-card gradient-bg-purple">
            <h3>✨ AI Personalization</h3>
            
            <div className="personalization-section">
              <h4>For Each Contact:</h4>
              <ul>
                <li><CheckCircle size={16} /> Personalized subject lines</li>
                <li><CheckCircle size={16} /> Tailored opening & body content</li>
                <li><CheckCircle size={16} /> Industry-specific pain points</li>
                <li><CheckCircle size={16} /> Role-relevant value propositions</li>
                <li><CheckCircle size={16} /> Company-specific examples</li>
                <li><CheckCircle size={16} /> Optimized call-to-action</li>
              </ul>
            </div>

            <div className="personalization-section">
              <h4>Using Your Configuration:</h4>
              <ul>
                <li><CheckCircle size={16} /> {config.tone} tone throughout</li>
                <li><CheckCircle size={16} /> Highlights {config.productService}</li>
                <li><CheckCircle size={16} /> Addresses pain points</li>
                <li><CheckCircle size={16} /> Drives to {config.callToAction}</li>
              </ul>
            </div>
          </div>

          <div className="next-steps-card card">
            <h4>Next Steps</h4>
            <ol className="next-steps-list">
              <li>
                <strong>Select Contacts</strong>
                <p className="text-muted">Choose which contacts to target</p>
              </li>
              <li>
                <strong>Generate AI Emails</strong>
                <p className="text-muted">AI will create personalized emails</p>
              </li>
              <li>
                <strong>Review & Approve</strong>
                <p className="text-muted">Review generated emails before sending</p>
              </li>
              <li>
                <strong>Launch Campaign</strong>
                <p className="text-muted">Send personalized emails to contacts</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="config-summary-actions">
        <button className="btn btn-secondary" onClick={onEdit}>
          Reconfigure AI Settings
        </button>
        <button className="btn btn-primary" onClick={onContinue}>
          Select Target Contacts →
        </button>
      </div>
    </div>
  );
};

export default AIConfigurationSummary;
