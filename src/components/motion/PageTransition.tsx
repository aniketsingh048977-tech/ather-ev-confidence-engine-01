/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition
 * Between routes:
 * 1. A thin green line sweeps across the screen left to right (0.6s).
 * 2. The old page fades and blurs out.
 * 3. The new page fades and un-blurs in.
 * Total duration: 0.6s.
 * Only animates transform and opacity for 60fps performance.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className="w-full flex-1 flex flex-col">{children}</div>;
  }

  return (
    <div className="w-full flex-1 flex flex-col relative">
      {/* Sweeping thin green line across top of screen */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#00E08A] z-[99998] pointer-events-none shadow-[0_0_14px_#00E08A]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{
          scaleX: [0, 1, 0],
          originX: [0, 0, 1],
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Main Page Fade & Blur In/Out */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(8px)' }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </div>
  );
};
