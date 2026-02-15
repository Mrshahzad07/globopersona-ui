import { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckSquare, Square, User, MapPin, Phone, Briefcase } from 'lucide-react';
import './WizardSteps.css';

const ContactSelectionStep = ({ data, updateData }) => {
  const [contacts, setContacts] = useState(data.contacts || []);
  const [selectedContacts, setSelectedContacts] = useState(data.selectedContactIds || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setContacts(data.contacts || []);
  }, [data.contacts]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery.trim() === '' || 
      Object.values(contact).some(value => 
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
      updateData('selectedContactIds', []);
    } else {
      const allIds = filteredContacts.map((_, idx) => idx);
      setSelectedContacts(allIds);
      updateData('selectedContactIds', allIds);
    }
  };

  const toggleSelectContact = (index) => {
    const newSelected = selectedContacts.includes(index)
      ? selectedContacts.filter(id => id !== index)
      : [...selectedContacts, index];
    
    setSelectedContacts(newSelected);
    updateData('selectedContactIds', newSelected);
  };

  const getInitials = (firstName, lastName) => {
    return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
  };

  const getFieldCount = (contact) => {
    return Object.values(contact).filter(v => v && String(v).trim() !== '').length;
  };

  return (
    <div>
      <h2 className="wizard-step-title">Select Target Contacts</h2>
      <p className="wizard-step-description">
        Choose which contacts to include in this campaign
      </p>

      <div className="contact-selection-summary card">
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Campaign Name</span>
            <strong>{data.campaignInfo?.name || 'Untitled Campaign'}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Email List</span>
            <strong>{data.emailListName || 'Not selected'}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Available Contacts</span>
            <strong>{contacts.length}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Selected</span>
            <strong className="text-primary">{selectedContacts.length}</strong>
          </div>
        </div>
      </div>

      <div className="contact-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, company, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <select 
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="selected">Selected</option>
            <option value="unselected">Unselected</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={toggleSelectAll}>
            {selectedContacts.length === filteredContacts.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      <div className="contacts-table-container">
        <table className="contacts-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <button className="checkbox-btn" onClick={toggleSelectAll}>
                  {selectedContacts.length === filteredContacts.length && filteredContacts.length > 0 ? (
                    <CheckSquare size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Job Title</th>
              <th>Location</th>
              <th>Phone</th>
              <th>AI Potential</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => (
              <tr
                key={index}
                className={selectedContacts.includes(index) ? 'selected' : ''}
                onClick={() => toggleSelectContact(index)}
              >
                <td>
                  <button className="checkbox-btn" onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectContact(index);
                  }}>
                    {selectedContacts.includes(index) ? (
                      <CheckSquare size={20} className="text-primary" />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </td>
                <td>
                  <div className="contact-name-cell">
                    <div className="contact-avatar">
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <div>
                      <div className="contact-name">{contact.firstName} {contact.lastName}</div>
                    </div>
                  </div>
                </td>
                <td>{contact.email}</td>
                <td>{contact.company || '-'}</td>
                <td>{contact.jobTitle || '-'}</td>
                <td>
                  {contact.city && contact.state ? (
                    <span>{contact.city}, {contact.state}</span>
                  ) : contact.city || contact.state || '-'}
                </td>
                <td>{contact.phone || '-'}</td>
                <td>
                  <span className="ai-potential-badge badge badge-purple">
                    {getFieldCount(contact)} fields
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedContacts.length > 0 && (
        <div className="selection-footer">
          <div className="selection-summary">
            <strong>{selectedContacts.length}</strong> contacts selected
          </div>
        </div>
      )}

      {selectedContacts.length === 0 && (
        <div className="alert alert-warning" style={{ marginTop: '1.5rem' }}>
          <span>⚠️</span>
          <div>
            <strong>No contacts selected</strong>
            <p>Please select at least one contact to continue with the campaign.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSelectionStep;
