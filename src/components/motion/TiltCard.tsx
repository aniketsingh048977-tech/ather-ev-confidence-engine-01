/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // default 8 degrees
  glareOpacity?: number; // default 0.12
  enabled?: boolean;
}

/**
 * TiltCard
 * Card tilts toward the cursor (max 8 degrees) with a moving light glare.
 * Disabled on touch/mobile devices and for prefers-reduced-motion to maintain 60fps.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glareOpacity = 0.12,
  enabled = true,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  // Rotation & glare state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const shouldTilt = enabled && !prefersReduced && !isTouch;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2; // -1 to 1
    const yPct = (y / rect.height - 0.5) * 2; // -1 to 1

    setRotateX(-yPct * maxTilt);
    setRotateY(xPct * maxTilt);
    setGlarePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => {
    if (shouldTilt) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!shouldTilt) return;
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: shouldTilt ? rotateX : 0,
        rotateY: shouldTilt ? rotateY : 0,
        transformPerspective: 1000,
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 24,
        mass: 0.5,
      }}
      className={`relative overflow-hidden tilt-card ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      {...(rest as any)}
    >
      {/* Glare Overlay */}
      {shouldTilt && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: isHovered ? glareOpacity : 0,
            background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(0, 224, 138, 0.2) 25%, transparent 70%)`,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-0 h-full w-full">{children}</div>
    </motion.div>
  );
};
