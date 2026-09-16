/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Fuel,
  ArrowRight,
  ShieldCheck,
  Coins,
  Sparkles,
  Plane,
  Home,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PetrolToSipTimeMachine } from '../components/wealth/PetrolToSipTimeMachine';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';

export const WealthPage: React.FC = () => {
  const { logEvent, quizAnswers } = useAppState();
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    if (!hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('page_view', '/wealth', { page: 'WealthCompounding', title: 'Petrol-to-SIP Wealth Engine' });
    }
  }, [logEvent]);

  return (
    <div className="w-full relative bg-[#0B0D10] text-[#F5F7FA] pb-24">
      {/* Background ambient orbs */}
      <div
        className="absolute top-10 right-1/4 w-[650px] h-[500px] pointer-events-none rounded-full blur-[160px] opacity-25 bg-[#00E08A]/25"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/6 w-[550px] h-[450px] pointer-events-none rounded-full blur-[140px] opacity-15 bg-emerald-500/20"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 relative z-10">
        
        {/* Page Header */}
        <MotionSection alternate={false} className="!py-0 !px-0 mb-8 sm:mb-12">
          <MotionItem>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00E08A] bg-[#00E08A]/10 border border-[#00E08A]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-[#00E08A]" />
                  <span>Financial Engineering</span>
                </span>
                <span className="text-[11px] font-mono text-[#F5F7FA] bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                  Nifty Index Compounding Model
                </span>
                <Badge variant="ACADEMIC PROTOTYPE" label="WEALTH PROJECTION ENGINE" />
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F7FA] leading-[1.1] mb-4">
                What If Your Scooter Paid For <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E08A] via-[#5DFDCB] to-emerald-400">
                  Your Next Real Estate Down Payment?
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed max-w-2xl">
                Every rupee pumped into a petrol tank is burned to ashes at 0% return.
                By switching to Ather and diverting that exact fuel burn into a disciplined equity index fund,
                you transform a routine daily commute into up to ₹7.5 Lakhs in compounded personal net worth.
              </p>
            </div>
          </MotionItem>
        </MotionSection>

        {/* Primary Petrol-to-SIP Time Machine Component */}
        <div className="relative z-20 mb-16 sm:mb-20">
          <PetrolToSipTimeMachine initialMonthlyFuel={quizAnswers.monthlyFuelExpense} />
        </div>

        {/* The 3 Core Laws of Commute Wealth */}
        <section className="mt-16 sm:mt-20 pt-12 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-2">
              Behavioral Finance
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              The Three Financial Truths Petrol Companies Hide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#111418] border border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">
                The "Zero Free-Cash-Flow" Trap
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                When you buy an ICE petrol scooter for ₹95,000, you are signing up for a compulsory ₹3,500/month recurring lifetime subscription
                to oil refineries. Over 8 years, you spend more than 3x the scooter's purchase price just feeding it fuel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111418] border border-[#00E08A]/30">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">
                The Month 30 Free-Scooter Threshold
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                By charging at home for ₹0.22/km instead of burning ₹2.60/km in petrol, your cumulative fuel savings equal the full
                ₹1.45 Lakh on-road purchase price of an Ather Rizta by month 30. From that point onward, the vehicle is literally 100% free.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111418] border border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">
                Compounding Over Time
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                ₹3,500 invested monthly in a standard Nifty 50 Index Mutual Fund at 12% CAGR yields over ₹2.8 Lakhs in 5 years,
                and ₹7.5+ Lakhs in 10 years. Your daily office ride literally funds your financial independence.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-20 p-8 rounded-3xl bg-gradient-to-r from-[#00E08A]/15 via-[#00E08A]/5 to-transparent border border-[#00E08A]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-1">
              Start building wealth on your next ride
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Experience the Instant Torque of Ather
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA3AF] mt-1">
              Book a hassle-free 15-minute test ride at home or your nearest Ather Space showroom.
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
