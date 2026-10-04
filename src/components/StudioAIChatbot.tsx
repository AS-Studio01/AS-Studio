import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Bot, X, Sparkles, User, RefreshCw, AlertCircle, 
  Mail, Send as TelegramIcon, Copy, Check, MessageSquare, 
  ShieldCheck, ArrowUpRight, Zap, CheckCheck, FileText, 
  FileCheck2, ExternalLink, Edit3, Database
} from 'lucide-react';
import { STUDIO_CONTACT, buildMailtoLink } from '../constants/communication';
import { saveProjectInquiry, sendEmailViaGmail } from '../services';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDirectContact?: boolean;
  isGeneratedInquiry?: boolean;
  inquiryData?: string;
}

interface StudioAIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

export function StudioAIChatbot({ isOpen, onClose, onOpenContact }: StudioAIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I’m the AS Studio assistant.

I can help you understand our website services, suggest the right type of website for your business, explain the project process, or help you prepare a project brief.

Tell me what your business does and what you want the website to achieve.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingInquiry, setIsGeneratingInquiry] = useState(false);
  const [typingPhase, setTypingPhase] = useState<'thinking' | 'typing'>('thinking');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedInquiryId, setCopiedInquiryId] = useState<string | null>(null);
  const [editingInquiryId, setEditingInquiryId] = useState<string | null>(null);
  const [savedInquiryIds, setSavedInquiryIds] = useState<Record<string, boolean>>({});

  const handleSaveInquiryToDatabase = async (inquiryText: string, msgId: string) => {
    try {
      await saveProjectInquiry({
        clientName: 'Client via Assistant',
        businessName: 'Synthesized Brief',
        contactChannel: STUDIO_CONTACT.email,
        scopeSummary: inquiryText,
        targetBudget: 'To be discussed',
        source: 'ai_chat_assistant',
      });
      await sendEmailViaGmail({
        to: STUDIO_CONTACT.email,
        subject: '[Inquiry Saved] Synthesized Chat Brief',
        bodyText: inquiryText,
      });
      setSavedInquiryIds((prev) => ({ ...prev, [msgId]: true }));
    } catch (e) {
      console.error('Failed to log to database:', e);
    }
  };

  // Active editable inquiry in modal view
  const [activeModalInquiry, setActiveModalInquiry] = useState<string | null>(null);

  // Streaming typewriter state for the latest assistant message
  const [streamingText, setStreamingText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateInquiryText = (msgId: string, newText: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, inquiryData: newText } : m))
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading, streamingText, isGeneratingInquiry]);

  // Typing phase timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setTypingPhase('thinking');
      timer = setTimeout(() => {
        setTypingPhase('typing');
      }, 600);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Tap anywhere else / Escape key to exit chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const copyEmail = () => {
    navigator.clipboard.writeText(STUDIO_CONTACT.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyInquiryText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInquiryId(id);
    setTimeout(() => setCopiedInquiryId(null), 2200);
  };

  const handleDirectContactRequest = () => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Direct Contact',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const contactReply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Here are the official direct contact touchpoints to connect with the AS Studio team right now. We typically reply within a few hours:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDirectContact: true,
    };

    setMessages((prev) => [...prev, userMsg, contactReply]);
  };

  // Generate pre-built message or inquiry based on chat history
  const handleGenerateInquiry = async () => {
    if (isGeneratingInquiry || isLoading) return;

    setIsGeneratingInquiry(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: '✨ Generate a pre-built inquiry from our conversation',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/chat/generate-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      let inquiryText = '';
      if (response.ok) {
        const data = await response.json();
        inquiryText = data.inquiryText;
      }

      if (!inquiryText) {
        inquiryText = `Hi AS Studio team,\n\nI was chatting with AS Studio Helper AI regarding a website project for my business.\n\n• Service: Website Design & Development\n• Pricing: Negotiable to my budget\n• Desired timeline: 7–14 business days\n\nPlease let me know the best next steps!`;
      }

      const inquiryReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've synthesized your chat into a structured, pre-built project inquiry! You can review, copy, or send it directly to the founders on Telegram or Gmail with 1 click:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isGeneratedInquiry: true,
        inquiryData: inquiryText,
      };

      setMessages((prev) => [...prev, inquiryReply]);
    } catch (err) {
      console.error('Error generating inquiry:', err);
      const fallbackInquiry = `Hi AS Studio team,\n\nI was chatting with AS Studio Helper AI and would like to discuss building a website for my business with negotiable pricing.\n\nPlease let me know how we can get started!`;
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Here is a pre-built inquiry message ready to send:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isGeneratedInquiry: true,
        inquiryData: fallbackInquiry,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsGeneratingInquiry(false);
    }
  };

  const handleFillContactForm = (inquiryText: string) => {
    try {
      sessionStorage.setItem('as_studio_prefilled_inquiry', inquiryText);
    } catch (e) {
      console.error('Session storage error', e);
    }
    onClose();
    if (onOpenContact) {
      onOpenContact();
    }
  };

  // Typewriter effect simulator for lively text reveal
  const streamResponse = (fullText: string, isContact: boolean) => {
    let index = 0;
    const chunkSize = Math.max(3, Math.floor(fullText.length / 25));
    setStreamingText('');

    const interval = setInterval(() => {
      index += chunkSize;
      if (index >= fullText.length) {
        clearInterval(interval);
        setStreamingText(null);
        const finalMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: fullText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDirectContact: isContact,
        };
        setMessages((prev) => [...prev, finalMsg]);
      } else {
        setStreamingText(fullText.slice(0, index));
      }
    }, 20);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading || isGeneratingInquiry || streamingText !== null) return;

    // Check if the user is asking for direct contact
    const lower = text.toLowerCase();
    if (
      lower === 'direct contact' ||
      lower === 'contact' ||
      lower === 'talk to human' ||
      lower === 'speak to someone' ||
      lower === 'founder contact'
    ) {
      setInput('');
      handleDirectContactRequest();
      return;
    }

    // Check if the user wants to generate a pre-built message or inquiry
    if (
      lower.includes('generate inquiry') ||
      lower.includes('pre built') ||
      lower.includes('prebuilt') ||
      lower.includes('draft inquiry') ||
      lower.includes('create inquiry') ||
      lower.includes('summary message') ||
      lower.includes('draft message')
    ) {
      setInput('');
      handleGenerateInquiry();
      return;
    }

    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'I am here to assist with AS Studio projects and pricing.';

      const hasDirectContact =
        reply.includes('@AS_Studio_official01') ||
        reply.includes('asbusinessofficial01@gmail.com') ||
        reply.toLowerCase().includes('direct contact') ||
        reply.toLowerCase().includes('reach out directly');

      setIsLoading(false);
      streamResponse(reply, hasDirectContact);
    } catch (err: any) {
      console.error('Chat error:', err);
      setIsLoading(false);
      const fallbackReply = 'I could not process that request right now. You can reach the AS Studio team directly via Telegram (@AS_Studio_official01) or Gmail (asbusinessofficial01@gmail.com) below:';
      streamResponse(fallbackReply, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render bold text and bullet points cleanly
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lineIdx} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  const quickPrompts = [
    '✨ Draft Pre-built Inquiry',
    'Direct Contact',
    'Is pricing negotiable for my budget?',
    'What is your turnaround time?',
    'Will I own 100% of the code?',
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen Glassmorphic Blur Backdrop with Tap-to-Exit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-md cursor-pointer transition-opacity"
        aria-label="Tap anywhere to exit chat"
        title="Tap anywhere to exit chat"
      />

      {/* Floating Chat Container */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-auto justify-center sm:justify-end p-0 sm:bottom-16 sm:right-6 landscape:bottom-2 landscape:right-4">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full sm:w-[460px] h-[96dvh] sm:h-[min(640px,calc(100dvh-3rem))] landscape:h-[calc(100dvh-1rem)] bg-[#121215] border border-white/10 shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden text-[#F4F4F6] sm:rounded-2xl relative"
          role="dialog"
          aria-labelledby="chat-title"
        >
        {/* Real-feeling Chat Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 landscape:py-2.5 bg-[#18181D]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-md">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#18181D]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 id="chat-title" className="text-sm font-black tracking-tight text-white">
                  AS Studio Helper AI
                </h3>
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#3B82F6]/20 text-[#60A5FA] text-[9px] font-mono font-bold uppercase">
                  Fast
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online · Instant replies</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Generate Inquiry Button in Header */}
            <button
              onClick={handleGenerateInquiry}
              disabled={isGeneratingInquiry || isLoading}
              className="px-2.5 py-1 text-[11px] font-bold font-mono bg-gradient-to-r from-[#2563EB]/25 to-[#60A5FA]/20 hover:from-[#2563EB]/35 hover:to-[#60A5FA]/30 text-[#93C5FD] border border-[#3B82F6]/40 rounded-md transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Generate a pre-built inquiry summarizing your chat"
            >
              <Sparkles className="w-3 h-3 text-[#60A5FA] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden xs:inline">Draft Inquiry</span>
              <span className="xs:hidden">Draft</span>
            </button>

            {/* Direct Contact Action Button */}
            <button
              onClick={handleDirectContactRequest}
              className="px-2 py-1 text-[11px] font-bold font-mono bg-[#3B82F6]/15 hover:bg-[#3B82F6]/25 text-[#60A5FA] border border-[#3B82F6]/30 rounded-md transition-colors flex items-center gap-1"
              title="Get direct Telegram & Gmail links"
            >
              <Zap className="w-3 h-3 text-[#60A5FA]" />
              <span>Contact</span>
            </button>

            {/* Reset Thread */}
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome',
                    role: 'assistant',
                    content: `Hello! I am **AS Studio Helper AI**, your direct assistant for AS Studio.

I can help answer any questions about our design services, negotiable pricing, turnaround times, or how we collaborate.

Ask me anything or tap **Direct Contact** or **Draft Pre-built Inquiry** at any time!`,
                    timestamp: 'Just now',
                  },
                ]);
                setStreamingText(null);
              }}
              className="p-1.5 text-[#A1A1AA] hover:text-white transition-colors rounded-md hover:bg-white/5"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#A1A1AA] hover:text-white transition-colors rounded-md hover:bg-white/5"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Subtle Security Badge */}
          <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-[#71717A] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official AS Studio Concierge · No login required</span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-white/10 text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      isUser
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-tr-xs shadow-md'
                        : 'bg-[#1C1C22] border border-white/[0.08] text-[#E4E4E7] rounded-tl-xs shadow-sm'
                    }`}
                  >
                    <div className="space-y-1">{renderFormattedContent(msg.content)}</div>
                    
                    <div className="flex items-center justify-end gap-1 text-[10px] mt-1.5 font-mono opacity-60">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* FEATURE: Pre-built Message / Inquiry Card generated according to chat */}
                {msg.isGeneratedInquiry && msg.inquiryData && (
                  <div className="w-full max-w-[94%] ml-9 p-4 bg-[#181822] border border-[#3B82F6]/40 rounded-xl space-y-3.5 shadow-xl fade-in">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-[#60A5FA]" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                          Pre-built Inquiry Generated from Chat
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Edit / Save Button */}
                        <button
                          onClick={() => setEditingInquiryId(editingInquiryId === msg.id ? null : msg.id)}
                          className="px-2.5 py-1 text-[11px] font-mono font-bold text-[#93C5FD] hover:text-white bg-[#3B82F6]/20 hover:bg-[#3B82F6]/35 border border-[#3B82F6]/40 rounded flex items-center gap-1.5 transition-colors"
                          title={editingInquiryId === msg.id ? 'Save changes' : 'Edit this message before sending'}
                        >
                          {editingInquiryId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Edit3 className="w-3.5 h-3.5 text-[#60A5FA]" />
                              <span>Edit Message</span>
                            </>
                          )}
                        </button>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {editingInquiryId === msg.id ? 'Editing' : 'Ready'}
                        </span>
                      </div>
                    </div>

                    {/* Formatted Message Preview Box OR Live Editable Textarea */}
                    {editingInquiryId === msg.id ? (
                      <div className="space-y-1.5 fade-in">
                        <div className="flex items-center justify-between text-[11px] text-[#A1A1AA] font-mono">
                          <span className="text-[#93C5FD]">✏️ Edit message directly below:</span>
                          <span className="text-[10px] text-emerald-400">Telegram & Gmail links update live</span>
                        </div>
                        <textarea
                          value={msg.inquiryData}
                          onChange={(e) => handleUpdateInquiryText(msg.id, e.target.value)}
                          rows={7}
                          className="w-full p-3 bg-[#0A0A0E] border-2 border-[#3B82F6] rounded-lg text-xs font-mono text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 resize-y"
                          placeholder="Type or modify your inquiry..."
                        />
                        <div className="flex items-center justify-between text-[10px] text-[#71717A] pt-0.5">
                          <span>Modify any requirements, scope, or questions</span>
                          <button
                            onClick={() => setEditingInquiryId(null)}
                            className="text-[11px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1 rounded transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Save & Close Editor</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setEditingInquiryId(msg.id)}
                        className="p-3 bg-[#0F0F14] border border-white/10 hover:border-[#3B82F6]/60 rounded-lg text-xs font-mono text-[#D4D4D8] leading-relaxed whitespace-pre-wrap select-all max-h-48 overflow-y-auto cursor-pointer transition-colors group relative"
                        title="Click to edit message directly"
                      >
                        {msg.inquiryData}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#18181D]/90 px-2 py-0.5 rounded text-[10px] text-[#93C5FD] border border-white/15 flex items-center gap-1 shadow-sm">
                          <Edit3 className="w-3 h-3 text-[#60A5FA]" />
                          <span>Click to edit</span>
                        </div>
                      </div>
                    )}

                    {/* Quick 1-Click Action Buttons for this inquiry */}
                    <div className="space-y-2 pt-1">
                      {/* Send via Telegram */}
                      <a
                        href={`https://t.me/AS_Studio_official01?text=${encodeURIComponent(msg.inquiryData)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-btn-primary w-full py-2.5 px-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white group"
                      >
                        <span className="flex items-center gap-2">
                          <TelegramIcon className="w-4 h-4 text-white" />
                          <span>Send via Telegram (@AS_Studio_official01)</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono group-hover:bg-white/30 transition-colors">
                          <span>1-Tap Send</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>

                      {/* Send via Gmail + Copy + Fill Form + Save to DB Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* Save to Database */}
                        <button
                          onClick={() => handleSaveInquiryToDatabase(msg.inquiryData!, msg.id)}
                          disabled={savedInquiryIds[msg.id]}
                          className={`py-2 px-2 flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg border transition-colors ${
                            savedInquiryIds[msg.id]
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'glass-btn border-white/10 hover:border-white/25 text-white'
                          }`}
                          title="Save this inquiry to AS Studio database"
                        >
                          {savedInquiryIds[msg.id] ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[11px]">Saved in DB</span>
                            </>
                          ) : (
                            <>
                              <Database className="w-3.5 h-3.5 text-[#60A5FA]" />
                              <span className="text-[11px]">Save to DB</span>
                            </>
                          )}
                        </button>

                        {/* Send Email */}
                        <a
                          href={`mailto:${STUDIO_CONTACT.email}?subject=${encodeURIComponent('AS Studio Project Inquiry')}&body=${encodeURIComponent(msg.inquiryData)}`}
                          className="glass-btn py-2 px-2 flex items-center justify-center gap-1.5 text-xs font-bold text-white border border-white/10 hover:border-white/25 rounded-lg"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#60A5FA]" />
                          <span className="text-[11px]">Email</span>
                        </a>

                        {/* Copy Inquiry Text */}
                        <button
                          onClick={() => copyInquiryText(msg.inquiryData!, msg.id)}
                          className="glass-btn py-2 px-2 flex items-center justify-center gap-1.5 text-xs font-bold text-white border border-white/10 hover:border-white/25 rounded-lg"
                        >
                          {copiedInquiryId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </button>

                        {/* Transfer to Website Contact Form */}
                        <button
                          onClick={() => handleFillContactForm(msg.inquiryData!)}
                          className="glass-btn py-2 px-2 flex items-center justify-center gap-1.5 text-xs font-bold text-white border border-white/10 hover:border-white/25 rounded-lg"
                          title="Pre-fill into official contact page form"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#60A5FA]" />
                          <span className="text-[11px]">Fill Form</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* High-Fidelity Direct Contact Cards */}
                {msg.isDirectContact && (
                  <div className="w-full max-w-[90%] ml-9 p-4 bg-[#18181E] border border-[#3B82F6]/30 rounded-xl space-y-3 shadow-lg fade-in">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#60A5FA] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Connect Directly With Founders:
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono">Replies &lt; 24h</span>
                    </div>

                    {/* Telegram Card */}
                    <a
                      href={STUDIO_CONTACT.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-btn-primary w-full py-2.5 px-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white group"
                    >
                      <span className="flex items-center gap-2">
                        <TelegramIcon className="w-4 h-4 text-white" />
                        <span>Telegram: @AS_Studio_official01</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono group-hover:bg-white/30 transition-colors">
                        <span>Fastest</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </a>

                    {/* Gmail Card */}
                    <div className="flex gap-2">
                      <a
                        href={buildMailtoLink()}
                        className="glass-btn flex-1 py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-bold text-white border border-white/10 hover:border-white/25"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#60A5FA]" />
                        <span>Send Email</span>
                      </a>
                      <button
                        onClick={copyEmail}
                        className="glass-btn px-3 py-2.5 text-xs font-bold text-white border border-white/10 hover:border-white/25 flex items-center gap-1.5"
                        title="Copy email address"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* WhatsApp Notice */}
                    <div className="pt-1 text-[11px] text-[#A1A1AA] flex items-center gap-1.5 border-t border-white/[0.06]">
                      <span className="line-through text-[#71717A]">WhatsApp</span>
                      <span>is currently disabled. Use Telegram or Gmail above.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Active Live Typewriter Stream Message */}
          {streamingText !== null && (
            <div className="flex gap-2.5 justify-start fade-in">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-white/10 text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-[#1C1C22] border border-white/[0.08] text-[#E4E4E7] rounded-tl-xs shadow-sm">
                <div className="space-y-1">
                  {renderFormattedContent(streamingText)}
                  <span className="inline-block w-1.5 h-3.5 bg-[#3B82F6] ml-1 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Realistic Typing / Inquiry Generation Indicator */}
          {(isLoading || isGeneratingInquiry) && (
            <div className="flex gap-2.5 justify-start fade-in">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-white/10 text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#1C1C22] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce [animation-delay:-0.32s] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  <span className="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce [animation-delay:-0.16s] shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                  <span className="w-2 h-2 bg-[#93C5FD] rounded-full animate-bounce shadow-[0_0_8px_rgba(147,197,253,0.6)]" />
                </div>
                <span className="text-[11px] text-[#A1A1AA] font-mono">
                  {isGeneratingInquiry
                    ? 'AS Studio Helper is synthesizing your chat inquiry...'
                    : typingPhase === 'thinking'
                    ? 'AS Studio Helper is thinking...'
                    : 'AS Studio Helper is typing...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#16161C] flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                if (prompt.includes('Draft Pre-built Inquiry')) {
                  handleGenerateInquiry();
                } else {
                  handleSend(prompt);
                }
              }}
              disabled={isLoading || isGeneratingInquiry || streamingText !== null}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all truncate max-w-full disabled:opacity-50 ${
                prompt.includes('Draft Pre-built Inquiry')
                  ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/50 text-[#93C5FD] hover:bg-[#3B82F6]/30'
                  : 'bg-[#1F1F26] border border-white/[0.08] text-[#D4D4D8] hover:border-[#3B82F6] hover:text-white'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-[#18181E] border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask questions or type 'Draft inquiry'..."
              disabled={isLoading || isGeneratingInquiry || streamingText !== null}
              className="flex-1 px-4 py-3 bg-[#111114] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || isGeneratingInquiry || streamingText !== null || !input.trim()}
              className="glass-btn-primary p-3 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#71717A] mt-2 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#3B82F6]" />
              <span>Tap &quot;Draft Inquiry&quot; to summarize chat</span>
            </span>
            {onOpenContact && (
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="text-[#60A5FA] font-bold hover:underline"
              >
                Open Official Brief Form →
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  </>
);
}
