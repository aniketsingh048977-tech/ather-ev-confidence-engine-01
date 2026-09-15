/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtext?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  lightMode?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtext,
  align = 'left',
  className = '',
  lightMode = false,
}) => {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  return (
    <div className={`flex flex-col max-w-3xl ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-tight ${
          lightMode ? 'text-[#0B0D10]' : 'text-[#F5F7FA]'
        }`}
      >
        {title}
      </h2>
      {subtext && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed ${
            lightMode ? 'text-[#4A5568]' : 'text-[#9AA3AF]'
          }`}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};
