import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Navigation,
  BatteryCharging,
  Wallet,
  Zap,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import { PrimaryButton } from '../ui/PrimaryButton';

// 4 Code-built visual panels
const CommuteVisual: React.FC = () => {
  return (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#111418] rounded-[24px] border border-white/[0.08] relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00E08A] animate-ping" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#00E08A]">
            Active Route Telemetry
          </span>
        </div>
        <span className="font-mono text-xs text-[#9AA3AF]">Urban Commute: 22.4 km</span>
      </div>

      {/* Animated Route Grid & Road Path */}
      <div className="relative my-6 flex items-center justify-center h-48">
        <svg viewBox="0 0 340 180" className="w-full h-full" fill="none">
          {/* Grid lines */}
          <line x1="20" y1="40" x2="320" y2="40" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="20" y1="90" x2="320" y2="90" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="20" y1="140" x2="320" y2="140" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="90" y1="20" x2="90" y2="160" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="170" y1="20" x2="170" y2="160" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="250" y1="20" x2="250" y2="160" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

          {/* S-curve commuting road */}
          <path
            d="M 30 140 C 90 140, 100 50, 170 50 C 240 50, 260 120, 310 80"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Glowing Green Route Line */}
          <motion.path
            d="M 30 140 C 90 140, 100 50, 170 50 C 240 50, 260 120, 310 80"
            stroke="#00E08A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="60 180"
            animate={{ strokeDashoffset: [-240, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Origin Pin */}
          <circle cx="30" cy="140" r="5" fill="#00E08A" />
          <circle cx="30" cy="140" r="10" stroke="#00E08A" strokeOpacity="0.4" />

          {/* Midpoint waypoint */}
          <circle cx="170" cy="50" r="4" fill="#F5F7FA" />

          {/* Destination Pin */}
          <circle cx="310" cy="80" r="6" fill="#00E08A" />
          <circle cx="310" cy="80" r="12" stroke="#00E08A" strokeOpacity="0.6" />
        </svg>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06] text-center">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="block text-[10px] uppercase text-[#9AA3AF] mb-0.5">TrueRange</span>
          <span className="font-mono text-sm font-bold text-[#00E08A]">110 km</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="block text-[10px] uppercase text-[#9AA3AF] mb-0.5">Battery Used</span>
          <span className="font-mono text-sm font-bold text-[#F5F7FA]">20.3%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="block text-[10px] uppercase text-[#9AA3AF] mb-0.5">Buffer Remaining</span>
          <span className="font-mono text-sm font-bold text-[#00E08A]">+88 km</span>
        </div>
      </div>
    </div>
  );
};

const ChargingVisual: React.FC = () => {
  return (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#111418] rounded-[24px] border border-white/[0.08] relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <BatteryCharging size={16} className="text-[#00E08A]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#00E08A]">
            Overnight 5A Domestic Plug
          </span>
        </div>
        <span className="font-mono text-xs text-[#00E08A] px-2 py-0.5 rounded bg-[#00E08A]/10">
          Optimal Battery Health
        </span>
      </div>

      {/* Battery Cylinder Gauge & Flowing Electrons */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[280px] h-28 rounded-2xl border-2 border-white/20 p-2 flex items-center bg-[#0B0D10]">
          {/* Battery Cap */}
          <div className="absolute -right-3 w-2.5 h-10 rounded-r-md bg-white/20" />

          {/* Animated Filled Battery Cells */}
          <div className="w-full h-full rounded-xl overflow-hidden flex gap-1.5 p-1 bg-white/[0.02]">
            {[1, 2, 3, 4, 5, 6].map((bar) => (
              <motion.div
                key={bar}
                className="flex-1 h-full rounded-md bg-[#00E08A]"
                animate={{
                  opacity: [0.35, 1, 0.35],
                  boxShadow: [
                    '0 0 0px #00E08A',
                    '0 0 14px rgba(0,224,138,0.7)',
                    '0 0 0px #00E08A',
                  ],
                }}
                transition={{
                  duration: 2.2,
                  delay: bar * 0.28,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            100% Ready
          </span>
        </div>

        {/* Cable & Plug indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs text-[#9AA3AF] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00E08A]" />
          <span>Standard 5A Socket • 0–80% in ~4h 30m</span>
        </div>
      </div>

      {/* Grid Network reassurance */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-[#9AA3AF]">Ather Grid Fast Chargers:</span>
        <span className="font-mono font-semibold text-[#F5F7FA]">3,000+ live stations</span>
      </div>
    </div>
  );
};

const SavingsVisual: React.FC = () => {
  return (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#111418] rounded-[24px] border border-white/[0.08] relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-[#00E08A]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#00E08A]">
            TCO Running Economics
          </span>
        </div>
        <span className="font-mono text-xs text-[#00E08A] font-bold">₹36,000+/yr Retained</span>
      </div>

      {/* Comparative Bar Visualization */}
      <div className="my-6 space-y-4">
        {/* Petrol ICE Scooter */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#9AA3AF]">Petrol Scooter (₹108/L)</span>
            <span className="font-mono text-red-400 font-semibold">₹2.80 / km</span>
          </div>
          <div className="w-full h-4 bg-white/[0.04] rounded-full overflow-hidden">
            <div className="w-[85%] h-full bg-gradient-to-r from-red-500/60 to-red-400 rounded-full" />
          </div>
        </div>

        {/* Ather Electric */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#F5F7FA] font-medium">Ather Electric (Domestic Tariff)</span>
            <span className="font-mono text-[#00E08A] font-bold">₹0.35 / km</span>
          </div>
          <div className="w-full h-4 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#00E08A] rounded-full shadow-[0_0_12px_#00E08A]"
              initial={{ width: '0%' }}
              whileInView={{ width: '12%' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Annual Summary Card */}
      <div className="p-4 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/30 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#00E08A] block font-semibold">
            5-Year Cumulative Savings
          </span>
          <span className="text-xl font-heading font-bold text-white">₹1,80,000+</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#00E08A]/20 flex items-center justify-center text-[#00E08A]">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

const RideVisual: React.FC = () => {
  return (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#111418] rounded-[24px] border border-white/[0.08] relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[#00E08A]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#00E08A]">
            Warp Torque Dynamics
          </span>
        </div>
        <span className="font-mono text-xs text-[#00E08A]">0–40 km/h: 3.3s</span>
      </div>

      {/* Torque Curve Oscilloscope */}
      <div className="my-6 relative flex flex-col items-center justify-center h-44">
        <svg viewBox="0 0 320 140" className="w-full h-full" fill="none">
          {/* ICE Curve (Lagging) */}
          <path
            d="M 20 120 C 80 115, 120 80, 180 60 C 240 40, 280 45, 300 45"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Ather Instant Warp Torque (Vertical instant step) */}
          <motion.path
            d="M 20 120 L 25 30 C 90 28, 180 32, 300 35"
            stroke="#00E08A"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
          />
        </svg>

        {/* Live Torque Overlay */}
        <div className="absolute bottom-1 right-2 text-right">
          <span className="text-[10px] text-[#9AA3AF] uppercase block">Instant Torque</span>
          <span className="font-mono font-bold text-lg text-[#00E08A]">26 Nm @ 0 RPM</span>
        </div>
      </div>

      {/* Handling Reassurance */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06] text-xs">
        <div className="p-2 rounded-lg bg-white/[0.02]">
          <span className="text-[#9AA3AF] block text-[10px]">Center of Gravity</span>
          <span className="font-mono text-white font-medium">Low Floorboard Pack</span>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.02]">
          <span className="text-[#9AA3AF] block text-[10px]">Weight Ratio</span>
          <span className="font-mono text-[#00E08A] font-medium">Balanced 50:50</span>
        </div>
      </div>
    </div>
  );
};

const STORIES = [
  {
    num: '01',
    title: 'Your Commute',
    subtitle: 'Urban distance calibration & traffic topology',
    text: 'Calculate your exact daily route physics against real stop-and-go patterns. True range isn’t an idealized laboratory spec—it’s your actual city commute reality.',
    link: '/savings',
    buttonLabel: 'Simulate Commute',
    Visual: CommuteVisual,
  },
  {
    num: '02',
    title: 'Your Charging',
    subtitle: 'Overnight 5A domestic plug & grid density',
    text: 'Wake up to 100% full capacity every morning from standard 5A household sockets. Zero petrol station detours, reinforced by 3,000+ public fast-charging points across India.',
    link: '/quiz',
    buttonLabel: 'Evaluate Parking Fit',
    Visual: ChargingVisual,
  },
  {
    num: '03',
    title: 'Your Savings',
    subtitle: '₹3,500/mo petrol replaced by ₹450 electricity',
    text: 'Experience ₹36,000+ net cash retained in your pocket annually. Watch operating costs plummet from ₹2.80/km down to ₹0.35/km over your vehicle lifespan.',
    link: '/savings',
    buttonLabel: 'Calculate Economics',
    Visual: SavingsVisual,
  },
  {
    num: '04',
    title: 'Your Ride',
    subtitle: 'Instantaneous warp torque & low center of gravity',
    text: 'Zero gears, zero engine vibration, and instant 26 Nm throttle response. The aluminum chassis delivers effortless cornering and unmatched stability in traffic.',
    link: '/test-ride',
    buttonLabel: 'Book Experience Ride',
    Visual: RideVisual,
  },
];

export const StickyScrollStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReduced = useReducedMotion();
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance through stories every 6 seconds unless paused/hovered
  useEffect(() => {
    if (isPaused || prefersReduced) return;

    autoPlayTimerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STORIES.length);
    }, 6000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, prefersReduced, activeStep]);

  const activeStory = STORIES[activeStep];
  const VisualComponent = activeStory.Visual;

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + STORIES.length) % STORIES.length);
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % STORIES.length);
  };

  return (
    <section
      className="relative w-full bg-[#0B0D10] py-20 md:py-28 overflow-hidden border-t border-white/[0.05]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Eyebrow & Phase Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="inline-block text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00E08A] mb-3">
              Real-World Ownership Calibration
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-[#F5F7FA] tracking-tight">
              The Four Pillars of Confidence
            </h2>
          </div>

          {/* Phase Tabs with progress bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {STORIES.map((story, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={story.num}
                  onClick={() => setActiveStep(idx)}
                  className={`relative px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-300 flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-white/[0.08] text-white border border-[#00E08A]/40 shadow-[0_0_15px_rgba(0,224,138,0.15)]'
                      : 'bg-white/[0.02] text-[#9AA3AF] hover:text-white border border-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <span className={`font-bold ${isActive ? 'text-[#00E08A]' : 'text-[#9AA3AF]'}`}>
                    {story.num}
                  </span>
                  <span className="font-sans font-medium text-xs">
                    {story.title.replace('Your ', '')}
                  </span>

                  {/* Active Step Progress Underline */}
                  {isActive && !isPaused && !prefersReduced && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#00E08A] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 6, ease: 'linear' }}
                      key={activeStep}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Active Story Narrative */}
          <div className="lg:col-span-5 min-h-[340px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory.num}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-heading font-extrabold text-5xl sm:text-6xl text-[#00E08A] tracking-tight">
                    {activeStory.num}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#9AA3AF] bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.06]">
                    Story Phase
                  </span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F5F7FA] tracking-tight mb-2">
                  {activeStory.title}
                </h3>

                <span className="text-sm font-medium text-[#00E08A] mb-4 block">
                  {activeStory.subtitle}
                </span>

                <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed mb-6">
                  {activeStory.text}
                </p>

                <div className="flex items-center gap-4">
                  <PrimaryButton
                    to={activeStory.link}
                    size="md"
                    icon={<ArrowRight size={16} />}
                  >
                    {activeStory.buttonLabel}
                  </PrimaryButton>

                  {/* Manual Prev / Next arrow controls */}
                  <div className="flex items-center gap-1.5 ml-auto text-[#9AA3AF]">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:text-[#00E08A] border border-white/[0.06] transition-colors focus:outline-none"
                      aria-label="Previous story phase"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:text-[#00E08A] border border-white/[0.06] transition-colors focus:outline-none"
                      aria-label="Next story phase"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Code-built Visual Panel */}
          <div className="lg:col-span-7 relative h-[380px] sm:h-[440px] w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory.num}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <VisualComponent />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
