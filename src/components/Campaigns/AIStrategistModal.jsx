import { useState } from 'react';
import { X, Bot, Loader, CheckCircle } from 'lucide-react';
import './AIComponents.css';

const AI_STEPS = [
  {
    step: 1,
    question: "Let's start! Tell me about your company.",
    placeholder: "e.g., We're a B2B SaaS company focused on project management...",
    field: 'companyInfo',
    type: 'textarea'
  },
  {
    step: 2,
    question: "What products or services do you offer?",
    placeholder: "e.g., AI-powered project management platform with team collaboration features...",
    field: 'productService',
    type: 'textarea'
  },
  {
    step: 3,
    question: "Who is your target audience?",
    placeholder: "e.g., CTOs, VPs of Engineering, Product Managers at mid-sized tech companies...",
    field: 'targetAudience',
    type: 'textarea'
  },
  {
    step: 4,
    question: "What pain points does your solution address?",
    placeholder: "e.g., Poor team visibility, missed deadlines, scattered communication...",
    field: 'painPoints',
    type: 'textarea'
  },
  {
    step: 5,
    question: "What tone should we use in the emails?",
    field: 'tone',
    type: 'buttons',
    options: [
      { value: 'professional', label: 'Professional', description: 'Formal and business-focused' },
      { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
      { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' }
    ]
  },
  {
    step: 6,
    question: "What action do you want recipients to take?",
    placeholder: "e.g., Schedule a demo, Start a free trial, Download our whitepaper...",
    field: 'callToAction',
    type: 'textarea'
  },
  {
    step: 7,
    question: "What's your unique value proposition?",
    placeholder: "e.g., Ship products 40% faster with AI-powered insights and automation...",
    field: 'valueProposition',
    type: 'textarea'
  },
  {
    step: 8,
    question: "Perfect! I have all the information needed.",
    field: 'confirmation',
    type: 'confirmation'
  }
];

const AIStrategistModal = ({ isOpen, onClose, onComplete, campaignId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    companyInfo: '',
    productService: '',
    targetAudience: '',
    painPoints: '',
    tone: '',
    callToAction: '',
    valueProposition: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentStepData = AI_STEPS.find(s => s.step === currentStep);
  const progress = (currentStep / AI_STEPS.length) * 100;

  const handleNext = async () => {
    if (currentStep < AI_STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsProcessing(true);
      setShowCompletion(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onComplete(config);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceed = () => {
    if (currentStep === AI_STEPS.length) return true; // Confirmation step
    
    const field = currentStepData?.field;
    if (!field) return false;
    
    return config[field]?.trim().length > 0;
  };

  const handleClose = () => {
    if (!showCompletion) {
      setCurrentStep(1);
      setConfig({
        companyInfo: '',
        productService: '',
        targetAudience: '',
        painPoints: '',
        tone: '',
        callToAction: '',
        valueProposition: ''
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay ai-strategist-overlay" onClick={handleClose}>
      <div className="modal-content ai-strategist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-strategist-header gradient-bg-purple">
          <div className="ai-strategist-title">
            <Bot size={24} />
            <h2>AI Email Strategist</h2>
          </div>
          <button className="icon-button-white" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="ai-progress-section">
          <div className="ai-progress-info">
            <span>Step {currentStep} of {AI_STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="ai-chat-area">
          {showCompletion ? (
            <div className="ai-completion-screen">
              <div className="completion-icon">
                {isProcessing ? (
                  <Loader size={64} className="spinner completion-spinner" />
                ) : (
                  <CheckCircle size={64} className="text-success" />
                )}
              </div>
              <h3>Configuration Complete! 🎉</h3>
              <p>Generating personalized emails...</p>
              <p className="text-muted">This will take just a moment</p>
            </div>
          ) : (
            <>
              <div className="ai-message">
                <div className="ai-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-bubble ai-bubble">
                  <p>{currentStepData?.question}</p>
                </div>
              </div>

              <div className="user-input-section">
                {currentStepData?.type === 'textarea' && (
                  <textarea
                    className="ai-input-textarea"
                    placeholder={currentStepData.placeholder}
                    value={config[currentStepData.field] || ''}
                    onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                    rows={4}
                    autoFocus
                  />
                )}

                {currentStepData?.type === 'buttons' && (
                  <div className="ai-button-group">
                    {currentStepData.options?.map(option => (
                      <button
                        key={option.value}
                        className={`ai-option-button ${config[currentStepData.field] === option.value ? 'selected' : ''}`}
                        onClick={() => handleInputChange(currentStepData.field, option.value)}
                      >
                        <div className="option-label">{option.label}</div>
                        <div className="option-description">{option.description}</div>
                      </button>
                    ))}
                  </div>
                )}

                {currentStepData?.type === 'confirmation' && (
                  <div className="ai-confirmation-message">
                    <CheckCircle size={48} className="text-success" />
                    <p>Your AI configuration is complete!</p>
                    <p className="text-muted">Click Continue to finalize and start generating personalized emails.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!showCompletion && (
          <div className="modal-footer ai-strategist-footer">
            <button
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === AI_STEPS.length ? 'Complete Configuration' : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStrategistModal;
