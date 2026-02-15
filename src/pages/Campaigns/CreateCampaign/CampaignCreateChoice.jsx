import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileEdit, MessageCircle } from 'lucide-react';
import WizardContainer from './WizardContainer';
import CampaignChatbot from './CampaignChatbot';
import './CreateCampaignChoice.css';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null | 'standard' | 'chatbot'
  const [chatbotFormData, setChatbotFormData] = useState(null);
  const [wizardStartStep, setWizardStartStep] = useState(1);

  const handleChooseStandard = () => {
    setMode('standard');
    setWizardStartStep(1);
    setChatbotFormData(null);
  };

  const handleChooseChatbot = () => {
    setMode('chatbot');
  };

  const handleChatbotComplete = (formData) => {
    setChatbotFormData(formData);
    setMode('standard');
    setWizardStartStep(3); // Continue from Upload Contacts
  };

  const handleBackToChoice = () => {
    setMode(null);
    setChatbotFormData(null);
    setWizardStartStep(1);
  };

  if (mode === 'chatbot') {
    return (
      <div className="create-campaign-page">
        <div className="create-campaign-header">
          <button type="button" className="btn btn-ghost" onClick={handleBackToChoice}>
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        <CampaignChatbot
          onComplete={handleChatbotComplete}
          onBack={handleBackToChoice}
        />
      </div>
    );
  }

  if (mode === 'standard') {
    return (
      <WizardContainer
        initialStep={wizardStartStep}
        initialFormData={chatbotFormData}
        onBackToChoice={wizardStartStep === 1 ? handleBackToChoice : undefined}
      />
    );
  }

  return (
    <div className="create-campaign-page animate-fadeIn">
      <div className="create-campaign-header">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/campaigns')}>
          <ArrowLeft size={20} />
          Back to Campaigns
        </button>
      </div>

      <div className="create-campaign-choice">
        <h1 className="choice-title">Create New Campaign</h1>
        <p className="choice-subtitle">Choose how you want to set up your campaign</p>

        <div className="choice-cards">
          <button
            type="button"
            className="choice-card"
            onClick={handleChooseStandard}
          >
            <div className="choice-card-icon standard">
              <FileEdit size={40} />
            </div>
            <h3>Standard way</h3>
            <p>Fill in campaign details step by step: campaign info, target audience, upload contacts, AI config, generate emails, validate, and launch.</p>
            <span className="choice-card-cta">Start step-by-step →</span>
          </button>

          <button
            type="button"
            className="choice-card"
            onClick={handleChooseChatbot}
          >
            <div className="choice-card-icon chatbot">
              <MessageCircle size={40} />
            </div>
            <h3>Create with AI Chatbot</h3>
            <p>Answer the same questions in a conversation. The AI assistant will collect campaign info, target audience, and AI strategy, then you add contacts and generate emails.</p>
            <span className="choice-card-cta">Start with chatbot →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
