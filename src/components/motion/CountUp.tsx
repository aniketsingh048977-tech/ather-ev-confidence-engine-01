/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface CountUpProps {
  value: number;
  duration?: number; // in seconds, default 1.5s
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  id?: string;
}

/**
 * CountUp
 * Numbers count up when they enter the viewport.
 * Uses requestAnimationFrame and easeOutExpo for high-end automotive instrument feel.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1.6,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  id,
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }

    if (!isInView) return;

    let startTime: number | null = null;
    let animFrame: number;

    const startVal = 0;
    const endVal = value;
    const durMs = duration * 1000;

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durMs, 1);

      // Ease out expo: 1 - 2^(-10 * progress)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    animFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animFrame);
  }, [isInView, value, duration, prefersReduced]);

  const formattedNumber = displayValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} id={id} className={`tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
