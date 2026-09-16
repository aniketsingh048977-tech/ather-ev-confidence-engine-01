import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const MarqueeSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const row1Text = 'RANGE CONFIDENCE • CHARGING CLARITY • REAL SAVINGS • ';
  const row2Text = 'ASK HOW I LIVE • NOT WHAT I BUY • YOUR RIDE • ';

  // Duration in seconds: faster when scrolling
  const durationRow1 = prefersReduced ? 0 : isScrolling ? 18 : 34;
  const durationRow2 = prefersReduced ? 0 : isScrolling ? 22 : 38;

  return (
    <section className="w-full bg-[#0B0D10] py-14 sm:py-20 overflow-hidden select-none border-y border-white/[0.04]">
      {/* Row 1: Scrolling Left */}
      <div className="flex whitespace-nowrap overflow-hidden py-2">
        <motion.div
          className="flex whitespace-nowrap font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
          animate={prefersReduced ? {} : { x: ['0%', '-50%'] }}
          transition={{
            duration: durationRow1,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="inline-block px-4 text-transparent transition-all duration-300"
              style={{
                WebkitTextStroke: '1.25px rgba(255, 255, 255, 0.22)',
              }}
            >
              <span className="hover:text-[#00E08A] hover:[webkit-text-stroke:0px] transition-colors">
                {row1Text}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Row 2: Scrolling Right */}
      <div className="flex whitespace-nowrap overflow-hidden py-2 mt-2">
        <motion.div
          className="flex whitespace-nowrap font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
          animate={prefersReduced ? {} : { x: ['-50%', '0%'] }}
          transition={{
            duration: durationRow2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="inline-block px-4 text-transparent transition-all duration-300"
              style={{
                WebkitTextStroke: '1.25px rgba(0, 224, 138, 0.35)',
              }}
            >
              <span className="hover:text-white hover:[webkit-text-stroke:0px] transition-colors">
                {row2Text}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
