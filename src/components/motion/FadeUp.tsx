/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  distance?: number;
  id?: string;
}

/**
 * FadeUp
 * Section content fades up 30px on scroll, children stagger.
 * Targets 60fps by strictly animating transform (translateY) and opacity.
 */
export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  className = '',
  delay = 0,
  stagger = 0.08,
  distance = 30,
  id,
}) => {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: {
      opacity: prefersReduced ? 1 : 0,
      y: prefersReduced ? 0 : distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        delay,
        staggerChildren: prefersReduced ? 0 : stagger,
      },
    },
  } as any;

  return (
    <motion.div
      id={id}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const FadeUpItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  distance?: number;
}> = ({ children, className = '', distance = 20 }) => {
  const prefersReduced = useReducedMotion();

  const itemVariants = {
    hidden: {
      opacity: prefersReduced ? 1 : 0,
      y: prefersReduced ? 0 : distance,
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
    <motion.div variants={itemVariants} className={`will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
};
