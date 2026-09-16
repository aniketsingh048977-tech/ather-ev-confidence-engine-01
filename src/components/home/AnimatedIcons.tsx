import React from 'react';
import { motion } from 'motion/react';

interface AnimatedIconProps {
  isHovered: boolean;
}

// 01: Compass with rotating needle and pulsing bearing points
export const AnimatedCompassIcon: React.FC<AnimatedIconProps> = ({ isHovered }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#00E08A]"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity={isHovered ? 0.9 : 0.4} />
      {/* Dynamic Needle */}
      <motion.g
        animate={isHovered ? { rotate: [0, 45, -30, 20, 0] } : { rotate: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 12px' }}
      >
        <polygon
          points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
          fill={isHovered ? 'rgba(0, 224, 138, 0.3)' : 'none'}
          stroke="#00E08A"
        />
        <circle cx="12" cy="12" r="1.5" fill="#00E08A" />
      </motion.g>
    </svg>
  );
};

// 02: Sparkles with rotating stars and twinkling flares
export const AnimatedSparklesIcon: React.FC<AnimatedIconProps> = ({ isHovered }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#00E08A]"
    >
      {/* Main Center Sparkle */}
      <motion.path
        d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"
        animate={
          isHovered
            ? { scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, 15, -10, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 12px' }}
        fill={isHovered ? 'rgba(0, 224, 138, 0.25)' : 'none'}
        stroke="#00E08A"
      />
      {/* Small top-right star */}
      <motion.path
        d="M19 4v4m2-2h-4"
        animate={isHovered ? { scale: [0.8, 1.4, 1], opacity: [0.4, 1, 0.7] } : { opacity: 0.5 }}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, repeatDelay: 0.4 }}
        stroke="#00E08A"
      />
      {/* Small bottom-left star */}
      <motion.path
        d="M5 18v2m1-1H4"
        animate={isHovered ? { scale: [1.3, 0.7, 1.2], opacity: [1, 0.3, 0.9] } : { opacity: 0.5 }}
        transition={{ duration: 0.6, delay: 0.2, repeat: isHovered ? Infinity : 0, repeatDelay: 0.4 }}
        stroke="#00E08A"
      />
    </svg>
  );
};

// 03: Zap with electrical pulse and lightning discharge
export const AnimatedZapIcon: React.FC<AnimatedIconProps> = ({ isHovered }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#00E08A]"
    >
      <motion.path
        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
        animate={
          isHovered
            ? {
                scale: [1, 1.15, 0.95, 1.05, 1],
                strokeWidth: [1.5, 2.5, 1.8, 2.2, 1.5],
              }
            : { scale: 1, strokeWidth: 1.5 }
        }
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 12px' }}
        fill={isHovered ? 'rgba(0, 224, 138, 0.35)' : 'none'}
        stroke="#00E08A"
      />
    </svg>
  );
};
