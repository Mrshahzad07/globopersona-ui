import { useState } from 'react';
import './WizardSteps.css';

const Step1_CampaignInfo = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    name: data.campaignInfo?.name || '',
    companyDescription: data.campaignInfo?.companyDescription || '',
    productService: data.campaignInfo?.productService || '',
    offer: data.campaignInfo?.offer || '',
    goal: data.campaignInfo?.goal || 'lead_generation'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updateData('campaignInfo', updated);
  };

  return (
    <div>
      <h2 className="wizard-step-title">Campaign Information</h2>
      <p className="wizard-step-description">
        Provide basic information about your campaign to help AI generate personalized emails.
      </p>

      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="name">
          Campaign Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          placeholder="e.g., Diwali Sale Campaign"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="companyDescription">
          Company Description
        </label>
        <textarea
          id="companyDescription"
          name="companyDescription"
          className="form-textarea"
          placeholder="Brief description of your company..."
          value={formData.companyDescription}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="productService">
          Product/Service
        </label>
        <textarea
          id="productService"
          name="productService"
          className="form-textarea"
          placeholder="What product or service are you promoting?"
          value={formData.productService}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="offer">
          Offer
        </label>
        <textarea
          id="offer"
          name="offer"
          className="form-textarea"
          placeholder="What's your value proposition or offer?"
          value={formData.offer}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label-required" htmlFor="goal">
          Campaign Goal
        </label>
        <select
          id="goal"
          name="goal"
          className="form-select"
          value={formData.goal}
          onChange={handleChange}
          required
        >
          <option value="lead_generation">Lead Generation</option>
          <option value="sales">Sales</option>
          <option value="partnership">Partnership</option>
          <option value="feedback">Feedback</option>
          <option value="awareness">Brand Awareness</option>
        </select>
      </div>
    </div>
  );
};

export default Step1_CampaignInfo;
