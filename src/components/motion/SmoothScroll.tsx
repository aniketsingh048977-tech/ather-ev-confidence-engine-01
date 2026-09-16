/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * SmoothScroll
 * Site-wide smooth inertia scrolling powered by Lenis, synced with Framer Motion.
 * Automatically resets scroll on route transitions and respects prefers-reduced-motion.
 */
export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Disable smooth scroll if user requests reduced motion
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // Attach to global window object for any external components that need programmatic scroll
    (window as any).__lenis = lenis;

    // Auto-resize on content changes so scroll limit is never outdated
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).__lenis;
    };
  }, [prefersReduced]);

  // Route change scroll reset and bound recalculation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.resize();
      const t1 = setTimeout(() => lenisRef.current?.resize(), 100);
      const t2 = setTimeout(() => lenisRef.current?.resize(), 400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  return <>{children}</>;
};
