/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Sparkles, ArrowRight, X, ShieldCheck, Home } from 'lucide-react';
import { SwitchModal } from './SwitchModal';

export const FloatingConversionBar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hide on quiz, admin, switch, and confirmation pages
  const isHiddenPage =
    location.pathname.startsWith('/quiz') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/confirmation') ||
    location.pathname.startsWith('/switch') ||
    location.pathname.startsWith('/exchange');

  // Trigger floating bar visibility after small scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isHiddenPage || isDismissed || !isScrolled) {
    return (
      <SwitchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    );
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[700px] px-3 pointer-events-none">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="pointer-events-auto bg-[#0E1217]/95 backdrop-blur-xl border border-[#00E08A]/35 shadow-[0_12px_40px_rgba(0,0,0,0.7)] rounded-full py-2.5 px-4 sm:px-5 flex items-center justify-between gap-3 text-white"
        >
          {/* Left: Ticker & Bonus */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#00E08A]/15 border border-[#00E08A]/40 flex items-center justify-center text-[#00E08A] shrink-0">
              <RefreshCw size={15} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-heading font-bold text-white truncate">
                  Switch from Petrol to Ather
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold bg-[#00E08A]/20 text-[#00E08A] px-2 py-0.5 rounded-full border border-[#00E08A]/30">
                  +₹10,000 Bonus
                </span>
              </div>
              <p className="text-[11px] text-[#9AA3AF] truncate hidden sm:block">
                Exchange your Activa, Jupiter, or Access • Doorstep VIP test ride
              </p>
            </div>
          </div>

          {/* Right: CTA & Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/switch"
              className="py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-[#00E08A] hover:bg-[#00c97b] text-[#0B0D10] font-heading font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_2px_15px_rgba(0,224,138,0.4)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Check Trade-in</span>
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 text-[#9AA3AF] hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss exchange bar"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Switch Modal */}
      <SwitchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
