/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Navigation,
  ShieldCheck,
  Zap,
  BatteryCharging,
  ArrowRight,
  TrendingDown,
  Car,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { CommuteTwinSimulator } from '../components/telemetry/CommuteTwinSimulator';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';

export const CommuteTwinPage: React.FC = () => {
  const { logEvent } = useAppState();
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    if (!hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('page_view', '/commute-twin', { page: 'CommuteTwin', title: 'Route Telemetry Simulator' });
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
        className="absolute top-1/2 left-1/6 w-[550px] h-[450px] pointer-events-none rounded-full blur-[140px] opacity-15 bg-blue-500/20"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 relative z-10">
        
        {/* Page Header */}
        <MotionSection alternate={false} className="!py-0 !px-0 mb-8 sm:mb-12">
          <MotionItem>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00E08A] bg-[#00E08A]/10 border border-[#00E08A]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Navigation size={12} className="text-[#00E08A]" />
                  <span>Commute Twin™ Telemetry</span>
                </span>
                <span className="text-[11px] font-mono text-[#F5F7FA] bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                  Real Indian Road Physics
                </span>
                <Badge variant="ACADEMIC PROTOTYPE" label="FLEET TELEMETRY BENCHMARK" />
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F7FA] leading-[1.1] mb-4">
                Will Ather Handle Your Exact Daily Route? <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E08A] via-[#5DFDCB] to-emerald-400">
                  Run the Live Telemetry Simulation.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed max-w-2xl">
                Benchmarked on over 1.2 billion kilometres of real-world Indian road telemetry.
                Test flyovers, Silk Board crawl, monsoon conditions, and regenerative energy recovery before stepping into a showroom.
              </p>
            </div>
          </MotionItem>
        </MotionSection>

        {/* Primary Commute Twin Simulator Engine */}
        <div className="relative z-20 mb-16 sm:mb-20">
          <CommuteTwinSimulator />
        </div>

        {/* Technical Explainer: Why TrueRange™ Never Lies */}
        <section className="mt-16 sm:mt-20 pt-12 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-2">
              Engineering Transparency
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Why Indian EV Buyers Distrust Range (And Why Ather is Different)
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA3AF] mt-2">
              ARAI certification tests vehicles in laboratory conditions at 30 km/h with zero wind, zero flyovers, and zero pillion passengers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#111418] border border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center font-bold mb-4">
                ❌
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">
                The Generic EV "Lab Trap"
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                Most electric scooters advertise 150 km range, but when you climb a steep flyover with a backpack or get stuck in 40°C heat,
                the battery drops from 40% to 10% in two kilometres, stranding you in traffic.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111418] border border-[#00E08A]/30">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-bold mb-4">
                ⚡
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">
                Ather TrueRange™ Algorithm
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                Ather’s onboard BMS calculates real-world internal resistance, ambient motor temperature, and historical throttle cadence.
                When the dashboard reads 65 km, you are guaranteed 65 km on actual asphalt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111418] border border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center font-bold mb-4">
                🔄
              </div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">
                Magic Twist™ Energy Recapture
              </h3>
              <p className="text-xs text-[#9AA3AF] leading-relaxed">
                Twisting the throttle backward engages progressive regenerative braking. On a typical 25 km commute with 14 traffic lights,
                you recover up to 15% kinetic energy directly back into the battery cells.
              </p>
            </div>
          </div>
        </section>

        {/* Direct Call to Action */}
        <div className="mt-16 sm:mt-20 p-8 rounded-3xl bg-gradient-to-r from-[#00E08A]/15 via-[#00E08A]/5 to-transparent border border-[#00E08A]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-1">
              Verify it on your actual road
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Schedule a VIP Doorstep Test Ride Along Your Commute
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA3AF] mt-1">
              Our specialist brings the Ather Rizta or 450X directly to your residence so you can ride your exact office route.
            </p>
          </div>

          <Link
            to="/test-ride"
            className="py-3 px-6 rounded-full bg-[#00E08A] hover:bg-[#00c97b] text-[#0B0D10] font-heading font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,224,138,0.3)] transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Book Commute Test Ride</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};
