/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../motion/MagneticButton';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  to,
  children,
  icon,
  className = '',
  size = 'md',
  disabled,
  ...rest
}) => {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }[size];

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 bg-[#00E08A] text-[#0B0D10] hover:bg-[#1ae596] hover:shadow-[0_0_28px_rgba(0,224,138,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E08A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D10] active:scale-[0.97] active:bg-[#00c77a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 whitespace-nowrap cursor-pointer ${sizeClasses} ${className}`;

  if (to && !disabled) {
    return (
      <MagneticButton enabled={!disabled}>
        <Link to={to} className={baseClasses}>
          <span>{children}</span>
          {icon && <span className="inline-flex items-center">{icon}</span>}
        </Link>
      </MagneticButton>
    );
  }

  return (
    <MagneticButton enabled={!disabled}>
      <button className={baseClasses} disabled={disabled} {...rest}>
        <span>{children}</span>
        {icon && <span className="inline-flex items-center">{icon}</span>}
      </button>
    </MagneticButton>
  );
};

