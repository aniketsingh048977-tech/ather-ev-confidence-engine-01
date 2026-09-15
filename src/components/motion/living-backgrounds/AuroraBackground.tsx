/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AuroraBackgroundProps {
  className?: string;
  faint?: boolean; // When used in header or subtle panels, lower opacity
  isMobileCompact?: boolean;
}

/**
 * AuroraBackground
 * Slow drifting blurred blobs in green #00E08A and teal, ~8% opacity.
 * On mobile: fewer blobs, lighter compute footprint.
 * Only animates transform and opacity for smooth 60fps performance.
 */
export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  faint = false,
  isMobileCompact = false,
}) => {
  const prefersReduced = useReducedMotion();

  const baseOpacity = faint ? 0.04 : 0.08;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      style={{ opacity: baseOpacity }}
    >
      {/* Blob 1: Green #00E08A Top-Left Drift */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] rounded-full bg-[#00E08A] blur-[90px] sm:blur-[130px] will-change-transform"
        animate={
          prefersReduced
            ? undefined
            : {
                x: ['0%', '12%', '-8%', '0%'],
                y: ['0%', '-10%', '8%', '0%'],
                scale: [1, 1.08, 0.94, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2: Teal #00B4D8 Bottom-Right Drift */}
      <motion.div
        className="absolute -bottom-[20%] -right-[10%] w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] rounded-full bg-[#00B4D8] blur-[80px] sm:blur-[120px] will-change-transform"
        animate={
          prefersReduced
            ? undefined
            : {
                x: ['0%', '-14%', '10%', '0%'],
                y: ['0%', '8%', '-12%', '0%'],
                scale: [0.95, 1.05, 0.98, 0.95],
              }
        }
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      />

      {/* Blob 3: Emerald Mid-Center Glow (Skipped if mobile compact) */}
      {!isMobileCompact && (
        <motion.div
          className="hidden sm:block absolute top-[35%] left-[30%] w-[420px] h-[420px] rounded-full bg-[#059669] blur-[110px] will-change-transform"
          animate={
            prefersReduced
              ? undefined
              : {
                  x: ['0%', '8%', '-10%', '0%'],
                  y: ['0%', '12%', '-6%', '0%'],
                  scale: [1, 0.92, 1.06, 1],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />
      )}
    </div>
  );
};
