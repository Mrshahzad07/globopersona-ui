import { useState, useEffect, useRef, useMemo } from 'react';
import { Upload, Search, Users, CheckCircle, XCircle, UserPlus, X, Trash2 } from 'lucide-react';
import { contactService } from '../../services/mockApi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import './ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '', email: '', company: '', role: ''
  });
  const [addError, setAddError] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(contact =>
      contact.name?.toLowerCase().includes(q) ||
      contact.email?.toLowerCase().includes(q) ||
      contact.company?.toLowerCase().includes(q)
    );
  }, [contacts, searchQuery]);

  const handleAddContact = () => {
    setAddError('');
    if (!newContact.name.trim() || !newContact.email.trim()) {
      setAddError('Name and email are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newContact.email)) {
      setAddError('Please enter a valid email address.');
      return;
    }
    if (contacts.some(c => c.email.toLowerCase() === newContact.email.toLowerCase())) {
      setAddError('A contact with this email already exists.');
      return;
    }

    const contact = {
      id: `contact-${Date.now()}`,
      name: newContact.name.trim(),
      email: newContact.email.trim(),
      company: newContact.company.trim() || 'Unknown',
      role: newContact.role.trim() || 'N/A',
      valid: true,
      uploadedAt: new Date().toISOString(),
    };

    const storageKey = 'globopersona_data';
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const data = JSON.parse(raw);
      data.contacts = [...(data.contacts || []), contact];
      localStorage.setItem(storageKey, JSON.stringify(data));
    }

    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', email: '', company: '', role: '' });
    setShowAddModal(false);
  };

  const handleDeleteContact = (id) => {
    if (!window.confirm('Delete this contact?')) return;
    const storageKey = 'globopersona_data';
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const data = JSON.parse(raw);
      data.contacts = (data.contacts || []).filter(c => c.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const validCount = contacts.filter(c => c.valid).length;
  const invalidCount = contacts.length - validCount;
  const validPercent = contacts.length > 0 ? ((validCount / contacts.length) * 100).toFixed(0) : 0;
  const invalidPercent = contacts.length > 0 ? ((invalidCount / contacts.length) * 100).toFixed(0) : 0;

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading contacts..." />;
  }

  return (
    <div className="contact-list-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h2 className="page-title">Contacts</h2>
          <p className="page-subtitle">Manage your contact database</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={20} />
          Add Contact
        </button>
      </div>

      <div className="contact-stats">
        <div className="contact-stat-card animate-fadeInUp stagger-1">
          <div className="cs-icon cs-icon-primary"><Users size={22} /></div>
          <div className="cs-info">
            <span className="cs-value">{contacts.length}</span>
            <span className="cs-label">Total Contacts</span>
          </div>
        </div>
        <div className="contact-stat-card animate-fadeInUp stagger-2">
          <div className="cs-icon cs-icon-success"><CheckCircle size={22} /></div>
          <div className="cs-info">
            <span className="cs-value cs-value-success">{validCount}</span>
            <span className="cs-label">Valid Emails</span>
          </div>
          <div className="cs-progress">
            <div className="progress-bar-container progress-bar-stat">
              <div className="progress-bar-fill progress-success" style={{ width: `${validPercent}%` }} />
            </div>
            <span className="cs-percent">{validPercent}%</span>
          </div>
        </div>
        <div className="contact-stat-card animate-fadeInUp stagger-3">
          <div className="cs-icon cs-icon-error"><XCircle size={22} /></div>
          <div className="cs-info">
            <span className="cs-value cs-value-error">{invalidCount}</span>
            <span className="cs-label">Invalid Emails</span>
          </div>
          {invalidCount > 0 && (
            <div className="cs-progress">
              <div className="progress-bar-container progress-bar-stat">
                <div className="progress-bar-fill progress-error" style={{ width: `${invalidPercent}%` }} />
              </div>
              <span className="cs-percent">{invalidPercent}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search contacts by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <EmptyState
          icon={Upload}
          title="No contacts found"
          description="Add contacts manually or upload them through a campaign"
          action={
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={20} />
              Add Contact
            </button>
          }
        />
      ) : (
        <div className="card contacts-table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <tr key={contact.id} className={`table-row-animated stagger-${Math.min(index + 1, 7)}`}>
                    <td>
                      <div className="contact-cell">
                        <div className="contact-avatar">
                          {contact.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <span className="contact-name-text">{contact.name}</span>
                      </div>
                    </td>
                    <td className="text-secondary text-sm">{contact.email}</td>
                    <td className="text-sm">{contact.company}</td>
                    <td className="text-sm text-secondary">{contact.role}</td>
                    <td>
                      <span className={`badge badge-${contact.valid ? 'success' : 'error'}`}>
                        {contact.valid ? '✓ Valid' : '✗ Invalid'}
                      </span>
                    </td>
                    <td className="text-secondary text-sm">
                      {new Date(contact.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      <button
                        className="action-btn action-btn-danger"
                        onClick={() => handleDeleteContact(contact.id)}
                        title="Delete contact"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Contact</h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {addError && <div className="modal-error">{addError}</div>}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Smith"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="rajesh@infosys.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="TechCorp Inc"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="CEO"
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddContact}>
                <UserPlus size={18} />
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
