/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Home,
  Building2,
  Briefcase,
  Zap,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BatteryCharging,
  Clock,
  Coins,
  MessageSquare,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';
import { usePresentation } from '../context/PresentationContext';

type ChargingOptionKey = 'Home' | 'Apartment' | 'Workplace' | 'Public' | 'Unsure';

interface OptionCardConfig {
  key: ChargingOptionKey;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tag: string;
}

const CHARGING_OPTIONS: OptionCardConfig[] = [
  {
    key: 'Home',
    title: 'Home',
    subtitle: 'Independent house, villa, or private garage with dedicated socket access',
    icon: <Home size={26} />,
    tag: 'Strongest Option',
  },
  {
    key: 'Apartment',
    title: 'Apartment',
    subtitle: 'Basement, stilt, or shared designated parking bay in a housing society',
    icon: <Building2 size={26} />,
    tag: 'RWA Guidance',
  },
  {
    key: 'Workplace',
    title: 'Workplace',
    subtitle: 'Office tech-park, commercial building, or corporate campus parking',
    icon: <Briefcase size={26} />,
    tag: 'Shift Charging',
  },
  {
    key: 'Public',
    title: 'Public',
    subtitle: 'Commercial fast-charging hubs, arterial corridors, and metro points',
    icon: <Zap size={26} />,
    tag: 'Supplemental',
  },
  {
    key: 'Unsure',
    title: 'Unsure',
    subtitle: 'Uncertain about earthing, socket availability, or society permissions',
    icon: <HelpCircle size={26} />,
    tag: 'We Help You',
  },
];

export const ChargingPage: React.FC = () => {
  const { quizAnswers, leadScore, setLeadScore, logEvent, events } = useAppState();
  const prefersReduced = useReducedMotion();
  const hasLoggedRef = useRef(false);

  // Map quiz answer to initial key if available
  const initialOption: ChargingOptionKey = (() => {
    if (quizAnswers.parkingType === 'Private home parking') return 'Home';
    if (quizAnswers.parkingType === 'Apartment parking') return 'Apartment';
    if (quizAnswers.parkingType === 'Workplace parking') return 'Workplace';
    if (quizAnswers.parkingType === 'Public parking') return 'Public';
    if (quizAnswers.parkingType === 'Not sure') return 'Unsure';
    return 'Home';
  })();

  const [selectedOption, setSelectedOption] = useState<ChargingOptionKey>(initialOption);

  const { isActive: isPresentationActive, currentStep: presentationStep } = usePresentation();

  useEffect(() => {
    if (isPresentationActive && presentationStep === 7) {
      setSelectedOption('Apartment');
    }
  }, [isPresentationActive, presentationStep]);

  // Checkbox toggle states for interactive checklist feel
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Log charging_tool_used and add +10 to lead score once
  useEffect(() => {
    const alreadyLogged = events.some((e) => e.type === 'charging_tool_used');
    if (!alreadyLogged && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('charging_tool_used', '/charging', { selectedOption: initialOption });
      setLeadScore(Math.min(100, leadScore + 10));
    }
  }, [events, initialOption, leadScore, logEvent, setLeadScore]);

  const handleSelectOption = (key: ChargingOptionKey) => {
    setSelectedOption(key);
    logEvent('charging_option_selected', '/charging', { option: key });
  };

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] pb-24">
      {/* Ambient background glow */}
      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none rounded-full blur-[160px] opacity-20 bg-[#00E08A]/30"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 relative z-10">
        <MotionSection alternate={false} className="!py-0 !px-0">
          {/* 1. HEADER */}
          <MotionItem>
            <div className="flex flex-col items-start max-w-3xl mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#00E08A] bg-[#00E08A]/10 px-3.5 py-1 rounded-full border border-[#00E08A]/25">
                  Infrastructure & Daily Routine
                </span>
                <Badge variant="ACADEMIC PROTOTYPE" label="CHARGING FEASIBILITY ENGINE" />
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F7FA] leading-[1.1] mb-4">
                Where Would I Charge?
              </h1>

              <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed">
                Demystifying EV charging by mapping your actual parking reality. Over 95% of Ather riders
                charge overnight at home using a regular 5A socket, waking up with a full battery every morning
                for less than ₹25.
              </p>
            </div>
          </MotionItem>

          {/* 2. FIVE LARGE OPTION CARDS */}
          <MotionItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
              {CHARGING_OPTIONS.map((opt) => {
                const isSelected = selectedOption === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-5 rounded-[22px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[180px] relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#00E08A] bg-[#00E08A]/[0.08] shadow-[0_0_30px_rgba(0,224,138,0.22)]'
                        : 'border-white/[0.08] bg-[#111418] hover:border-white/25 hover:bg-[#16191E]'
                    }`}
                  >
                    {/* Top row with icon & tag */}
                    <div className="flex items-start justify-between w-full mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'bg-white/[0.05] text-[#9AA3AF] group-hover:text-white'
                        }`}
                      >
                        {opt.icon}
                      </div>

                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#00E08A]/20 text-[#00E08A] font-semibold'
                            : 'bg-white/[0.04] text-[#9AA3AF]'
                        }`}
                      >
                        {opt.tag}
                      </span>
                    </div>

                    {/* Title & subtitle */}
                    <div>
                      <h3
                        className={`font-heading font-semibold text-lg mb-1 transition-colors ${
                          isSelected ? 'text-[#00E08A]' : 'text-[#F5F7FA]'
                        }`}
                      >
                        {opt.title}
                      </h3>
                      <p className="text-xs text-[#9AA3AF] leading-relaxed line-clamp-2">
                        {opt.subtitle}
                      </p>
                    </div>

                    {/* Active accent underline */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeUnderline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#00E08A]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </MotionItem>

          {/* 3. ANIMATED GUIDANCE CARD */}
          <MotionItem>
            <AnimatePresence mode="wait">
              {/* HOME GUIDANCE */}
              {selectedOption === 'Home' && (
                <motion.div
                  key="home-guidance"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00E08A]">
                          Recommended Charging Paradigm
                        </span>
                        <Badge variant="VERIFIED" label="OPTIMAL CONFIGURATION" />
                      </div>
                      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F7FA]">
                        Home charging appears to be your strongest potential option.
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                        <span className="text-[10px] uppercase text-[#9AA3AF] block font-mono">
                          Typical Full Charge Cost
                        </span>
                        <span className="font-heading font-bold text-lg text-[#00E08A]">
                          ~₹20 - ₹25
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Checklist Items */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-[#9AA3AF]">
                      Home Charging Feasibility Checklist (3 Key Steps):
                    </h3>

                    <div
                      onClick={() => toggleCheckItem('home-1')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['home-1']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          1. Standard 5A / 15A 3-Pin Socket Within Reach
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          No heavy three-phase upgrade or expensive wallbox is required. A regular grounded 3-pin
                          domestic plug in your garage or porch plugs straight into the Ather portable charger.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('home-2')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['home-2']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          2. Seamless Overnight Charging Routine
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          Just like charging your mobile phone overnight: plug in at 10 PM, auto-cutoff safeguards
                          prevent overcharging, and you wake up to 100% full range every single morning with zero queueing.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('home-3')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['home-3']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          3. Lowest Electricity Tariff (~₹6–8 per Unit)
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          Your domestic utility bill rate is typically 50–70% cheaper than commercial fast-charging points.
                          A daily 30 km commute costs ~₹8 in electricity, replacing ₹75 of petrol.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.08]">
                    <PrimaryButton to="/test-ride" size="md" icon={<ArrowRight size={16} />}>
                      Book Test Ride & Experience Charging
                    </PrimaryButton>
                    <SecondaryButton to="/savings" size="md">
                      Calculate Home Charging Savings
                    </SecondaryButton>
                  </div>
                </motion.div>
              )}

              {/* APARTMENT GUIDANCE */}
              {selectedOption === 'Apartment' && (
                <motion.div
                  key="apartment-guidance"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                          Community Parking Resolution
                        </span>
                        <Badge variant="ACADEMIC PROTOTYPE" label="RWA PERMISSION PATHWAY" />
                      </div>
                      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F7FA]">
                        Your next step is to confirm access and permission for charging.
                      </h2>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
                      Standard NOC Template Available
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-[#9AA3AF]">
                      Apartment Approval & Installation Checklist:
                    </h3>

                    <div
                      onClick={() => toggleCheckItem('apt-1')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['apt-1']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          1. Apartment Society / RWA Formal Notification
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          Most housing societies require a simple written application. Central ministry guidelines
                          encourage RWAs to grant EV charging installation permissions without unreasonable restrictions.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('apt-2')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['apt-2']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          2. Direct Flat Meter or Sub-Meter Cabling
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          Electrician routes an armored fire-rated cable directly from your assigned apartment meter board
                          or installs a calibrated private sub-meter in the parking bay, ensuring billing transparency.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('apt-3')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['apt-3']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          3. Certified Earthing & Weatherproof Enclosure
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          A lockable MCB-protected weatherproof box prevents unauthorized tapping and guarantees safety
                          during monsoon washing or basement cleaning.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.08]">
                    <PrimaryButton to="/concierge" size="md" icon={<MessageSquare size={16} />}>
                      Ask Concierge About RWA Approval Kit
                    </PrimaryButton>
                    <SecondaryButton to="/test-ride" size="md">
                      Request Pre-Purchase Site Survey
                    </SecondaryButton>
                  </div>
                </motion.div>
              )}

              {/* WORKPLACE GUIDANCE */}
              {selectedOption === 'Workplace' && (
                <motion.div
                  key="workplace-guidance"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-400">
                          Office Transit Routine
                        </span>
                        <Badge variant="DEMO DATA" label="COMMERCIAL LOT" />
                      </div>
                      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F7FA]">
                        Workplace charging could fit your routine. Confirm availability with your employer.
                      </h2>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-medium">
                      5–8 Hr Workday Match
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-[#9AA3AF]">
                      Workplace Charging Evaluation Points:
                    </h3>

                    <div
                      onClick={() => toggleCheckItem('work-1')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['work-1']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          1. Parking Facility Plug Accessibility
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          Check with administrative facilities if designated two-wheeler parking bays have active 15A
                          or 5A utility wall points available for employee commute charging.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('work-2')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['work-2']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          2. Ideal Top-Up Duration During Office Shift
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          A normal 6-hour workday easily recharges 50–70 km of range at standard slow charging rates,
                          allowing you to head home with a completely fresh battery buffer.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('work-3')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['work-3']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          3. Corporate ESG & Green Commute Policies
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          Many major tech hubs (Bangalore, Hyderabad, Chennai, Pune) actively provide free or subsidized
                          charging bays to support corporate carbon-reduction mandates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.08]">
                    <PrimaryButton to="/savings" size="md" icon={<ArrowRight size={16} />}>
                      Calculate Workplace Commute Savings
                    </PrimaryButton>
                    <SecondaryButton to="/test-ride" size="md">
                      Plan My Test Ride
                    </SecondaryButton>
                  </div>
                </motion.div>
              )}

              {/* PUBLIC GUIDANCE */}
              {selectedOption === 'Public' && (
                <motion.div
                  key="public-guidance"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-400">
                          Transit Network Reliance
                        </span>
                        <Badge variant="ACADEMIC PROTOTYPE" label="LIVE CHARGING DATA REQUIRED" />
                      </div>
                      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F7FA]">
                        Public charging can work, but availability varies.
                      </h2>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium">
                      Live OEM Telematics Required
                    </div>
                  </div>

                  {/* Checklist & Guidelines */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-[#9AA3AF]">
                      Public Network Realities & Guidance:
                    </h3>

                    <div
                      onClick={() => toggleCheckItem('pub-1')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['pub-1']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          1. Ather Grid Fast-Charging Architecture
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          DC fast-chargers provide high-speed top-ups (adding ~15 km in 10 minutes). They are installed
                          across commercial cafes, shopping hubs, and arterial highways.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('pub-2')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['pub-2']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          2. Best Used as a Supplemental Safety Net
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          We do not recommend relying 100% on public charging for routine daily commuting. Public stations
                          may experience queues, commercial tariff pricing, or temporary maintenance.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheckItem('pub-3')}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checkedItems['pub-3']
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="fill-current" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                          3. Real-Time Telematics & Slot Reservation
                        </span>
                        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                          The Ather App displays live charger occupancy and fault status. Verified API integration is
                          required for production navigation routing.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory academic disclaimer */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#9AA3AF] flex items-start gap-2.5 mb-8">
                    <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Verified Policy Notice:</strong> This prototype never invents charger locations or network
                      sizes. Production deployment requires live API feeds from Ather Grid telematics.
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.08]">
                    <PrimaryButton to="/concierge" size="md" icon={<MessageSquare size={16} />}>
                      Explore Home Socket Alternatives
                    </PrimaryButton>
                    <SecondaryButton to="/test-ride" size="md">
                      Discuss Charging with Ather Space Expert
                    </SecondaryButton>
                  </div>
                </motion.div>
              )}

              {/* UNSURE GUIDANCE */}
              {selectedOption === 'Unsure' && (
                <motion.div
                  key="unsure-guidance"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00E08A]">
                          Personalized Consultation Pathway
                        </span>
                        <Badge variant="ACADEMIC PROTOTYPE" label="ASSESSMENT SUPPORT" />
                      </div>
                      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F7FA]">
                        Let's solve your charging question before you decide.
                      </h2>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] text-xs font-semibold">
                      Zero Risk Evaluation
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed mb-6 max-w-3xl">
                    You should never commit to an electric vehicle until you feel completely confident in your daily charging routine.
                    Most riders who feel unsure find that an accessible 5A socket or a straightforward society extension easily solves
                    their requirements.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="p-5 rounded-2xl bg-[#16191E] border border-white/[0.06]">
                      <div className="w-9 h-9 rounded-xl bg-[#00E08A]/10 text-[#00E08A] flex items-center justify-center mb-3">
                        <MessageSquare size={18} />
                      </div>
                      <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                        1. Chat With EV Concierge
                      </span>
                      <p className="text-xs text-[#9AA3AF] leading-relaxed">
                        Our intelligent assistant can guide you through socket distance, wiring thickness, circuit breaker specs,
                        and standard RWA approval letters.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#16191E] border border-white/[0.06]">
                      <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center mb-3">
                        <ShieldCheck size={18} />
                      </div>
                      <span className="font-heading font-semibold text-base text-[#F5F7FA] block mb-1">
                        2. Free Pre-Purchase Site Inspection
                      </span>
                      <p className="text-xs text-[#9AA3AF] leading-relaxed">
                        When booking a test ride, you can request an Ather certified technician to inspect your meter room,
                        calculate conduit length, and provide an exact setup estimate.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.08]">
                    <PrimaryButton to="/concierge" size="md" icon={<ArrowRight size={16} />}>
                      Ask EV Concierge About My Setup
                    </PrimaryButton>
                    <SecondaryButton to="/test-ride" size="md">
                      Book Test Ride with Charging Consultation
                    </SecondaryButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </MotionItem>

          {/* 4. BOTTOM CONTINUATION HUB */}
          <MotionItem className="mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#111418] border border-white/[0.08]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#9AA3AF] block">
                  Next Step in Evaluation
                </span>
                <span className="font-heading font-semibold text-lg text-[#F5F7FA]">
                  Ready to test-ride the bike and test home charger ergonomics?
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SecondaryButton to="/savings" size="md">
                  Review Savings
                </SecondaryButton>
                <PrimaryButton to="/test-ride" size="md" icon={<ArrowRight size={16} />}>
                  Book Test Ride
                </PrimaryButton>
              </div>
            </div>
          </MotionItem>
        </MotionSection>
      </div>
    </div>
  );
};
