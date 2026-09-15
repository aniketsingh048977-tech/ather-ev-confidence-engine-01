/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

type CursorVariant = 'default' | 'hover' | 'slider';

/**
 * CustomCursor
 * Desktop-only custom cursor with slight lag and interactive hover expansions:
 * - Small 8px white dot by default (mix-blend-mode: difference)
 * - Expands into a 40px ring over buttons, links, and cards
 * - Shows a tiny "Drag" label over range sliders
 * Strictly hidden on mobile and touch devices.
 */
export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const prefersReduced = useReducedMotion();

  // Mouse position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for slight cinematic lag
  const springConfig = { damping: 28, stiffness: 400, mass: 0.3 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device has a fine pointer (desktop mouse) and not touch-only
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (hasFinePointer && !isTouch && !prefersReduced) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect hover targets dynamically across the DOM
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Slider check
      if (
        target.tagName === 'INPUT' &&
        (target as HTMLInputElement).type === 'range' ||
        target.closest('input[type="range"]') ||
        target.closest('[data-cursor="slider"]')
      ) {
        setVariant('slider');
        return;
      }

      // 2. Button / Link / Card check
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.tilt-card') ||
        target.closest('.magnetic-trigger') ||
        target.closest('[data-cursor="pointer"]')
      ) {
        setVariant('hover');
        return;
      }

      setVariant('default');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible, prefersReduced]);

  if (!isEnabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform select-none"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.15 } }}
    >
      {variant === 'default' && (
        <motion.div
          key="default-cursor"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      )}

      {variant === 'hover' && (
        <motion.div
          key="hover-cursor"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 24 }}
          className="w-10 h-10 rounded-full border border-white bg-white/20 backdrop-blur-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        />
      )}

      {variant === 'slider' && (
        <motion.div
          key="slider-cursor"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="w-12 h-12 rounded-full border-2 border-[#00E08A] bg-[#00E08A]/20 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_16px_rgba(0,224,138,0.6)]"
        >
          <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">
            Drag
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};
