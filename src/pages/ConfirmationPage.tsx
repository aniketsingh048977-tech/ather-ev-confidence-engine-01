/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight,
  Home,
  UserCheck,
  Phone,
  Mail,
  Compass,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { useAppState } from '../context/AppContext';
import { usePresentation } from '../context/PresentationContext';
import { TestRideBooking } from '../types';

export const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { latestTestRide, testRides, currentCustomer, logEvent } = useAppState();
  const {
    isActive: isPresentationActive,
    currentStep: presentationStep,
    nextStep: presentationNextStep,
  } = usePresentation();

  // Retrieve booking either from router navigation state, latestTestRide, or first in testRides
  const booking: Partial<TestRideBooking> =
    location.state?.booking ||
    latestTestRide ||
    testRides[0] || {
      customerName: currentCustomer?.name || 'Aarav Sharma',
      phone: currentCustomer?.phone || '+91 98450 12345',
      email: currentCustomer?.email || 'aarav.sharma@example.com',
      city: 'Bengaluru',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTimeSlot: '11:30 AM - 01:00 PM',
      modelInterest: 'Ather 450X Series [VERIFIED ATHER PRODUCT DATA REQUIRED]',
      experienceCenter: 'Ather Space, Indiranagar [VERIFIED LOCATION DATA REQUIRED]',
      bookingRef: 'ATH-839210',
      primaryConcern: 'Range & TrueRange Confidence',
    };

  const bookingRef =
    location.state?.bookingRef ||
    booking.bookingRef ||
    latestTestRide?.bookingRef ||
    'ATH-839210';

  // Log confirmation view
  useEffect(() => {
    logEvent('confirmation_viewed', '/confirmation', {
      bookingRef,
      city: booking.city,
    });
  }, [booking.city, bookingRef, logEvent]);

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] min-h-[calc(100vh-80px)] flex flex-col justify-center py-10 sm:py-16">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[550px] pointer-events-none rounded-full blur-[170px] opacity-20 bg-[#00E08A]/30"
        aria-hidden="true"
      />

      <div className="max-w-[780px] w-full mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* ANIMATED GREEN CHECK DRAWING ITSELF */}
        <div className="relative mb-6 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#00E08A]/10 border border-[#00E08A]/30 flex items-center justify-center shadow-[0_0_50px_rgba(0,224,138,0.25)]"
          >
            <svg
              className="w-12 h-12 sm:w-14 sm:h-14 text-[#00E08A]"
              viewBox="0 0 52 52"
              fill="none"
            >
              {/* Outer drawing circle */}
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
              {/* Checkmark drawing */}
              <motion.path
                d="M15 27L22.5 34.5L37 19"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
              />
            </svg>
          </motion.div>
        </div>

        {/* HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-2 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="ACADEMIC PROTOTYPE" label="DEMO BOOKING CONFIRMATION" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA]">
            Your test ride request is in.
          </h1>

          <p className="font-mono text-sm sm:text-base text-[#00E08A] tracking-wide font-semibold">
            Demo Booking Reference: {bookingRef}
          </p>

          <p className="text-xs sm:text-sm text-[#9AA3AF] max-w-md mx-auto">
            An Ather Experience Specialist is preparing your vehicle. No spam, no aggressive sales
            pitches—just a clear, guided road trial.
          </p>
        </motion.div>

        {/* SUMMARY CARD OF BOOKING DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="w-full bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-8"
        >
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] block">
                Digital Pass
              </span>
              <h2 className="font-heading text-base font-bold text-[#F5F7FA]">
                Reservation Summary
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {booking.rideType === 'Doorstep VIP' && (
                <span className="text-[11px] font-mono font-bold text-[#00E08A] bg-[#00E08A]/15 border border-[#00E08A]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Home size={11} /> VIP Doorstep
                </span>
              )}
              <span className="text-xs font-mono text-[#00E08A] bg-[#00E08A]/10 border border-[#00E08A]/30 px-3 py-1 rounded-full">
                Status: Scheduled
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer & Phone */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[#9AA3AF] block mb-1">Rider Details</span>
              <span className="font-semibold text-sm text-[#F5F7FA] block">
                {booking.customerName}
              </span>
              <span className="text-[11px] text-[#9AA3AF] font-mono mt-0.5 block">
                {booking.phone} {booking.email ? `· ${booking.email}` : ''}
              </span>
            </div>

            {/* Date & Slot */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[#9AA3AF] block mb-1">Scheduled Window</span>
              <span className="font-semibold text-sm text-[#00E08A] flex items-center gap-1.5">
                <Calendar size={13} /> {booking.preferredDate}
              </span>
              <span className="text-[11px] text-[#9AA3AF] flex items-center gap-1.5 mt-0.5">
                <Clock size={12} /> {booking.preferredTimeSlot}
              </span>
            </div>

            {/* City & Experience Center / Doorstep Address */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[#9AA3AF] block mb-1">
                {booking.rideType === 'Doorstep VIP' ? 'VIP Delivery Destination' : 'Location / Space'}
              </span>
              <span className="font-semibold text-sm text-[#F5F7FA] flex items-center gap-1.5">
                <MapPin size={13} className="text-[#00E08A]" /> {booking.city}
              </span>
              <span className="text-[11px] text-[#9AA3AF] mt-0.5 block truncate">
                {booking.experienceCenter}
              </span>
            </div>

            {/* Model & Focus */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[#9AA3AF] block mb-1">Allocated Model & Concern</span>
              <span className="font-semibold text-sm text-[#F5F7FA] block truncate">
                {booking.modelInterest}
              </span>
              <span className="text-[11px] text-[#00E08A] mt-0.5 block truncate">
                Focus: {booking.primaryConcern || 'TrueRange & City Comfort'}
              </span>
            </div>
          </div>

          {/* Guaranteed 7-Day Exchange Valuation Certificate (If customer added an exchange) */}
          {booking.exchangeVehicle && (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-[#00E08A]/15 via-[#00E08A]/5 to-transparent border border-[#00E08A]/40 text-xs">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#00E08A]/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00E08A]/20 flex items-center justify-center text-[#00E08A]">
                    <RefreshCw size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#00E08A] block">
                      Ather Switch & Save Certificate
                    </span>
                    <h3 className="font-heading font-bold text-sm text-white">
                      7-Day Guaranteed Trade-In Valuation Locked
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#00E08A] bg-[#00E08A]/20 border border-[#00E08A]/40 px-2.5 py-1 rounded-full shrink-0">
                  Ref: TR-{booking.bookingRef}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-[#9AA3AF] block">Current Scooter</span>
                  <span className="font-semibold text-white truncate block">
                    {booking.exchangeVehicle.modelName}
                  </span>
                  <span className="text-[10px] text-[#9AA3AF]">
                    Year: {booking.exchangeVehicle.year} · {booking.exchangeVehicle.condition}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-[#9AA3AF] block">Base Trade-in Value</span>
                  <span className="font-semibold text-white block">
                    ₹{booking.exchangeVehicle.tradeInCredit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#9AA3AF]">Doorstep Instant Appraisal</span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-[#9AA3AF] block">Ather Switch Bonus</span>
                  <span className="font-semibold text-[#00E08A] block">
                    +₹{(booking.exchangeVehicle.switchBonus || 10000).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#00E08A]">Limited-time Academic Offer</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#00E08A]/20 border border-[#00E08A]/40">
                  <span className="text-[10px] text-[#00E08A] font-bold uppercase tracking-wider block">
                    Total Upfront Offset
                  </span>
                  <span className="font-heading font-extrabold text-base text-white block">
                    ₹{(booking.exchangeVehicle.tradeInCredit + (booking.exchangeVehicle.switchBonus || 10000)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-white/80">Deducted from Ather on-road price</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-[#9AA3AF]">
                <div className="flex items-center gap-1.5 text-[#00E08A]">
                  <CheckCircle2 size={13} />
                  <span>Our specialist will inspect and confirm this valuation during your test ride.</span>
                </div>
              </div>
            </div>
          )}

          {/* Checklist reminder */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] block mb-2">
              What to Bring on Test Ride Day:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-[#F5F7FA]">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <ShieldCheck size={14} className="text-[#00E08A] shrink-0" />
                <span>Original Driving License</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <Check size={14} className="text-[#00E08A] shrink-0" />
                <span>Closed-toe shoes</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <Check size={14} className="text-[#00E08A] shrink-0" />
                <span>Sanitized helmet (or bring own)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BUTTONS: Back to Home + I've completed my ride */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center"
        >
          <SecondaryButton
            to="/"
            size="lg"
            className="w-full sm:w-auto justify-center text-xs sm:text-sm font-semibold !px-6"
            icon={<Home size={15} />}
          >
            Back to Home
          </SecondaryButton>

          {isPresentationActive && presentationStep === 10 ? (
            <PrimaryButton
              onClick={presentationNextStep}
              size="lg"
              className="w-full sm:w-auto justify-center text-xs sm:text-sm font-semibold !px-6 shadow-[0_0_20px_rgba(0,224,138,0.35)]"
              icon={<ArrowRight size={15} />}
            >
              Step 11: Open Admin Command Center →
            </PrimaryButton>
          ) : (
            <PrimaryButton
              to="/post-ride"
              size="lg"
              className="w-full sm:w-auto justify-center text-xs sm:text-sm font-semibold !px-6"
              icon={<ArrowRight size={15} />}
            >
              I've completed my ride
            </PrimaryButton>
          )}
        </motion.div>
      </div>
    </div>
  );
};
