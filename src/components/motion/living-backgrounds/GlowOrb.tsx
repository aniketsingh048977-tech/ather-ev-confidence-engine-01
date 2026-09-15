/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface GlowOrbProps {
  className?: string;
  size?: number | string;
  color?: string; // default #00E08A
  pulse?: boolean;
}

/**
 * GlowOrb
 * A soft radial green glow that can be placed behind key elements (cards, badges, CTAs).
 */
export const GlowOrb: React.FC<GlowOrbProps> = ({
  className = '',
  size = 320,
  color = '#00E08A',
  pulse = true,
}) => {
  const prefersReduced = useReducedMotion();
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none rounded-full blur-[80px] sm:blur-[100px] will-change-transform ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        background: `radial-gradient(circle, ${color} 0%, rgba(0, 224, 138, 0.25) 45%, transparent 70%)`,
        opacity: 0.16,
      }}
      animate={
        pulse && !prefersReduced
          ? {
              scale: [1, 1.1, 0.96, 1],
              opacity: [0.14, 0.22, 0.14],
            }
          : undefined
      }
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};
