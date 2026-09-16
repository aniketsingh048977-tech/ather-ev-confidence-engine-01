/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
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
  Zap,
  RotateCcw,
  Sliders,
  MapPin,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { ScoreRing } from '../components/ui/ScoreRing';
import { useAppState } from '../context/AppContext';
import { usePresentation } from '../context/PresentationContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  isStreaming?: boolean;
  showHumanHandOff?: boolean;
  modelBadge?: string;
  actions?: { label: string; url: string; icon?: 'ride' | 'savings' | 'charging' | 'human' }[];
  timestamp: string;
}

const CATEGORIZED_PROMPTS = [
  {
    category: 'Vehicle Models',
    prompts: [
      'Compare Ather 450X vs Ather Rizta for my lifestyle',
      'What are the differences between Ather 450X, 450S, and 450 Apex?',
      'How does the Rizta 56L storage and pillion comfort compare to petrol scooters?',
    ],
  },
  {
    category: 'Range & Battery',
    prompts: [
      'Will TrueRange™ safely cover my daily commute without running out?',
      'How does the IP67 battery handle deep monsoon waterlogging in Indian cities?',
      'What is the Ather Battery Protect™ 5-year warranty and degradation rate?',
    ],
  },
  {
    category: 'Charging & RWA',
    prompts: [
      'How do I set up charging in an apartment basement with society/RWA permissions?',
      'How long does a 5A home socket charge take, and what is the cost per full charge?',
      'How fast is the Ather Grid™ network on highways and city corridors?',
    ],
  },
  {
    category: 'Savings & Tech',
    prompts: [
      'Calculate my 3-year total cost of ownership savings against petrol',
      'Explain Magic Twist™ and AutoHold™ hill-stop engineering',
      'What should I specifically test during an Ather test ride?',
    ],
  },
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

  // Active prompt category tab
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'concierge',
      text: `### Welcome ${currentCustomer?.name ? currentCustomer.name.split(' ')[0] : 'Rider'}! 

I am your **Ather Senior EV Systems & Engineering Specialist**. 

I have loaded your commuter profile:
* **Commute**: ${quizAnswers.dailyCommute || '20-40 km roundtrip'}
* **Parking / Power**: ${quizAnswers.parkingType || 'Apartment / Home parking'}
* **Fuel Spend**: ₹${quizAnswers.monthlyFuelExpense?.toLocaleString('en-IN') || '2,500'}/mo
* **Archetype**: ${riderProfile?.archetype || 'Balanced Daily Commuter'}

Ask me anything about **Ather models (450X, 450S, 450 Apex, Rizta)**, **TrueRange™ calculations**, **5A apartment charging blueprints**, or **battery physics**. How can I assist your EV transition today?`,
      timestamp: 'Just now',
      actions: [
        { label: 'Compare 450X vs Rizta', url: '#prompt-compare' },
        { label: 'Apartment Charging Blueprint', url: '/charging', icon: 'charging' },
        { label: 'Calculate Route Savings', url: '/savings', icon: 'savings' },
      ],
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
      logEvent('ride_concierge_opened', '/concierge', { mode: 'FULL ATHER EV EXPERT AI' });
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

  // Derive relevant contextual action pills based on query/response content
  const deriveContextualActions = (text: string) => {
    const actions: { label: string; url: string; icon?: 'ride' | 'savings' | 'charging' | 'human' }[] = [];
    const lower = text.toLowerCase();

    if (lower.includes('test ride') || lower.includes('ride') || lower.includes('experience center') || lower.includes('autohold')) {
      actions.push({ label: 'Book Zero-Pressure Test Ride', url: '/test-ride', icon: 'ride' });
    }
    if (lower.includes('saving') || lower.includes('petrol') || lower.includes('cost') || lower.includes('expense') || lower.includes('tco')) {
      actions.push({ label: 'Interactive Savings Calculator', url: '/savings', icon: 'savings' });
    }
    if (lower.includes('charg') || lower.includes('apartment') || lower.includes('socket') || lower.includes('grid') || lower.includes('rwa')) {
      actions.push({ label: 'View Charging Blueprint', url: '/charging', icon: 'charging' });
    }
    return actions;
  };

  // Local fallback response generator if backend is booting or offline
  const generateLocalAtherExpertResponse = (query: string): string => {
    const lower = query.toLowerCase();
    const commute = quizAnswers.dailyCommute || '20-30 km';
    const parking = quizAnswers.parkingType || 'Home / Apartment';
    const petrolSpend = quizAnswers.monthlyFuelExpense || 3000;

    if (lower.includes('rizta') || lower.includes('family') || lower.includes('boot') || lower.includes('luggage') || lower.includes('storage') || lower.includes('seat')) {
      return `### Ather Rizta: Purpose-Built Family Engineering

The **Ather Rizta** addresses Indian family commuting with specific structural upgrades:

* **Segment-Leading Comfort**: Features a 900mm wide seat—the longest in the category—with an optional ergonomic pillion backrest.
* **56L Massive Storage**: A 34-liter deep under-seat boot (fits 2 full-face helmets or weekly groceries) plus an optional 22L front trunk (*Frunk*).
* **SkidControl™ Traction Control**: Uses motor-speed sensor algorithms to eliminate rear-wheel drift over wet pavement, gravel, and sandy corners.
* **TrueRange™ Configurations**:
  * **Rizta S (2.9 kWh)**: 105 km TrueRange (123 km IDC)
  * **Rizta Z (3.7 kWh)**: 125 km TrueRange (160 km IDC)
* **Smart Dashboard**: 7-inch DeepView™ or TFT display with WhatsApp preview, Live Location sharing, and Emergency Stop Signal (ESS).

Would you like to compare the Rizta directly with the sporty 450X?`;
    }

    if (lower.includes('450x') || lower.includes('apex') || lower.includes('speed') || lower.includes('warp') || lower.includes('torque') || lower.includes('acceleration')) {
      return `### Ather 450X & 450 Apex: Performance & Precision Dynamics

The **Ather 450 Series** is engineered around sport handling and instant throttle response:

* **Instant Throttle Dynamics**: Produces **26 Nm of peak torque from 0 RPM**, propelling you from **0 to 40 km/h in 3.3 seconds** (2.9 seconds on the 450 Apex in Warp+ mode).
* **Chassis Architecture**: Precision all-aluminum hybrid trellis frame ensures 50:50 front-rear weight distribution and ultra-low center of gravity.
* **TrueRange™ Metrics**:
  * **3.7 kWh Pack**: 110 km TrueRange (150 km IDC) in SmartEco mode.
  * **2.9 kWh Pack**: 90 km TrueRange (115 km IDC).
* **Atherstack™ Features**:
  * **AutoHold™**: Holds the scooter securely on steep flyovers or basement ramps without touching the brake levers.
  * **Park Assist™**: Smooth reverse throttle up to 5 km/h for effortless maneuvering out of tight parking slots.
  * **Google Maps Onboard**: 7-inch capacitive touchscreen with live traffic and range overlay perimeter.

On the **450 Apex**, you also get **Magic Twist™**, enabling regenerative deceleration all the way to 0 km/h simply by twisting the throttle forward.`;
    }

    if (lower.includes('range') || lower.includes('distance') || lower.includes('run out') || lower.includes('dead') || lower.includes('commute')) {
      return `### TrueRange™ vs Indian Driving Cycle (IDC)

Most EV manufacturers advertise laboratory IDC figures tested on flat rollers at 30 km/h without wind, passenger, or traffic stops. Ather created **TrueRange™**:

* **What TrueRange™ Guarantees**: Tested with headlights on, pillion weight, dynamic throttle acceleration, flyovers, and stop-and-go metro signals. 
* **Your Daily Commute**: With your stated commute of **${commute}**, an Ather 450X (110 km TrueRange) utilizes less than **25-35% of its battery capacity**, leaving a generous **65%+ reserve buffer** for impromptu detours or emergency errands.
* **Stationary Efficiency**: When halted at traffic signals, an electric motor draws virtually zero energy, whereas internal combustion engines waste petrol continuously idling.
* **Safety Margin**: The dashboard continuously recalculates remaining kilometers based on your real-time riding style.`;
    }

    if (lower.includes('charg') || lower.includes('socket') || lower.includes('apartment') || lower.includes('rwa') || lower.includes('grid') || lower.includes('plug')) {
      return `### Complete Charging Architecture: Home, Apartment & Ather Grid™

Charging an Ather requires no complex industrial setup:

1. **Everyday Home Charging (5A / 15A Socket)**:
   * Plugs directly into any standard domestic three-pin socket via the **Ather Portable Charger** or **Ather Dot**.
   * **0 to 80% charge in ~4.5 hours** overnight.
   * Full overnight recharge costs approximately **₹22 to ₹28** based on standard ₹7/unit residential electricity tariffs.

2. **Apartment / Society (RWA) Installations**:
   * Over **40% of Ather owners live in multi-story apartments**.
   * Ather provides certified standard RWA compliance documentation, site survey assistance, and technical blueprints to pull a line from your private electricity meter to your basement parking bay with a dedicated sub-meter.

3. **Public Fast-Charging (Ather Grid™)**:
   * Over **3,000+ fast-charging points** deployed across 100+ cities and major interstate transit corridors.
   * Delivers up to **1.5 km of range per minute** (0 to 50% in approximately 20 minutes) with automatic vehicle authentication.`;
    }

    if (lower.includes('cost') || lower.includes('saving') || lower.includes('petrol') || lower.includes('expense') || lower.includes('money') || lower.includes('roi')) {
      const monthly = Number(petrolSpend) || 3000;
      const annualPetrol = monthly * 12;
      const annualEV = Math.round(annualPetrol * 0.12);
      const annualSavings = annualPetrol - annualEV;

      return `### The Financial Reality: Total Cost of Ownership (TCO)

Comparing electric efficiency against petrol reveals significant recurring cash retention:

* **Energy Cost per Kilometer**:
  * Petrol Scooter (35 km/L @ ₹105/L): **~₹3.00 per km**
  * Ather Electric (~3.2 kWh per 100 km @ ₹7.5/unit): **~₹0.24 to ₹0.30 per km**
* **Monthly Budget Comparison**:
  * Your current monthly petrol expenditure: **₹${monthly.toLocaleString('en-IN')}**
  * Equivalent Ather electric energy cost: **₹${Math.round(monthly * 0.10).toLocaleString('en-IN')}**
* **Annual Net Retained Savings**:
  * **Fuel Savings**: **~₹${annualSavings.toLocaleString('en-IN')} every single year**
  * **Service Savings**: **~₹4,000 - ₹5,000/year** (no engine oil changes, valve tappet adjustments, spark plugs, drive belt pulleys, or carburetor cleanings)
* **3-Year Cumulative Payback**: Over 36 months, you save over **₹1,10,000+** in operational cash!`;
    }

    if (lower.includes('battery') || lower.includes('water') || lower.includes('monsoon') || lower.includes('flood') || lower.includes('warranty') || lower.includes('life')) {
      return `### Battery Durability & Monsoon Waterproofing

Ather battery packs are engineered specifically for extreme tropical and monsoon climates:

* **IP67 Waterproof & Dustproof**: The battery cells and BMS are hermetically encased inside an aircraft-grade die-cast aluminum enclosure. Tested to operate submerged in water up to 1 meter for 30 minutes without electrical leakage.
* **Water Wading**: Tested through standing monsoon water puddles up to 400 mm depth safely.
* **Thermal Management**: Real-time multi-sensor thermal throttling ensures the pack never overheats, even in 45°C summer traffic or continuous Warp mode bursts.
* **Ather Battery Protect™**: Comprehensive **5-year or 60,000 km warranty** with an industry-leading **70% State of Health (SoH) guarantee**.
* **Fleet Telemetry**: Across 100+ million cumulative kilometers logged by Ather riders, the average battery capacity retention remains above 80% even past 5-6 years of active urban use!`;
    }

    return `### Ather EV Systems Specialist Recommendation

Based on your current riding profile (**${commute}** commute, **${parking}** parking setup):

* **Optimal Architecture**: Your daily transit distance is an ideal match for an electric powertrain. Charging once or twice a week covers your entire commuting week with zero range anxiety.
* **Zero Stop-and-Go Fatigue**: The 26 Nm instantaneous torque provides smooth, clutchless urban navigation without engine heat, noise, or vibration.
* **Best Next Step**: Real-world tactile feel is the best way to verify electric confidence. We strongly recommend scheduling a 15-minute test ride at your local Ather Space to experience **AutoHold™** and the immediate throttle precision firsthand.

What specific aspect would you like to examine in greater technical detail?`;
  };

  // Deliver response word by word
  const deliverAssistantResponse = (
    fullText: string,
    modelBadge: string,
    showHumanHandOff: boolean = false
  ) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setIsStreaming(true);

      const words = fullText.split(' ');
      let currentWordIndex = 0;
      const messageId = `msg-${Date.now()}`;
      const actions = deriveContextualActions(fullText);

      // Insert empty streaming message
      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          sender: 'concierge',
          text: '',
          isStreaming: true,
          modelBadge,
          actions,
          showHumanHandOff,
          timestamp: 'Just now',
        },
      ]);

      streamIntervalRef.current = setInterval(() => {
        currentWordIndex += 2; // Stream 2 words per tick for crisp pace
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
              msg.id === messageId ? { ...msg, text: fullText, isStreaming: false } : msg
            )
          );
        }
      }, 35);
    }, 450);
  };

  // Main message sender with real server API call to Gemini EV Expert
  const handleSendMessage = async (textToSend: string) => {
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

    setIsTyping(true);

    try {
      // Build user context payload
      const userContext = {
        name: currentCustomer?.name,
        city: currentCustomer?.city,
        commute: quizAnswers.dailyCommute,
        parking: quizAnswers.parkingType,
        monthlyFuelExpense: quizAnswers.monthlyFuelExpense,
        archetype: riderProfile?.archetype,
        suggestedModel: riderProfile?.suggestedAtherModel,
        priority: quizAnswers.primaryPriority,
        concern: quizAnswers.biggestConcern,
      };

      // Call Express server-side Gemini API route
      const res = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          userContext,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          deliverAssistantResponse(
            data.reply,
            data.model === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Ather EV Engine',
            false
          );
          return;
        }
      }

      // Fallback if response not ok
      const fallbackReply = generateLocalAtherExpertResponse(userText);
      deliverAssistantResponse(fallbackReply, 'Ather EV Engine', false);
    } catch (err) {
      console.warn('Network call to concierge backend failed, using local Ather Expert system:', err);
      const fallbackReply = generateLocalAtherExpertResponse(userText);
      deliverAssistantResponse(fallbackReply, 'Ather EV Engine', false);
    }
  };

  const { isActive: isPresentationActive, currentStep: presentationStep } = usePresentation();

  // Auto-ask apartment charging question on Step 8 of Presentation Mode
  useEffect(() => {
    if (isPresentationActive && presentationStep === 8) {
      const timer = setTimeout(() => {
        const hasAsked = messages.some(
          (m) => m.sender === 'user' && m.text.toLowerCase().includes('charging')
        );
        if (!hasAsked && !isTyping && !isStreaming) {
          handleSendMessage('How can I think about charging in an apartment?');
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isPresentationActive, presentationStep, messages, isTyping, isStreaming]);

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
    }, 600);
  };

  const closeHumanModal = () => {
    setShowHumanModal(false);
    setHumanSuccess(false);
    setHumanError('');
  };

  const resetChat = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
    setIsTyping(false);
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'concierge',
        text: `### Session Reset\n\nI'm ready for your next questions regarding **Ather 450X**, **Rizta**, **TrueRange™ calculations**, or **RWA apartment charging**. What would you like to evaluate?`,
        timestamp: 'Just now',
        actions: [
          { label: 'Compare 450X vs Rizta', url: '#prompt-compare' },
          { label: 'Apartment Charging Blueprint', url: '/charging', icon: 'charging' },
        ],
      },
    ]);
  };

  // Prompts to show based on active category
  const visiblePrompts =
    activeCategory === 'All'
      ? CATEGORIZED_PROMPTS.flatMap((c) => c.prompts).slice(0, 6)
      : CATEGORIZED_PROMPTS.find((c) => c.category === activeCategory)?.prompts || [];

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] min-h-[calc(100vh-80px)] flex flex-col">
      {/* Ambient background glow */}
      <div
        className="absolute top-16 left-1/3 w-[650px] h-[500px] pointer-events-none rounded-full blur-[160px] opacity-15 bg-[#00E08A]/30"
        aria-hidden="true"
      />

      <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex-1 flex flex-col relative z-10">
        {/* TOP BAR: Title, Subtitle, Status, Talk to a Human */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
                Ather EV Expert AI
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#00E08A]/10 text-[#00E08A] border border-[#00E08A]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E08A] animate-pulse" />
                Specialist Online
              </span>
              <Badge variant="ACADEMIC PROTOTYPE" label="FULL EV EXPERT" />
            </div>
            <p className="text-xs sm:text-sm text-[#9AA3AF]">
              Authoritative EV engineering guidance powered by Gemini & Ather vehicle physics. Grounded in your commuter profile.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={resetChat}
              title="Reset conversation"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#9AA3AF] hover:text-white hover:border-white/25 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHumanModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#F5F7FA] hover:text-[#00E08A] hover:border-[#00E08A]/40 transition-colors cursor-pointer"
            >
              <PhoneCall size={14} className="text-[#00E08A]" />
              <span>Talk to an Ather Specialist</span>
            </button>
          </div>
        </div>

        {/* MAIN SPLIT: Left Profile Sidebar + Chat Arena */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: Rider Profile & Scores (lg:col-span-4) */}
          <aside
            id="concierge-rider-profile-sidebar"
            className="hidden lg:flex lg:col-span-4 flex-col gap-4 bg-[#111418] border border-white/[0.08] rounded-[24px] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] sticky top-24"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#00E08A] block">
                  Active Rider Context
                </span>
                <h2 className="font-heading text-base font-semibold text-[#F5F7FA]">
                  {currentCustomer?.name || 'Rider Profile'}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#9AA3AF] bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                Lead Score: {leadScore}/100
              </span>
            </div>

            {/* Score Ring Preview */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#16191E] border border-white/[0.06]">
              <ScoreRing
                score={riderProfile?.matchScore || 88}
                size={78}
                strokeWidth={7}
                label=""
                sublabel=""
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#9AA3AF] block mb-0.5">
                  Recommendation Match
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
            <div className="space-y-2 text-xs">
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
                  <BatteryCharging size={13} className="text-amber-400" /> Parking Setup
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

            {/* Quick action buttons */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <SecondaryButton
                to="/test-ride"
                size="sm"
                className="w-full justify-center !text-xs !py-2"
                icon={<ArrowRight size={13} />}
              >
                Schedule Test Ride
              </SecondaryButton>
              <Link
                to="/savings"
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[#9AA3AF] hover:text-[#00E08A] py-1 transition-colors font-medium"
              >
                <span>View Full Savings Breakdown</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </aside>

          {/* CHAT ARENA (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#111418] border border-white/[0.08] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex flex-col h-[680px] sm:h-[740px] overflow-hidden">
            {/* PROMPTS FILTER TABS & CHIPS */}
            <div className="p-3 sm:p-3.5 bg-[#16191E] border-b border-white/[0.06]">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-2 pb-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] mr-1 shrink-0">
                  Topics:
                </span>
                {['All', 'Vehicle Models', 'Range & Battery', 'Charging & RWA', 'Savings & Tech'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#00E08A]/15 text-[#00E08A] border border-[#00E08A]/40 font-medium'
                        : 'bg-white/[0.03] text-[#9AA3AF] hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Suggested Prompts Horizon */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {visiblePrompts.map((chip) => (
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
                      <div className="w-8 h-8 rounded-full bg-[#00E08A]/15 border border-[#00E08A]/30 flex items-center justify-center text-[#00E08A] shrink-0 mt-0.5 shadow-sm">
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#00E08A] text-[#0B0D10] font-medium rounded-tr-none shadow-md'
                          : 'bg-[#16191E] border border-white/[0.08] text-[#F5F7FA] rounded-tl-none shadow-md'
                      }`}
                    >
                      {/* Message Content: Render Markdown for Assistant, text for User */}
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-[#00E08A] [&_h3]:mb-1 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5 [&_strong]:text-[#00E08A] [&_strong]:font-semibold">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      )}

                      {/* Model badge and contextual actions for Assistant */}
                      {!isUser && !msg.isStreaming && msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                          {msg.actions.map((act) => {
                            if (act.url.startsWith('#prompt-')) {
                              return (
                                <button
                                  key={act.label}
                                  type="button"
                                  onClick={() => handleSendMessage(act.label)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#00E08A]/15 text-[#F5F7FA] hover:text-[#00E08A] border border-white/10 hover:border-[#00E08A]/30 text-xs font-medium transition-all cursor-pointer"
                                >
                                  <Sparkles size={12} className="text-[#00E08A]" />
                                  <span>{act.label}</span>
                                </button>
                              );
                            }
                            return (
                              <Link
                                key={act.label}
                                to={act.url}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E08A]/15 hover:bg-[#00E08A] text-[#00E08A] hover:text-[#0B0D10] border border-[#00E08A]/30 text-xs font-semibold transition-all cursor-pointer"
                              >
                                {act.icon === 'ride' && <Zap size={12} />}
                                {act.icon === 'savings' && <Coins size={12} />}
                                {act.icon === 'charging' && <BatteryCharging size={12} />}
                                <span>{act.label}</span>
                                <ArrowRight size={11} />
                              </Link>
                            );
                          })}
                        </div>
                      )}

                      {/* Hand-off button if explicitly requested */}
                      {msg.showHumanHandOff && !isStreaming && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowHumanModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E08A] text-[#0B0D10] font-semibold text-xs hover:bg-[#00c97b] transition-colors cursor-pointer"
                          >
                            <PhoneCall size={13} />
                            <span>Connect with Ather Representative</span>
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[9px] mt-2 pt-1 border-t border-white/[0.04]">
                        {!isUser && msg.modelBadge && (
                          <span className="text-[#00E08A]/70 font-mono">
                            ⚡ {msg.modelBadge}
                          </span>
                        )}
                        <span
                          className={`ml-auto ${
                            isUser ? 'text-[#0B0D10]/60' : 'text-[#9AA3AF]/60'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
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
                  <div className="bg-[#16191E] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-[#9AA3AF]">
                    <span className="w-1.5 h-1.5 bg-[#00E08A] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#00E08A] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#00E08A] rounded-full animate-bounce" />
                    <span className="ml-2 font-mono text-[11px] text-[#00E08A]">
                      Ather EV Specialist is analyzing engineering telemetry...
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
                  placeholder="Ask about 450X vs Rizta, TrueRange™, 5A charging, or battery longevity..."
                  disabled={isTyping || isStreaming}
                  className="flex-1 bg-[#111418] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F7FA] placeholder-[#9AA3AF]/60 focus:outline-none focus:border-[#00E08A] transition-colors disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping || isStreaming}
                  className="p-3 rounded-xl bg-[#00E08A] text-[#0B0D10] hover:bg-[#00c97b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md"
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-[#9AA3AF] mt-2 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#00E08A]" />
                  Grounded in real Ather vehicle data and {currentCustomer?.city || 'Pune'} transit conditions
                </span>
                <span className="hidden sm:inline font-mono">Press Enter ↵</span>
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
                    Callback Scheduled!
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed max-w-sm mx-auto">
                    An Ather EV product specialist will contact <strong className="text-white">{humanName}</strong> at{' '}
                    <strong className="text-white">{humanPhone}</strong> during your preferred slot (
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
                      Direct Ather Specialist Handoff
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#F5F7FA] mb-1">
                    Connect with an Ather Representative
                  </h3>
                  <p className="text-xs text-[#9AA3AF] mb-5">
                    Speak directly with an Ather Space product specialist regarding local booking offers, on-road pricing, or custom apartment charging site surveys.
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
                        placeholder="e.g. Riya Desai"
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
                          placeholder="9823012345"
                          maxLength={10}
                          className="w-full bg-[#16191E] border border-white/10 rounded-r-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                        />
                      </div>
                    </div>

                    {/* Preferred Time Window */}
                    <div>
                      <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                        Preferred Callback Window
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
                          I consent to receive a call from Ather Energy regarding product queries and test ride booking.
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
                        {humanSubmitting ? 'Scheduling Callback...' : 'Schedule Callback'}
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
