import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Calendar, Clock, Mail as MailIcon } from 'lucide-react';
import { campaignService } from '../../../services/mockApi';
import './WizardSteps.css';

const Step6_Launch = ({ data }) => {
  const navigate = useNavigate();
  const [launching, setLaunching] = useState(false);
  const [launchConfig, setLaunchConfig] = useState({
    senderEmail: 'you@company.com',
    startDate: new Date().toISOString().split('T')[0],
    emailGap: 5,
    dailyLimit: 100
  });

  const handleLaunch = async () => {
    setLaunching(true);
    
    try {
      const campaignData = {
        name: data.campaignInfo?.name || 'Untitled Campaign',
        status: 'running',
        contactsCount: data.contacts?.length || 0,
        campaignInfo: data.campaignInfo,
        targetAudience: data.targetAudience,
        emailTemplate: data.emailTemplate || (data.generatedEmails?.[0] ? {
          subject: data.generatedEmails[0].subject,
          body: data.generatedEmails[0].body
        } : null),
        launchConfig,
        sentCount: data.contacts?.length || 0,
        openCount: 0,
        clickCount: 0,
        replyCount: 0,
        bounceCount: 0,
        openRate: 0,
        clickRate: 0,
        replyRate: 0
      };

      await campaignService.send(campaignData);
      
      localStorage.removeItem('campaign_draft');
      
      setTimeout(() => {
        navigate('/campaigns');
      }, 1000);
    } catch (error) {
      console.error('Failed to launch campaign:', error);
      alert('Failed to launch campaign');
      setLaunching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaunchConfig({...launchConfig, [name]: value});
  };

  return (
    <div>
      <h2 className="wizard-step-title">Launch Configuration</h2>
      <p className="wizard-step-description">
        Configure sending schedule and launch your campaign.
      </p>

      <div className="form-group">
        <label className="form-label form-label-required">
          <MailIcon size={16} style={{display: 'inline', marginRight: '8px'}} />
          Sender Email
        </label>
        <input
          type="email"
          name="senderEmail"
          className="form-input"
          value={launchConfig.senderEmail}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">
          <Calendar size={16} style={{display: 'inline', marginRight: '8px'}} />
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          className="form-input"
          value={launchConfig.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">
          <Clock size={16} style={{display: 'inline', marginRight: '8px'}} />
          Email Gap (minutes)
        </label>
        <input
          type="number"
          name="emailGap"
          className="form-input"
          value={launchConfig.emailGap}
          onChange={handleChange}
          min="1"
        />
        <span className="form-hint">Time between each email</span>
      </div>

      <div className="form-group">
        <label className="form-label form-label-required">
          Daily Limit
        </label>
        <input
          type="number"
          name="dailyLimit"
          className="form-input"
          value={launchConfig.dailyLimit}
          onChange={handleChange}
          min="1"
        />
        <span className="form-hint">Maximum emails to send per day</span>
      </div>

      <div className="launch-summary card">
        <h3>Campaign Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span>Campaign Name</span>
            <strong>{data.campaignInfo?.name || 'Untitled'}</strong>
          </div>
          <div className="summary-item">
            <span>Total Contacts</span>
            <strong>{Array.isArray(data.contacts) ? data.contacts.length : 0}</strong>
          </div>
          <div className="summary-item">
            <span>Valid Emails</span>
            <strong>{Array.isArray(data.contacts) ? data.contacts.filter(c => c.valid).length : 0}</strong>
          </div>
          <div className="summary-item">
            <span>Spam Risk</span>
            <strong className={`badge badge-${data.validationResult?.riskLevel === 'low' ? 'success' : 'warning'}`}>
              {data.validationResult?.riskLevel || 'N/A'}
            </strong>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg w-full mt-6"
        onClick={handleLaunch}
        disabled={launching}
      >
        {launching ? (
          <>Launching...</>
        ) : (
          <>
            <Rocket size={20} />
            Launch Campaign
          </>
        )}
      </button>
    </div>
  );
};

export default Step6_Launch;
