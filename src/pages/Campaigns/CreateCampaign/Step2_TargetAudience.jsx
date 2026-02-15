import { useState } from 'react';
import './WizardSteps.css';

const Step2_TargetAudience = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    industries: data.targetAudience?.industries || [],
    jobRoles: data.targetAudience?.jobRoles || [],
    companySizes: data.targetAudience?.companySizes || [],
    locations: data.targetAudience?.locations || ''
  });

  const handleCheckboxChange = (category, value) => {
    const currentValues = formData[category] || [];
    const updated = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    const newData = { ...formData, [category]: updated };
    setFormData(newData);
    updateData('targetAudience', newData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updateData('targetAudience', updated);
  };

  const industries = ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Manufacturing'];
  const jobRoles = ['CEO', 'CTO', 'VP Engineering', 'Product Manager', 'Marketing Manager', 'Sales Director'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  return (
    <div>
      <h2 className="wizard-step-title">Target Audience</h2>
      <p className="wizard-step-description">
        Define your target audience to ensure your message resonates with the right people.
      </p>

      <div className="form-group">
        <label className="form-label">Industries</label>
        <div className="checkbox-group">
          {industries.map((industry) => (
            <label key={industry} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.industries.includes(industry)}
                onChange={() => handleCheckboxChange('industries', industry)}
              />
              <span>{industry}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Job Roles</label>
        <div className="checkbox-group">
          {jobRoles.map((role) => (
            <label key={role} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.jobRoles.includes(role)}
                onChange={() => handleCheckboxChange('jobRoles', role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Company Size</label>
        <div className="checkbox-group">
          {companySizes.map((size) => (
            <label key={size} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.companySizes.includes(size)}
                onChange={() => handleCheckboxChange('companySizes', size)}
              />
              <span>{size} employees</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="locations">
          Target Locations
        </label>
        <input
          type="text"
          id="locations"
          name="locations"
          className="form-input"
          placeholder="e.g., United States, Canada, Europe"
          value={formData.locations}
          onChange={handleChange}
        />
        <span className="form-hint">Separate multiple locations with commas</span>
      </div>
    </div>
  );
};

export default Step2_TargetAudience;
