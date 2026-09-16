/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  RefreshCw,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  Home,
  HelpCircle,
  TrendingDown,
  Car,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { AtherSwitchEngine } from '../components/conversion/AtherSwitchEngine';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';

export const SwitchPage: React.FC = () => {
  const { logEvent } = useAppState();
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    if (!hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('page_view', '/switch', { page: 'SwitchAndSave', title: 'Petrol to Electric Exchange Engine' });
    }
  }, [logEvent]);

  return (
    <div className="w-full relative bg-[#0B0D10] text-[#F5F7FA] pb-24">
      {/* Ambient background glow */}
      <div
        className="absolute top-10 right-1/4 w-[650px] h-[500px] pointer-events-none rounded-full blur-[160px] opacity-25 bg-[#00E08A]/25"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/6 w-[500px] h-[450px] pointer-events-none rounded-full blur-[140px] opacity-15 bg-blue-500/20"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 relative z-10">
        
        {/* Page Header */}
        <MotionSection alternate={false} className="!py-0 !px-0 mb-8 sm:mb-12">
          <MotionItem>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00E08A] bg-[#00E08A]/10 border border-[#00E08A]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Switch & Save Program</span>
                </span>
                <span className="text-[11px] font-mono text-[#F5F7FA] bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                  +₹10,000 Switch Bonus Included
                </span>
                <Badge variant="ACADEMIC PROTOTYPE" label="EXCHANGE VALUATION DEMO" />
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F7FA] leading-[1.1] mb-4">
                Trade in Your Petrol Scooter. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E08A] via-[#5DFDCB] to-emerald-400">
                  Drive Home an Ather.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed max-w-2xl">
                Get an instant transparent resale appraisal on your Honda Activa, TVS Jupiter, Suzuki Access, or any ICE scooter.
                Lock in your 7-day guaranteed exchange value with zero doorstep inspection hassle.
              </p>
            </div>
          </MotionItem>
        </MotionSection>

        {/* Primary Switch & Save Engine Component */}
        <div className="relative z-20 mb-16 sm:mb-20">
          <AtherSwitchEngine initialDailyKm={25} />
        </div>

        {/* 4-Step Frictionless Exchange Process */}
        <section className="mt-16 sm:mt-20 pt-12 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-2">
              The 4-Step Process
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              How Ather Exchange Works
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA3AF] mt-2">
              No dealers, no haggling, and no marketplace scams. Pure convenience right at your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-[#111418] border border-white/[0.08] relative">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-mono font-bold text-base mb-4">
                01
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-1.5">
                Instant Online Estimate
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                Select your scooter model, manufacturing year, and condition above to receive an accurate appraisal with ₹10,000 bonus.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111418] border border-white/[0.08] relative">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-mono font-bold text-base mb-4">
                02
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-1.5">
                Doorstep VIP Inspection
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                Our specialist visits your home or office with the test ride Ather and performs a 15-minute verification of your old vehicle.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111418] border border-white/[0.08] relative">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-mono font-bold text-base mb-4">
                03
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-1.5">
                Direct Price Deduction
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                Your agreed trade-in value is deducted directly as down payment from your new Ather Rizta or 450X on-road invoice.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111418] border border-white/[0.08] relative">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-mono font-bold text-base mb-4">
                04
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-1.5">
                RC Transfer Assistance
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                We handle authorized documentation and complete the RTO ownership transfer so you remain 100% legally indemnified.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mt-16 sm:mt-20 pt-12 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-2">
              Common Questions
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Exchange & Trade-in FAQs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-xl bg-[#111418] border border-white/[0.06]">
              <div className="flex items-start gap-3">
                <HelpCircle size={18} className="text-[#00E08A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-sm font-semibold text-white mb-1">
                    What documents do I need for exchange?
                  </h4>
                  <p className="text-xs text-[#9AA3AF] leading-relaxed">
                    Original Registration Certificate (RC), valid vehicle insurance copy, Pollution Under Control (PUC) certificate, and owner KYC (Aadhaar/PAN).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#111418] border border-white/[0.06]">
              <div className="flex items-start gap-3">
                <HelpCircle size={18} className="text-[#00E08A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-sm font-semibold text-white mb-1">
                    Can I exchange a scooter with an active hypothecation loan?
                  </h4>
                  <p className="text-xs text-[#9AA3AF] leading-relaxed">
                    Yes. We assist in closing existing bank hypothecation by settling the foreclosure balance directly against the trade-in value.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#111418] border border-white/[0.06]">
              <div className="flex items-start gap-3">
                <HelpCircle size={18} className="text-[#00E08A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-sm font-semibold text-white mb-1">
                    How long is the online appraisal price locked?
                  </h4>
                  <p className="text-xs text-[#9AA3AF] leading-relaxed">
                    Every appraisal generated through the Ather Confidence Engine comes with a 7-day price guarantee from the date of quote generation.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#111418] border border-white/[0.06]">
              <div className="flex items-start gap-3">
                <HelpCircle size={18} className="text-[#00E08A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-sm font-semibold text-white mb-1">
                    Can I schedule the test ride at my home?
                  </h4>
                  <p className="text-xs text-[#9AA3AF] leading-relaxed">
                    Yes! Select "VIP Doorstep Test Ride" during booking, and our Ather Product Specialist will bring the vehicle directly to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <div className="mt-16 sm:mt-20 p-8 rounded-3xl bg-gradient-to-r from-[#00E08A]/15 via-[#00E08A]/5 to-transparent border border-[#00E08A]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-1">
              Ready to feel the difference?
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Experience the Ather Warp Acceleration Today
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA3AF] mt-1">
              Free VIP Doorstep Test Ride with instant exchange appraisal at your convenience.
            </p>
          </div>

          <Link
            to="/test-ride"
            className="py-3 px-6 rounded-full bg-[#00E08A] hover:bg-[#00c97b] text-[#0B0D10] font-heading font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,224,138,0.3)] transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Book VIP Test Ride</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};
