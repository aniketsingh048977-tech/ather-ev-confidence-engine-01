/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Wallet,
  TrendingDown,
  Fuel,
  Zap,
  Gauge,
  Calendar,
  Sparkles,
  Plane,
  Coins,
  Dumbbell,
  Film,
  GraduationCap,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';
import { usePresentation } from '../context/PresentationContext';

type SavingsGoalCategory = 'Weekend travel' | 'Investments' | 'Fitness' | 'Entertainment' | 'Education';

export const SavingsPage: React.FC = () => {
  const { quizAnswers, leadScore, setLeadScore, logEvent, currentCustomer, events } = useAppState();
  const prefersReduced = useReducedMotion();
  const hasLoggedRef = useRef(false);

  // Log calculator_used and add +10 to lead score once
  useEffect(() => {
    const alreadyLogged = events.some((e) => e.type === 'calculator_used');
    if (!alreadyLogged && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('calculator_used', '/savings', { page: '/savings' });
      setLeadScore(Math.min(100, leadScore + 10));
    }
  }, [events, leadScore, logEvent, setLeadScore]);

  // Initial values prefilled from quiz if available
  const initialDistance = useMemo(() => {
    if (quizAnswers.monthlyFuelExpense && quizAnswers.monthlyFuelExpense > 0) {
      // Estimated distance from fuel expense at 105/L & 45 km/L
      const approxKm = Math.round((quizAnswers.monthlyFuelExpense / 105) * 45);
      return Math.min(2000, Math.max(100, Math.round(approxKm / 50) * 50));
    }
    if (quizAnswers.dailyCommute) {
      if (quizAnswers.dailyCommute === 'Under 10 km') return 250;
      if (quizAnswers.dailyCommute === '10-20 km') return 450;
      if (quizAnswers.dailyCommute === '20-40 km') return 800;
      if (quizAnswers.dailyCommute === '40+ km') return 1300;
    }
    return 600;
  }, [quizAnswers]);

  // Sliders state
  const [monthlyDistance, setMonthlyDistance] = useState<number>(initialDistance);
  const [petrolPrice, setPetrolPrice] = useState<number>(105);
  const [petrolMileage, setPetrolMileage] = useState<number>(45);
  const [evEnergyPer100km, setEvEnergyPer100km] = useState<number>(3.0);
  const [electricityCost, setElectricityCost] = useState<number>(8.0);

  // Interactive 5 savings goals tiles
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoalCategory>('Weekend travel');

  const { isActive: isPresentationActive, currentStep: presentationStep } = usePresentation();

  // "Can I Make It?" Range Simulator inputs
  const [routeStart, setRouteStart] = useState<string>(
    currentCustomer?.city ? `Home, ${currentCustomer.city}` : 'Home, Indiranagar'
  );
  const [routeDestination, setRouteDestination] = useState<string>('Office, Outer Ring Road');
  const [routeStop, setRouteStop] = useState<string>('Indiranagar Gym / Coffee');
  const [oneWayKm, setOneWayKm] = useState<number>(16);
  const [tripsPerDay, setTripsPerDay] = useState<number>(2); // standard roundtrip

  // Presentation Mode: Riya Desai parameters
  useEffect(() => {
    if (isPresentationActive) {
      setMonthlyDistance(780); // 15 km * 2 * 26 days = 780 km
      setRouteStart('Home, Kothrud, Pune');
      setRouteDestination('Office, Hinjewadi, Pune');
      setOneWayKm(15);
    }
  }, [isPresentationActive]);

  // Step 6 auto-scroll to range simulator
  useEffect(() => {
    if (isPresentationActive && presentationStep === 6) {
      const timer = setTimeout(() => {
        const el = document.getElementById('range-simulator');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPresentationActive, presentationStep]);

  // Calculations
  const monthlyPetrolCost = useMemo(() => {
    if (petrolMileage <= 0) return 0;
    const litres = monthlyDistance / petrolMileage;
    return Math.round(litres * petrolPrice);
  }, [monthlyDistance, petrolMileage, petrolPrice]);

  const monthlyEvCost = useMemo(() => {
    const kwh = (monthlyDistance / 100) * evEnergyPer100km;
    return Math.round(kwh * electricityCost);
  }, [monthlyDistance, evEnergyPer100km, electricityCost]);

  const monthlyDifference = Math.max(0, monthlyPetrolCost - monthlyEvCost);
  const annualDifference = monthlyDifference * 12;
  const percentageSaved = monthlyPetrolCost > 0 ? Math.round((monthlyDifference / monthlyPetrolCost) * 100) : 0;

  // Recharts 12-month comparison data
  const chartData = useMemo(() => {
    return [
      {
        month: '3 Mo',
        Petrol: Math.round(monthlyPetrolCost * 3),
        Electric: Math.round(monthlyEvCost * 3),
      },
      {
        month: '6 Mo',
        Petrol: Math.round(monthlyPetrolCost * 6),
        Electric: Math.round(monthlyEvCost * 6),
      },
      {
        month: '9 Mo',
        Petrol: Math.round(monthlyPetrolCost * 9),
        Electric: Math.round(monthlyEvCost * 9),
      },
      {
        month: '12 Mo',
        Petrol: Math.round(monthlyPetrolCost * 12),
        Electric: Math.round(monthlyEvCost * 12),
      },
    ];
  }, [monthlyPetrolCost, monthlyEvCost]);

  // Range Section output
  const dailyDistance = oneWayKm * tripsPerDay;
  const estimatedDailyEnergy = ((dailyDistance / 100) * evEnergyPer100km).toFixed(2);
  const dailyEvCost = (Number(estimatedDailyEnergy) * electricityCost).toFixed(1);

  // Confidence Pill: HIGH (<40 km), MODERATE (40-80 km), LOW (>80 km)
  const rangeConfidence = useMemo(() => {
    if (dailyDistance < 40) {
      return {
        level: 'HIGH',
        color: 'border-[#00E08A]/40 bg-[#00E08A]/15 text-[#00E08A]',
        dotColor: 'bg-[#00E08A]',
        summary: 'Easily covered on a single charge with 65%+ reserve buffer.',
        details: 'You can commute multiple days between charges without any range concern.',
      };
    }
    if (dailyDistance <= 80) {
      return {
        level: 'MODERATE',
        color: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
        dotColor: 'bg-amber-400',
        summary: 'Comfortably within real-world TrueRange™ on overnight charging.',
        details: 'A simple overnight 5A plug-in replenishes full range while you sleep.',
      };
    }
    return {
      level: 'LOW',
      color: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
      dotColor: 'bg-rose-400',
      summary: 'High daily mileage. May require mid-day top-up or nightly full cycle.',
      details: 'Fast-charging via public Ather Grid or workplace 15A socket is recommended.',
    };
  }, [dailyDistance]);

  // Goal message generator
  const getGoalMessage = (goal: SavingsGoalCategory): string => {
    switch (goal) {
      case 'Weekend travel': {
        const trips = Math.max(1, Math.round(annualDifference / 6000));
        return `That's about ${trips} weekend road trips or hill-station getaways funded entirely by your petrol savings!`;
      }
      case 'Investments': {
        const sipMonthly = Math.round(monthlyDifference).toLocaleString('en-IN');
        const futureValue5Yr = Math.round(annualDifference * 5.6).toLocaleString('en-IN');
        return `That's an automatic SIP of ₹${sipMonthly}/month compounding to over ₹${futureValue5Yr} in 5 years!`;
      }
      case 'Fitness': {
        const gymMemberships = Math.max(1, Math.round(annualDifference / 14000));
        return `That covers ${gymMemberships} full annual premium gym memberships or sports club coaching packages every year.`;
      }
      case 'Entertainment': {
        const movieOutings = Math.round(annualDifference / 1500);
        return `That's about ${movieOutings} dinner & movie dates or 4 years of 4K streaming subscriptions covered.`;
      }
      case 'Education': {
        const courses = Math.max(1, Math.round(annualDifference / 9000));
        return `That funds ${courses} professional tech certifications, masterclasses, or specialized skill courses every year.`;
      }
      default:
        return '';
    }
  };

  const handleResetDefaults = () => {
    setMonthlyDistance(600);
    setPetrolPrice(105);
    setPetrolMileage(45);
    setEvEnergyPer100km(3.0);
    setElectricityCost(8.0);
  };

  return (
    <div className="w-full relative overflow-hidden bg-[#0B0D10] text-[#F5F7FA] pb-24">
      {/* Subtle emerald atmospheric background glow */}
      <div
        className="absolute top-20 right-1/4 w-[600px] h-[500px] pointer-events-none rounded-full blur-[150px] opacity-20 bg-[#00E08A]/30"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 relative z-10">
        <MotionSection alternate={false} className="!py-0 !px-0">
          {/* 1. HEADER */}
          <MotionItem>
            <div className="flex flex-col items-start max-w-3xl mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#00E08A] bg-[#00E08A]/10 px-3.5 py-1 rounded-full border border-[#00E08A]/25">
                  Financial Economics & TCO
                </span>
                <Badge variant="ACADEMIC PROTOTYPE" label="DEMO CALCULATION" />
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F7FA] leading-[1.1] mb-4">
                Total Cost of Ownership & Savings
              </h1>

              <p className="text-sm sm:text-base text-[#9AA3AF] leading-relaxed">
                Compare actual running expenses between internal combustion scooters and electric mobility.
                Adjust the sliders below to match your daily commute distance, local fuel costs, and home power tariffs.
              </p>
            </div>
          </MotionItem>

          {/* 2. TWO-COLUMN LAYOUT (Inputs Left, Results Right, stacks on mobile) */}
          <MotionItem>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* LEFT COLUMN: INPUT SLIDERS */}
              <div className="lg:col-span-5 bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00E08A] block">
                      Parameter Inputs
                    </span>
                    <h2 className="font-heading text-lg font-semibold text-[#F5F7FA]">
                      Your Commute Variables
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1.5 text-xs text-[#9AA3AF] hover:text-[#00E08A] transition-colors font-mono cursor-pointer"
                    title="Reset to demo defaults"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* SLIDER 1: Monthly Distance (km) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-[#F5F7FA] flex items-center gap-1.5">
                        <Gauge size={14} className="text-[#00E08A]" />
                        Monthly distance (km)
                      </label>
                      <span className="font-mono text-sm font-bold text-[#00E08A] tabular-nums bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.08]">
                        {monthlyDistance} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={2000}
                      step={25}
                      value={monthlyDistance}
                      onChange={(e) => setMonthlyDistance(Number(e.target.value))}
                      className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E08A]"
                    />
                    <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1.5">
                      <span>100 km (~3 km/d)</span>
                      <span>1,000 km</span>
                      <span>2,000 km (~66 km/d)</span>
                    </div>
                  </div>

                  {/* SLIDER 2: Petrol Price per Litre */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-[#F5F7FA] flex items-center gap-1.5">
                        <Fuel size={14} className="text-amber-400" />
                        Petrol price per litre
                      </label>
                      <span className="font-mono text-sm font-bold text-amber-300 tabular-nums bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.08]">
                        ₹{petrolPrice}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={85}
                      max={130}
                      step={1}
                      value={petrolPrice}
                      onChange={(e) => setPetrolPrice(Number(e.target.value))}
                      className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1.5">
                      <span>₹85/L</span>
                      <span>₹105/L (Metro Avg)</span>
                      <span>₹130/L</span>
                    </div>
                  </div>

                  {/* SLIDER 3: Petrol Scooter Mileage (km/L) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-[#F5F7FA] flex items-center gap-1.5">
                        <TrendingDown size={14} className="text-rose-400" />
                        Petrol scooter mileage (km/l)
                      </label>
                      <span className="font-mono text-sm font-bold text-rose-300 tabular-nums bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.08]">
                        {petrolMileage} km/L
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={65}
                      step={1}
                      value={petrolMileage}
                      onChange={(e) => setPetrolMileage(Number(e.target.value))}
                      className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400"
                    />
                    <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1.5">
                      <span>25 km/L (Heavy traffic)</span>
                      <span>45 km/L (Standard)</span>
                      <span>65 km/L</span>
                    </div>
                  </div>

                  {/* SLIDER 4: EV Energy Use (kWh per 100 km) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-[#F5F7FA] flex items-center gap-1.5">
                          <Zap size={14} className="text-[#00E08A]" />
                          EV energy use (kWh/100 km)
                        </label>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Demo assumption
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#00E08A] tabular-nums bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.08]">
                        {evEnergyPer100km.toFixed(1)} kWh
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1.5}
                      max={5.0}
                      step={0.1}
                      value={evEnergyPer100km}
                      onChange={(e) => setEvEnergyPer100km(Number(e.target.value))}
                      className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E08A]"
                    />
                    <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1.5">
                      <span>1.5 kWh (Eco)</span>
                      <span>3.0 kWh (Real City)</span>
                      <span>5.0 kWh</span>
                    </div>
                  </div>

                  {/* SLIDER 5: Electricity Cost per kWh */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-[#F5F7FA] flex items-center gap-1.5">
                        <Coins size={14} className="text-blue-400" />
                        Electricity cost per kWh
                      </label>
                      <span className="font-mono text-sm font-bold text-blue-300 tabular-nums bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.08]">
                        ₹{electricityCost.toFixed(1)}/unit
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4.0}
                      max={15.0}
                      step={0.5}
                      value={electricityCost}
                      onChange={(e) => setElectricityCost(Number(e.target.value))}
                      className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400"
                    />
                    <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1.5">
                      <span>₹4 (Subsidized)</span>
                      <span>₹8 (Domestic Avg)</span>
                      <span>₹15 (Commercial)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-[#9AA3AF] flex items-start gap-2">
                  <Info size={14} className="text-[#00E08A] shrink-0 mt-0.5" />
                  <span>
                    Calculations automatically adapt in real-time. Pre-configured with average Indian metropolitan rates.
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: RESULTS & RECHARTS */}
              <div className="lg:col-span-7 space-y-6">
                {/* BIG ANNUAL SAVINGS HERO CARD */}
                <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E08A]/10 rounded-full blur-[80px] pointer-events-none" />

                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00E08A] block mb-1">
                    Annual Operational Delta
                  </span>

                  {/* HUGE ACCENT GREEN ANNUAL SAVINGS */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-4">
                    <motion.span
                      key={annualDifference}
                      initial={{ scale: prefersReduced ? 1 : 0.96 }}
                      animate={{ scale: 1 }}
                      className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl text-[#00E08A] tracking-tight tabular-nums"
                    >
                      ₹{annualDifference.toLocaleString('en-IN')}
                    </motion.span>
                    <span className="text-sm sm:text-base font-semibold text-[#9AA3AF]">
                      / year saved in fuel
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#9AA3AF] mb-6">
                    By switching from petrol to electric, you reduce recurring commute energy expenses by ~
                    <span className="text-[#00E08A] font-semibold">{percentageSaved}%</span> every month.
                  </p>

                  {/* 3 Live Metric Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-white/[0.08]">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[11px] uppercase tracking-wider text-[#9AA3AF] block mb-1">
                        Monthly Petrol Cost
                      </span>
                      <div className="font-heading font-bold text-lg text-amber-300 tabular-nums">
                        ₹{monthlyPetrolCost.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#9AA3AF]">
                        ~{(monthlyDistance / petrolMileage).toFixed(1)} L/mo
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[11px] uppercase tracking-wider text-[#9AA3AF] block mb-1">
                        Monthly EV Cost
                      </span>
                      <div className="font-heading font-bold text-lg text-[#00E08A] tabular-nums">
                        ₹{monthlyEvCost.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#9AA3AF]">
                        ~{((monthlyDistance / 100) * evEnergyPer100km).toFixed(1)} kWh/mo
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#00E08A]/[0.08] border border-[#00E08A]/25">
                      <span className="text-[11px] uppercase tracking-wider text-[#00E08A] block mb-1 font-semibold">
                        Monthly Savings
                      </span>
                      <div className="font-heading font-bold text-lg text-[#00E08A] tabular-nums">
                        +₹{monthlyDifference.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#9AA3AF]">
                        in your bank every month
                      </span>
                    </div>
                  </div>
                </div>

                {/* SMALL RECHARTS BAR CHART (12-MONTH COMPARISON) */}
                <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9AA3AF] block">
                        Cumulative Comparison
                      </span>
                      <h3 className="font-heading text-base font-semibold text-[#F5F7FA]">
                        Petrol vs EV Cumulative Spend (12 Months)
                      </h3>
                    </div>
                    <Badge variant="DEMO DATA" label="12-MO PROJECTION" />
                  </div>

                  <div className="h-56 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                          dataKey="month"
                          stroke="#9AA3AF"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#9AA3AF"
                          fontSize={11}
                          tickLine={false}
                          tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#16191E',
                            borderColor: 'rgba(255,255,255,0.12)',
                            borderRadius: '12px',
                            color: '#F5F7FA',
                            fontSize: '12px',
                          }}
                          formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        />
                        <Bar
                          dataKey="Petrol"
                          fill="#F59E0B"
                          radius={[4, 4, 0, 0]}
                          name="Petrol Scooter (Cumulative)"
                        />
                        <Bar
                          dataKey="Electric"
                          fill="#00E08A"
                          radius={[4, 4, 0, 0]}
                          name="Electric (Cumulative)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* MANDATORY NOTE */}
                  <p className="text-[11px] text-[#9AA3AF]/80 italic mt-3 pt-3 border-t border-white/[0.06]">
                    * Actual savings depend on usage, electricity tariff, charging method and vehicle efficiency.
                  </p>
                </div>
              </div>
            </div>
          </MotionItem>

          {/* 3. SECTION "WHAT WOULD YOU DO WITH YOUR POTENTIAL SAVINGS?" */}
          <MotionItem className="mt-12">
            <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              <div className="mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00E08A] block mb-1">
                  Lifestyle Transformation
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F5F7FA]">
                  What would you do with your potential savings?
                </h2>
                <p className="text-xs sm:text-sm text-[#9AA3AF] mt-1">
                  Select a category to see how ₹{annualDifference.toLocaleString('en-IN')} in fuel savings compounds into real-world lifestyle upgrades.
                </p>
              </div>

              {/* 5 Clickable Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                {(
                  [
                    { key: 'Weekend travel', icon: <Plane size={20} /> },
                    { key: 'Investments', icon: <Coins size={20} /> },
                    { key: 'Fitness', icon: <Dumbbell size={20} /> },
                    { key: 'Entertainment', icon: <Film size={20} /> },
                    { key: 'Education', icon: <GraduationCap size={20} /> },
                  ] as const
                ).map(({ key, icon }) => {
                  const isSelected = selectedGoal === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedGoal(key)}
                      className={`p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#00E08A] bg-[#00E08A]/[0.1] shadow-[0_0_20px_rgba(0,224,138,0.2)]'
                          : 'border-white/[0.08] bg-[#16191E] hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                          isSelected
                            ? 'bg-[#00E08A] text-[#0B0D10]'
                            : 'bg-white/[0.05] text-[#9AA3AF]'
                        }`}
                      >
                        {icon}
                      </div>

                      <span
                        className={`font-heading font-semibold text-sm sm:text-base ${
                          isSelected ? 'text-[#00E08A]' : 'text-[#F5F7FA]'
                        }`}
                      >
                        {key}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Friendly Line Output Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#00E08A]/[0.06] border border-[#00E08A]/25 flex items-start gap-3.5">
                <Sparkles size={20} className="text-[#00E08A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#00E08A] block mb-1">
                    Savings In Action: {selectedGoal}
                  </span>
                  <p className="text-sm sm:text-base text-[#F5F7FA] font-medium leading-relaxed">
                    {getGoalMessage(selectedGoal)}
                  </p>
                </div>
              </div>
            </div>
          </MotionItem>

          {/* 4. RANGE SECTION: "CAN I MAKE IT?" */}
          <MotionItem className="mt-12" id="range-simulator">
            <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00E08A]">
                      Range Feasibility Simulator
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F5F7FA]">
                    Can I Make It?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9AA3AF] mt-1 max-w-xl">
                    Simulate your real daily door-to-door transit route to verify single-charge battery safety margins.
                  </p>
                </div>

                <Badge
                  variant="ACADEMIC PROTOTYPE"
                  label="DEMO ROUTE MODEL. MAP/API INTEGRATION REQUIRED FOR PRODUCTION"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Inputs Left (lg:col-span-7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Start Text */}
                    <div>
                      <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                        Start Point
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00E08A]" />
                        <input
                          type="text"
                          value={routeStart}
                          onChange={(e) => setRouteStart(e.target.value)}
                          placeholder="e.g. Home, Indiranagar"
                          className="w-full bg-[#16191E] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                        />
                      </div>
                    </div>

                    {/* Destination Text */}
                    <div>
                      <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                        Destination
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                        <input
                          type="text"
                          value={routeDestination}
                          onChange={(e) => setRouteDestination(e.target.value)}
                          placeholder="e.g. Office, Manyata Tech Park"
                          className="w-full bg-[#16191E] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Stop */}
                  <div>
                    <label className="text-xs font-semibold text-[#9AA3AF] block mb-1.5">
                      Optional Stop / Errand (Optional)
                    </label>
                    <input
                      type="text"
                      value={routeStop}
                      onChange={(e) => setRouteStop(e.target.value)}
                      placeholder="e.g. Supermarket, School Pickup, Gym"
                      className="w-full bg-[#16191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
                    />
                  </div>

                  {/* Sliders: One-Way Distance & Trips per Day */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* One-way distance km */}
                    <div className="p-4 rounded-xl bg-[#16191E] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-[#F5F7FA]">
                          One-way distance:
                        </label>
                        <span className="font-mono text-xs font-bold text-[#00E08A]">
                          {oneWayKm} km
                        </span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={60}
                        step={1}
                        value={oneWayKm}
                        onChange={(e) => setOneWayKm(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E08A]"
                      />
                    </div>

                    {/* Trips per Day */}
                    <div className="p-4 rounded-xl bg-[#16191E] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-[#F5F7FA]">
                          Trips per day:
                        </label>
                        <span className="font-mono text-xs font-bold text-[#00E08A]">
                          {tripsPerDay} {tripsPerDay === 2 ? '(Roundtrip)' : 'trips'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTripsPerDay(num)}
                            className={`flex-1 py-1 rounded text-xs font-mono font-semibold border transition-colors ${
                              tripsPerDay === num
                                ? 'border-[#00E08A] bg-[#00E08A]/15 text-[#00E08A]'
                                : 'border-white/10 bg-white/[0.02] text-[#9AA3AF] hover:border-white/20'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outputs Right (lg:col-span-5) */}
                <div className="lg:col-span-5 bg-[#16191E] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF] block mb-2">
                      Route Simulation Result
                    </span>

                    {/* Daily Distance & Energy */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-[11px] text-[#9AA3AF] block mb-1">
                          Total Daily Distance
                        </span>
                        <div className="font-heading font-bold text-2xl text-[#F5F7FA] tabular-nums">
                          {dailyDistance} km
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-[11px] text-[#9AA3AF] block mb-1">
                          Estimated Energy
                        </span>
                        <div className="font-heading font-bold text-2xl text-[#00E08A] tabular-nums">
                          {estimatedDailyEnergy} <span className="text-xs text-[#9AA3AF]">kWh</span>
                        </div>
                        <span className="text-[10px] text-[#9AA3AF]">
                          ~₹{dailyEvCost} daily power
                        </span>
                      </div>
                    </div>

                    {/* Confidence Pill */}
                    <div className="mb-6">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9AA3AF] block mb-2">
                        Confidence Evaluation
                      </span>
                      <div
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${rangeConfidence.color}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${rangeConfidence.dotColor} animate-pulse`} />
                        <span>{rangeConfidence.level} CONFIDENCE</span>
                      </div>

                      <p className="text-xs text-[#F5F7FA] font-medium mt-3 leading-relaxed">
                        {rangeConfidence.summary}
                      </p>
                      <p className="text-[11px] text-[#9AA3AF] mt-1 leading-relaxed">
                        {rangeConfidence.details}
                      </p>
                    </div>
                  </div>

                  {/* Plan My Test Ride Button */}
                  <div className="pt-4 border-t border-white/[0.06]">
                    <PrimaryButton
                      to="/test-ride"
                      size="md"
                      className="w-full justify-center"
                      icon={<ArrowRight size={16} />}
                    >
                      Plan My Test Ride
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </MotionItem>

          {/* 5. BOTTOM NAVIGATION BAR */}
          <MotionItem className="mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#111418] border border-white/[0.08]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#9AA3AF] block">
                  Next Step in EV Journey
                </span>
                <span className="font-heading font-semibold text-lg text-[#F5F7FA]">
                  Ready to see how charging fits your daily routine?
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SecondaryButton to="/profile" size="md">
                  Back to Profile
                </SecondaryButton>
                <PrimaryButton to="/charging" size="md" icon={<ArrowRight size={16} />}>
                  Where Would I Charge?
                </PrimaryButton>
              </div>
            </div>
          </MotionItem>
        </MotionSection>
      </div>
    </div>
  );
};
