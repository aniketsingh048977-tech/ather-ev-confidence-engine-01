/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';

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

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 bg-[#00E08A] text-[#0B0D10] hover:bg-[#1ae596] hover:shadow-[0_0_28px_rgba(0,224,138,0.45)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none whitespace-nowrap cursor-pointer ${sizeClasses} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={baseClasses}>
        <span>{children}</span>
        {icon && <span className="inline-flex items-center">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={baseClasses} disabled={disabled} {...rest}>
      <span>{children}</span>
      {icon && <span className="inline-flex items-center">{icon}</span>}
    </button>
  );
};
