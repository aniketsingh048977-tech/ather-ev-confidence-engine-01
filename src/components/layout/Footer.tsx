/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B0D10] border-t border-white/[0.06] mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="font-heading font-semibold text-lg text-[#F5F7FA]">
                Ather EV Confidence Engine
              </span>
              <Badge variant="ACADEMIC PROTOTYPE" />
            </div>
            <p className="text-sm text-[#9AA3AF] italic">
              "From 'Should I buy an EV?' to 'I should test this.'"
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#9AA3AF]">
            <Link to="/how-it-works" className="hover:text-[#F5F7FA] transition-colors">
              How It Works
            </Link>
            <Link to="/savings" className="hover:text-[#F5F7FA] transition-colors">
              Savings
            </Link>
            <Link to="/charging" className="hover:text-[#F5F7FA] transition-colors">
              Charging
            </Link>
            <Link to="/concierge" className="hover:text-[#F5F7FA] transition-colors">
              AI Concierge
            </Link>
            <Link to="/test-ride" className="hover:text-[#F5F7FA] transition-colors">
              Test Ride
            </Link>
            <Link to="/admin" className="hover:text-[#F5F7FA] transition-colors">
              Admin
            </Link>
          </div>
        </div>

        {/* Disclaimer section */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#9AA3AF]">
          <p className="max-w-2xl leading-relaxed">
            Academic prototype. Not affiliated with Ather Energy. Built strictly for an MBA digital marketing assessment.
            Where product data is referenced: <span className="text-white/60">[VERIFIED ATHER PRODUCT DATA REQUIRED]</span>.
          </p>
          <div className="flex items-center gap-4 text-[#9AA3AF]/80">
            <span>Phase 1: Foundation & Design System</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
