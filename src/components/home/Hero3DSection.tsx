import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { Badge } from '../ui/Badge';
import { RevealText } from '../motion/RevealText';
import { DotGrid } from '../motion/living-backgrounds/DotGrid';
import { AuroraBackground } from '../motion/living-backgrounds/AuroraBackground';
import { GlowOrb } from '../motion/living-backgrounds/GlowOrb';
import { MagneticButton } from '../motion/MagneticButton';
import { ScooterCanvas } from './ScooterCanvas';

export const Hero3DSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll inside hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Hero Scroll Effect: Headline fades gently on deeper scroll
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

  // Pass scroll value (0 to 1) to scooter rotation & zoom
  const [scrollVal, setScrollVal] = useState(0);
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollVal(latest);
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[#0B0D10]"
    >
      {/* Living Backgrounds */}
      <DotGrid className="opacity-30" />
      <AuroraBackground className="opacity-60" />

      {/* Subtle green GlowOrb behind headline cluster */}
      <GlowOrb size={680} className="top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-70" />

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-14 pb-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headline and Action Buttons */}
          <motion.div
            style={{
              opacity: prefersReduced ? 1 : headlineOpacity,
            }}
            className="lg:col-span-6 flex flex-col items-start text-left z-20"
          >
            {/* Academic Prototype Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <Badge variant="ACADEMIC PROTOTYPE" />
            </motion.div>

            {/* Headline with clean word reveal and safe line spacing */}
            <RevealText
              as="h1"
              text="Is an EV right for YOUR life?"
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-semibold tracking-[-0.02em] leading-[1.12] sm:leading-[1.1] text-[#F5F7FA]"
            />

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-base sm:text-lg md:text-xl text-[#9AA3AF] leading-relaxed"
            >
              Discover your rider profile, understand your EV fit, calculate your potential savings
              and find your next step. Powered by AI.
            </motion.p>

            {/* Buttons with Magnetic interaction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 sm:mt-10 flex flex-wrap gap-4 items-center"
            >
              <MagneticButton maxDistance={12}>
                <PrimaryButton to="/quiz" size="lg" icon={<ArrowRight size={18} strokeWidth={1.5} />}>
                  Find My Ather Match
                </PrimaryButton>
              </MagneticButton>
              <SecondaryButton to="/how-it-works" size="lg">
                See How It Works
              </SecondaryButton>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-white/[0.06] flex items-center gap-6 text-xs text-[#9AA3AF] font-mono"
            >
              <div>
                <span className="text-[#00E08A] font-bold block text-sm">3,000+</span>
                <span>Charging Hubs</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div>
                <span className="text-[#00E08A] font-bold block text-sm">₹36K+</span>
                <span>Avg Annual Savings</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div>
                <span className="text-[#00E08A] font-bold block text-sm">110 km</span>
                <span>TrueRange Certified</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Hero Scene (dedicated space on both mobile and desktop) */}
          <div className="lg:col-span-6 w-full relative z-10 h-[380px] sm:h-[460px] lg:h-[560px] flex items-center justify-center">
            <ScooterCanvas
              scrollProgress={scrollVal}
              isMobile={isMobile}
              className="w-full h-full"
            />
          </div>

        </div>
      </div>

      {/* Scroll to explore hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 pb-4 flex flex-col items-center gap-1.5 select-none"
      >
        <a
          href="#experience-cards"
          className="group flex flex-col items-center gap-1 text-xs text-[#9AA3AF] hover:text-[#00E08A] transition-colors focus:outline-none"
          aria-label="Scroll to experience overview"
        >
          <span className="text-[10px] uppercase tracking-[0.16em] font-medium opacity-80 group-hover:opacity-100">
            Scroll to explore
          </span>
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} strokeWidth={1.5} className="text-[#00E08A]" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
