import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuroraBackground } from '../motion/living-backgrounds/AuroraBackground';
import { GlowOrb } from '../motion/living-backgrounds/GlowOrb';
import { MagneticButton } from '../motion/MagneticButton';
import { PrimaryButton } from '../ui/PrimaryButton';
import { RevealText } from '../motion/RevealText';

export const FinalCtaSection: React.FC = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section className="w-full bg-[#111418] border-t border-white/[0.08] relative overflow-hidden py-24 sm:py-36">
      {/* Living Aurora Background */}
      <AuroraBackground className="opacity-70" />

      {/* Large GlowOrb pulsing directly behind the Magnetic CTA Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <motion.div
          animate={prefersReduced ? {} : { scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <GlowOrb size={620} className="relative top-0 left-0" />
        </motion.div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00E08A] bg-[#00E08A]/10 px-4 py-1.5 rounded-full border border-[#00E08A]/25">
            Your Commute • Your Realities
          </span>
        </motion.div>

        {/* Headline revealed line by line */}
        <div className="max-w-4xl mx-auto mb-8">
          <RevealText
            as="h2"
            text="“Don’t ask me what scooter I want."
            className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.02em] text-[#F5F7FA] leading-[1.12]"
            delay={0.1}
          />
          <RevealText
            as="h2"
            text="Ask me how I live.”"
            className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.02em] text-[#00E08A] leading-[1.12] mt-1 sm:mt-2"
            delay={0.35}
          />
        </div>

        {/* Narrative subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-base sm:text-lg text-[#9AA3AF] max-w-xl mx-auto leading-relaxed mb-10"
        >
          Take the 2-minute assessment to unlock your personalized EV confidence score,
          tailored savings calculation, and direct test-ride voucher.
        </motion.p>

        {/* Magnetic Button Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="relative z-10"
        >
          <MagneticButton maxDistance={12}>
            <PrimaryButton
              to="/quiz"
              size="lg"
              className="text-base px-8 py-4 shadow-[0_0_30px_rgba(0,224,138,0.35)] hover:shadow-[0_0_45px_rgba(0,224,138,0.6)]"
              icon={<ArrowRight size={20} strokeWidth={1.75} />}
            >
              Find My Ather Match
            </PrimaryButton>
          </MagneticButton>
        </motion.div>

        {/* Reassurance pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-[#9AA3AF]"
        >
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
        </motion.div>

      </div>
    </section>
  );
};
