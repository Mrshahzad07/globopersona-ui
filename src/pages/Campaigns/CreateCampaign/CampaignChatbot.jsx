import { useState, useRef, useEffect } from 'react';
import { Bot, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import './CampaignChatbot.css';

const CHAT_STEPS = [
  { id: 'name', question: "What's the name of your campaign?", field: 'name', type: 'text', section: 'campaignInfo', label: 'Campaign name' },
  { id: 'companyDescription', question: 'Describe your company in a few sentences.', field: 'companyDescription', type: 'textarea', section: 'campaignInfo', label: 'Company description' },
  { id: 'productService', question: 'What product or service are you promoting?', field: 'productService', type: 'textarea', section: 'campaignInfo', label: 'Product/Service' },
  { id: 'offer', question: "What's your offer or value proposition?", field: 'offer', type: 'textarea', section: 'campaignInfo', label: 'Offer' },
  { id: 'goal', question: "What's the main goal of this campaign?", field: 'goal', type: 'choice', section: 'campaignInfo', label: 'Goal', options: [
    { value: 'lead_generation', label: 'Lead Generation' },
    { value: 'sales', label: 'Sales' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'awareness', label: 'Brand Awareness' },
  ]},
  { id: 'industries', question: 'Which industries are you targeting? (e.g. Technology, Healthcare)', field: 'industries', type: 'text', section: 'targetAudience', label: 'Industries', hint: 'Comma-separated' },
  { id: 'jobRoles', question: 'Which job roles? (e.g. CEO, CTO, Product Manager)', field: 'jobRoles', type: 'text', section: 'targetAudience', label: 'Job roles', hint: 'Comma-separated' },
  { id: 'companySizes', question: 'Company sizes? (e.g. 51-200, 201-500)', field: 'companySizes', type: 'text', section: 'targetAudience', label: 'Company sizes', hint: 'Comma-separated' },
  { id: 'locations', question: 'Target locations? (e.g. United States, Canada)', field: 'locations', type: 'text', section: 'targetAudience', label: 'Locations' },
  { id: 'ai_companyInfo', question: "For personalization: Tell me about your company.", field: 'companyInfo', type: 'textarea', section: 'aiConfig', label: 'Company info' },
  { id: 'ai_productService', question: "What products or services do you offer?", field: 'productService', type: 'textarea', section: 'aiConfig', label: 'Products/Services' },
  { id: 'ai_targetAudience', question: "Who is your target audience?", field: 'targetAudience', type: 'textarea', section: 'aiConfig', label: 'Target audience' },
  { id: 'painPoints', question: "What pain points does your solution address?", field: 'painPoints', type: 'textarea', section: 'aiConfig', label: 'Pain points' },
  { id: 'tone', question: "What tone should we use?", field: 'tone', type: 'choice', section: 'aiConfig', label: 'Tone', options: [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
  ]},
  { id: 'callToAction', question: "What action do you want recipients to take?", field: 'callToAction', type: 'textarea', section: 'aiConfig', label: 'Call to action' },
  { id: 'valueProposition', question: "What's your unique value proposition?", field: 'valueProposition', type: 'textarea', section: 'aiConfig', label: 'Value proposition' },
  { id: 'done', question: "I have everything I need. You'll add contacts and generate emails in the next steps.", field: null, type: 'confirmation', section: null },
];

function parseCommaList(str) {
  if (!str || typeof str !== 'string') return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function getAppreciationMessage(step, value) {
  const label = step.label || step.field;
  const display = typeof value === 'string' && value.length > 80 ? value.slice(0, 77) + '...' : value;
  return `✓ Got it! I've saved **${label}** as "${display}".`;
}

const TYPING_SPEED_MS = 28;

const CampaignChatbot = ({ onComplete, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [collected, setCollected] = useState({
    campaignInfo: {},
    targetAudience: { industries: [], jobRoles: [], companySizes: [], locations: '' },
    aiConfig: {},
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentStep = CHAT_STEPS[stepIndex];
  const isConfirmation = currentStep?.type === 'confirmation';

  useEffect(() => {
    if (stepIndex === 0 && messages.length === 0) {
      setMessages([{ type: 'bot', text: CHAT_STEPS[0].question, stepId: CHAT_STEPS[0].id, typing: true, displayedLength: 0 }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typingIntervalRef = useRef(null);

  useEffect(() => {
    const typingMsg = messages.find(m => m.type === 'bot' && m.typing);
    if (!typingMsg) return;
    const len = typingMsg.text?.length ?? 0;
    const current = typingMsg.displayedLength ?? 0;
    if (current >= len) {
      setMessages(prev => prev.map(m => (m.type === 'bot' && m.typing ? { ...m, typing: false } : m)));
      return;
    }
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = setInterval(() => {
      setMessages(prev => {
        const msg = prev.find(m => m.type === 'bot' && m.typing);
        if (!msg) return prev;
        const next = (msg.displayedLength ?? 0) + 1;
        const done = next >= (msg.text?.length ?? 0);
        return prev.map(m => (m.type === 'bot' && m.typing ? { ...m, displayedLength: next, typing: !done } : m));
      });
    }, TYPING_SPEED_MS);
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [messages]);

  useEffect(() => {
    if (!isConfirmation && currentStep?.type !== 'choice') {
      inputRef.current?.focus();
    }
  }, [stepIndex, isConfirmation, currentStep?.type]);

  const sendReply = (value, displayText) => {
    if (currentStep.type === 'confirmation') {
      setMessages(prev => [...prev, { type: 'user', text: displayText || 'Continue' }]);
      buildAndComplete();
      return;
    }
    const text = typeof value === 'string' ? value.trim() : value;
    if (!text) return;

    const userDisplay = typeof text === 'string' ? text : (currentStep.options?.find(o => o.value === text)?.label || text);
    setMessages(prev => [...prev, { type: 'user', text: userDisplay }]);

    const section = currentStep.section;
    const field = currentStep.field;
    let nextCollected = { ...collected };
    if (section === 'targetAudience' && ['industries', 'jobRoles', 'companySizes'].includes(field)) {
      nextCollected.targetAudience = { ...collected.targetAudience, [field]: parseCommaList(text) };
    } else if (section === 'targetAudience' && field === 'locations') {
      nextCollected.targetAudience = { ...collected.targetAudience, locations: text };
    } else if (section) {
      nextCollected[section] = { ...collected[section], [field]: text };
    }
    setCollected(nextCollected);

    const nextIndex = stepIndex + 1;
    if (nextIndex >= CHAT_STEPS.length) {
      setInputValue('');
      setStepIndex(nextIndex);
      return;
    }

    const nextStep = CHAT_STEPS[nextIndex];
    const appreciation = getAppreciationMessage(currentStep, userDisplay);
    const nextQuestion = nextStep.type === 'confirmation' ? nextStep.question : `Next — ${nextStep.question}`;
    const botText = `${appreciation}\n\n${nextQuestion}`;
    setMessages(prev => [...prev, { type: 'bot', text: botText, stepId: nextStep.id, typing: true, displayedLength: 0 }]);
    setInputValue('');
    setStepIndex(nextIndex);
  };

  const buildAndComplete = () => {
    const formData = {
      campaignInfo: {
        name: collected.campaignInfo.name || 'Campaign',
        companyDescription: collected.campaignInfo.companyDescription || '',
        productService: collected.campaignInfo.productService || '',
        offer: collected.campaignInfo.offer || '',
        goal: collected.campaignInfo.goal || 'lead_generation',
      },
      targetAudience: {
        industries: collected.targetAudience.industries || [],
        jobRoles: collected.targetAudience.jobRoles || [],
        companySizes: collected.targetAudience.companySizes || [],
        locations: collected.targetAudience.locations || '',
      },
      aiConfig: {
        companyInfo: collected.aiConfig.companyInfo || collected.campaignInfo.companyDescription || '',
        productService: collected.aiConfig.productService || collected.campaignInfo.productService || '',
        targetAudience: collected.aiConfig.targetAudience || '',
        painPoints: collected.aiConfig.painPoints || '',
        tone: collected.aiConfig.tone || 'professional',
        callToAction: collected.aiConfig.callToAction || '',
        valueProposition: collected.aiConfig.valueProposition || '',
      },
      contacts: [],
      emailListId: '',
      emailListName: '',
      campaignId: '',
      selectedContactIds: [],
      generatedEmails: [],
      emailTemplate: {},
      validationResult: {},
      launchConfig: {},
    };
    onComplete(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendReply(inputValue);
  };

  const handleChoice = (value) => {
    sendReply(value);
  };

  const getDisplayText = (msg) => {
    if (msg.type !== 'bot') return msg.text;
    if (msg.typing) {
      const len = msg.displayedLength ?? 0;
      return (msg.text || '').slice(0, len);
    }
    return msg.text || '';
  };

  const renderFormattedText = (text) => {
    return text.split('\n').map((line, j) => (
      <span key={j}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, k) =>
          part.startsWith('**') && part.endsWith('**') ? <strong key={k}>{part.slice(2, -2)}</strong> : part
        )}
        {j < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const isTyping = messages.some(m => m.type === 'bot' && m.typing);

  if (stepIndex >= CHAT_STEPS.length && !isConfirmation) {
    return null;
  }

  return (
    <div className="campaign-chatbot">
      <div className="chatbot-window card">
        <header className="chatbot-header">
          <div className="chatbot-header-title">
            <div className="chatbot-avatar">
              <Bot size={22} />
            </div>
            <div>
              <span className="chatbot-name">Campaign Assistant</span>
              <span className="chatbot-status">{isTyping ? 'typing...' : 'online'}</span>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm chatbot-back" onClick={onBack}>
            <ArrowLeft size={18} />
            <span className="btn-text">Back</span>
          </button>
        </header>

        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="message-avatar bot">
                  <Bot size={20} />
                </div>
              )}
              <div className="message-bubble">
                <p>{renderFormattedText(getDisplayText(msg))}</p>
                {msg.type === 'bot' && msg.typing && (
                  <span className="typing-cursor">|</span>
                )}
              </div>
              {msg.type === 'user' && (
                <div className="message-avatar user">You</div>
              )}
            </div>
          ))}
          {currentStep && stepIndex < CHAT_STEPS.length && !isTyping && (
            <div className="chat-input-area">
              {currentStep.type === 'choice' && (
                <div className="choice-buttons">
                  {currentStep.options.map(opt => (
                    <button key={opt.value} type="button" className="btn btn-secondary btn-sm" onClick={() => handleChoice(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              {currentStep.type === 'confirmation' && (
                <div className="confirmation-actions">
                  <button type="button" className="btn btn-primary" onClick={() => sendReply(null, 'Continue to add contacts & generate emails')}>
                    <CheckCircle size={20} />
                    Continue to add contacts & generate emails
                  </button>
                </div>
              )}
              {currentStep.type !== 'choice' && currentStep.type !== 'confirmation' && (
                <form onSubmit={handleSubmit} className="chat-input-form">
                  {currentStep.hint && <span className="input-hint">{currentStep.hint}</span>}
                  {currentStep.type === 'textarea' ? (
                    <textarea ref={inputRef} className="chat-input" rows={3} placeholder="Type your answer..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  ) : (
                    <input ref={inputRef} type="text" className="chat-input" placeholder="Type your answer..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  )}
                  <button type="submit" className="btn btn-primary btn-send" disabled={!inputValue.trim()}>
                    <Send size={18} />
                    Send
                  </button>
                </form>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default CampaignChatbot;
