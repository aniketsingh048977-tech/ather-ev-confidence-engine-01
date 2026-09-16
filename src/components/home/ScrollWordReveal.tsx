import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import {
  Navigation,
  Activity,
  SlidersHorizontal,
  BatteryCharging,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { TiltCard } from '../motion/TiltCard';

const WORDS = ["Don't", 'choose', 'your', 'EV', 'based', 'on', "someone", "else's", 'life.'];

const FACTORS = [
  {
    title: 'Commute',
    text: 'Your daily distance, real traffic congestion, and daily routes.',
    icon: Navigation,
    initialX: -60,
    initialY: -20,
  },
  {
    title: 'Usage',
    text: 'Solo urban sprint, heavy weekend riding, or daily pillion comfort.',
    icon: Activity,
    initialX: 0,
    initialY: -70,
  },
  {
    title: 'Priorities',
    text: 'Instant warp acceleration, storage capacity, or family utility.',
    icon: SlidersHorizontal,
    initialX: 60,
    initialY: -20,
  },
  {
    title: 'Charging access',
    text: 'Dedicated 5A home socket, apartment society, or public grid points.',
    icon: BatteryCharging,
    initialX: -50,
    initialY: 60,
  },
  {
    title: 'Spending',
    text: 'Monthly petrol expenses mapped directly to electric running cost delta.',
    icon: Wallet,
    initialX: 0,
    initialY: 70,
  },
  {
    title: 'Concerns',
    text: 'Real-world monsoons, battery thermal health, and battery longevity.',
    icon: ShieldCheck,
    initialX: 50,
    initialY: 60,
  },
];

// Single word component that fills from grey to white on scroll
const ScrollWord: React.FC<{
  word: string;
  index: number;
  total: number;
  scrollYProgress: any;
}> = ({ word, index, total, scrollYProgress }) => {
  const start = index / (total + 2);
  const end = (index + 1.2) / (total + 2);

  const color = useTransform(
    scrollYProgress,
    [start, end],
    ['rgba(255, 255, 255, 0.25)', '#F5F7FA']
  );

  return (
    <motion.span
      style={{ color }}
      className="inline-block mx-1 sm:mx-2 transition-colors"
    >
      {word}
    </motion.span>
  );
};

export const ScrollWordReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 85%', 'end 35%'],
  });

  return (
    <section ref={sectionRef} className="w-full bg-[#0E1115] relative z-10 py-24 md:py-36 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow */}
        <div className="text-center mb-8">
          <span className="inline-block text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00E08A] bg-[#00E08A]/10 px-3.5 py-1.5 rounded-full border border-[#00E08A]/20">
            Individual Mobility Calibration
          </span>
        </div>

        {/* Giant Text: Fills from grey to white word-by-word */}
        <div ref={textRef} className="text-center max-w-5xl mx-auto mb-16 md:mb-24">
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] select-none">
            {WORDS.map((word, idx) => (
              <ScrollWord
                key={idx}
                word={word}
                index={idx}
                total={WORDS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </h2>
          <p className="mt-8 text-base md:text-xl text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
            Generic EV opinions fail because no two urban routines are identical. The Confidence Engine
            evaluates your actual commuting reality across six key variables.
          </p>
        </div>

        {/* Six Factor Tiles floating in from different directions and settling into grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {FACTORS.map((factor, idx) => {
            const Icon = factor.icon;
            return (
              <motion.div
                key={factor.title}
                initial={{
                  opacity: 0,
                  x: prefersReduced ? 0 : factor.initialX,
                  y: prefersReduced ? 0 : factor.initialY,
                  scale: prefersReduced ? 1 : 0.94,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: prefersReduced ? 0.2 : 0.75,
                  delay: prefersReduced ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
              >
                <TiltCard maxTilt={8} className="h-full">
                  <div className="h-full bg-[#16191E] rounded-[22px] p-6 sm:p-7 border border-white/[0.08] hover:border-[#00E08A]/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      {/* Icon */}
                      <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 text-[#00E08A] group-hover:border-[#00E08A]/40 group-hover:bg-[#00E08A]/10 transition-colors">
                        <Icon size={20} strokeWidth={1.75} />
                      </div>

                      {/* Title */}
                      <h3 className="font-heading font-semibold text-lg sm:text-xl text-[#F5F7FA] mb-2 group-hover:text-[#00E08A] transition-colors">
                        {factor.title}
                      </h3>

                      {/* Text */}
                      <p className="text-sm text-[#9AA3AF] leading-relaxed">
                        {factor.text}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-[#9AA3AF] group-hover:text-[#00E08A] transition-colors">
                      <span className="uppercase tracking-wider">Factor 0{idx + 1}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E08A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Academic Notice Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 p-4 sm:p-5 rounded-2xl bg-[#16191E]/80 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#9AA3AF]"
        >
          <span className="font-medium">
            Academic Prototype Standard: All comparisons use objective user inputs rather than speculative specifications.
          </span>
          <span className="font-mono font-semibold px-2.5 py-1 rounded bg-[#00E08A]/10 text-[#00E08A] border border-[#00E08A]/25 shrink-0">
            [VERIFIED ATHER PRODUCT DATA REQUIRED]
          </span>
        </motion.div>

      </div>
    </section>
  );
};
