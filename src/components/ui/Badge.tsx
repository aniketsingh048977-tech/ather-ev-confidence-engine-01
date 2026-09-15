/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type BadgeVariant = 'ACADEMIC PROTOTYPE' | 'DEMO DATA' | 'VERIFIED' | 'UNVERIFIED';

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'ACADEMIC PROTOTYPE',
  label,
  className = '',
}) => {
  const displayText = label || variant;

  const variantStyles: Record<BadgeVariant, string> = {
    'ACADEMIC PROTOTYPE': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    'DEMO DATA': 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    'VERIFIED': 'border-[#00E08A]/30 bg-[#00E08A]/10 text-[#00E08A]',
    'UNVERIFIED': 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase border whitespace-nowrap select-none ${variantStyles[variant] || 'border-white/10 bg-white/5 text-[#9AA3AF]'} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 opacity-80 current-color bg-current" />
      {displayText}
    </span>
  );
};
