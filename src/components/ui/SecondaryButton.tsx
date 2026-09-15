/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 bg-transparent text-[#F5F7FA] border border-white/20 hover:border-white/60 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D10] active:scale-[0.97] active:bg-white/[0.1] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap cursor-pointer ${sizeClasses} ${className}`;

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
