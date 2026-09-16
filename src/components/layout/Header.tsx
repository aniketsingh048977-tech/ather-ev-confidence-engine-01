/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ShieldAlert, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { PrimaryButton } from '../ui/PrimaryButton';
import { AuroraBackground } from '../motion/living-backgrounds/AuroraBackground';
import { SwitchModal } from '../conversion/SwitchModal';

const NAV_LINKS = [
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Savings', path: '/savings' },
  { label: 'Charging', path: '/charging' },
  { label: 'AI Concierge', path: '/concierge' },
  { label: 'Test Ride', path: '/test-ride' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-[16px] bg-[#0B0D10]/75 border-b border-white/[0.06] transition-colors duration-200 overflow-hidden">
      {/* Faint Aurora Background behind header glass */}
      <AuroraBackground faint isMobileCompact className="opacity-40" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Left: Brand Identity & Academic Prototype Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00E08A] font-heading font-bold text-sm group-hover:border-[#00E08A]/40 transition-colors">
              Æ
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-semibold text-base tracking-tight text-[#F5F7FA]">
                  ATHER
                </span>
                <span className="text-xs text-[#9AA3AF] font-light hidden sm:inline">
                  CONFIDENCE ENGINE
                </span>
              </div>
            </div>
          </Link>

          {/* Academic Prototype Pill Badge */}
          <div className="hidden sm:block ml-2">
            <Badge variant="ACADEMIC PROTOTYPE" />
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                  isActive
                    ? 'text-[#00E08A] bg-white/[0.04]'
                    : 'text-[#9AA3AF] hover:text-[#F5F7FA] hover:bg-white/[0.02]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Switch CTA & Admin Link */}
        <div className="hidden md:flex items-center gap-3">
          {/* Conversion Booster: Exchange & Switch Page Link */}
          <Link
            to="/switch"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E08A]/10 border border-[#00E08A]/35 text-[#00E08A] hover:bg-[#00E08A]/20 text-xs font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(0,224,138,0.15)] cursor-pointer"
          >
            <RefreshCw size={12} className="text-[#00E08A]" />
            <span>Switch & Save (+₹10k)</span>
          </Link>

          <Link
            to="/admin"
            className={`text-xs uppercase tracking-wider font-semibold px-2.5 py-1.5 rounded transition-colors ${
              location.pathname.startsWith('/admin')
                ? 'text-[#00E08A] bg-[#00E08A]/10'
                : 'text-[#9AA3AF] hover:text-white'
            }`}
          >
            Admin
          </Link>

          <PrimaryButton to="/quiz" size="sm">
            Find My Match
          </PrimaryButton>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setSwitchModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00E08A]/10 border border-[#00E08A]/30 text-[#00E08A] text-[11px] font-bold"
          >
            <RefreshCw size={11} />
            <span>Switch (+₹10k)</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-[#9AA3AF] hover:text-white hover:bg-white/[0.05] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0B0D10]/95 backdrop-blur-2xl px-5 py-6 flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <Badge variant="ACADEMIC PROTOTYPE" />
            <span className="text-[11px] text-[#9AA3AF]">Phase 1 Design System</span>
          </div>

          {/* Mobile Switch Banner */}
          <Link
            to="/switch"
            onClick={closeMenu}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-[#00E08A]/15 to-transparent border border-[#00E08A]/30 flex items-center justify-between text-left text-white cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-[#00E08A] flex items-center gap-1">
                <RefreshCw size={12} /> Exchange Petrol Scooter
              </div>
              <div className="text-[11px] text-[#9AA3AF]">Get up to ₹55,000 + ₹10,000 bonus</div>
            </div>
            <span className="text-xs font-bold text-[#00E08A] bg-[#00E08A]/10 px-2.5 py-1 rounded-md">
              Evaluate
            </span>
          </Link>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'text-[#00E08A] bg-white/[0.06]'
                      : 'text-[#F5F7FA] hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/admin"
              onClick={closeMenu}
              className="px-4 py-3 text-base font-medium rounded-xl text-[#9AA3AF] hover:text-white hover:bg-white/[0.04]"
            >
              Admin Portal
            </Link>
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <PrimaryButton to="/quiz" onClick={closeMenu} className="w-full">
              Find My Match
            </PrimaryButton>
          </div>
        </div>
      )}
    </header>

    {/* Switch & Save Modal */}
    <SwitchModal isOpen={switchModalOpen} onClose={() => setSwitchModalOpen(false)} />
  </>
);
};
