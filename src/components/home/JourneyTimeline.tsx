import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { RevealText } from '../motion/RevealText';

interface Stage {
  step: string;
  name: string;
  desc: string;
}

const STAGES: Stage[] = [
  { step: '01', name: 'Curious', desc: 'Evaluating whether electric mobility fits your lifestyle.' },
  { step: '02', name: 'Understand', desc: 'Demystifying real commute ranges and operational TCO savings.' },
  { step: '03', name: 'Match', desc: 'Discovering your personalized Ather model recommendation.' },
  { step: '04', name: 'Confident', desc: 'Resolving battery, charging, and apartment parking queries.' },
  { step: '05', name: 'Test Ride', desc: 'Experiencing instantaneous electric torque on your local roads.' },
  { step: '06', name: 'Decide', desc: 'Making an informed decision backed by transparent financial data.' },
];

export const JourneyTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 45%'],
  });

  return (
    <section ref={containerRef} className="w-full bg-[#0B0D10] relative z-10 py-24 md:py-36">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 md:mb-24">
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

        {/* Timeline Container */}
        <div className="relative">
          {/* Desktop Horizontal Glowing Connecting Line */}
          <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-white/[0.08] overflow-hidden" aria-hidden="true">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00E08A]/60 via-[#00E08A] to-[#00E08A] shadow-[0_0_12px_#00E08A]"
              style={{
                scaleX: prefersReduced ? 1 : scrollYProgress,
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Vertical Glowing Line for Mobile / Tablet */}
          <div className="lg:hidden absolute left-[31px] top-6 bottom-6 w-[2px] bg-white/[0.08] overflow-hidden" aria-hidden="true">
            <motion.div
              className="w-full bg-[#00E08A] shadow-[0_0_10px_#00E08A]"
              style={{
                scaleY: prefersReduced ? 1 : scrollYProgress,
                transformOrigin: 'top',
              }}
            />
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
            {STAGES.map((stage, idx) => {
              const threshold = idx / 5.5;

              return (
                <TimelineNode
                  key={stage.step}
                  stage={stage}
                  idx={idx}
                  threshold={threshold}
                  scrollYProgress={scrollYProgress}
                  prefersReduced={prefersReduced}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

const TimelineNode: React.FC<{
  stage: Stage;
  idx: number;
  threshold: number;
  scrollYProgress: any;
  prefersReduced: boolean | null;
}> = ({ stage, idx, threshold, scrollYProgress, prefersReduced }) => {
  // Dot illumination state triggered as scroll progress crosses node position
  const dotScale = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.08), threshold, threshold + 0.1],
    [0.9, 1.28, 1]
  );

  const dotBorderColor = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.05), threshold],
    ['rgba(255, 255, 255, 0.15)', '#00E08A']
  );

  const dotShadow = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.05), threshold],
    ['0 0 0px rgba(0,224,138,0)', '0 0 16px rgba(0, 224, 138, 0.65)']
  );

  const labelY = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.05), threshold],
    [12, 0]
  );

  const labelOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.05), threshold],
    [0.4, 1]
  );

  return (
    <div className="flex flex-row lg:flex-col items-start gap-4 lg:gap-3">
      {/* Milestone Dot Pin */}
      <motion.div
        style={{
          scale: prefersReduced ? 1 : dotScale,
          borderColor: prefersReduced ? '#00E08A' : dotBorderColor,
          boxShadow: prefersReduced ? 'none' : dotShadow,
        }}
        className="w-14 h-14 rounded-full bg-[#111418] border-2 flex items-center justify-center font-mono text-xs font-bold text-[#00E08A] shrink-0 transition-colors duration-300"
      >
        {stage.step}
      </motion.div>

      {/* Label and description with rising transition */}
      <motion.div
        style={{
          y: prefersReduced ? 0 : labelY,
          opacity: prefersReduced ? 1 : labelOpacity,
        }}
        className="flex-1 lg:mt-2"
      >
        <h4 className="font-heading font-semibold text-base sm:text-lg text-[#F5F7FA]">
          {stage.name}
        </h4>
        <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed mt-1">
          {stage.desc}
        </p>
      </motion.div>
    </div>
  );
};
