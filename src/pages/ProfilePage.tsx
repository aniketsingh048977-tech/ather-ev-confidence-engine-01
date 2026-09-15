/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Navigation,
  Users,
  SlidersHorizontal,
  BatteryCharging,
  Wallet,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Zap,
  Info,
  ChevronRight,
  FileQuestion,
} from 'lucide-react';
import { ScoreRing } from '../components/ui/ScoreRing';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';
import { generateWhyThisMatchRows } from '../utils/profileLogic';
import { DemoLead } from '../types';

export const ProfilePage: React.FC = () => {
  const {
    riderProfile,
    quizAnswers,
    currentCustomer,
    leadScore,
    setLeadScore,
    addLead,
    logEvent,
  } = useAppState();

  const prefersReduced = useReducedMotion();
  const hasLoggedViewRef = useRef(false);

  // When profile is viewed:
  // 1. Add lead with journeyStage: 'PROFILE GENERATED'
  // 2. Increase lead score by +10 (recommendation viewed)
  // 3. Log event
  useEffect(() => {
    if (riderProfile && !hasLoggedViewRef.current) {
      hasLoggedViewRef.current = true;

      const newLeadScore = Math.min(100, Math.max(60, leadScore + 10));
      setLeadScore(newLeadScore);

      logEvent('recommendation_viewed', '/profile', {
        persona: riderProfile.persona,
        matchScore: riderProfile.matchScore,
        confidenceScore: riderProfile.confidenceScore,
        intentScore: newLeadScore,
      });

      // Add customer to leads list with stage PROFILE GENERATED
      const newLead: DemoLead = {
        id: `lead-quiz-${Date.now()}`,
        name: currentCustomer?.name || 'Evaluated Rider',
        city: currentCustomer?.city || 'Bengaluru',
        riderProfile: riderProfile.persona,
        primaryConcern: quizAnswers.biggestConcern || 'Range',
        matchPercentage: riderProfile.matchScore,
        leadScore: newLeadScore,
        journeyStage: 'PROFILE GENERATED',
        source: 'Direct',
        campaignName: 'Confidence_Diagnostic_SelfAssessment',
        testRideStatus: 'Not Booked',
        lastActivity: new Date().toISOString(),
        tag: 'DEMO CUSTOMER',
      };
      addLead(newLead);
    }
  }, [riderProfile, currentCustomer, quizAnswers, leadScore, setLeadScore, addLead, logEvent]);

  // FALLBACK: If someone visits /profile without taking the quiz
  if (!riderProfile || !quizAnswers.completed) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 py-16 bg-[#0B0D10] relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none rounded-full blur-[130px] opacity-15 bg-[#00E08A]/30"
          aria-hidden="true"
        />

        <div className="w-full max-w-xl relative z-10 text-center">
          <Card className="p-8 sm:p-12 border-white/10 bg-[#111418] flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00E08A] mb-6">
              <FileQuestion size={32} strokeWidth={1.5} />
            </div>

            <Badge variant="ACADEMIC PROTOTYPE" label="ASSESSMENT REQUIRED" className="mb-4" />

            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-[#F5F7FA] tracking-tight mb-4">
              No Rider Profile Generated Yet
            </h1>

            <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed mb-8 max-w-md">
              Your personalized EV Confidence Profile requires answering 7 quick diagnostic questions
              about your commute, charging access, and vehicle priorities.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center">
              <PrimaryButton to="/quiz" size="lg" icon={<ArrowRight size={18} />}>
                Start 2-Minute Assessment
              </PrimaryButton>
              <SecondaryButton to="/how-it-works" size="lg">
                See How It Works
              </SecondaryButton>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 7 Signals data mapping
  const signalsList = [
    {
      label: 'Daily Commute',
      value: quizAnswers.dailyCommute || '20-40 km',
      icon: <Navigation size={18} className="text-[#00E08A]" />,
      detail: 'Daily weekday roundtrip range requirement',
    },
    {
      label: 'Rider Dynamics',
      value: quizAnswers.whoWillUse || 'Me',
      icon: <Users size={18} className="text-[#00E08A]" />,
      detail: 'Seat ergonomics & pillion usage frequency',
    },
    {
      label: 'Primary Priority',
      value: quizAnswers.primaryPriority || 'Efficiency',
      icon: <SlidersHorizontal size={18} className="text-[#00E08A]" />,
      detail: 'Decisive engineering attribute',
    },
    {
      label: 'Parking & Charging',
      value: quizAnswers.parkingType || 'Private home parking',
      icon: <BatteryCharging size={18} className="text-[#00E08A]" />,
      detail: 'Domestic 5A socket accessibility',
    },
    {
      label: 'Monthly Petrol Spend',
      value: `₹${(quizAnswers.monthlyFuelExpense || 3000).toLocaleString('en-IN')}`,
      icon: <Wallet size={18} className="text-[#00E08A]" />,
      detail: 'Baseline recurring fuel expenditure',
    },
    {
      label: 'Biggest EV Concern',
      value: quizAnswers.biggestConcern || 'Range',
      icon: <ShieldAlert size={18} className="text-[#00E08A]" />,
      detail: 'Targeted for objective risk mitigation',
    },
    {
      label: 'Decision Catalyst',
      value: quizAnswers.yesFactor || 'Lower running cost',
      icon: <Sparkles size={18} className="text-[#00E08A]" />,
      detail: 'Decisive threshold for transition',
    },
  ];

  const whyThisMatchRows = generateWhyThisMatchRows(quizAnswers);

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] pb-24">
      {/* Soft emerald radial glow behind header */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none rounded-full blur-[160px] opacity-25 bg-[#00E08A]/30"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 relative z-10">
        <MotionSection alternate={false} className="!py-0 !px-0">
          {/* 1. HEADER & PROFILE NAME */}
          <MotionItem>
            <div className="flex flex-col items-start max-w-4xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#00E08A] bg-[#00E08A]/10 px-3.5 py-1 rounded-full border border-[#00E08A]/25">
                  Meet Your Rider Profile
                </span>
                <Badge variant="ACADEMIC PROTOTYPE" label="CALIBRATED REPORT" />
              </div>

              {/* Profile Name Huge, animates in */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F5F7FA] leading-[1.08]"
              >
                {riderProfile.persona}
              </motion.h1>

              {/* Archetype & One line requirement */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9AA3AF] bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08] mb-3">
                  <span>Archetype:</span>
                  <span className="text-[#00E08A] font-semibold">{riderProfile.archetype}</span>
                </div>
                <p className="text-base sm:text-lg text-[#9AA3AF] leading-relaxed max-w-3xl">
                  Your profile is based on your stated commute, usage, priorities, charging situation
                  and EV concerns.
                </p>
              </motion.div>
            </div>
          </MotionItem>

          {/* 2. THREE SCORE RINGS SIDE BY SIDE */}
          <MotionItem className="mt-12 md:mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              {/* Ring 1: MATCH */}
              <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <ScoreRing
                  score={riderProfile.matchScore}
                  size={150}
                  strokeWidth={10}
                  label="Match"
                  sublabel="Commute & lifestyle fit"
                />
                <div className="mt-4 text-center">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#00E08A] block mb-1">
                    Strong Technical Fit
                  </span>
                  <p className="text-xs text-[#9AA3AF] max-w-[200px]">
                    Evaluates route distance vs certified safe battery buffer.
                  </p>
                </div>
              </div>

              {/* Ring 2: EV CONFIDENCE */}
              <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <ScoreRing
                  score={riderProfile.confidenceScore}
                  size={150}
                  strokeWidth={10}
                  label="EV Confidence"
                  sublabel="Charging & range readiness"
                />
                <div className="mt-4 text-center">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#00E08A] block mb-1">
                    Feasibility Index
                  </span>
                  <p className="text-xs text-[#9AA3AF] max-w-[200px]">
                    Factoring domestic socket access and concern mitigation.
                  </p>
                </div>
              </div>

              {/* Ring 3: PURCHASE INTENT */}
              <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <ScoreRing
                  score={riderProfile.intentScore}
                  size={150}
                  strokeWidth={10}
                  label="Purchase Intent"
                  sublabel="Readiness to transition"
                />
                <div className="mt-4 text-center">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#00E08A] block mb-1">
                    Lead Progression
                  </span>
                  <p className="text-xs text-[#9AA3AF] max-w-[200px]">
                    Calculated from active assessment completion milestones.
                  </p>
                </div>
              </div>
            </div>
          </MotionItem>

          {/* 3. YOUR SIGNALS CARD */}
          <MotionItem className="mt-12">
            <Card className="bg-[#111418] border-white/[0.08] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-white/[0.06]">
                <div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] block mb-1">
                    Input Telemetry
                  </span>
                  <h2 className="font-heading text-2xl font-semibold text-[#F5F7FA]">
                    Your Signals
                  </h2>
                </div>
                <Link
                  to="/quiz"
                  className="text-xs font-semibold text-[#9AA3AF] hover:text-[#00E08A] transition-colors inline-flex items-center gap-1 self-start sm:self-center"
                >
                  <span>Retake Assessment</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {signalsList.map((sig) => (
                  <div
                    key={sig.label}
                    className="p-4 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-white/20 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                        {sig.icon}
                      </div>
                      <span className="text-[11px] uppercase tracking-wider text-[#9AA3AF] font-medium">
                        {sig.label}
                      </span>
                    </div>

                    <div>
                      <div className="font-heading font-semibold text-base text-[#F5F7FA] mb-1">
                        {sig.value}
                      </div>
                      <div className="text-[11px] text-[#9AA3AF] leading-tight">
                        {sig.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </MotionItem>

          {/* 4. RECOMMENDATION CARD (with verified data disclaimer) */}
          <MotionItem className="mt-12">
            <Card className="bg-[#111418] border-white/[0.08] p-6 sm:p-8 relative overflow-hidden">
              {/* Subtle accent border at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/40 via-[#00E08A] to-amber-500/40" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-amber-300 block mb-1">
                    System Recommendation Specification
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F5F7FA]">
                    {riderProfile.suggestedAtherModel}
                  </h2>
                </div>
                <Badge variant="ACADEMIC PROTOTYPE" label="[VERIFIED ATHER PRODUCT DATA REQUIRED]" />
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3.5 mb-6">
                <Info size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                  <p className="font-medium text-[#F5F7FA] mb-1">
                    Product recommendation requires verified Ather product data.
                  </p>
                  <p>
                    Specific vehicle model assignments (such as Ather 450X, 450S, or Ather Rizta) require
                    official OEM specification parameters to guarantee precise TrueRange™, battery warranty
                    durability, and localized pricing parity.
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#16191E] border border-white/[0.04]">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#00E08A] block mb-2">
                    Primary Alignment Drivers
                  </span>
                  <ul className="space-y-2 text-xs text-[#9AA3AF]">
                    {riderProfile.keyDrivers.map((driver, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#00E08A] shrink-0 mt-0.5" />
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#16191E] border border-white/[0.04]">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#00E08A] block mb-2">
                    Addressed Concern Mitigations
                  </span>
                  <ul className="space-y-2 text-xs text-[#9AA3AF]">
                    {riderProfile.addressedConcerns.map((concern, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#00E08A] shrink-0 mt-0.5" />
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </MotionItem>

          {/* 5. "WHY THIS MATCH" SECTION (3 Rows: CUSTOMER SIGNAL -> PRODUCT ATTRIBUTE -> BENEFIT) */}
          <MotionItem className="mt-12">
            <div className="mb-6">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] block mb-1">
                Logical Alignment Analysis
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F5F7FA]">
                Why this match
              </h2>
              <p className="text-sm text-[#9AA3AF] mt-1">
                Mapping your lifestyle inputs directly against verified EV technical attributes.
              </p>
            </div>

            <div className="space-y-4">
              {whyThisMatchRows.map((row, idx) => (
                <div
                  key={idx}
                  className="bg-[#111418] border border-white/[0.08] rounded-2xl p-5 sm:p-6 transition-all hover:border-white/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Step 1: Customer Signal */}
                  <div className="lg:w-1/3">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] block mb-1">
                      Customer Signal
                    </span>
                    <span className="font-heading font-semibold text-sm sm:text-base text-[#F5F7FA]">
                      {row.customerSignal}
                    </span>
                  </div>

                  {/* Arrow for desktop */}
                  <div className="hidden lg:flex items-center text-white/20">
                    <ArrowRight size={18} />
                  </div>

                  {/* Step 2: Product Attribute */}
                  <div className="lg:w-1/4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] block mb-1">
                      Product Attribute
                    </span>
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-white/[0.06] text-amber-300 border border-amber-500/25 inline-block">
                      {row.productAttribute}
                    </span>
                  </div>

                  {/* Arrow for desktop */}
                  <div className="hidden lg:flex items-center text-white/20">
                    <ArrowRight size={18} />
                  </div>

                  {/* Step 3: Benefit */}
                  <div className="lg:w-1/3">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#00E08A] block mb-1">
                      Tangible Benefit
                    </span>
                    <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                      {row.benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MotionItem>

          {/* 6. NEXT STEP BUTTONS */}
          <MotionItem className="mt-16">
            <Card className="bg-[#111418] border-white/[0.08] p-8 sm:p-10 text-center relative overflow-hidden">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] block mb-2">
                Continue Your Confidence Journey
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F5F7FA] mb-4">
                Explore the numbers or feel the throttle.
              </h2>
              <p className="text-sm sm:text-base text-[#9AA3AF] max-w-xl mx-auto mb-8">
                Every calculation is transparent. Move forward by analyzing your petrol savings, solving your
                parking socket questions, or reserving an unpressured test ride.
              </p>

              {/* 3 Next Step Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <PrimaryButton
                  to="/savings"
                  size="md"
                  icon={<Wallet size={16} />}
                >
                  Check My Savings
                </PrimaryButton>

                <SecondaryButton
                  to="/charging"
                  size="md"
                  icon={<Zap size={16} />}
                >
                  Solve Charging
                </SecondaryButton>

                <SecondaryButton
                  to="/test-ride"
                  size="md"
                  icon={<Calendar size={16} />}
                >
                  Plan My Test Ride
                </SecondaryButton>
              </div>
            </Card>
          </MotionItem>
        </MotionSection>
      </div>
    </div>
  );
};
