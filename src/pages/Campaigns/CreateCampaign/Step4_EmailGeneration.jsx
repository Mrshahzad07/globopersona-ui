import { useState, useEffect } from 'react';
import { Sparkles, RotateCw, CheckCircle, Edit2, Trash2, ThumbsUp, ThumbsDown, Loader } from 'lucide-react';
import { emailGenerationService } from '../../../services/mockApi';
import './WizardSteps.css';

const Step4_EmailGeneration = ({ data, updateData }) => {
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [approvedEmails, setApprovedEmails] = useState(new Set());
  const [rejectedEmails, setRejectedEmails] = useState(new Set());
  const [selectedForApproval, setSelectedForApproval] = useState(new Set());

  useEffect(() => {
    if (data.generatedEmails && data.generatedEmails.length > 0) {
      setGeneratedEmails(data.generatedEmails);
      const approved = new Set();
      const rejected = new Set();
      data.generatedEmails.forEach(e => {
        if (e.status === 'approved') approved.add(e.id);
        if (e.status === 'rejected') rejected.add(e.id);
      });
      setApprovedEmails(approved);
      setRejectedEmails(rejected);
    }
  }, [data.generatedEmails]);

  const handleGenerateEmails = async () => {
    setError(null);
    const selectedContactIds = data.selectedContactIds || [];
    if (!selectedContactIds.length) {
      setError('Please go back to Step 3 and select at least one contact.');
      return;
    }

    setIsGenerating(true);
    try {
      const aiConfig = data.aiConfig;
      const campaignId = data.campaignId || `campaign-${Date.now()}`;

      const emails = await emailGenerationService.generateForContacts(
        campaignId,
        selectedContactIds,
        aiConfig
      );

      setGeneratedEmails(emails);
      updateData('generatedEmails', emails);
    } catch (err) {
      console.error('Failed to generate emails:', err);
      setError(err?.message || 'Failed to generate emails. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateEmailsStatusInWizard = (updates) => {
    const updated = generatedEmails.map(e => ({
      ...e,
      status: updates[e.id] !== undefined ? updates[e.id] : e.status
    }));
    setGeneratedEmails(updated);
    updateData('generatedEmails', updated);
  };

  const handleApprove = (emailId) => {
    const newApproved = new Set(approvedEmails);
    newApproved.add(emailId);
    setApprovedEmails(newApproved);
    const newRejected = new Set(rejectedEmails);
    newRejected.delete(emailId);
    setRejectedEmails(newRejected);
    emailGenerationService.updateStatus(emailId, 'approved');
    updateEmailsStatusInWizard({ [emailId]: 'approved' });
    const approvedEmail = generatedEmails.find(e => e.id === emailId);
    if (approvedEmail) {
      updateData('emailTemplate', { subject: approvedEmail.subject, body: approvedEmail.body });
    }
  };

  const handleReject = (emailId) => {
    const newRejected = new Set(rejectedEmails);
    newRejected.add(emailId);
    setRejectedEmails(newRejected);
    const newApproved = new Set(approvedEmails);
    newApproved.delete(emailId);
    setApprovedEmails(newApproved);
    emailGenerationService.updateStatus(emailId, 'rejected');
    updateEmailsStatusInWizard({ [emailId]: 'rejected' });
  };

  const handleApproveAll = () => {
    const allIds = generatedEmails.map(e => e.id);
    setApprovedEmails(new Set(allIds));
    setRejectedEmails(new Set());
    const updates = Object.fromEntries(allIds.map(id => [id, 'approved']));
    allIds.forEach(id => emailGenerationService.updateStatus(id, 'approved'));
    updateEmailsStatusInWizard(updates);
    if (generatedEmails.length > 0) {
      updateData('emailTemplate', { subject: generatedEmails[0].subject, body: generatedEmails[0].body });
    }
  };

  const handleRejectAll = () => {
    const allIds = generatedEmails.map(e => e.id);
    setRejectedEmails(new Set(allIds));
    setApprovedEmails(new Set());
    setSelectedForApproval(new Set());
    const updates = Object.fromEntries(allIds.map(id => [id, 'rejected']));
    allIds.forEach(id => emailGenerationService.updateStatus(id, 'rejected'));
    updateEmailsStatusInWizard(updates);
  };

  const toggleSelectForApproval = (emailId) => {
    setSelectedForApproval(prev => {
      const next = new Set(prev);
      if (next.has(emailId)) next.delete(emailId);
      else next.add(emailId);
      return next;
    });
  };

  const handleSelectAllForApproval = () => {
    setSelectedForApproval(new Set(generatedEmails.map(e => e.id)));
  };

  const handleDeselectAllForApproval = () => {
    setSelectedForApproval(new Set());
  };

  const handleApproveSelected = () => {
    if (selectedForApproval.size === 0) return;
    const ids = [...selectedForApproval];
    const newApproved = new Set([...approvedEmails, ...ids]);
    const newRejected = new Set(rejectedEmails);
    ids.forEach(id => newRejected.delete(id));
    setApprovedEmails(newApproved);
    setRejectedEmails(newRejected);
    setSelectedForApproval(new Set());
    const updates = Object.fromEntries(ids.map(id => [id, 'approved']));
    ids.forEach(id => emailGenerationService.updateStatus(id, 'approved'));
    updateEmailsStatusInWizard(updates);
  };

  const handleRegenerate = async (emailId) => {
    try {
      const email = generatedEmails.find(e => e.id === emailId);
      if (!email) return;

      setGeneratedEmails(prevEmails =>
        prevEmails.map(e =>
          e.id === emailId ? { ...e, isRegenerating: true } : e
        )
      );

      const regenerated = await emailGenerationService.regenerate(emailId, data.aiConfig);

      setGeneratedEmails(prevEmails =>
        prevEmails.map(e =>
          e.id === emailId ? { ...regenerated, isRegenerating: false } : e
        )
      );

      const newApproved = new Set(approvedEmails);
      newApproved.delete(emailId);
      setApprovedEmails(newApproved);

      const newRejected = new Set(rejectedEmails);
      newRejected.delete(emailId);
      setRejectedEmails(newRejected);
    } catch (error) {
      console.error('Failed to regenerate email:', error);
    }
  };

  const renderPersonalizationTags = (fields) => {
    return fields.map((field, index) => (
      <span key={index} className="purple-tag">
        {field}
      </span>
    ));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 80) return 'warning';
    return 'error';
  };

  const approvedCount = approvedEmails.size;
  const totalEmails = generatedEmails.length;
  const selectedCount = (data.selectedContactIds || []).length;

  return (
    <div>
      <h2 className="wizard-step-title">AI Email Generation & Review</h2>
      <p className="wizard-step-description">
        Review AI-generated personalized emails for each contact
      </p>

      {generatedEmails.length > 0 && (
        <div className="generation-stats card">
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Total Emails</span>
              <strong className="stat-value">{totalEmails}</strong>
            </div>
            <div className="stat-item">
              <span className="stat-label">Approved</span>
              <strong className="stat-value text-success">{approvedCount}</strong>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending Review</span>
              <strong className="stat-value text-warning">{totalEmails - approvedCount - rejectedEmails.size}</strong>
            </div>
            <div className="stat-item">
              <span className="stat-label">Needs Work</span>
              <strong className="stat-value text-error">{rejectedEmails.size}</strong>
            </div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${(approvedCount / totalEmails) * 100}%` }}
            ></div>
          </div>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {approvedCount} of {totalEmails} emails approved ({Math.round((approvedCount / totalEmails) * 100)}%)
          </p>
          <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>
            Select emails below one by one (checkbox) and use <strong>Approve selected</strong>, or approve each card with <strong>Approve</strong>, or use <strong>Approve All</strong>.
          </p>
          <div className="approve-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleApproveSelected}
              disabled={selectedForApproval.size === 0}
              title="Approve only the emails you selected with the checkbox"
            >
              <ThumbsUp size={16} />
              Approve selected ({selectedForApproval.size})
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleApproveAll}
              disabled={approvedCount === totalEmails}
            >
              <ThumbsUp size={16} />
              Approve All
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleSelectAllForApproval}
            >
              Select all
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleDeselectAllForApproval}
            >
              Deselect all
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleRejectAll}
              disabled={rejectedEmails.size === totalEmails}
            >
              <ThumbsDown size={16} />
              Reject All
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          <span>{error}</span>
        </div>
      )}

      {generatedEmails.length === 0 && (
        <div className="generation-prompt card">
          <div className="generation-icon gradient-bg-purple">
            <Sparkles size={40} color="white" />
          </div>
          <h3>Generate Personalized Emails</h3>
          <p>
            AI will create unique, personalized emails for each of your {selectedCount} selected contact{selectedCount !== 1 ? 's' : ''}
            based on your configured settings.
          </p>
          {!data.selectedContactIds?.length && (
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Go back to Step 3 to select an email list and choose contacts.
            </p>
          )}
          <button
            className="btn btn-primary"
            onClick={handleGenerateEmails}
            disabled={isGenerating || !data.selectedContactIds?.length}
          >
            {isGenerating ? (
              <>
                <Loader size={20} className="spinner" />
                Generating {data.selectedContactIds?.length} emails...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate AI Emails
              </>
            )}
          </button>
        </div>
      )}

      {generatedEmails.length > 0 && (
        <div className="email-cards-grid">
          {generatedEmails.map((email) => {
            const contact = data.contacts?.[email.contactId];
            const isApproved = approvedEmails.has(email.id);
            const isRejected = rejectedEmails.has(email.id);
            const isRegenerating = email.isRegenerating;

            return (
              <div
                key={email.id}
                className={`email-card ${isApproved ? 'approved' : ''} ${isRejected ? 'rejected' : ''} ${selectedForApproval.has(email.id) ? 'selected-for-approval' : ''}`}
              >
                <div className="email-card-header">
                  <label className="email-card-select-label" onClick={e => e.stopPropagation()} title="Select for approval">
                    <input
                      type="checkbox"
                      checked={selectedForApproval.has(email.id)}
                      onChange={() => toggleSelectForApproval(email.id)}
                      disabled={isApproved}
                    />
                    <span className="select-for-approval-text">Select for approval</span>
                  </label>
                  <div className="contact-info">
                    <div className="contact-avatar">
                      {contact?.firstName?.[0]}{contact?.lastName?.[0]}
                    </div>
                    <div>
                      <h4>{contact?.firstName} {contact?.lastName}</h4>
                      <p className="text-muted">{contact?.email}</p>
                    </div>
                  </div>
                  <div className={`confidence-badge badge-${getConfidenceColor(email.confidence)}`}>
                    {email.confidence}% confident
                  </div>
                </div>

                <div className="email-content">
                  <div className="email-subject">
                    <strong>Subject:</strong> {email.subject}
                  </div>
                  <div className="email-body">
                    {email.body}
                  </div>
                </div>

                <div className="personalization-section">
                  <span className="personalization-label">Personalized with:</span>
                  <div className="personalization-tags">
                    {renderPersonalizationTags(email.personalizationFields)}
                  </div>
                </div>

                <div className="email-meta">
                  <span className="meta-item">
                    {email.tokens} tokens
                  </span>
                  <span className="meta-item">
                    Generated {new Date(email.generatedAt).toLocaleString()}
                  </span>
                </div>

                <div className="email-actions">
                  {isRegenerating ? (
                    <div className="regenerating-state">
                      <Loader size={20} className="spinner" />
                      <span>Regenerating...</span>
                    </div>
                  ) : (
                    <>
                      {!isApproved && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(email.id)}
                        >
                          <ThumbsUp size={16} />
                          Approve
                        </button>
                      )}
                      {isApproved && (
                        <button className="btn btn-success btn-sm" disabled>
                          <CheckCircle size={16} />
                          Approved
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRegenerate(email.id)}
                      >
                        <RotateCw size={16} />
                        Regenerate
                      </button>
                      {!isApproved && (
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleReject(email.id)}
                        >
                          <ThumbsDown size={16} />
                          Reject
                        </button>
                      )}
                    </>
                  )}
                </div>

                {isApproved && (
                  <div className="status-overlay">
                    <CheckCircle size={24} />
                    Approved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {generatedEmails.length > 0 && approvedCount === 0 && (
        <div className="alert alert-warning" style={{ marginTop: '1.5rem' }}>
          <span>⚠️</span>
          <div>
            <strong>Action Required</strong>
            <p>Please approve at least one email to continue with the campaign launch.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4_EmailGeneration;
