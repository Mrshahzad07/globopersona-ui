import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import './AIComponents.css';

const FIELD_OPTIONS = [
  { value: '', label: 'Do not import' },
  { value: 'email', label: 'Email Address *', required: true },
  { value: 'firstName', label: 'First Name *', required: true },
  { value: 'lastName', label: 'Last Name *', required: true },
  { value: 'name', label: 'Full Name (splits to First + Last)', required: false },
  { value: 'jobTitle', label: 'Job Title', required: false },
  { value: 'role', label: 'Role', required: false },
  { value: 'company', label: 'Company', required: false },
  { value: 'website', label: 'Website', required: false },
  { value: 'phone', label: 'Phone', required: false },
  { value: 'address', label: 'Address', required: false },
  { value: 'city', label: 'City', required: false },
  { value: 'state', label: 'State', required: false },
  { value: 'country', label: 'Country', required: false },
  { value: 'zipCode', label: 'Zip Code', required: false },
  { value: 'industry', label: 'Industry', required: false },
];

const FieldMappingModal = ({ isOpen, onClose, parsedData, onNext }) => {
  const [fieldMapping, setFieldMapping] = useState(() => {
    const initialMapping = {};
    const headers = Object.keys(parsedData?.data[0] || {});
    
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase().trim();
      
      if (lowerHeader.includes('email') || lowerHeader === 'e-mail') {
        initialMapping[header] = 'email';
      } else if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
        initialMapping[header] = 'firstName';
      } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
        initialMapping[header] = 'lastName';
      } else if (lowerHeader.includes('job') || lowerHeader.includes('title') || lowerHeader.includes('position')) {
        initialMapping[header] = 'jobTitle';
      } else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) {
        initialMapping[header] = 'company';
      } else if (lowerHeader.includes('website') || lowerHeader.includes('url')) {
        initialMapping[header] = 'website';
      } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
        initialMapping[header] = 'phone';
      } else if (lowerHeader.includes('address') && !lowerHeader.includes('email')) {
        initialMapping[header] = 'address';
      } else if (lowerHeader === 'city') {
        initialMapping[header] = 'city';
      } else if (lowerHeader === 'state' || lowerHeader.includes('province')) {
        initialMapping[header] = 'state';
      } else if (lowerHeader.includes('country')) {
        initialMapping[header] = 'country';
      } else if (lowerHeader.includes('zip') || lowerHeader.includes('postal')) {
        initialMapping[header] = 'zipCode';
      } else if (lowerHeader.includes('industry') || lowerHeader.includes('sector')) {
        initialMapping[header] = 'industry';
      } else if (lowerHeader === 'name' || (lowerHeader.includes('full') && lowerHeader.includes('name'))) {
        initialMapping[header] = 'name';
      } else if (lowerHeader === 'role') {
        initialMapping[header] = 'role';
      } else {
        initialMapping[header] = '';
      }
    });
    
    return initialMapping;
  });

  const [error, setError] = useState(null);

  const handleFieldChange = (csvHeader, selectedField) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvHeader]: selectedField
    }));
    setError(null);
  };

  const validateMapping = () => {
    const mappedFields = Object.values(fieldMapping);
    
    if (!mappedFields.includes('email')) {
      setError('Email field is required');
      return false;
    }
    const hasFirstLast = mappedFields.includes('firstName') && mappedFields.includes('lastName');
    const hasFullName = mappedFields.includes('name');
    if (!hasFirstLast && !hasFullName) {
      setError('Map either First Name + Last Name, or Full Name');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateMapping()) return;

    const transformedContacts = parsedData.data.map(row => {
      const contact = {};
      let fullNameValue = '';

      Object.entries(fieldMapping).forEach(([csvHeader, targetField]) => {
        if (!targetField) return;
        const value = (row[csvHeader] || '').trim();
        if (targetField === 'name') {
          fullNameValue = value;
        } else if (targetField === 'role') {
          contact.jobTitle = value;
        } else {
          contact[targetField] = value;
        }
      });

      if (fullNameValue) {
        const parts = fullNameValue.split(/\s+/);
        contact.firstName = parts[0] || '';
        contact.lastName = parts.slice(1).join(' ') || '';
      }

      return contact;
    });

    onNext({ contacts: transformedContacts, mapping: fieldMapping });
  };

  const getMappedFieldsCount = () => {
    return Object.values(fieldMapping).filter(v => v !== '').length;
  };

  if (!isOpen || !parsedData) return null;

  const csvHeaders = Object.keys(parsedData.data[0] || {});

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Map CSV Fields</h2>
            <p className="text-muted">Match your CSV columns to contact properties</p>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="field-mapping-container">
            <div className="mapping-instructions">
              <h4><CheckCircle size={16} /> Auto-Detection Complete</h4>
              <p>We&apos;ve detected common fields. Review and adjust. <strong>Email</strong> is required; use either <strong>First Name + Last Name</strong> or <strong>Full Name</strong>. <strong>Role</strong> maps to Job Title.</p>
            </div>

            <div className="mapping-stats">
              <div className="stat-item">
                <span className="stat-label">Fields Mapped</span>
                <span className="stat-value">{getMappedFieldsCount()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Contacts to Import</span>
                <span className="stat-value">{parsedData.data.length}</span>
              </div>
            </div>

            <div className="field-mapping-grid">
              {csvHeaders.map(csvHeader => {
                const selectedField = fieldMapping[csvHeader];
                const selectedOption = FIELD_OPTIONS.find(opt => opt.value === selectedField);
                const isRequired = selectedOption?.required;

                return (
                  <div
                    key={csvHeader}
                    className={`field-mapping-row ${isRequired ? 'required' : ''}`}
                  >
                    <div className="field-info">
                      <label>CSV Column</label>
                      <strong>{csvHeader}</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        Sample: {parsedData.data[0][csvHeader]}
                      </span>
                    </div>

                    <div className="field-info">
                      <label>
                        Maps to
                        {selectedOption?.required && (
                          <span className="required-badge">Required</span>
                        )}
                        {!selectedOption?.required && selectedField && (
                          <span className="optional-badge">Optional</span>
                        )}
                      </label>
                      <select
                        className="field-select"
                        value={selectedField}
                        onChange={(e) => handleFieldChange(csvHeader, e.target.value)}
                      >
                        {FIELD_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Back
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            Create Email List →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldMappingModal;
