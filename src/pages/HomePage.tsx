/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Zap,
  Navigation,
  Activity,
  SlidersHorizontal,
  BatteryCharging,
  Wallet,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { RevealText } from '../components/motion/RevealText';
import { DotGrid } from '../components/motion/living-backgrounds/DotGrid';
import { AuroraBackground } from '../components/motion/living-backgrounds/AuroraBackground';
import { GlowOrb } from '../components/motion/living-backgrounds/GlowOrb';
import { useAppState } from '../context/AppContext';



export const HomePage: React.FC = () => {
  const { logEvent } = useAppState();
  const prefersReduced = useReducedMotion();
  const hasLoggedRef = React.useRef(false);

  // Log page_view event on mount
  useEffect(() => {
    if (!hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('page_view', '/', { page: 'Home', title: 'Ather EV Confidence Engine' });
    }
  }, [logEvent]);

  // 3 Experience Cards data
  const experienceCards = [
    {
      num: '01',
      title: 'UNDERSTAND MY RIDE',
      text: 'Learn how an EV fits daily life.',
      link: '/savings',
      actionLabel: 'Calculate Economics',
      icon: <Compass size={24} strokeWidth={1.5} className="text-[#00E08A]" />,
    },
    {
      num: '02',
      title: 'DISCOVER MY MATCH',
      text: 'Answer a few questions and receive a personalised rider profile.',
      link: '/quiz',
      actionLabel: 'Take the Assessment',
      icon: <Sparkles size={24} strokeWidth={1.5} className="text-[#00E08A]" />,
    },
    {
      num: '03',
      title: 'EXPERIENCE IT',
      text: 'Move from digital confidence to a real test ride.',
      link: '/test-ride',
      actionLabel: 'Book Experience',
      icon: <Zap size={24} strokeWidth={1.5} className="text-[#00E08A]" />,
    },
  ];

  // 6 Small tiles for light section
  const personalFactors = [
    {
      title: 'Commute',
      text: 'Your daily distance, real traffic congestion, and daily routes.',
      icon: <Navigation size={20} strokeWidth={1.5} className="text-[#0B0D10]" />,
    },
    {
      title: 'Usage',
      text: 'Solo urban sprint, heavy weekend riding, or daily pillion comfort.',
      icon: <Activity size={20} strokeWidth={1.5} className="text-[#0B0D10]" />,
    },
    {
      title: 'Priorities',
      text: 'Instant warp acceleration, storage capacity, or family utility.',
      icon: <SlidersHorizontal size={20} strokeWidth={1.5} className="text-[#0B0D10]" />,
    },
    {
      title: 'Charging access',
      text: 'Dedicated 5A home socket, apartment society, or public grid points.',
      icon: <BatteryCharging size={20} strokeWidth={1.5} className="text-[#0B0D10]" />,
    },
    {
      title: 'Spending',
      text: 'Monthly petrol expenses mapped directly to electric running cost delta.',
      icon: <Wallet size={20} strokeWidth={1.5} className="text-[#0B0D10]" />,
    },
    {
      title: 'Concerns',
      text: 'Real-world monsoons, battery thermal health, and battery longevity.',
      icon: <ShieldCheck size={20} strokeWidth={1.5} className="text-[#0B0D10]" />,
    },
  ];

  // Journey Strip Stages
  const journeyStages = [
    { step: '01', name: 'Curious', desc: 'Evaluating whether electric mobility fits your lifestyle.' },
    { step: '02', name: 'Understand', desc: 'Demystifying real commute ranges and operational TCO savings.' },
    { step: '03', name: 'Match', desc: 'Discovering your personalized Ather model recommendation.' },
    { step: '04', name: 'Confident', desc: 'Resolving battery, charging, and apartment parking queries.' },
    { step: '05', name: 'Test Ride', desc: 'Experiencing instantaneous electric torque on your local roads.' },
    { step: '06', name: 'Decide', desc: 'Making an informed decision backed by transparent financial data.' },
  ];

  return (
    <div className="w-full relative overflow-hidden">
      {/* 1. HERO SECTION (Full viewport height) */}
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-8 overflow-hidden">
        {/* Living Backgrounds: Interactive DotGrid & Aurora Drift */}
        <DotGrid className="opacity-40" />
        <AuroraBackground className="opacity-60" />

        {/* Soft green radial GlowOrb behind headline */}
        <GlowOrb size={720} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Thin animated SVG line flowing across the background like a road or charging path */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <svg
            className="w-full h-full opacity-35"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E08A" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#00E08A" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#00E08A" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Static subtle guide line */}
            <path
              d="M-100,550 C250,680 450,220 720,440 C980,640 1200,320 1540,400"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Animated pulsing charging stream line */}
            <motion.path
              d="M-100,550 C250,680 450,220 720,440 C980,640 1200,320 1540,400"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="160 380"
              initial={{ strokeDashoffset: 0 }}
              animate={prefersReduced ? {} : { strokeDashoffset: -1080 }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Secondary lower accent road contour */}
            <motion.path
              d="M-80,720 C320,620 540,820 860,690 C1160,560 1340,780 1560,650"
              stroke="#00E08A"
              strokeOpacity="0.15"
              strokeWidth="1"
              fill="none"
              strokeDasharray="80 240"
              initial={{ strokeDashoffset: 0 }}
              animate={prefersReduced ? {} : { strokeDashoffset: 640 }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </svg>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 max-w-[1040px] mx-auto my-auto flex flex-col items-center">
          {/* Eyebrow Badge: ACADEMIC PROTOTYPE */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <Badge variant="ACADEMIC PROTOTYPE" />
          </motion.div>

          {/* Headline: Revealed with masked word slide up */}
          <RevealText
            as="h1"
            text="Is an EV right for YOUR life?"
            className="font-heading text-[42px] sm:text-[60px] md:text-[80px] font-semibold tracking-[-0.02em] leading-[1.08] text-[#F5F7FA]"
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-[#9AA3AF] leading-relaxed"
          >
            Discover your rider profile, understand your EV fit, calculate your potential savings
            and find your next step. Powered by AI.
          </motion.p>


          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 sm:mt-12 flex flex-wrap gap-4 items-center justify-center"
          >
            <PrimaryButton to="/quiz" size="lg" icon={<ArrowRight size={18} strokeWidth={1.5} />}>
              Find My Ather Match
            </PrimaryButton>
            <SecondaryButton to="/how-it-works" size="lg">
              See How It Works
            </SecondaryButton>
          </motion.div>
        </div>

        {/* Small Scroll Indicator at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 pt-8 pb-2 flex flex-col items-center gap-2 select-none"
        >
          <a
            href="#experience-cards"
            className="group flex flex-col items-center gap-1.5 text-xs text-[#9AA3AF] hover:text-[#00E08A] transition-colors focus:outline-none"
            aria-label="Scroll to experience overview"
          >
            <span className="text-[11px] uppercase tracking-[0.14em] font-medium opacity-80 group-hover:opacity-100">
              Scroll to explore
            </span>
            <motion.div
              animate={prefersReduced ? {} : { y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ChevronDown size={18} strokeWidth={1.5} className="text-[#00E08A]" />
            </motion.div>
          </a>
        </motion.div>
      </section>

      {/* 2. THREE EXPERIENCE CARDS */}
      <section id="experience-cards" className="w-full bg-[#111418]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-[120px]">
          <MotionSection alternate={true} className="!py-0 !px-0">
            <MotionItem>
              <div className="flex flex-col items-start max-w-2xl mb-12 md:mb-16">
                <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] mb-3">
                  Confidence Framework
                </span>
                <RevealText
                  as="h2"
                  text="Three steps to clarity."
                  className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#F5F7FA]"
                />
                <p className="mt-4 text-base md:text-lg text-[#9AA3AF] leading-relaxed">
                  Moving past general EV stereotypes requires honest commute physics, personalized
                  lifestyle mapping, and unpressured hands-on throttle time.
                </p>
              </div>
            </MotionItem>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {experienceCards.map((card) => (
                <MotionItem key={card.num}>
                  <Link to={card.link} className="block group h-full focus:outline-none">
                    <Card className="h-full relative overflow-hidden flex flex-col justify-between p-8 group-hover:border-[#00E08A]/40 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] transition-all duration-300">
                      {/* Large faint number in corner */}
                      <span className="absolute top-4 right-6 font-heading font-bold text-6xl sm:text-7xl select-none text-white/[0.04] group-hover:text-[#00E08A]/10 transition-colors pointer-events-none">
                        {card.num}
                      </span>

                      <div>
                        {/* Icon badge */}
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-8 group-hover:border-[#00E08A]/30 group-hover:bg-[#00E08A]/5 transition-colors">
                          {card.icon}
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#F5F7FA] tracking-tight mb-3 group-hover:text-[#00E08A] transition-colors">
                          {card.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm md:text-base text-[#9AA3AF] leading-relaxed">
                          {card.text}
                        </p>
                      </div>

                      {/* Bottom action link */}
                      <div className="pt-8 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#9AA3AF] group-hover:text-[#00E08A] transition-colors">
                        <span>{card.actionLabel}</span>
                        <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                </MotionItem>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>

      {/* 3. LIGHT SECTION: "Don't choose your EV based on someone else's life." */}
      <section className="w-full bg-[#F4F5F2] text-[#0B0D10]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-[120px]">
          <MotionSection lightMode={true} className="!py-0 !px-0">
            <MotionItem>
              <div className="max-w-3xl mb-12 md:mb-16">
                <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#0B0D10]/70 mb-3 bg-[#0B0D10]/5 px-3 py-1 rounded-full">
                  Individual Mobility Calibration
                </span>
                <RevealText
                  as="h2"
                  text="Don’t choose your EV based on someone else’s life."
                  className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#0B0D10] leading-tight"
                />
                <p className="mt-4 text-base md:text-lg text-[#0B0D10]/80 leading-relaxed">
                  Generic EV opinions fail because no two urban routines are identical. The Confidence Engine
                  evaluates your actual commuting reality across six key variables.
                </p>
              </div>
            </MotionItem>


            {/* Six small tiles with icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {personalFactors.map((item) => (
                <MotionItem key={item.title}>
                  <div className="bg-white rounded-[20px] p-6 border border-[#0B0D10]/10 hover:border-[#0B0D10]/25 transition-all duration-300 h-full flex flex-col justify-between shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#0B0D10]/5 flex items-center justify-center mb-4 text-[#0B0D10]">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-[#0B0D10] mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#0B0D10]/75 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </MotionItem>
              ))}
            </div>

            {/* Academic Notice Banner inside light section */}
            <MotionItem className="mt-10">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0D10]/[0.03] border border-[#0B0D10]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#0B0D10]/70">
                <span className="font-medium">
                  Academic Prototype Standard: All comparisons use objective user inputs rather than speculative specifications.
                </span>
                <span className="font-mono font-semibold px-2.5 py-1 rounded bg-white text-[#0B0D10] border border-[#0B0D10]/15 shrink-0">
                  [VERIFIED ATHER PRODUCT DATA REQUIRED]
                </span>
              </div>
            </MotionItem>
          </MotionSection>
        </div>
      </section>

      {/* 4. THE JOURNEY STRIP */}
      <section className="w-full bg-[#0B0D10]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-[120px]">
          <MotionSection alternate={false} className="!py-0 !px-0">
            <MotionItem>
              <div className="max-w-2xl mb-12 md:mb-16">
                <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] mb-3">
                  Behavioral Progression
                </span>
                <RevealText
                  as="h2"
                  text="The Journey to Electric"
                  className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#F5F7FA]"
                />
                <p className="mt-4 text-base md:text-lg text-[#9AA3AF] leading-relaxed">
                  From initial curiosity to a decisive physical road experience. Each stage removes
                  friction through data-driven confidence.
                </p>
              </div>

            </MotionItem>

            {/* Horizontal Timeline Strip */}
            <div className="relative">
              {/* Connecting Desktop Guideline */}
              <div className="hidden lg:block absolute top-[28px] left-[40px] right-[40px] h-[1px] bg-gradient-to-r from-white/10 via-[#00E08A]/40 to-white/10" aria-hidden="true" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4 relative z-10">
                {journeyStages.map((stage, idx) => (
                  <MotionItem key={stage.step}>
                    <div className="flex flex-col h-full bg-[#16191E] lg:bg-transparent p-5 lg:p-2 rounded-2xl lg:rounded-none border border-white/[0.06] lg:border-none">
                      {/* Step Indicator Pin */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#16191E] border border-white/20 flex items-center justify-center font-mono text-xs font-semibold text-[#00E08A] shadow-[0_0_16px_rgba(0,0,0,0.6)]">
                          {stage.step}
                        </div>
                        <h4 className="font-heading font-semibold text-base text-[#F5F7FA]">
                          {stage.name}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#9AA3AF] leading-relaxed mt-1">
                        {stage.desc}
                      </p>
                    </div>
                  </MotionItem>
                ))}
              </div>
            </div>
          </MotionSection>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="w-full bg-[#111418] border-t border-white/[0.06] relative overflow-hidden">
        {/* Soft green ambient glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none rounded-full blur-[100px] opacity-25 bg-[#00E08A]/35"
          aria-hidden="true"
        />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10 text-center">
          <MotionSection alternate={true} className="!py-0 !px-0 flex flex-col items-center">
            <MotionItem>
              <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] mb-4">
                Your Commute. Your Realities.
              </span>
            </MotionItem>

            <MotionItem>
              <RevealText
                as="h2"
                text="“Don’t ask me what scooter I want. Ask me how I live.”"
                className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.02em] text-[#F5F7FA] max-w-4xl leading-[1.12] mx-auto"
              />
            </MotionItem>


            <MotionItem className="mt-6">
              <p className="text-base sm:text-lg text-[#9AA3AF] max-w-xl mx-auto leading-relaxed">
                Take the 2-minute assessment to unlock your personalized EV confidence score,
                tailored savings calculation, and direct test-ride voucher.
              </p>
            </MotionItem>

            <MotionItem className="mt-10">
              <PrimaryButton to="/quiz" size="lg" icon={<ArrowRight size={18} strokeWidth={1.5} />}>
                Find My Ather Match
              </PrimaryButton>
            </MotionItem>

            <MotionItem className="mt-8">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#9AA3AF]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#00E08A]" />
                  Takes 2 minutes
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#00E08A]" />
                  No sales spam
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#00E08A]" />
                  Academic Prototype
                </span>
              </div>
            </MotionItem>
          </MotionSection>
        </div>
      </section>
    </div>
  );
};
