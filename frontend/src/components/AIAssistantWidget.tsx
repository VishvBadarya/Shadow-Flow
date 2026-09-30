import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  Calendar,
  User,
  HeartPulse,
  Info,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    path: string;
  };
}

export default function AIAssistantWidget() {
  const { aiModalOpen, setAiModalOpen, setBookingPrefill } = useApp();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hi, I’m MediCare AI. How can I help you today? I can help you find specialists, guide you through appointment booking, explain department services, or provide verified general health guidance.",
      timestamp: 'Just now'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiModalOpen) {
      scrollToBottom();
    }
  }, [messages, aiModalOpen]);

  const suggestedActions = [
    { label: 'Find a Doctor', query: 'Find a doctor' },
    { label: 'Book an Appointment', query: 'Book an appointment' },
    { label: 'Hospital Departments', query: 'What departments do you have?' },
    { label: 'Emergency Guidance', query: 'What are the emergency protocols?' },
    { label: 'Fasting for Blood Work', query: 'Do I need to fast for my lipid profile test?' },
    { label: 'Robotic Surgery Info', query: 'Tell me about robotic surgery at MediCare Nexus' }
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let actionBtn: { label: string; path: string } | undefined;

      const q = text.toLowerCase();

      if (q.includes('doctor') || q.includes('cardiologist') || q.includes('specialist')) {
        replyText = "We have 150+ board-certified medical specialists across 25+ departments. For example, Dr. Marcus Vance leads our Cardiology team with 16 years of experience, and Dr. Elena Rostova heads Neurology. Would you like to view our doctor directory or book directly?";
        actionBtn = { label: 'Explore All Doctors', path: '/doctors' };
      } else if (q.includes('book') || q.includes('appointment') || q.includes('schedule')) {
        replyText = "You can easily schedule a consultation using our 6-step online booking portal. You can choose in-person or video consultation, select your preferred doctor, date, and convenient time slot.";
        actionBtn = { label: 'Start 6-Step Booking', path: '/book-appointment' };
      } else if (q.includes('department') || q.includes('specialties')) {
        replyText = "Our core tertiary departments include Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, Oncology, Gynecology, and General Medicine, all supported by 24/7 diagnostic labs and imaging.";
        actionBtn = { label: 'View Departments', path: '/departments' };
      } else if (q.includes('emergency') || q.includes('urgent') || q.includes('chest pain') || q.includes('stroke')) {
        replyText = "IMPORTANT: If you or someone around you is experiencing acute chest pressure, sudden numbness/drooping (FAST stroke symptoms), severe bleeding, or respiratory distress, please call our 24/7 Emergency Line 1-800-MEDICARE immediately or proceed to our Level-1 Trauma Center.";
        actionBtn = { label: 'Emergency Care Center', path: '/emergency' };
      } else if (q.includes('fast') || q.includes('blood') || q.includes('lipid') || q.includes('test')) {
        replyText = "For comprehensive metabolic and lipid panels, standard clinical guidance requires 10 to 12 hours of overnight fasting (water is permitted). Do not skip prescribed cardiac medications unless explicitly directed by your physician.";
        actionBtn = { label: 'Health Packages', path: '/packages' };
      } else if (q.includes('robotic')) {
        replyText = "ShadowFlow MediCare Nexus utilizes the da Vinci® Xi and Mako® robotic surgical systems for minimally invasive orthopedic, thoracic, and gynecological procedures, allowing 50% faster recovery and microscopic surgical precision.";
        actionBtn = { label: 'Explore Surgical Services', path: '/services' };
      } else {
        replyText = `Thank you for asking about "${text}". At ShadowFlow MediCare Nexus, our clinical staff and coordinators are available 24/7 to assist with consultations, second opinions, and diagnostic bookings.`;
        actionBtn = { label: 'Contact Hospital Support', path: '/contact' };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: actionBtn
        }
      ]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!aiModalOpen && (
        <button
          onClick={() => setAiModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 900,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-glow-primary)',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontWeight: 600,
            fontSize: '14px'
          }}
          className="btn"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bot size={18} />
          </div>
          <span>Ask MediCare AI</span>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--secondary-light)'
            }}
          ></span>
        </button>
      )}

      {/* AI Assistant Modal Box */}
      {aiModalOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            width: '400px',
            maxWidth: 'calc(100vw - 32px)',
            height: '620px',
            maxHeight: 'calc(100vh - 56px)',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-modal)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleUp 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #074780 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div className="flex items-center gap-sm">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  MediCare AI
                  <span className="badge" style={{ backgroundColor: 'rgba(20, 184, 166, 0.25)', color: '#5eead4', fontSize: '10px', padding: '2px 6px' }}>
                    Verified Guide
                  </span>
                </div>
                <div style={{ fontSize: '11px', opacity: 0.85 }}>Hospital Clinical Intelligence</div>
              </div>
            </div>
            <button
              onClick={() => setAiModalOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                opacity: 0.85
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mandatory Clinical Disclaimer Alert */}
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--warning-light)',
              borderBottom: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: 'var(--warning-dark)',
              lineHeight: 1.3
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Clinical Notice:</strong> MediCare AI provides general hospital info and health education. It does NOT replace a doctor or handle medical emergencies.
            </span>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#F8FAFC'
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    backgroundColor: m.sender === 'user' ? 'var(--primary)' : 'var(--surface)',
                    color: m.sender === 'user' ? 'white' : 'var(--text-primary)',
                    boxShadow: 'var(--shadow-xs)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '13.5px',
                    lineHeight: 1.45
                  }}
                >
                  {m.text}

                  {m.actionButton && (
                    <button
                      onClick={() => {
                        setAiModalOpen(false);
                        navigate(m.actionButton!.path);
                      }}
                      className="btn btn-sm btn-primary"
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}
                    >
                      {m.actionButton.label} →
                    </button>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    marginTop: '3px',
                    textAlign: m.sender === 'user' ? 'right' : 'left'
                  }}
                >
                  {m.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} color="var(--primary)" />
                MediCare AI is formulating guidance...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Action Chips */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {suggestedActions.map((act) => (
              <button
                key={act.label}
                onClick={() => handleSend(act.query)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'var(--transition)'
                }}
              >
                {act.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask about doctors, departments, booking..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSend()}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 12px' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
