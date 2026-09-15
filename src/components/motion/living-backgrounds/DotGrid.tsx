/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface DotGridProps {
  className?: string;
  dotSpacing?: number;
  baseRadius?: number;
  highlightRadius?: number;
  proximityThreshold?: number;
}

/**
 * DotGrid
 * Subtle interactive dot pattern where dots near the cursor brighten and grow.
 * High-performance 60fps canvas implementation that adapts to retina screens and touch inputs.
 */
export const DotGrid: React.FC<DotGridProps> = ({
  className = '',
  dotSpacing = 32,
  baseRadius = 1.2,
  highlightRadius = 3,
  proximityThreshold = 140,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mousePosRef.current;
      const cols = Math.floor(width / dotSpacing);
      const rows = Math.floor(height / dotSpacing);
      const offsetX = (width - cols * dotSpacing) / 2;
      const offsetY = (height - rows * dotSpacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * dotSpacing;
          const y = offsetY + j * dotSpacing;

          let radius = baseRadius;
          let alpha = 0.12;
          let isGreen = false;

          if (mouse && !prefersReduced && !isTouchDevice) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.hypot(dx, dy);

            if (dist < proximityThreshold) {
              const factor = 1 - dist / proximityThreshold; // 0 to 1
              radius = baseRadius + (highlightRadius - baseRadius) * factor;
              alpha = 0.12 + 0.65 * factor;
              if (factor > 0.25) {
                isGreen = true;
              }
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          if (isGreen) {
            ctx.fillStyle = `rgba(0, 224, 138, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          }
          ctx.fill();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReduced || isTouchDevice) return;
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(() => {
          draw();
          animFrameRef.current = null;
        });
      }
    };

    const handleMouseLeave = () => {
      mousePosRef.current = null;
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(() => {
          draw();
          animFrameRef.current = null;
        });
      }
    };

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }
    resize();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [dotSpacing, baseRadius, highlightRadius, proximityThreshold, prefersReduced, isTouchDevice]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
