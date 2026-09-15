/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  ArrowRight,
  HelpCircle,
  Compass,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAppState } from '../context/AppContext';
import { City, PrimaryConcern, TestRideBooking } from '../types';
import { usePresentation } from '../context/PresentationContext';
import { RIYA_DESAI_BOOKING } from '../data/demoCustomerRiya';

const CITIES: City[] = ['Bengaluru', 'Pune', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'];

const TIME_SLOTS = [
  '10:00 AM - 11:30 AM',
  '11:30 AM - 01:00 PM',
  '02:00 PM - 03:30 PM',
  '04:00 PM - 05:30 PM',
  '05:30 PM - 07:00 PM',
];

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
}

export const TestRidePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentCustomer,
    quizAnswers,
    riderProfile,
    leadScore,
    setLeadScore,
    addTestRide,
    logEvent,
    addLead,
    updateLead,
    leads,
  } = useAppState();

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  // Form states
  const [name, setName] = useState(currentCustomer?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(currentCustomer?.email || 'aarav.sharma@example.com');
  const [phone, setPhone] = useState(
    currentCustomer?.phone ? currentCustomer.phone.replace('+91 ', '') : '9845012345'
  );
  const [city, setCity] = useState<City>(
    currentCustomer?.city || (quizAnswers as any)?.city || 'Bengaluru'
  );
  const [experienceCenter, setExperienceCenter] = useState(
    'Ather Space, Indiranagar [VERIFIED LOCATION DATA REQUIRED]'
  );
  const [preferredDate, setPreferredDate] = useState(tomorrowStr);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[0]);
  const [recommendedCategory] = useState(
    riderProfile?.suggestedAtherModel ||
      riderProfile?.archetype ||
      'Ather 450X Series [VERIFIED ATHER PRODUCT DATA REQUIRED]'
  );
  const [primaryConcern, setPrimaryConcern] = useState<string>(
    quizAnswers.biggestConcern || 'Range'
  );
  const [consent, setConsent] = useState(false);

  // Errors & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Presentation Mode Integration
  const {
    isActive: isPresentationActive,
    currentStep: presentationStep,
    goToStep: presentationGoToStep,
  } = usePresentation();

  // Auto-fill Riya Desai's information during Step 9
  useEffect(() => {
    if (isPresentationActive && presentationStep === 9) {
      setName('Riya Desai');
      setEmail('riya.desai@example.com');
      setPhone('9823012345');
      setCity('Pune');
      setExperienceCenter('Ather Space, Deccan Gymkhana [VERIFIED LOCATION DATA REQUIRED]');
      setPrimaryConcern('Charging');
      setConsent(true);
    }
  }, [isPresentationActive, presentationStep]);

  // Interactive Checklist states
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Experience center default per city
  useEffect(() => {
    const ecMap: Record<City, string> = {
      Bengaluru: 'Ather Space, Indiranagar [VERIFIED LOCATION DATA REQUIRED]',
      Pune: 'Ather Space, Deccan Gymkhana [VERIFIED LOCATION DATA REQUIRED]',
      Mumbai: 'Ather Space, Bandra West [VERIFIED LOCATION DATA REQUIRED]',
      Delhi: 'Ather Space, Connaught Place [VERIFIED LOCATION DATA REQUIRED]',
      Chennai: 'Ather Space, Nungambakkam [VERIFIED LOCATION DATA REQUIRED]',
      Hyderabad: 'Ather Space, Hitec City [VERIFIED LOCATION DATA REQUIRED]',
    };
    if (ecMap[city]) {
      setExperienceCenter(ecMap[city]);
    }
  }, [city]);

  // Log page view event
  useEffect(() => {
    logEvent('test_ride_page_viewed', '/test-ride', {
      recommendedModel: recommendedCategory,
      primaryConcern,
    });
  }, [logEvent, primaryConcern, recommendedCategory]);

  // Get concern-specific checklist
  const getPersonalizedChecklist = (concern: string): ChecklistItem[] => {
    const lower = concern.toLowerCase();

    if (lower.includes('range') || lower.includes('battery')) {
      return [
        {
          id: 'c1',
          title: 'TrueRange™ Accuracy Verification',
          description:
            'Observe how TrueRange dynamically accounts for riding mode (Eco vs Warp) and stays rock-solid in city traffic.',
        },
        {
          id: 'c2',
          title: 'Regenerative Braking Deceleration',
          description:
            'Experience reverse throttle or coast braking that pumps kinetic energy back into the battery pack without brake pad wear.',
        },
        {
          id: 'c3',
          title: 'Thermal Management & IP67 Aluminum Case',
          description:
            'Ask the specialist to show the sealed IP67 battery undercarriage engineered for Indian monsoons and summer heatwaves.',
        },
      ];
    }

    if (lower.includes('charge') || lower.includes('charging') || lower.includes('park')) {
      return [
        {
          id: 'c4',
          title: 'Home 5A Charging Socket Ergonomics',
          description:
            'Inspect the standard three-pin portable charging cable and see how easily it locks into the vehicle charging port.',
        },
        {
          id: 'c5',
          title: 'Live Ather Grid Navigation',
          description:
            'Test the dashboard Google Maps navigation to nearby Ather Grid fast-chargers with live stall availability.',
        },
        {
          id: 'c6',
          title: 'Apartment/RWA Installation Protocol',
          description:
            'Review the standard NOC blueprint for setting up a dedicated sub-meter point in shared residential parking.',
        },
      ];
    }

    if (lower.includes('price') || lower.includes('saving') || lower.includes('running')) {
      return [
        {
          id: 'c7',
          title: 'Cost-Per-Kilometer Dashboard Live Proof',
          description:
            'Review real-time telemetry showing electricity consumption equivalent to ~25-30 paise per kilometer compared to ~₹2.50+ on petrol.',
        },
        {
          id: 'c8',
          title: 'Comprehensive Battery Warranty & Health',
          description:
            'Review the multi-year battery warranty documentation and zero scheduled engine-oil servicing schedule.',
        },
        {
          id: 'c9',
          title: 'Resale & Battery Buyback Guarantees',
          description:
            'Ask for the verified TCO sheet outlining total 5-year ownership projections vs conventional 125cc ICE scooters.',
        },
      ];
    }

    if (lower.includes('performance') || lower.includes('speed')) {
      return [
        {
          id: 'c10',
          title: 'Warp Mode Instant Torque Modulation',
          description:
            'Feel 0–40 km/h in under 3.3 seconds with linear, seamless power delivery and zero clutch or belt sluggishness.',
        },
        {
          id: 'c11',
          title: '43:57 Weight Distribution & Cornering',
          description:
            'Experience precision agility enabled by an underslung low center-of-gravity aluminum chassis on sharp turns.',
        },
        {
          id: 'c12',
          title: 'Mono-shock Suspension over Potholes',
          description:
            'Test ride through broken asphalt to evaluate high-speed chassis damping and disc brake stopping grip.',
        },
      ];
    }

    // Default: Family, Comfort, or General Commute
    return [
      {
        id: 'c13',
        title: 'Pillion Seating Ergonomics & Backrest',
        description:
          'Have your partner or friend sit behind you to check footboard width, pillion backrest lumbar support, and passenger vision.',
      },
      {
        id: 'c14',
        title: 'Deep Under-seat Boot Storage Capacity',
        description:
          'Open the boot to verify room for a full-face helmet, grocery bag, or laptop backpack with integrated lighting.',
      },
      {
        id: 'c15',
        title: 'Gentle Throttle Calibration for Smooth Two-Up Riding',
        description:
          'Switch to SmartEco or Ride mode for reassuring, jerk-free city cruising that keeps pillions completely relaxed.',
      },
    ];
  };

  const checklistItems = getPersonalizedChecklist(primaryConcern);

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please provide your full legal name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (!city) {
      newErrors.city = 'Please select your city';
    }

    if (!preferredDate) {
      newErrors.preferredDate = 'Please select a preferred test ride date';
    }

    if (!preferredTimeSlot) {
      newErrors.preferredTimeSlot = 'Please select a preferred time slot';
    }

    if (!consent) {
      newErrors.consent = 'You must agree to the contact consent to schedule your ride';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Scoring: +15 (test ride intent) + 10 (test ride started) = +25
    const updatedLeadScore = Math.min(100, leadScore + 25);
    setLeadScore(updatedLeadScore);

    const consentTimestamp = new Date().toISOString();
    const bookingRef = `ATH-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Add Test Ride to Context
    const createdRide = addTestRide({
      customerName: name.trim(),
      phone: `+91 ${cleanPhone}`,
      email: email.trim(),
      city,
      preferredDate,
      preferredTimeSlot,
      status: 'Scheduled',
      modelInterest: recommendedCategory,
      experienceCenter,
      bookingRef,
      primaryConcern,
      consentTimestamp,
    });

    // 2. Log test_ride_started telemetry
    logEvent('test_ride_started', '/test-ride', {
      bookingRef,
      name: name.trim(),
      city,
      preferredDate,
      preferredTimeSlot,
      model: recommendedCategory,
      primaryConcern,
      leadScore: updatedLeadScore,
      consentTimestamp,
    });

    // 3. Update or Add Demo Lead in CRM State
    const existingLead = leads.find((l) => l.name.toLowerCase() === name.trim().toLowerCase());
    if (existingLead) {
      updateLead(existingLead.id, {
        journeyStage: 'Test Ride Booked',
        testRideStatus: 'Scheduled',
        leadScore: updatedLeadScore,
        city,
        lastActivity: consentTimestamp,
      });
    } else {
      addLead({
        id: `lead-${Date.now()}`,
        name: name.trim(),
        city,
        riderProfile: riderProfile?.archetype || 'Balanced Daily Commuter',
        primaryConcern,
        matchPercentage: riderProfile?.matchScore || 88,
        leadScore: updatedLeadScore,
        journeyStage: 'Test Ride Booked',
        source: 'Direct',
        campaignName: 'Academic EV Confidence Engine',
        testRideStatus: 'Scheduled',
        lastActivity: consentTimestamp,
        tag: 'DEMO CUSTOMER',
      });
    }

    // Delay briefly for realistic feedback then navigate
    setTimeout(() => {
      setIsSubmitting(false);
      if (isPresentationActive) {
        presentationGoToStep(10);
      } else {
        navigate('/confirmation', {
          state: {
            booking: createdRide,
            bookingRef,
          },
        });
      }
    }, 600);
  };

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] min-h-[calc(100vh-80px)]">
      {/* Subtle background glow */}
      <div
        className="absolute top-12 left-1/4 w-[600px] h-[500px] pointer-events-none rounded-full blur-[160px] opacity-15 bg-[#00E08A]/25"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* PRESENTATION DEMO BANNER */}
        {isPresentationActive && presentationStep === 9 && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/30 text-xs text-[#00E08A]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#00E08A]" />
              <span className="font-semibold text-white">
                Step 9: Auto-filled booking for Riya Desai (Ather Space Deccan Gymkhana, Pune)
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              className="px-3 py-1.5 rounded-lg bg-[#00E08A] text-[#0B0D10] font-semibold text-xs hover:bg-[#00c97b] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,224,138,0.3)]"
            >
              Submit Riya's Ride →
            </button>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#00E08A] font-semibold">
              Conversion Pivot
            </span>
            <Badge variant="ACADEMIC PROTOTYPE" label="NO SALES PRESSURE" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA]">
            Schedule Your Zero-Pressure Test Ride
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#9AA3AF] max-w-2xl">
            Theoretical confidence turns into physical conviction on the road. Experience instant,
            silent torque and precision balance at your nearest Ather Space.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT: Left Form, Right Personalized Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Booking Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06]">
              <h2 className="font-heading text-lg font-bold text-[#F5F7FA] flex items-center gap-2">
                <Calendar size={18} className="text-[#00E08A]" />
                Test Ride Reservation Details
              </h2>
              <span className="text-[11px] font-mono text-[#9AA3AF] bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                30-Minute Window
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full bg-[#16191E] border ${
                        errors.name ? 'border-rose-500' : 'border-white/10'
                      } rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]`}
                    />
                    <User size={14} className="absolute right-3 top-3 text-[#9AA3AF]/60 pointer-events-none" />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aarav@example.com"
                      className={`w-full bg-[#16191E] border ${
                        errors.email ? 'border-rose-500' : 'border-white/10'
                      } rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]`}
                    />
                    <Mail size={14} className="absolute right-3 top-3 text-[#9AA3AF]/60 pointer-events-none" />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    Phone Number (10 digits) *
                  </label>
                  <div className="flex items-center">
                    <span className="bg-[#16191E] border border-r-0 border-white/10 text-[#9AA3AF] text-xs sm:text-sm px-3 py-2.5 rounded-l-xl font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9845012345"
                      maxLength={10}
                      className={`w-full bg-[#16191E] border ${
                        errors.phone ? 'border-rose-500' : 'border-white/10'
                      } rounded-r-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as City)}
                    className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Experience Center */}
              <div>
                <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                  Preferred Experience Center
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={experienceCenter}
                    onChange={(e) => setExperienceCenter(e.target.value)}
                    className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                  />
                  <MapPin size={14} className="absolute right-3 top-3 text-[#00E08A] pointer-events-none" />
                </div>
                <p className="text-[10px] text-[#9AA3AF]/70 mt-1 font-mono">
                  Location verification active · GPS mapping included in confirmation pass
                </p>
              </div>

              {/* Row 4: Preferred Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    Preferred Date (Tomorrow onwards) *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={tomorrowStr}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={`w-full bg-[#16191E] border ${
                        errors.preferredDate ? 'border-rose-500' : 'border-white/10'
                      } rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A] [color-scheme:dark]`}
                    />
                  </div>
                  {errors.preferredDate && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Recommended Category (Read-only) & Primary Concern */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    Recommended Model Allocation
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={recommendedCategory}
                    className="w-full bg-[#16191E]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-[#00E08A] font-medium cursor-not-allowed select-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                    Focus Focus / Concern
                  </label>
                  <select
                    value={primaryConcern}
                    onChange={(e) => setPrimaryConcern(e.target.value)}
                    className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                  >
                    <option value="Range">Range & TrueRange Confidence</option>
                    <option value="Charging">Charging & Home Socket Setup</option>
                    <option value="Price">Price, Savings & Total Ownership Cost</option>
                    <option value="Performance">Performance, Warp Mode & Handling</option>
                    <option value="Pillion / Family">Pillion Comfort & Underseat Storage</option>
                  </select>
                </div>
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="pt-3 border-t border-white/[0.06]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-[#16191E] text-[#00E08A] focus:ring-[#00E08A] accent-[#00E08A]"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-[#F5F7FA] block">
                      I agree to be contacted regarding my test ride request. *
                    </span>
                    <span className="text-[11px] text-[#9AA3AF] leading-relaxed block">
                      Your information will be used to personalise your experience and, where you consent,
                      for follow-up communication.
                    </span>
                  </div>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-rose-400 mt-2 flex items-center gap-1.5">
                    <AlertCircle size={13} /> {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <PrimaryButton
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center text-sm font-semibold tracking-wide"
                  icon={
                    isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight size={16} />
                    )
                  }
                >
                  {isSubmitting ? 'Securing Test Ride Slot...' : 'Confirm Test Ride Booking'}
                </PrimaryButton>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: What to Check on Your Ride (Personalised Checklist) (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#00E08A] block">
                    Personalised Protocol
                  </span>
                  <h3 className="font-heading text-base font-bold text-[#F5F7FA]">
                    What to Check on Your Ride
                  </h3>
                </div>
                <span className="text-[11px] text-[#9AA3AF] bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                  Concern: {primaryConcern}
                </span>
              </div>

              <p className="text-xs text-[#9AA3AF] mb-5 leading-relaxed">
                We've customized these specific evaluation points based on your primary focus. Tick them off as you prepare for your road session:
              </p>

              <div className="space-y-3.5">
                {checklistItems.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-[#00E08A]/10 border-[#00E08A]/40'
                          : 'bg-[#16191E] border-white/[0.06] hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-[#00E08A] border-[#00E08A] text-[#0B0D10]'
                              : 'border-white/20 bg-white/[0.02]'
                          }`}
                        >
                          {isChecked && <CheckCircle2 size={13} strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-xs font-semibold transition-colors ${
                              isChecked ? 'text-[#00E08A] line-through' : 'text-[#F5F7FA]'
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#9AA3AF] leading-relaxed mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* What to Bring Card */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#00E08A]" />
                  What to Bring for Your Ride
                </h4>
                <ul className="text-xs text-[#9AA3AF] space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E08A] shrink-0" />
                    Valid Driving License (Physical card or DigiLocker)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E08A] shrink-0" />
                    Comfortable closed-toe footwear (shoes recommended)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E08A] shrink-0" />
                    Helmet (sanitized helmets provided, or bring your own)
                  </li>
                </ul>
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#9AA3AF] flex items-center gap-3">
              <BadgeCheck size={20} className="text-[#00E08A] shrink-0" />
              <span>
                Zero aggressive sales pitches. Our Ather Experience Specialists are product educators dedicated to resolving your transit doubts.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
