import { useState } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';
import { createEmailList } from '../../services/mockApi';
import './AIComponents.css';

const EmailListCreationModal = ({ isOpen, onClose, mappedData, onSuccess }) => {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!listName.trim()) {
      setError('Please enter a list name');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const emailList = await createEmailList(
        listName.trim(),
        description.trim(),
        mappedData.contacts
      );
      
      onSuccess(emailList);
      handleClose();
    } catch (err) {
      setError('Failed to create email list. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setListName('');
    setDescription('');
    setError(null);
    onClose();
  };

  if (!isOpen || !mappedData) return null;

  const { contacts, mapping } = mappedData;
  const mappedFieldsCount = Object.values(mapping).filter(v => v !== '').length;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Create Email List</h2>
            <p className="text-muted">Name your list and review the import summary</p>
          </div>
          <button className="icon-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="list-creation-form">
            <div className="form-group">
              <label htmlFor="list-name">List Name *</label>
              <input
                id="list-name"
                type="text"
                value={listName}
                onChange={(e) => {
                  setListName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Q1 2024 Prospects"
                disabled={isCreating}
              />
            </div>

            <div className="form-group">
              <label htmlFor="list-description">Description (Optional)</label>
              <textarea
                id="list-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about this contact list..."
                disabled={isCreating}
              />
            </div>

            <div className="list-summary">
              <div className="summary-card">
                <h4>Total Contacts</h4>
                <p>{contacts.length}</p>
              </div>
              <div className="summary-card">
                <h4>Fields Mapped</h4>
                <p>{mappedFieldsCount}</p>
              </div>
              <div className="summary-card">
                <h4>Import Status</h4>
                <p style={{ color: 'var(--success-green)', fontSize: '1rem' }}>
                  <CheckCircle size={20} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                  Ready
                </p>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={isCreating || !listName.trim()}
          >
            {isCreating ? (
              <>
                <Loader size={16} className="spinner" />
                Creating...
              </>
            ) : (
              'Create Email List'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailListCreationModal;
