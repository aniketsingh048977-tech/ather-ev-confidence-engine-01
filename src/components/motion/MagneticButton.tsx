/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  maxDistance?: number; // max 12px as requested
  enabled?: boolean;
}

/**
 * MagneticButton
 * Button gently pulls toward the cursor within 12px, springs back on mouse leave.
 * Disabled on touch devices and when prefers-reduced-motion is active.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  maxDistance = 12,
  enabled = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const shouldMagnet = enabled && !isTouch && !prefersReduced;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldMagnet || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Pull factor
    const pullX = Math.max(-maxDistance, Math.min(maxDistance, dx * 0.35));
    const pullY = Math.max(-maxDistance, Math.min(maxDistance, dy * 0.35));

    setPosition({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    if (!shouldMagnet) return;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: shouldMagnet ? position.x : 0,
        y: shouldMagnet ? position.y : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 18,
        mass: 0.4,
      }}
      className={`inline-block magnetic-trigger ${className}`}
    >
      {children}
    </motion.div>
  );
};
