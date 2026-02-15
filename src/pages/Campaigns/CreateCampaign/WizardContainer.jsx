import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import ErrorBoundary from '../../../components/Common/ErrorBoundary';
import './WizardContainer.css';

import Step1_CampaignInfo from './Step1_CampaignInfo';
import Step2_TargetAudience from './Step2_TargetAudience';
import Step3_UploadContacts from './Step3_UploadContacts';
import Step4_EmailGeneration from './Step4_EmailGeneration';
import Step5_Validation from './Step5_Validation';
import Step6_Launch from './Step6_Launch';

const STEPS = [
  { number: 1, title: 'Campaign Info', component: Step1_CampaignInfo },
  { number: 2, title: 'Target Audience', component: Step2_TargetAudience },
  { number: 3, title: 'Upload Contacts', component: Step3_UploadContacts },
  { number: 4, title: 'Email Generation', component: Step4_EmailGeneration },
  { number: 5, title: 'Validation', component: Step5_Validation },
  { number: 6, title: 'Launch', component: Step6_Launch },
];

const defaultFormData = {
  campaignInfo: {},
  targetAudience: {},
  contacts: [],
  emailListId: '',
  emailListName: '',
  campaignId: '',
  aiConfig: null,
  selectedContactIds: [],
  generatedEmails: [],
  emailTemplate: {},
  validationResult: {},
  launchConfig: {},
};

const WizardContainer = ({ initialStep = 1, initialFormData = null, onBackToChoice }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(() => {
    const base = { ...defaultFormData };
    if (initialFormData && typeof initialFormData === 'object') {
      return { ...base, ...initialFormData };
    }
    return base;
  });

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('campaign_draft', JSON.stringify(formData));
    alert('Draft saved successfully!');
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="wizard-container animate-fadeIn">
      <div className="wizard-header">
        <button
          className="btn btn-ghost"
          onClick={onBackToChoice || (() => navigate('/campaigns'))}
        >
          <ArrowLeft size={20} />
          {onBackToChoice ? 'Back' : 'Back to Campaigns'}
        </button>
        <button className="btn btn-secondary" onClick={handleSaveDraft}>
          <Save size={18} />
          Save Draft
        </button>
      </div>

      <div className="wizard-content">
        <div className="wizard-progress">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={`progress-step ${
                step.number === currentStep
                  ? 'progress-step-active'
                  : step.number < currentStep
                  ? 'progress-step-completed'
                  : ''
              }`}
            >
              <div className="progress-number">{step.number}</div>
              <span className="progress-label">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="wizard-step-content">
          <ErrorBoundary>
            <CurrentStepComponent data={formData} updateData={updateFormData} />
          </ErrorBoundary>
        </div>

        <div className="wizard-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft size={18} />
            Previous
          </button>
          <span className="step-indicator">
            Step {currentStep} of {STEPS.length}
          </span>
          {currentStep < STEPS.length && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardContainer;
