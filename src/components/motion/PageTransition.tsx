/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: prefersReduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: prefersReduced ? 1 : 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.3, ease: 'easeInOut' }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};
