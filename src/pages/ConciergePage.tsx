/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  PhoneCall,
  CheckCircle2,
  X,
  Clock,
  ShieldCheck,
  Gauge,
  BatteryCharging,
  Coins,
  Compass,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { ScoreRing } from '../components/ui/ScoreRing';
import { useAppState } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  isStreaming?: boolean;
  showHumanHandOff?: boolean;
  timestamp: string;
}

const SUGGESTED_CHIPS = [
  'Will an EV fit my commute?',
  'How can I think about charging?',
  'Help me understand my potential running costs.',
  'What should I check during a test ride?',
  "I'm still unsure about EVs.",
];

export const ConciergePage: React.FC = () => {
  const {
    currentCustomer,
    quizAnswers,
    riderProfile,
    leadScore,
    setLeadScore,
    logEvent,
    events,
  } = useAppState();

  const hasLoggedRef = useRef(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'concierge',
      text: `Hello ${currentCustomer?.name ? currentCustomer.name.split(' ')[0] : 'there'}! I'm your AI Ride Concierge. I've analyzed your daily transit variables and rider profile. What can I help clarify about your EV transition?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // "Talk to a Human" Modal state
  const [showHumanModal, setShowHumanModal] = useState(false);
  const [humanName, setHumanName] = useState(currentCustomer?.name || '');
  const [humanPhone, setHumanPhone] = useState(currentCustomer?.phone || '');
  const [humanConsent, setHumanConsent] = useState(false);
  const [humanTimeWindow, setHumanTimeWindow] = useState('Morning (9 AM - 12 PM)');
  const [humanSubmitting, setHumanSubmitting] = useState(false);
  const [humanSuccess, setHumanSuccess] = useState(false);
  const [humanError, setHumanError] = useState('');

  // 1. Log event and +5 to lead score once on mount
  useEffect(() => {
    const alreadyLogged = events.some((e) => e.type === 'ride_concierge_opened');
    if (!alreadyLogged && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('ride_concierge_opened', '/concierge', { mode: 'DEMO AI MODE' });
      setLeadScore(Math.min(100, leadScore + 5));
    }
  }, [events, leadScore, logEvent, setLeadScore]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isStreaming]);

  // Cleanup stream interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Check if a question violates guardrail (price, range, specs, offers, availability, delivery)
  const violatesGuardrail = (query: string): boolean => {
    const lower = query.toLowerCase();
    const guardrailKeywords = [
      'price',
      'cost',
      'rate',
      'how much',
      'on-road',
      'on road',
      'emi',
      'down payment',
      'discount',
      'offer',
      'subsidy',
      'fame',
      'range',
      'km per charge',
      'how many km',
      'spec',
      'specs',
      'specification',
      'top speed',
      'battery capacity',
      'kwh',
      'motor',
      'torque',
      'availability',
      'available',
      'stock',
      'delivery',
      'waiting period',
      'waiting time',
      'booking amount',
      'color options',
      'colors',
    ];
    return guardrailKeywords.some((keyword) => lower.includes(keyword));
  };

  // Generate deterministic answers based on user profile and quiz
  const generateResponse = (query: string): { text: string; showHumanHandOff: boolean } => {
    const trimmed = query.trim();

    // Check guardrails first
    if (violatesGuardrail(trimmed)) {
      return {
        text: "I don't have verified information for that yet. Would you like to connect with an Ather representative?",
        showHumanHandOff: true,
      };
    }

    const lower = trimmed.toLowerCase();

    // 1. Commute question
    if (lower.includes('commute') || lower.includes('fit my commute') || lower.includes('daily distance')) {
      const commuteStr = quizAnswers.dailyCommute || '20-40 km';
      return {
        text: `Based on your stated daily commute of ${commuteStr}, an electric scooter is mathematically and practically tailored for your transit routine. A standard single overnight charge easily covers your full roundtrip with a 50%+ safety buffer remaining. In stop-and-go metro traffic, electric powertrains consume near-zero energy when stationary at traffic signals, making your actual efficiency significantly higher than petrol.`,
        showHumanHandOff: false,
      };
    }

    // 2. Charging question
    if (lower.includes('charge') || lower.includes('charging') || lower.includes('parking') || lower.includes('plug')) {
      const parking = quizAnswers.parkingType || 'home parking';
      if (parking.includes('Apartment')) {
        return {
          text: `For your ${parking} setup, the key step is getting standard society/RWA permission for a dedicated 5A/15A socket from your flat's meter board. Over 40% of Ather owners live in apartments. It requires a simple sub-meter installation, and overnight charging takes zero extra time—just like plugging in your smartphone before sleep. You can also utilize public Ather Grid points for occasional rapid top-ups.`,
          showHumanHandOff: false,
        };
      }
      return {
        text: `For your ${parking} setup, charging is remarkably effortless. You don't need a dedicated industrial wallbox—a standard 5A or 15A three-pin household socket in your garage or porch is all you need. You plug in at night, automated battery management protects from overcharging, and you wake up every morning with a full 100% battery for approximately ₹20–₹25.`,
        showHumanHandOff: false,
      };
    }

    // 3. Running costs question
    if (lower.includes('cost') || lower.includes('expense') || lower.includes('running') || lower.includes('petrol') || lower.includes('savings')) {
      const petrolSpend = quizAnswers.monthlyFuelExpense
        ? `₹${quizAnswers.monthlyFuelExpense.toLocaleString('en-IN')}`
        : '₹2,500 - ₹3,500';
      return {
        text: `You currently budget approximately ${petrolSpend} per month on petrol. With an EV consuming roughly 3.0 kWh per 100 km, your monthly electricity cost drops to just ~₹180–₹300 depending on your local tariff. That represents an immediate 85%+ reduction in recurring commute energy expenses, saving you tens of thousands of rupees annually while completely eliminating oil changes, spark plug replacements, and engine maintenance.`,
        showHumanHandOff: false,
      };
    }

    // 4. Test ride checklist question
    if (lower.includes('test ride') || lower.includes('check during') || lower.includes('what to check') || lower.includes('ride checklist')) {
      const concern = quizAnswers.biggestConcern || 'Range & Reliability';
      return {
        text: `Since your primary consideration is ${concern}, on your test ride pay specific attention to:\n\n1. Throttle Modulation: Notice the instant, predictable torque without any clutch lag or engine vibration.\n2. Regenerative Braking: Feel how releasing the throttle or rolling reverse slows down smoothly while putting power back into the battery.\n3. Dynamic Dashboard: Watch the TrueRange™ indicator adapt to your ride mode in real-time.\n4. Ergonomics & Boot Space: Test the seating balance with a pillion and inspect the under-seat storage depth for your everyday bag or helmet.`,
        showHumanHandOff: false,
      };
    }

    // 5. Unsure about EVs question
    if (lower.includes('unsure') || lower.includes('hesitant') || lower.includes('doubt') || lower.includes('scared') || lower.includes('worry')) {
      return {
        text: `Hesitation is completely natural when transitioning from 15+ years of petrol familiarity! Most first-time EV riders wonder about battery longevity, monsoon water-wading, and charging discipline. Ather battery packs are IP67-rated sealed aluminum units tested through severe water-logging and heat cycles. You don't have to commit today—the best approach is to book a relaxed, zero-pressure test ride so you can experience the whisper-quiet ride and solid road balance firsthand.`,
        showHumanHandOff: false,
      };
    }

    // Fallback response: EV Education & Test Ride recommendation
    return {
      text: `That's a thoughtful question regarding electric vehicle adoption! In real-world urban conditions, electric two-wheelers combine low center-of-gravity handling, instant acceleration, and minimal recurring maintenance compared to internal combustion engines. To verify how this fits your exact daily routine, we recommend trying a guided test ride at your local Ather Space.`,
      showHumanHandOff: false,
    };
  };

  // Stream assistant message word by word
  const deliverAssistantResponse = (fullText: string, showHumanHandOff: boolean) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setIsStreaming(true);

      const words = fullText.split(' ');
      let currentWordIndex = 0;
      const messageId = `msg-${Date.now()}`;

      // Insert empty streaming message
      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          sender: 'concierge',
          text: '',
          isStreaming: true,
          showHumanHandOff,
          timestamp: 'Just now',
        },
      ]);

      streamIntervalRef.current = setInterval(() => {
        currentWordIndex++;
        const currentSlice = words.slice(0, currentWordIndex).join(' ');

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, text: currentSlice } : msg
          )
        );

        if (currentWordIndex >= words.length) {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, isStreaming: false } : msg
            )
          );
        }
      }, 40); // 40ms per word feels very natural and responsive
    }, 600); // 600ms typing indicator
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isTyping || isStreaming) return;

    const userText = textToSend.trim();
    setInputQuery('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    logEvent('concierge_query_sent', '/concierge', { query: userText });

    // Determine reply
    const { text, showHumanHandOff } = generateResponse(userText);
    deliverAssistantResponse(text, showHumanHandOff);
  };

  // Submit Talk to a Human callback form
  const handleHumanCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHumanError('');

    if (!humanName.trim()) {
      setHumanError('Please enter your full name');
      return;
    }

    const cleanPhone = humanPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setHumanError('Please provide a valid 10-digit phone number');
      return;
    }

    if (!humanConsent) {
      setHumanError('Please grant contact consent to proceed');
      return;
    }

    setHumanSubmitting(true);

    setTimeout(() => {
      setHumanSubmitting(false);
      setHumanSuccess(true);
      logEvent('human_callback_requested', '/concierge', {
        name: humanName,
        phone: cleanPhone,
        timeWindow: humanTimeWindow,
      });
      setLeadScore(Math.min(100, leadScore + 10));
    }, 700);
  };

  const closeHumanModal = () => {
    setShowHumanModal(false);
    setHumanSuccess(false);
    setHumanError('');
  };

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] min-h-[calc(100vh-80px)] flex flex-col">
      {/* Ambient background glow */}
      <div
        className="absolute top-16 left-1/3 w-[650px] h-[500px] pointer-events-none rounded-full blur-[160px] opacity-15 bg-[#00E08A]/30"
        aria-hidden="true"
      />

      <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col relative z-10">
        {/* TOP BAR: Title, Subtitle, Badge, Talk to a Human */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
                AI Ride Concierge
              </h1>
              <Badge variant="ACADEMIC PROTOTYPE" label="DEMO AI MODE" />
            </div>
            <p className="text-xs sm:text-sm text-[#9AA3AF]">
              Your EV decision companion. Grounded in your commuter profile and transit reality.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowHumanModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#F5F7FA] hover:text-[#00E08A] hover:border-[#00E08A]/40 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
          >
            <PhoneCall size={14} className="text-[#00E08A]" />
            <span>Talk to a Human</span>
          </button>
        </div>

        {/* MAIN SPLIT: Left Profile Sidebar (hidden on mobile) + Chat Arena */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: Rider Profile & Scores (hidden on mobile, lg:col-span-4) */}
          <aside
            id="concierge-rider-profile-sidebar"
            className="hidden lg:flex lg:col-span-4 flex-col gap-4 bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.5)] sticky top-24"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#00E08A] block">
                  Customer Context
                </span>
                <h2 className="font-heading text-base font-semibold text-[#F5F7FA]">
                  {currentCustomer?.name || 'Rider Profile'}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#9AA3AF] bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                Score: {leadScore}/100
              </span>
            </div>

            {/* Score Ring Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#16191E] border border-white/[0.06]">
              <ScoreRing
                score={riderProfile?.matchScore || 88}
                size={84}
                strokeWidth={7}
                label=""
                sublabel=""
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#9AA3AF] block mb-0.5">
                  Recommendation Fit
                </span>
                <span className="font-heading font-bold text-sm text-[#00E08A] block truncate">
                  {riderProfile?.archetype || 'Balanced Daily Commuter'}
                </span>
                <span className="text-[11px] text-[#9AA3AF] block mt-1">
                  Confidence: {riderProfile?.confidenceScore || 78}% · Intent: {riderProfile?.intentScore || 85}%
                </span>
              </div>
            </div>

            {/* Commuter Variables Summary List */}
            <div className="space-y-2.5 text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] block mb-1">
                Grounded Variables
              </span>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <span className="text-[#9AA3AF] flex items-center gap-1.5">
                  <Gauge size={13} className="text-[#00E08A]" /> Daily Commute
                </span>
                <span className="font-medium text-[#F5F7FA]">
                  {quizAnswers.dailyCommute || '20-40 km'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <span className="text-[#9AA3AF] flex items-center gap-1.5">
                  <BatteryCharging size={13} className="text-amber-400" /> Parking & Power
                </span>
                <span className="font-medium text-[#F5F7FA] truncate max-w-[150px] text-right">
                  {quizAnswers.parkingType || 'Private home parking'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <span className="text-[#9AA3AF] flex items-center gap-1.5">
                  <Coins size={13} className="text-blue-400" /> Monthly Fuel
                </span>
                <span className="font-medium text-[#F5F7FA]">
                  {quizAnswers.monthlyFuelExpense
                    ? `₹${quizAnswers.monthlyFuelExpense.toLocaleString('en-IN')}`
                    : '₹2,500/mo'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <span className="text-[#9AA3AF] flex items-center gap-1.5">
                  <Compass size={13} className="text-rose-400" /> Primary Focus
                </span>
                <span className="font-medium text-[#F5F7FA] truncate max-w-[150px] text-right">
                  {quizAnswers.biggestConcern || 'Range & Reliability'}
                </span>
              </div>
            </div>

            {/* Quick action to test ride */}
            <div className="pt-3 border-t border-white/[0.06]">
              <SecondaryButton
                to="/test-ride"
                size="sm"
                className="w-full justify-center !text-xs !py-2"
                icon={<ArrowRight size={13} />}
              >
                Schedule Test Ride
              </SecondaryButton>
            </div>
          </aside>

          {/* CHAT ARENA (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#111418] border border-white/[0.08] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex flex-col h-[650px] sm:h-[700px] overflow-hidden">
            {/* SUGGESTED QUESTION CHIPS ROW */}
            <div className="p-3.5 sm:p-4 bg-[#16191E] border-b border-white/[0.06] overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] block mb-2 px-1">
                Suggested Decision Prompts:
              </span>
              <div className="flex items-center gap-2 whitespace-nowrap">
                {SUGGESTED_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isTyping || isStreaming}
                    onClick={() => handleSendMessage(chip)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#00E08A]/40 hover:bg-[#00E08A]/10 text-[#F5F7FA] hover:text-[#00E08A] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* MESSAGES SCROLLABLE CONTAINER */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#00E08A]/15 border border-[#00E08A]/30 flex items-center justify-center text-[#00E08A] shrink-0 mt-0.5">
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#00E08A] text-[#0B0D10] font-medium rounded-tr-none shadow-md'
                          : 'bg-[#16191E] border border-white/[0.08] text-[#F5F7FA] rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* If message triggers guardrail human hand-off button */}
                      {msg.showHumanHandOff && !isStreaming && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowHumanModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E08A] text-[#0B0D10] font-semibold text-xs hover:bg-[#00c97b] transition-colors cursor-pointer"
                          >
                            <PhoneCall size={13} />
                            <span>Connect with Representative</span>
                          </button>
                        </div>
                      )}

                      <span
                        className={`text-[9px] block text-right mt-1.5 ${
                          isUser ? 'text-[#0B0D10]/60' : 'text-[#9AA3AF]/60'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* TYPING INDICATOR */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00E08A]/15 border border-[#00E08A]/30 flex items-center justify-center text-[#00E08A] shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-[#16191E] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs text-[#9AA3AF]">
                    <span className="w-1.5 h-1.5 bg-[#00E08A] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#00E08A] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#00E08A] rounded-full animate-bounce" />
                    <span className="ml-2 font-mono text-[11px] text-[#9AA3AF]">
                      Analyzing commuter variables...
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* CHAT INPUT FORM */}
            <div className="p-3 sm:p-4 bg-[#16191E] border-t border-white/[0.06]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputQuery);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask about daily charging, monsoon safety, or running costs..."
                  disabled={isTyping || isStreaming}
                  className="flex-1 bg-[#111418] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F7FA] placeholder-[#9AA3AF]/60 focus:outline-none focus:border-[#00E08A] transition-colors disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping || isStreaming}
                  className="p-3 rounded-xl bg-[#00E08A] text-[#0B0D10] hover:bg-[#00c97b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-[#9AA3AF] mt-2 px-1">
                <span>Academic prototype AI model. Answers grounded in decision logic.</span>
                <span className="hidden sm:inline">Press Enter to send</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "TALK TO A HUMAN" MODAL */}
      <AnimatePresence>
        {showHumanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111418] border border-white/15 rounded-[24px] max-w-md w-full p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closeHumanModal}
                className="absolute top-5 right-5 text-[#9AA3AF] hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {humanSuccess ? (
                /* SUCCESS STATE */
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#00E08A]/15 border border-[#00E08A]/40 flex items-center justify-center mx-auto text-[#00E08A]">
                    <CheckCircle2 size={36} />
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-[#F5F7FA]">
                    Callback Requested!
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed max-w-sm mx-auto">
                    An Ather EV specialist will reach out to <strong className="text-white">{humanName}</strong> at{' '}
                    <strong className="text-white">{humanPhone}</strong> during your preferred window (
                    {humanTimeWindow}).
                  </p>

                  <div className="pt-4">
                    <PrimaryButton
                      type="button"
                      size="md"
                      onClick={closeHumanModal}
                      className="w-full justify-center"
                    >
                      Done & Return to Chat
                    </PrimaryButton>
                  </div>
                </div>
              ) : (
                /* FORM STATE */
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00E08A]">
                      Direct Human Handoff
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#F5F7FA] mb-1">
                    Connect with an Ather Specialist
                  </h3>
                  <p className="text-xs text-[#9AA3AF] mb-5">
                    Speak directly with a product expert regarding vehicle pricing, live inventory, or custom home socket installation.
                  </p>

                  {humanError && (
                    <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{humanError}</span>
                    </div>
                  )}

                  <form onSubmit={handleHumanCallbackSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={humanName}
                        onChange={(e) => setHumanName(e.target.value)}
                        placeholder="e.g. Aniket Singh"
                        className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                        Phone Number (10 digits) *
                      </label>
                      <div className="flex items-center">
                        <span className="bg-[#16191E] border border-r-0 border-white/10 text-[#9AA3AF] text-xs sm:text-sm px-3 py-2.5 rounded-l-xl font-mono">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={humanPhone}
                          onChange={(e) => setHumanPhone(e.target.value)}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full bg-[#16191E] border border-white/10 rounded-r-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                        />
                      </div>
                    </div>

                    {/* Preferred Time Window */}
                    <div>
                      <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                        Preferred Callback Slot
                      </label>
                      <select
                        value={humanTimeWindow}
                        onChange={(e) => setHumanTimeWindow(e.target.value)}
                        className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                      >
                        <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                        <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                        <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                      </select>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={humanConsent}
                          onChange={(e) => setHumanConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-[#16191E] text-[#00E08A] focus:ring-[#00E08A] accent-[#00E08A]"
                        />
                        <span className="text-[11px] text-[#9AA3AF] leading-relaxed">
                          I agree to be contacted by an Ather representative regarding my queries and test ride preferences.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <PrimaryButton
                        type="submit"
                        size="md"
                        disabled={humanSubmitting}
                        className="w-full justify-center"
                        icon={
                          humanSubmitting ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <PhoneCall size={15} />
                          )
                        }
                      >
                        {humanSubmitting ? 'Submitting Request...' : 'Schedule Callback'}
                      </PrimaryButton>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
