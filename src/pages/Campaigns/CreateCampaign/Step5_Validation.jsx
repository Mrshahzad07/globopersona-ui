import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Send, Calendar, Mail, User, Clock, Rocket } from 'lucide-react';
import { senderAccountService, campaignService } from '../../../services/mockApi';
import './WizardSteps.css';

const Step5_Validation = ({ data, updateData }) => {
  const navigate = useNavigate();
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [senderAccounts, setSenderAccounts] = useState([]);
  const [selectedSender, setSelectedSender] = useState('');
  const [sendOptions, setSendOptions] = useState({
    sendNow: true,
    scheduleDate: '',
    scheduleTime: '',
    testEmail: ''
  });
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  useEffect(() => {
    loadSenderAccounts();
  }, []);

  useEffect(() => {
    runValidation();
  }, [data.generatedEmails]);

  const loadSenderAccounts = async () => {
    const accounts = await senderAccountService.getAll();
    setSenderAccounts(accounts);
    const defaultAccount = accounts.find(acc => acc.isDefault);
    if (defaultAccount) {
      setSelectedSender(defaultAccount.id);
      updateData('selectedSender', defaultAccount.id);
    }
  };

  const runValidation = async () => {
    setValidating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const approvedCount = data.generatedEmails?.filter(e => e.status === 'approved')?.length || 0;
    const totalEmails = data.generatedEmails?.length || 0;
    
    const result = {
      spamScore: Math.floor(Math.random() * 30) + 10, // 10-40
      deliverability: Math.floor(Math.random() * 15) + 85, // 85-100
      predictedOpenRate: Math.floor(Math.random() * 20) + 25, // 25-45
      riskLevel: approvedCount > 0 ? 'low' : 'high',
      issues: approvedCount === 0 ? [
        { message: 'No emails have been approved yet' }
      ] : [],
      summary: {
        totalContacts: data.selectedContactIds?.length || 0,
        approvedEmails: approvedCount,
        estimatedDeliveryTime: `${Math.ceil((approvedCount * 0.5) / 60)} minutes`
      }
    };
    
    setValidationResult(result);
    updateData('validationResult', result);
    setValidating(false);
  };

  const handleSendOptionChange = (key, value) => {
    const updated = { ...sendOptions, [key]: value };
    setSendOptions(updated);
    updateData('sendOptions', updated);
  };

  const handleLaunch = () => {
    if (!selectedSender) {
      alert('Please select a sender account');
      return;
    }
    
    if (validationResult.summary.approvedEmails === 0) {
      alert('Please approve at least one email before launching');
      return;
    }
    
    setShowLaunchModal(true);
  };

  const confirmLaunch = async () => {
    setLaunching(true);
    try {
      const senderAccount = senderAccounts.find(a => a.id === selectedSender);
      const campaignData = {
        name: data.campaignInfo?.name || data.name || 'Untitled Campaign',
        status: 'running',
        contactsCount: data.selectedContactIds?.length || data.contacts?.length || 0,
        campaignInfo: data.campaignInfo,
        targetAudience: data.targetAudience,
        emailTemplate: data.emailTemplate || (data.generatedEmails?.[0] ? {
          subject: data.generatedEmails[0].subject,
          body: data.generatedEmails[0].body
        } : null),
        senderEmail: senderAccount?.email || 'noreply@company.com',
        sendOptions,
        validationResult,
        sentCount: validationResult.summary.approvedEmails,
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
      setShowLaunchModal(false);
      navigate('/campaigns');
    } catch (error) {
      console.error('Failed to launch campaign:', error);
      alert('Failed to launch campaign. Please try again.');
      setLaunching(false);
    }
  };

  if (validating) {
    return (
      <div className="validation-loading">
        <div className="loading-spinner"></div>
        <h3>Validating Campaign...</h3>
        <p className="text-muted">Checking spam scores, deliverability, and email variables</p>
      </div>
    );
  }

  if (!validationResult) return null;

  const getRiskColor = (level) => {
    if (level === 'low') return 'success';
    if (level === 'medium') return 'warning';
    return 'error';
  };

  return (
    <div>
      <h2 className="wizard-step-title">Validation & Launch</h2>
      <p className="wizard-step-description">
        Review your campaign metrics and configure delivery settings before launch
      </p>

      <div className="section-card">
        <h3 className="section-title-h3">📊 Campaign Summary</h3>
        <div className="campaign-summary-grid">
          <div className="summary-stat">
            <span className="summary-stat-label">Campaign Name</span>
            <strong>{data.campaignInfo?.name || 'Untitled Campaign'}</strong>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label">Email List</span>
            <strong>{data.emailListName || 'Not selected'}</strong>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label">Total Contacts</span>
            <strong className="text-primary">{validationResult.summary.totalContacts}</strong>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label">Approved Emails</span>
            <strong className="text-success">{validationResult.summary.approvedEmails}</strong>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label">Est. Delivery Time</span>
            <strong>{validationResult.summary.estimatedDeliveryTime}</strong>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title-h3">✅ Validation Checks</h3>
        <div className="validation-grid">
          <div className={`validation-card card-${getRiskColor(validationResult.riskLevel)}`}>
            <Shield size={32} />
            <div>
              <p className="validation-label">Spam Risk</p>
              <h3 className="validation-value">{validationResult.riskLevel.toUpperCase()}</h3>
              <p className="validation-score">Score: {validationResult.spamScore}/100</p>
            </div>
          </div>

          <div className="validation-card card-success">
            <TrendingUp size={32} />
            <div>
              <p className="validation-label">Deliverability</p>
              <h3 className="validation-value">{validationResult.deliverability}%</h3>
              <p className="validation-score">Inbox Rate</p>
            </div>
          </div>

          <div className="validation-card card-primary">
            <CheckCircle size={32} />
            <div>
              <p className="validation-label">Predicted Open Rate</p>
              <h3 className="validation-value">{validationResult.predictedOpenRate}%</h3>
              <p className="validation-score">Based on industry avg</p>
            </div>
          </div>
        </div>

        {validationResult.issues && validationResult.issues.length > 0 && (
          <div className="issues-section">
            {validationResult.issues.map((issue, i) => (
              <div key={i} className="alert alert-warning">
                <AlertTriangle size={18} />
                <div>
                  <strong>Issue Found</strong>
                  <p>{issue.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section-card">
        <h3 className="section-title-h3">✉️ Sender Configuration</h3>
        <div className="form-group">
          <label className="form-label form-label-required">From Email</label>
          <select
            className="form-input"
            value={selectedSender}
            onChange={(e) => {
              setSelectedSender(e.target.value);
              updateData('selectedSender', e.target.value);
            }}
          >
            <option value="">Select sender account...</option>
            {senderAccounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.email}) {account.isDefault ? '⭐ Default' : ''}
              </option>
            ))}
          </select>
          <span className="form-hint">
            Emails will be sent from this address
          </span>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title-h3">🚀 Delivery Options</h3>
        
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="sendTiming"
              checked={sendOptions.sendNow}
              onChange={() => handleSendOptionChange('sendNow', true)}
            />
            <div className="radio-content">
              <div className="radio-title">
                <Send size={20} />
                <strong>Send Immediately</strong>
              </div>
              <p>Start sending emails right after launch</p>
            </div>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="sendTiming"
              checked={!sendOptions.sendNow}
              onChange={() => handleSendOptionChange('sendNow', false)}
            />
            <div className="radio-content">
              <div className="radio-title">
                <Calendar size={20} />
                <strong>Schedule for Later</strong>
              </div>
              <p>Choose a specific date and time to start</p>
            </div>
          </label>
        </div>

        {!sendOptions.sendNow && (
          <div className="schedule-inputs">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={sendOptions.scheduleDate}
                  onChange={(e) => handleSendOptionChange('scheduleDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={sendOptions.scheduleTime}
                  onChange={(e) => handleSendOptionChange('scheduleTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Send Test Email (Optional)</label>
          <input
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={sendOptions.testEmail}
            onChange={(e) => handleSendOptionChange('testEmail', e.target.value)}
          />
          <span className="form-hint">
            Send a test email to yourself before launching the campaign
          </span>
        </div>
      </div>

      {validationResult.riskLevel === 'low' && validationResult.summary.approvedEmails > 0 && (
        <div className="launch-section">
          <div className="launch-card">
            <div className="launch-icon gradient-bg-purple">
              <Rocket size={40} color="white" />
            </div>
            <div className="launch-content">
              <h3>Ready to Launch!</h3>
              <p>
                Your campaign is validated and ready. {validationResult.summary.approvedEmails} emails will be sent
                to selected contacts.
              </p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleLaunch}>
              <Send size={20} />
              Launch Campaign
            </button>
          </div>
        </div>
      )}

      {showLaunchModal && (
        <div className="modal-overlay" onClick={() => setShowLaunchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🚀 Confirm Campaign Launch</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to launch this campaign?</p>
              <div className="confirmation-details">
                <div className="confirmation-item">
                  <Mail size={18} />
                  <span><strong>{validationResult.summary.approvedEmails}</strong> emails will be sent</span>
                </div>
                <div className="confirmation-item">
                  <User size={18} />
                  <span>From: <strong>{senderAccounts.find(a => a.id === selectedSender)?.email}</strong></span>
                </div>
                <div className="confirmation-item">
                  <Clock size={18} />
                  <span>{sendOptions.sendNow ? 'Immediately' : `Scheduled for ${sendOptions.scheduleDate} at ${sendOptions.scheduleTime}`}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowLaunchModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmLaunch} disabled={launching}>
                <Send size={18} />
                {launching ? 'Launching...' : 'Confirm Launch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step5_Validation;
