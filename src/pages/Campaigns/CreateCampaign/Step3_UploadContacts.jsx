import { useState, useEffect } from 'react';
import { Upload, List, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import CSVUploadModal from '../../../components/Campaigns/CSVUploadModal';
import FieldMappingModal from '../../../components/Campaigns/FieldMappingModal';
import EmailListCreationModal from '../../../components/Campaigns/EmailListCreationModal';
import { getEmailLists } from '../../../services/mockApi';
import './WizardSteps.css';

const Step3_UploadContacts = ({ data, updateData }) => {
  const [emailLists, setEmailLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(data.emailListId || '');
  const [selectedList, setSelectedList] = useState(null);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const [showListCreation, setShowListCreation] = useState(false);
  const [parsedCSVData, setParsedCSVData] = useState(null);
  const [mappedData, setMappedData] = useState(null);

  useEffect(() => {
    loadEmailLists();
  }, []);

  const loadEmailLists = async () => {
    try {
      const lists = await getEmailLists();
      setEmailLists(lists);
    } catch (error) {
      console.error('Failed to load email lists:', error);
    }
  };

  const handleListSelect = (listId) => {
    setSelectedListId(listId);
    const list = emailLists.find(l => l.id === listId);
    setSelectedList(list);
    updateData('emailListId', listId);
    updateData('emailListName', list?.name);
    updateData('contacts', list?.contacts || []);
  };

  useEffect(() => {
    if (!data.campaignId) updateData('campaignId', `campaign-${Date.now()}`);
  }, []);

  const handleCSVNext = (parsedData) => {
    setParsedCSVData(parsedData);
    setShowCSVUpload(false);
    setShowFieldMapping(true);
  };

  const handleMappingNext = (mappedDataResult) => {
    setMappedData(mappedDataResult);
    setShowFieldMapping(false);
    setShowListCreation(true);
  };

  const handleListCreated = async (newList) => {
    await loadEmailLists();
    setSelectedListId(newList.id);
    setSelectedList(newList);
    updateData('emailListId', newList.id);
    updateData('emailListName', newList.name);
    updateData('contacts', newList.contacts);
    setShowListCreation(false);
  };

  return (
    <div>
      <h2 className="wizard-step-title">Upload Contacts</h2>
      <p className="wizard-step-description">
        Select an email list or upload a new CSV, then choose which contacts to include in this campaign
      </p>

      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <List size={20} />
            <h3>Select Email List</h3>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCSVUpload(true)}
          >
            <Plus size={16} />
            Upload New CSV
          </button>
        </div>

        {emailLists.length > 0 ? (
          <div className="email-lists-grid">
            {emailLists.map(list => (
              <div
                key={list.id}
                className={`email-list-card ${selectedListId === list.id ? 'selected' : ''}`}
                onClick={() => handleListSelect(list.id)}
              >
                <div className="list-card-header">
                  <h4>{list.name}</h4>
                  {selectedListId === list.id && (
                    <CheckCircle size={20} className="text-success" />
                  )}
                </div>
                <div className="list-card-stats">
                  <span>{list.contactsCount} contacts</span>
                  <span>•</span>
                  <span>{list.fieldsCount} fields</span>
                </div>
                {list.description && (
                  <p className="list-card-description">{list.description}</p>
                )}
                <div className="list-card-date">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Upload size={48} className="empty-icon" />
            <h4>No email lists yet</h4>
            <p>Upload a CSV file to create your first email list</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCSVUpload(true)}
            >
              <Upload size={16} />
              Upload CSV File
            </button>
          </div>
        )}
      </div>

      {selectedList && (
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <CheckCircle size={20} className="text-success" />
              <h3>Selected List: {selectedList.name}</h3>
            </div>
          </div>
          <div className="selected-list-stats">
            <div className="stat-item">
              <span className="stat-label">Total Contacts</span>
              <span className="stat-value">{selectedList.contactsCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mapped Fields</span>
              <span className="stat-value">{selectedList.fieldsCount}</span>
            </div>
          </div>
        </div>
      )}

      {selectedList && selectedList.contacts && selectedList.contacts.length > 0 && (
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <List size={24} className="text-primary" />
              <h3>Select Target Contacts</h3>
            </div>
            <div>
              <span className="text-muted">
                {(data.selectedContactIds || []).length} of {selectedList.contacts.length} selected
              </span>
            </div>
          </div>

          <div className="contacts-preview-grid">
            {selectedList.contacts.map((contact, index) => {
              const isSelected = (data.selectedContactIds || []).includes(index);
              return (
                <div
                  key={index}
                  className={`contact-preview-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    const currentSelected = data.selectedContactIds || [];
                    const newSelected = isSelected
                      ? currentSelected.filter(id => id !== index)
                      : [...currentSelected, index];
                    updateData('selectedContactIds', newSelected);
                  }}
                >
                  <div className="contact-preview-header">
                    <div className="contact-avatar">
                      {contact.firstName?.[0]}{contact.lastName?.[0]}
                    </div>
                    <div className="contact-preview-info">
                      <h4>{contact.firstName} {contact.lastName}</h4>
                      <p className="text-muted">{contact.email}</p>
                    </div>
                    {isSelected && <CheckCircle size={20} className="text-success" />}
                  </div>
                  {contact.company && (
                    <p className="contact-company">
                      <strong>{contact.jobTitle || 'Contact'}</strong> at {contact.company}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="selection-actions">
            <button
              className="btn btn-secondary"
              onClick={() => updateData('selectedContactIds', [])}
            >
              Deselect All
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const allIds = selectedList.contacts.map((_, idx) => idx);
                updateData('selectedContactIds', allIds);
              }}
            >
              Select All ({selectedList.contacts.length})
            </button>
          </div>
        </div>
      )}

      {(!selectedListId || !(data.selectedContactIds || []).length) && (
        <div className="alert alert-warning">
          <AlertCircle size={20} />
          <div>
            <strong>Complete requirements</strong>
            <p>
              {!selectedListId && '• Select or create an email list'}
              {!(data.selectedContactIds || []).length && selectedListId && '• Select at least one contact to target'}
            </p>
          </div>
        </div>
      )}

      <CSVUploadModal
        isOpen={showCSVUpload}
        onClose={() => setShowCSVUpload(false)}
        onNext={handleCSVNext}
      />

      <FieldMappingModal
        isOpen={showFieldMapping}
        onClose={() => {
          setShowFieldMapping(false);
          setShowCSVUpload(true);
        }}
        parsedData={parsedCSVData}
        onNext={handleMappingNext}
      />

      <EmailListCreationModal
        isOpen={showListCreation}
        onClose={() => {
          setShowListCreation(false);
          setShowFieldMapping(true);
        }}
        mappedData={mappedData}
        onSuccess={handleListCreated}
      />
    </div>
  );
};

export default Step3_UploadContacts;
