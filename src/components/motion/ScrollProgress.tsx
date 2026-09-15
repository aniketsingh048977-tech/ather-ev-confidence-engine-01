/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/**
 * ScrollProgress
 * 2px green progress bar at the very top of the page.
 * Synchronized with page scroll using a smooth spring.
 */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#00E08A] origin-left z-[100] pointer-events-none shadow-[0_0_10px_#00E08A]"
      style={{ scaleX }}
    />
  );
};
