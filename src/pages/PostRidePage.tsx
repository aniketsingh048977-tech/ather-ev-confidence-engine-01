/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ThumbsUp,
  HelpCircle,
  MinusCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Coins,
  Bot,
  BatteryCharging,
  Gauge,
  ShieldCheck,
  Zap,
  Wrench,
  Compass,
  FileCheck2,
  AlertCircle,
  Share2,
  Users,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { useAppState } from '../context/AppContext';
import { PrimaryConcern, TestRideBooking } from '../types';

type EmotiveReaction = 'Loved it' | 'Good' | 'Still unsure' | 'Not for me';

interface ConcernEducation {
  title: string;
  tagline: string;
  body: string;
  actionText: string;
  actionLink: string;
  icon: React.ReactNode;
}

const CONCERN_DATA: Record<string, ConcernEducation> = {
  Range: {
    title: 'TrueRange™ vs ARAI: Engineered for Zero Anxiety',
    tagline: 'Predictable algorithms that adapt to metro traffic',
    body: 'Unlike lab-tested ARAI ratings, Ather TrueRange™ continuously calculates remaining kilometers based on real-time riding mode, terrain gradients, and throttle intensity. Regenerative braking reclaims energy every time you roll off the throttle in city traffic, giving you genuine peace of mind.',
    actionText: 'Ask Concierge About Your Exact Route',
    actionLink: '/concierge',
    icon: <Gauge className="text-[#00E08A]" size={20} />,
  },
  Charging: {
    title: 'Home Charging: Effortless Overnight Top-Ups',
    tagline: 'Standard 5A socket simplicity + apartment NOC assistance',
    body: 'You do not need industrial high-voltage wallboxes. A standard 5A or 15A three-pin household socket provides a full 100% battery overnight for just ₹20–₹25. For apartment residents, Ather provides standardized RWA and society permission templates to install dedicated sub-meter connections.',
    actionText: 'Chat With Concierge on Apartment Setup',
    actionLink: '/concierge',
    icon: <BatteryCharging className="text-amber-400" size={20} />,
  },
  Price: {
    title: 'Total Cost of Ownership: ₹0.25/km vs ₹2.50/km Petrol',
    tagline: 'Recurring fuel savings offset vehicle ownership within 24 months',
    body: 'While initial EV acquisition is slightly higher than basic petrol scooters, your ongoing commute costs drop by 85%+. With zero oil changes, spark plug replacements, or engine wear, average daily commuters pocket over ₹30,000 to ₹45,000 in direct net savings every year.',
    actionText: 'Review Custom TCO & EMI Calculator',
    actionLink: '/savings',
    icon: <Coins className="text-emerald-400" size={20} />,
  },
  Performance: {
    title: 'Warp Mode & Underslung Precision Aluminum Chassis',
    tagline: 'Instant 0–40 km/h acceleration with 43:57 weight distribution',
    body: 'Ather scooters place the sealed IP67 battery low inside the floorboard frame. This lowers the center of gravity drastically compared to top-heavy petrol tanks, delivering motorcycle-grade cornering agility, instantaneous belt-drive torque, and seamless roll-on response.',
    actionText: 'Compare Model Specs & Handling',
    actionLink: '/savings',
    icon: <Zap className="text-cyan-400" size={20} />,
  },
  Service: {
    title: 'Preventive Over-the-Air Diagnostics & Nationwide Hubs',
    tagline: '90% fewer moving parts than internal combustion engines',
    body: 'Without carburettors, exhaust filters, drive belts, or piston assemblies, electric drivetrains require virtually zero periodic engine rebuilds. Ather vehicles receive regular software updates over the air and monitor battery cell balance automatically in the background.',
    actionText: 'Connect With an Ather Service Specialist',
    actionLink: '/concierge',
    icon: <Wrench className="text-purple-400" size={20} />,
  },
};

export const PostRidePage: React.FC = () => {
  const {
    currentCustomer,
    quizAnswers,
    riderProfile,
    leadScore,
    setLeadScore,
    latestTestRide,
    testRides,
    addTestRide,
    updateTestRide,
    logEvent,
    leads,
    updateLead,
    addLead,
  } = useAppState();

  // Find or determine the active test ride
  const activeRide: TestRideBooking = latestTestRide || testRides[0] || {
    id: `tr-default-${Date.now()}`,
    customerName: currentCustomer?.name || 'Aarav Sharma',
    phone: currentCustomer?.phone || '+91 98450 12345',
    email: currentCustomer?.email || 'aarav.sharma@example.com',
    city: currentCustomer?.city || 'Bengaluru',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTimeSlot: '11:30 AM - 01:00 PM',
    status: 'Scheduled',
    modelInterest:
      riderProfile?.suggestedAtherModel || 'Ather 450X Series [VERIFIED ATHER PRODUCT DATA REQUIRED]',
    experienceCenter: 'Ather Space, Indiranagar [VERIFIED LOCATION DATA REQUIRED]',
    bookingRef: 'ATH-839210',
    primaryConcern: quizAnswers.biggestConcern || 'Range',
  };

  // Selected Reaction state
  const [selectedReaction, setSelectedReaction] = useState<EmotiveReaction | null>(
    activeRide.feedbackReaction || null
  );

  // Referral form states (Loved it)
  const [friendFirstName, setFriendFirstName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendConsent, setFriendConsent] = useState(false);
  const [referralSubmitting, setReferralSubmitting] = useState(false);
  const [referralSubmitted, setReferralSubmitted] = useState(false);
  const [referralError, setReferralError] = useState('');

  // Unsure concern selection state (Still unsure)
  const [selectedConcern, setSelectedConcern] = useState<string>(
    activeRide.unresolvedConcern || quizAnswers.biggestConcern || 'Range'
  );

  // Optional feedback notes (Not for me)
  const [feedbackNotes, setFeedbackNotes] = useState(activeRide.feedbackNotes || '');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Log page view on mount
  useEffect(() => {
    logEvent('post_ride_page_viewed', '/post-ride', {
      bookingRef: activeRide.bookingRef,
      hasExistingReaction: !!selectedReaction,
    });
  }, [activeRide.bookingRef, logEvent, selectedReaction]);

  // Handle reaction selection
  const handleSelectReaction = (reaction: EmotiveReaction) => {
    setSelectedReaction(reaction);

    // Calculate score increment: +25 for 'Loved it' or 'Good'
    let updatedScore = leadScore;
    if (reaction === 'Loved it' || reaction === 'Good') {
      updatedScore = Math.min(100, leadScore + 25);
      setLeadScore(updatedScore);
    }

    // 1. Ensure test ride is marked Completed in context
    const updates: Partial<TestRideBooking> = {
      status: 'Completed',
      feedbackReaction: reaction,
    };

    if (testRides.some((r) => r.id === activeRide.id)) {
      updateTestRide(activeRide.id, updates);
    } else {
      addTestRide({
        ...activeRide,
        status: 'Completed',
        feedbackReaction: reaction,
      });
    }

    // 2. Log post_ride_feedback & test_ride_completed
    logEvent('post_ride_feedback', '/post-ride', {
      bookingId: activeRide.id,
      bookingRef: activeRide.bookingRef,
      reaction,
      leadScore: updatedScore,
    });

    logEvent('test_ride_completed', '/post-ride', {
      bookingId: activeRide.id,
      bookingRef: activeRide.bookingRef,
      reaction,
      leadScore: updatedScore,
    });

    // 3. Update or add CRM lead
    const customerName = activeRide.customerName || currentCustomer?.name || 'Aarav Sharma';
    const existingLead = leads.find(
      (l) => l.name.toLowerCase() === customerName.toLowerCase()
    );

    const newJourneyStage =
      reaction === 'Loved it'
        ? 'PURCHASE CONSIDERATION'
        : reaction === 'Good'
        ? 'Deliberation'
        : 'Evaluation';

    if (existingLead) {
      updateLead(existingLead.id, {
        testRideStatus: 'Completed',
        journeyStage: newJourneyStage,
        leadScore: updatedScore,
        lastActivity: new Date().toISOString(),
      });
    } else {
      addLead({
        id: `lead-${Date.now()}`,
        name: customerName,
        city: activeRide.city || 'Bengaluru',
        riderProfile: riderProfile?.archetype || 'Balanced Daily Commuter',
        primaryConcern: activeRide.primaryConcern || 'Range',
        matchPercentage: riderProfile?.matchScore || 88,
        leadScore: updatedScore,
        journeyStage: newJourneyStage,
        source: 'Direct',
        campaignName: 'Academic EV Confidence Engine',
        testRideStatus: 'Completed',
        lastActivity: new Date().toISOString(),
        tag: 'DEMO CUSTOMER',
      });
    }
  };

  // Handle Referral submission ("Loved it")
  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReferralError('');

    if (!friendFirstName.trim()) {
      setReferralError("Please enter your friend's first name");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!friendEmail.trim() || !emailRegex.test(friendEmail)) {
      setReferralError("Please enter a valid email address for your friend");
      return;
    }

    if (!friendConsent) {
      setReferralError("Please confirm your friend's consent to be contacted");
      return;
    }

    setReferralSubmitting(true);

    setTimeout(() => {
      setReferralSubmitting(false);
      setReferralSubmitted(true);

      // Update test ride with referral data
      updateTestRide(activeRide.id, {
        referralName: friendFirstName.trim(),
        referralEmail: friendEmail.trim(),
      });

      // Log referral_started
      logEvent('referral_started', '/post-ride', {
        friendName: friendFirstName.trim(),
        friendEmail: friendEmail.trim(),
        referrer: activeRide.customerName,
        bookingRef: activeRide.bookingRef,
      });
    }, 600);
  };

  // Handle Unsure concern change
  const handleConcernSelect = (concern: string) => {
    setSelectedConcern(concern);
    updateTestRide(activeRide.id, { unresolvedConcern: concern });
    logEvent('post_ride_concern_explored', '/post-ride', {
      unresolvedConcern: concern,
      bookingRef: activeRide.bookingRef,
    });
  };

  // Handle Not For Me feedback notes submission
  const handleFeedbackNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitting(true);

    setTimeout(() => {
      setFeedbackSubmitting(false);
      setFeedbackSubmitted(true);

      updateTestRide(activeRide.id, { feedbackNotes });

      logEvent('post_ride_feedback_notes_submitted', '/post-ride', {
        bookingRef: activeRide.bookingRef,
        notesLength: feedbackNotes.length,
      });
    }, 500);
  };

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] min-h-[calc(100vh-80px)] py-8 sm:py-12">
      {/* Background ambient light */}
      <div
        className="absolute top-10 left-1/3 w-[700px] h-[550px] pointer-events-none rounded-full blur-[170px] opacity-15 bg-[#00E08A]/25"
        aria-hidden="true"
      />

      <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00E08A] font-semibold">
              Post-Experience Pulse
            </span>
            <Badge variant="ACADEMIC PROTOTYPE" label="DECISION PROGRESSION" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FA]">
            How did your ride feel?
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
            Your real-world road impressions shape the next step in your EV transition. Select how
            the acceleration, ergonomics, and balance felt to you.
          </p>

          {/* Test Ride Context pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-[#9AA3AF]">
            <span>Booking Ref: <strong className="text-[#00E08A] font-mono">{activeRide.bookingRef || 'ATH-839210'}</strong></span>
            <span>·</span>
            <span className="truncate max-w-[200px] sm:max-w-none">{activeRide.modelInterest || 'Ather 450X Series'}</span>
          </div>
        </div>

        {/* FOUR LARGE EMOTIVE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {/* Card 1: Loved it */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectReaction('Loved it')}
            className={`cursor-pointer rounded-[22px] p-5 sm:p-6 transition-all duration-200 relative overflow-hidden flex flex-col justify-between select-none ${
              selectedReaction === 'Loved it'
                ? 'bg-[#111418] border-2 border-[#00E08A] shadow-[0_0_30px_rgba(0,224,138,0.25)]'
                : 'bg-[#111418] border border-white/[0.08] hover:border-[#00E08A]/40 hover:bg-[#16191E]'
            }`}
          >
            {selectedReaction === 'Loved it' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00E08A] text-[#0B0D10] flex items-center justify-center">
                <CheckCircle2 size={13} strokeWidth={3} />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00E08A]/10 border border-[#00E08A]/30 flex items-center justify-center text-[#00E08A]">
                <Heart size={24} className="fill-[#00E08A]/20" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#F5F7FA]">Loved it</h3>
                <p className="text-xs text-[#9AA3AF] mt-1 leading-relaxed">
                  Instant torque, whisper-quiet acceleration, and solid road stability. Ready to consider ownership.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#00E08A] font-medium">+25 Lead Score</span>
              <span className="text-[#9AA3AF]">High Intent</span>
            </div>
          </motion.div>

          {/* Card 2: Good */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectReaction('Good')}
            className={`cursor-pointer rounded-[22px] p-5 sm:p-6 transition-all duration-200 relative overflow-hidden flex flex-col justify-between select-none ${
              selectedReaction === 'Good'
                ? 'bg-[#111418] border-2 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                : 'bg-[#111418] border border-white/[0.08] hover:border-sky-400/40 hover:bg-[#16191E]'
            }`}
          >
            {selectedReaction === 'Good' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-400 text-[#0B0D10] flex items-center justify-center">
                <CheckCircle2 size={13} strokeWidth={3} />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <ThumbsUp size={24} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#F5F7FA]">Good</h3>
                <p className="text-xs text-[#9AA3AF] mt-1 leading-relaxed">
                  Smooth and practical ride experience, but evaluating total cost of ownership and savings math.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-sky-400 font-medium">+25 Lead Score</span>
              <span className="text-[#9AA3AF]">Deliberation</span>
            </div>
          </motion.div>

          {/* Card 3: Still unsure */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectReaction('Still unsure')}
            className={`cursor-pointer rounded-[22px] p-5 sm:p-6 transition-all duration-200 relative overflow-hidden flex flex-col justify-between select-none ${
              selectedReaction === 'Still unsure'
                ? 'bg-[#111418] border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.25)]'
                : 'bg-[#111418] border border-white/[0.08] hover:border-amber-400/40 hover:bg-[#16191E]'
            }`}
          >
            {selectedReaction === 'Still unsure' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 text-[#0B0D10] flex items-center justify-center">
                <CheckCircle2 size={13} strokeWidth={3} />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <HelpCircle size={24} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#F5F7FA]">Still unsure</h3>
                <p className="text-xs text-[#9AA3AF] mt-1 leading-relaxed">
                  Need clarity on range reliability, home charging feasibility, or battery longevity before deciding.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-400 font-medium">Educational Handoff</span>
              <span className="text-[#9AA3AF]">Evaluation</span>
            </div>
          </motion.div>

          {/* Card 4: Not for me */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectReaction('Not for me')}
            className={`cursor-pointer rounded-[22px] p-5 sm:p-6 transition-all duration-200 relative overflow-hidden flex flex-col justify-between select-none ${
              selectedReaction === 'Not for me'
                ? 'bg-[#111418] border-2 border-rose-400 shadow-[0_0_30px_rgba(251,113,133,0.25)]'
                : 'bg-[#111418] border border-white/[0.08] hover:border-rose-400/40 hover:bg-[#16191E]'
            }`}
          >
            {selectedReaction === 'Not for me' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-400 text-[#0B0D10] flex items-center justify-center">
                <CheckCircle2 size={13} strokeWidth={3} />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#9AA3AF]">
                <MinusCircle size={24} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#F5F7FA]">Not for me</h3>
                <p className="text-xs text-[#9AA3AF] mt-1 leading-relaxed">
                  EV doesn't fit my current transit lifestyle or I prefer sticking with my conventional vehicle.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#9AA3AF]">Zero Pressure</span>
              <span className="text-[#9AA3AF]">Feedback</span>
            </div>
          </motion.div>
        </div>

        {/* DYNAMIC CONTENT SECTIONS BASED ON REACTION */}
        <AnimatePresence mode="wait">
          {/* 1. LOVED IT: REVEAL ADVOCACY SECTION & REFERRAL FORM */}
          {selectedReaction === 'Loved it' && (
            <motion.div
              key="loved-it-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Stage & Status Confirmation Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#00E08A]/10 border border-[#00E08A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00E08A] text-[#0B0D10] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#F5F7FA]">
                      Test Ride Successfully Completed · +25 Lead Score Added
                    </h4>
                    <p className="text-xs text-[#9AA3AF]">
                      CRM Journey Stage updated to <strong className="text-[#00E08A]">PURCHASE CONSIDERATION</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="VERIFIED" label="STAGE: PURCHASE CONSIDERATION" />
                </div>
              </div>

              {/* ADVOCACY SECTION: "Your Ride. Your Story." */}
              <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-2xl mb-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles size={16} className="text-[#00E08A]" />
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#00E08A] font-semibold">
                      Your Ride. Your Story.
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-[#F5F7FA]">
                    Know someone who is considering an EV?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9AA3AF] mt-2 leading-relaxed">
                    Electric mobility spreads fastest through genuine rider convictions, not billboard ads.
                    Share your experience link or pass along a zero-pressure test ride invitation to a friend or colleague.
                  </p>
                </div>

                {/* REFERRAL FORM / SUCCESS STATE */}
                {referralSubmitted ? (
                  <div className="p-6 rounded-2xl bg-[#16191E] border border-[#00E08A]/30 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#00E08A]/15 text-[#00E08A] flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#F5F7FA]">
                      Referral Invitation Dispatched!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9AA3AF] max-w-md mx-auto leading-relaxed">
                      We've queued a friendly, zero-pressure invitation and personalized commute savings guide for{' '}
                      <strong className="text-white">{friendFirstName}</strong> at{' '}
                      <strong className="text-white">{friendEmail}</strong>.
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                      <PrimaryButton to="/savings" size="sm">
                        Review Financing & EMI Options
                      </PrimaryButton>
                      <SecondaryButton
                        onClick={() => {
                          setReferralSubmitted(false);
                          setFriendFirstName('');
                          setFriendEmail('');
                          setFriendConsent(false);
                        }}
                        size="sm"
                      >
                        Refer Another Friend
                      </SecondaryButton>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReferralSubmit} className="space-y-4 max-w-xl">
                    {referralError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{referralError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Friend's First Name */}
                      <div>
                        <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                          Friend's First Name *
                        </label>
                        <input
                          type="text"
                          value={friendFirstName}
                          onChange={(e) => setFriendFirstName(e.target.value)}
                          placeholder="e.g. Rohini"
                          className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                        />
                      </div>

                      {/* Friend's Email */}
                      <div>
                        <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                          Friend's Email Address *
                        </label>
                        <input
                          type="email"
                          value={friendEmail}
                          onChange={(e) => setFriendEmail(e.target.value)}
                          placeholder="e.g. rohini@example.com"
                          className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                        />
                      </div>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={friendConsent}
                          onChange={(e) => setFriendConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-[#16191E] text-[#00E08A] focus:ring-[#00E08A] accent-[#00E08A]"
                        />
                        <span className="text-[11px] text-[#9AA3AF] leading-relaxed">
                          I confirm my friend is considering an EV and is happy to receive a zero-spam test ride pass and commute savings breakdown.
                        </span>
                      </label>
                    </div>

                    {/* Share Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <PrimaryButton
                        type="submit"
                        size="md"
                        disabled={referralSubmitting}
                        className="w-full sm:w-auto justify-center"
                        icon={
                          referralSubmitting ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send size={15} />
                          )
                        }
                      >
                        {referralSubmitting ? 'Sharing...' : 'Share My Ather Journey'}
                      </PrimaryButton>

                      <SecondaryButton
                        to="/savings"
                        size="md"
                        className="w-full sm:w-auto justify-center"
                        icon={<ArrowRight size={14} />}
                      >
                        Explore Ownership Financing
                      </SecondaryButton>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {/* 2. GOOD: PERSONALISED FOLLOW-UP CARD WITH LINKS TO SAVINGS & CONCIERGE */}
          {selectedReaction === 'Good' && (
            <motion.div
              key="good-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Score addition banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-400 text-[#0B0D10] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#F5F7FA]">
                      Ride Completed · +25 Lead Score Added
                    </h4>
                    <p className="text-xs text-[#9AA3AF]">
                      Progressing from Evaluation into Deliberation.
                    </p>
                  </div>
                </div>
                <Badge variant="DEMO DATA" label="STAGE: DELIBERATION" />
              </div>

              {/* Personalised Follow-up Card */}
              <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-sky-400" />
                  <span className="text-[11px] font-mono tracking-wider uppercase text-sky-400 font-semibold">
                    Personalized Commute Math
                  </span>
                </div>

                <h2 className="font-heading text-2xl font-bold text-[#F5F7FA] mb-2">
                  Solid ride impressions. Ready to calculate your exact financial payoff?
                </h2>

                <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed max-w-3xl mb-6">
                  You felt the instant throttle modulation and lightweight chassis. Now let's quantify how
                  your daily commute of{' '}
                  <strong className="text-white">{quizAnswers.dailyCommute || '25-35 km'}</strong> compares
                  against your current monthly petrol expense of{' '}
                  <strong className="text-white">
                    ₹{quizAnswers.monthlyFuelExpense ? quizAnswers.monthlyFuelExpense.toLocaleString('en-IN') : '2,500'}
                  </strong>
                  .
                </p>

                {/* Two Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Link 1: Savings Calculator */}
                  <Link
                    to="/savings"
                    className="p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-[#00E08A]/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/30 flex items-center justify-center text-[#00E08A] mb-3">
                        <Coins size={20} />
                      </div>
                      <h3 className="font-heading text-base font-bold text-[#F5F7FA] group-hover:text-[#00E08A] transition-colors">
                        3-Year Total Cost of Ownership
                      </h3>
                      <p className="text-xs text-[#9AA3AF] mt-1.5 leading-relaxed">
                        Simulate electricity tariffs, battery warranties, zero maintenance savings, and monthly EMI offsets against petrol.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#00E08A]">
                      <span>Open Financial Calculator</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  {/* Link 2: AI Ride Concierge */}
                  <Link
                    to="/concierge"
                    className="p-5 rounded-2xl bg-[#16191E] border border-white/[0.06] hover:border-sky-400/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-3">
                        <Bot size={20} />
                      </div>
                      <h3 className="font-heading text-base font-bold text-[#F5F7FA] group-hover:text-sky-400 transition-colors">
                        Consult AI Ride Concierge
                      </h3>
                      <p className="text-xs text-[#9AA3AF] mt-1.5 leading-relaxed">
                        Have lingering questions about home parking socket setup, monsoon water-wading, or charging etiquette? Get grounded answers.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                      <span>Chat With Concierge</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. STILL UNSURE: ASK BIGGEST CONCERN + EDUCATION CARD & LINK */}
          {selectedReaction === 'Still unsure' && (
            <motion.div
              key="still-unsure-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-2xl mb-6">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-amber-400 font-semibold block mb-1">
                    Targeted Clarification
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-[#F5F7FA]">
                    What's your biggest remaining concern?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9AA3AF] mt-2 leading-relaxed">
                    Transitioning to electric power is a significant behavioral shift. Select the primary factor holding you back, and let's examine the real engineering behind it.
                  </p>
                </div>

                {/* 5 CONCERN CHIPS */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
                  {(['Range', 'Charging', 'Price', 'Performance', 'Service'] as const).map(
                    (concern) => {
                      const isSelected = selectedConcern === concern;
                      return (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => handleConcernSelect(concern)}
                          className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none text-center ${
                            isSelected
                              ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                              : 'bg-[#16191E] border-white/10 text-[#9AA3AF] hover:text-[#F5F7FA] hover:border-white/20'
                          }`}
                        >
                          {concern}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* MATCHING EDUCATION CARD */}
                {CONCERN_DATA[selectedConcern] && (
                  <motion.div
                    key={selectedConcern}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-2xl bg-[#16191E] border border-white/[0.08] space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        {CONCERN_DATA[selectedConcern].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 block">
                          Verified Engineering Perspective
                        </span>
                        <h3 className="font-heading text-lg font-bold text-[#F5F7FA] mt-0.5">
                          {CONCERN_DATA[selectedConcern].title}
                        </h3>
                        <p className="text-xs text-[#00E08A] mt-0.5 font-medium">
                          {CONCERN_DATA[selectedConcern].tagline}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#9AA3AF] leading-relaxed">
                      {CONCERN_DATA[selectedConcern].body}
                    </p>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
                      <span className="text-[11px] text-[#9AA3AF]">
                        Explore detailed data points in the dedicated portal:
                      </span>
                      <PrimaryButton
                        to={CONCERN_DATA[selectedConcern].actionLink}
                        size="sm"
                        icon={<ArrowRight size={13} />}
                      >
                        {CONCERN_DATA[selectedConcern].actionText}
                      </PrimaryButton>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. NOT FOR ME: RESPECTFUL THANK-YOU + OPTIONAL FEEDBACK TEXTBOX */}
          {selectedReaction === 'Not for me' && (
            <motion.div
              key="not-for-me-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-2xl mb-6">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#9AA3AF] font-semibold block mb-1">
                    Respectful Conclusion
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-[#F5F7FA]">
                    Thank you for experiencing an Ather on the road.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9AA3AF] mt-2 leading-relaxed">
                    Transitioning to electric mobility is a highly personal choice influenced by parking logistics, charging access, and travel patterns. We appreciate you taking the time to test our vehicle firsthand with zero obligation.
                  </p>
                </div>

                {/* Optional Feedback Textbox */}
                {feedbackSubmitted ? (
                  <div className="p-5 rounded-2xl bg-[#16191E] border border-white/10 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05] text-[#00E08A] flex items-center justify-center mx-auto">
                      <CheckCircle2 size={22} />
                    </div>
                    <h3 className="font-heading text-sm font-bold text-[#F5F7FA]">
                      Feedback Recorded
                    </h3>
                    <p className="text-xs text-[#9AA3AF] max-w-md mx-auto">
                      Thank you for sharing your thoughts. Your candid impressions directly assist our vehicle architecture and software teams.
                    </p>
                    <div className="pt-2">
                      <SecondaryButton to="/" size="sm">
                        Return to Home
                      </SecondaryButton>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackNotesSubmit} className="space-y-4 max-w-xl">
                    <div>
                      <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                        What didn't quite work for you? (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackNotes}
                        onChange={(e) => setFeedbackNotes(e.target.value)}
                        placeholder="e.g. Seating posture, boot layout, suspension firmness, apartment charging permission..."
                        className="w-full bg-[#16191E] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-[#F5F7FA] placeholder-[#9AA3AF]/50 focus:outline-none focus:border-white/30 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <PrimaryButton
                        type="submit"
                        size="md"
                        disabled={feedbackSubmitting}
                        className="!bg-white/[0.08] hover:!bg-white/[0.14] !text-[#F5F7FA] border border-white/15"
                      >
                        {feedbackSubmitting ? 'Saving...' : 'Submit Feedback'}
                      </PrimaryButton>

                      <SecondaryButton to="/" size="md">
                        Return to Home
                      </SecondaryButton>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM NAVIGATION / FOOTER */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA3AF]">
          <span>
            Test ride evaluation logged in current browser session context.
          </span>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-[#00E08A] transition-colors">
              View CRM Lead Pipeline →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
