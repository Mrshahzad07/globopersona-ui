import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Trash2, Edit3, Users, CalendarDays,
  Hash, Mail, Building2, Briefcase, Plus, X, Save, Search
} from 'lucide-react';
import { emailListService } from '../../services/mockApi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './EmailLists.css';

const EmailListDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '', lastName: '', email: '', company: '', jobTitle: ''
  });

  useEffect(() => {
    loadList();
  }, [id]);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await emailListService.getById(id);
      setList(data);
      setEditName(data.name);
      setEditDesc(data.description || '');
    } catch (error) {
      console.error('Failed to load email list:', error);
      navigate('/email-lists');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    await emailListService.update(id, { name: editName, description: editDesc });
    setEditing(false);
    loadList();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this email list? This cannot be undone.')) {
      await emailListService.delete(id);
      navigate('/email-lists');
    }
  };

  const handleAddContact = async () => {
    if (!newContact.email.trim() || !newContact.firstName.trim()) return;
    const updatedContacts = [...(list.contacts || []), { ...newContact }];
    await emailListService.update(id, {
      contacts: updatedContacts,
      contactsCount: updatedContacts.length,
      fieldsCount: Object.keys(newContact).filter(k => newContact[k]).length
    });
    setNewContact({ firstName: '', lastName: '', email: '', company: '', jobTitle: '' });
    setShowAddContact(false);
    loadList();
  };

  const handleDeleteContact = async (index) => {
    if (!window.confirm('Remove this contact from the list?')) return;
    const updatedContacts = list.contacts.filter((_, i) => i !== index);
    await emailListService.update(id, {
      contacts: updatedContacts,
      contactsCount: updatedContacts.length
    });
    loadList();
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading email list..." />;
  }

  if (!list) return null;

  const contacts = list.contacts || [];
  const filteredContacts = searchTerm
    ? contacts.filter(c =>
        (c.firstName + ' ' + c.lastName + ' ' + c.email + ' ' + (c.company || ''))
          .toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contacts;

  return (
    <div className="el-details-page animate-fadeIn">
      <button className="btn btn-secondary el-back-btn" onClick={() => navigate('/email-lists')}>
        <ArrowLeft size={18} />
        Back to Email Lists
      </button>

      <div className="el-details-header">
        <div className="el-details-info">
          {editing ? (
            <div className="el-edit-form">
              <input
                type="text"
                className="el-edit-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
              />
              <textarea
                className="el-edit-textarea"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Description..."
                rows={2}
              />
              <div className="el-edit-actions">
                <button className="btn btn-primary btn-sm" onClick={handleSaveEdit}>
                  <Save size={16} /> Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="el-details-title">{list.name}</h1>
              {list.description && <p className="el-details-desc">{list.description}</p>}
            </>
          )}
        </div>
        <div className="el-details-actions">
          {!editing && (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              <Edit3 size={18} /> Edit
            </button>
          )}
          <button className="btn btn-secondary action-btn-danger-text" onClick={handleDelete}>
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      <div className="el-details-stats">
        <div className="el-detail-stat-card">
          <Users size={20} className="el-stat-icon el-stat-primary" />
          <div>
            <span className="el-detail-stat-value">{list.contactsCount || 0}</span>
            <span className="el-detail-stat-label">Total Contacts</span>
          </div>
        </div>
        <div className="el-detail-stat-card">
          <Hash size={20} className="el-stat-icon el-stat-success" />
          <div>
            <span className="el-detail-stat-value">{list.fieldsCount || 0}</span>
            <span className="el-detail-stat-label">Data Fields</span>
          </div>
        </div>
        <div className="el-detail-stat-card">
          <CalendarDays size={20} className="el-stat-icon el-stat-accent" />
          <div>
            <span className="el-detail-stat-value">
              {new Date(list.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="el-detail-stat-label">Created</span>
          </div>
        </div>
      </div>

      <div className="el-contacts-section card">
        <div className="el-contacts-toolbar">
          <h3>Contacts ({contacts.length})</h3>
          <div className="el-contacts-actions">
            <div className="search-box el-search-compact">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddContact(true)}>
              <Plus size={16} /> Add Contact
            </button>
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="el-empty-contacts">
            <Mail size={40} className="el-empty-icon" />
            <p>{searchTerm ? 'No contacts match your search' : 'No contacts in this list yet'}</p>
            {!searchTerm && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddContact(true)}>
                <Plus size={16} /> Add First Contact
              </button>
            )}
          </div>
        ) : (
          <div className="el-contacts-table-wrap">
            <table className="el-contacts-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, idx) => (
                  <tr key={idx}>
                    <td className="el-row-num">{idx + 1}</td>
                    <td>
                      <div className="el-contact-name">
                        <div className="el-contact-avatar">
                          {(contact.firstName?.[0] || '')}{(contact.lastName?.[0] || '')}
                        </div>
                        <span>
                          {contact.firstName || ''} {contact.lastName || ''}
                          {contact.fullName && !contact.firstName ? contact.fullName : ''}
                        </span>
                      </div>
                    </td>
                    <td className="el-contact-email">{contact.email || '—'}</td>
                    <td>{contact.company || '—'}</td>
                    <td>{contact.jobTitle || contact.role || '—'}</td>
                    <td>
                      <button
                        className="action-btn action-btn-danger"
                        onClick={() => handleDeleteContact(idx)}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddContact && (
        <div className="modal-overlay" onClick={() => setShowAddContact(false)}>
          <div className="modal-content el-create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Add Contact</h2>
                <p className="text-muted">Add a new contact to {list.name}</p>
              </div>
              <button className="icon-button" onClick={() => setShowAddContact(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="el-add-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    placeholder="Rajesh"
                    value={newContact.firstName}
                    onChange={(e) => setNewContact(p => ({ ...p, firstName: e.target.value }))}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={newContact.lastName}
                    onChange={(e) => setNewContact(p => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="rajesh@infosys.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="el-add-grid">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="Infosys Technologies"
                    value={newContact.company}
                    onChange={(e) => setNewContact(p => ({ ...p, company: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    placeholder="Senior Manager"
                    value={newContact.jobTitle}
                    onChange={(e) => setNewContact(p => ({ ...p, jobTitle: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddContact(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddContact}
                disabled={!newContact.firstName.trim() || !newContact.email.trim()}
              >
                <Plus size={18} /> Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailListDetails;
