import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroSequenceProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete, forceShow = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<'line' | 'text' | 'split' | 'done'>('line');

  const text = 'EV CONFIDENCE ENGINE';

  useEffect(() => {
    // Check if user already saw the intro during this session
    const hasSeen = sessionStorage.getItem('ather_has_seen_intro_v1');
    if (hasSeen && !forceShow) {
      onComplete();
      return;
    }

    setIsVisible(true);

    // Sequence timing:
    // 0.0s - 0.4s: green line draws
    // 0.4s - 1.1s: letters reveal
    // 1.1s - 1.5s: split open
    // 1.5s: finish
    const tText = setTimeout(() => setStage('text'), 350);
    const tSplit = setTimeout(() => setStage('split'), 1100);
    const tDone = setTimeout(() => {
      setStage('done');
      setIsVisible(false);
      sessionStorage.setItem('ather_has_seen_intro_v1', 'true');
      onComplete();
    }, 1550);

    return () => {
      clearTimeout(tText);
      clearTimeout(tSplit);
      clearTimeout(tDone);
    };
  }, [forceShow, onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    sessionStorage.setItem('ather_has_seen_intro_v1', 'true');
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden">
        {/* Top shutter panel */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 bg-[#0B0D10] border-b border-[#00E08A]/40"
          initial={{ y: 0 }}
          animate={stage === 'split' ? { y: '-100%' } : { y: 0 }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Bottom shutter panel */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0B0D10] border-t border-[#00E08A]/40"
          initial={{ y: 0 }}
          animate={stage === 'split' ? { y: '100%' } : { y: 0 }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Central Content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
          initial={{ opacity: 1 }}
          animate={stage === 'split' ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          {/* Green line drawing across */}
          <div className="relative w-full max-w-md h-[2px] mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#00E08A] to-transparent shadow-[0_0_12px_#00E08A]"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </div>

          {/* Letter by letter title */}
          <div className="flex items-center justify-center overflow-hidden">
            {text.split('').map((char, index) => (
              <motion.span
                key={index}
                className={`font-mono text-sm sm:text-base md:text-lg font-bold tracking-[0.24em] ${
                  char === ' ' ? 'w-3 sm:w-4' : 'text-[#F5F7FA]'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={stage !== 'line' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{
                  duration: 0.18,
                  delay: stage !== 'line' ? index * 0.028 : 0,
                  ease: 'easeOut',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mt-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#00E08A]"
          >
            <span>Autonomous Calibration</span>
          </motion.div>
        </motion.div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-[#00E08A]/20 border border-white/10 hover:border-[#00E08A]/40 text-xs font-mono text-[#9AA3AF] hover:text-[#00E08A] transition-all cursor-pointer"
        >
          Skip Intro →
        </button>
      </div>
    </AnimatePresence>
  );
};
