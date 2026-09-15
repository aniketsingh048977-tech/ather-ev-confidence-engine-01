/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Compass, Home, ShieldAlert, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-16 px-4 sm:px-6">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] pointer-events-none rounded-full blur-[160px] opacity-15 bg-[#00E08A]/25"
        aria-hidden="true"
      />

      <div className="max-w-xl w-full mx-auto text-center relative z-10 space-y-6">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#00E08A]">
          <span className="w-2 h-2 rounded-full bg-[#00E08A] animate-ping" />
          <span>404 • ROUTE NOT FOUND</span>
        </div>

        {/* Big Code Display */}
        <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
            Out of Signal Range
          </h2>
          <p className="text-sm text-[#9AA3AF] max-w-md mx-auto leading-relaxed">
            The path you are trying to reach doesn't exist on this grid or has been relocated.
            Navigate back to the main journey or take the 2-minute confidence quiz.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <PrimaryButton to="/" icon={<Home size={16} />}>
            Back to Home
          </PrimaryButton>
          <SecondaryButton to="/quiz" icon={<Sparkles size={16} />}>
            Take Confidence Quiz
          </SecondaryButton>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex items-center justify-center gap-4 text-xs text-[#9AA3AF]">
          <Link to="/admin" className="hover:text-[#00E08A] transition-colors">
            Command Center
          </Link>
          <span>&bull;</span>
          <Link to="/how-it-works" className="hover:text-[#00E08A] transition-colors">
            How It Works
          </Link>
          <span>&bull;</span>
          <Link to="/concierge" className="hover:text-[#00E08A] transition-colors">
            AI Concierge
          </Link>
        </div>
      </div>
    </div>
  );
};
