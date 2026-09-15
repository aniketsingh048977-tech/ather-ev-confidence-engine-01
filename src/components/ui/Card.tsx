/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = true,
  ...rest
}) => {
  return (
    <div
      className={`bg-[#16191E] border border-white/[0.06] rounded-[20px] p-6 sm:p-8 transition-all duration-300 ${
        interactive
          ? 'hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
