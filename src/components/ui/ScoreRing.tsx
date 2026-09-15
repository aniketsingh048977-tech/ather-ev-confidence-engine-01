/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score = 0,
  size = 140,
  strokeWidth = 10,
  label = 'Match Score',
  sublabel,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();
  const clampedScore = Math.min(100, Math.max(0, score));
  const [displayNumber, setDisplayNumber] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  useEffect(() => {
    if (prefersReduced) {
      setDisplayNumber(clampedScore);
      return;
    }

    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(eased * clampedScore);
      setDisplayNumber(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      }
    };

    const animId = requestAnimationFrame(animateNumber);
    return () => cancelAnimationFrame(animId);
  }, [clampedScore, prefersReduced]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Track background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Animated fill ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#00E08A"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: prefersReduced ? 0 : 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="font-heading font-semibold tabular-nums text-4xl sm:text-5xl text-[#F5F7FA] tracking-tight">
            {displayNumber}
            <span className="text-xl text-[#00E08A] font-normal">%</span>
          </span>
          {label && (
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#9AA3AF] mt-0.5 font-medium">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <span className="text-xs text-[#9AA3AF] mt-2.5 text-center max-w-[180px]">
          {sublabel}
        </span>
      )}
    </div>
  );
};
