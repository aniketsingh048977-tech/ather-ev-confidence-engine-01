/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealTextProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  id?: string;
  delay?: number;
  stagger?: number;
}

/**
 * RevealText
 * Headline words slide up from a masked overflow one by one, staggered by 0.06s.
 * Only animates transform (y) for smooth 60fps rendering.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  children,
  text,
  className = '',
  as: Component = 'h2',
  id,
  delay = 0,
  stagger = 0.06,
}) => {
  const prefersReduced = useReducedMotion();

  // If text prop is provided, prioritize it; otherwise check if children is string
  const rawString = text ?? (typeof children === 'string' ? children : null);

  if (!rawString || prefersReduced) {
    return (
      <Component id={id} className={className}>
        {children ?? text}
      </Component>
    );
  }

  // Split words while preserving space
  const words = rawString.trim().split(/\s+/);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  } as any;

  const wordVariants = {
    hidden: {
      y: 12,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  } as any;

  return (
    <Component id={id} className={className}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            variants={wordVariants}
            className="inline-block mr-[0.28em] last:mr-0 will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
};
