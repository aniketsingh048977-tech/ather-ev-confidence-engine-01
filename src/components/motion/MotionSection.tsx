/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  alternate?: boolean;
  lightMode?: boolean;
  id?: string;
  delay?: number;
}

export const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className = '',
  alternate = false,
  lightMode = false,
  id,
  delay = 0,
}) => {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: {
      opacity: prefersReduced ? 1 : 0,
      y: prefersReduced ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        delay,
        staggerChildren: prefersReduced ? 0 : 0.08,
      },
    },
  } as any;

  const backgroundClass = lightMode
    ? 'bg-[#F4F5F2] text-[#0B0D10]'
    : alternate
    ? 'bg-[#111418] text-[#F5F7FA]'
    : 'bg-[#0B0D10] text-[#F5F7FA]';

  return (
    <section id={id} className={`w-full ${backgroundClass}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-[120px] ${className}`}
      >
        {children}
      </motion.div>
    </section>
  );
};

export const MotionItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const itemVariants = {
    hidden: {
      opacity: prefersReduced ? 1 : 0,
      y: prefersReduced ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  } as any;

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};
