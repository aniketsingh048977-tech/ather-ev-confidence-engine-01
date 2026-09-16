/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Fuel,
  Sparkles,
  Plane,
  Coins,
  GraduationCap,
  Home,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Share2,
  Check,
  RotateCcw,
  Sliders,
  DollarSign,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  calculatePetrolToSip,
  SipWealthResult,
  ATHER_SCOOTER_PRICES,
} from '../../utils/sipCalculator';
import { useAppState } from '../../context/AppContext';

interface PetrolToSipTimeMachineProps {
  className?: string;
  initialMonthlyFuel?: number;
  onBookRide?: () => void;
}

export const PetrolToSipTimeMachine: React.FC<PetrolToSipTimeMachineProps> = ({
  className = '',
  initialMonthlyFuel,
  onBookRide,
}) => {
  const navigate = useNavigate();
  const { quizAnswers, currentCustomer, logEvent, setLeadScore, leadScore } = useAppState();

  // Initial monthly fuel from context if available
  const defaultFuel = useMemo(() => {
    if (initialMonthlyFuel && initialMonthlyFuel > 0) return initialMonthlyFuel;
    if (quizAnswers.monthlyFuelExpense && quizAnswers.monthlyFuelExpense > 0) {
      return quizAnswers.monthlyFuelExpense;
    }
    return 3500;
  }, [initialMonthlyFuel, quizAnswers.monthlyFuelExpense]);

  // Sliders state
  const [monthlyFuel, setMonthlyFuel] = useState<number>(defaultFuel);
  const [years, setYears] = useState<number>(10);
  const [cagrPercent, setCagrPercent] = useState<number>(12); // standard 12% Nifty 50 historical CAGR
  const [includeInflation, setIncludeInflation] = useState<boolean>(true);
  const [selectedAtherModel, setSelectedAtherModel] = useState<keyof typeof ATHER_SCOOTER_PRICES>('rizta-z');
  const [activeTab, setActiveTab] = useState<'chart' | 'milestones'>('chart');
  const [copiedLink, setCopiedLink] = useState(false);

  // Wealth calculations
  const wealth: SipWealthResult = useMemo(() => {
    return calculatePetrolToSip(
      monthlyFuel,
      years,
      cagrPercent,
      includeInflation,
      selectedAtherModel
    );
  }, [monthlyFuel, years, cagrPercent, includeInflation, selectedAtherModel]);

  // Milestones list filtered by selected years
  const activeMilestones = useMemo(() => {
    return wealth.milestones.filter((m) => m.year <= years);
  }, [wealth.milestones, years]);

  const handleShareWealthSummary = () => {
    const text = `💰 *My Ather Petrol-to-SIP Wealth Compounding Report*\n` +
      `Monthly Fuel Diverted: ₹${monthlyFuel.toLocaleString('en-IN')}/mo\n` +
      `Time Horizon: ${years} Years at ${cagrPercent}% CAGR\n` +
      `*Ather Paid Off (Free Scooter):* Month ${wealth.freeAtherMonth}!\n` +
      `Petrol Burned with Zero Return: ₹${wealth.totalPetrolBurned.toLocaleString('en-IN')}\n` +
      `*Total Compounded Wealth Created:* ₹${wealth.totalCompoundedWealth.toLocaleString('en-IN')}\n` +
      `Free Compound Interest Gain: +₹${wealth.freeInterestEarned.toLocaleString('en-IN')}\n` +
      `Calculated via Ather Confidence Engine`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBookTestRide = () => {
    setLeadScore(Math.min(100, leadScore + 20));
    logEvent('sip_time_machine_booked', window.location.pathname, {
      monthlyFuel,
      years,
      wealthCreated: wealth.totalCompoundedWealth,
    });

    if (onBookRide) {
      onBookRide();
    } else {
      navigate('/test-ride');
    }
  };

  return (
    <div
      id="petrol-to-sip-time-machine"
      className={`relative w-full rounded-2xl bg-[#0E1217] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 sm:p-7 md:p-9 overflow-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-0 right-10 w-96 h-96 bg-[#00E08A]/10 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Header section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] text-xs font-semibold tracking-wide uppercase mb-3 font-mono">
            <TrendingUp size={13} className="text-[#00E08A]" />
            <span>Wealth Compounding Time Machine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Turn Your Daily Commute into a Mutual Fund Fortune
          </h2>
          <p className="text-sm sm:text-base text-[#9AA3AF] mt-1.5 max-w-2xl">
            Petrol burns to smoke at 0% return. If you divert what you spend at fuel stations into a standard 12% Nifty index SIP,
            your daily commute will generate life-changing personal net worth.
          </p>
        </div>

        {/* Free Scooter Callout Badge */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#00E08A]/20 to-transparent border border-[#00E08A]/35 shrink-0 self-start md:self-auto text-left">
          <div className="text-[10px] font-mono text-[#00E08A] uppercase tracking-wider font-bold">
            The Free Scooter Milestone
          </div>
          <div className="font-heading text-sm font-bold text-white mt-0.5">
            100% Paid Off by <span className="text-[#00E08A]">Month {wealth.freeAtherMonth}</span>
          </div>
          <div className="text-[10px] text-[#9AA3AF]">Cumulative petrol savings offset full on-road price</div>
        </div>
      </div>

      {/* Two-Column Stage: Left Controls, Right Graph & Milestones */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-6">
        
        {/* LEFT COLUMN: Variables & Sliders (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-[#090B0E] p-5 sm:p-6 rounded-2xl border border-white/[0.06]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A] block mb-1">
            Financial Variables
          </span>

          {/* SLIDER 1: Monthly Petrol Spend */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Fuel size={14} className="text-red-400" />
                Current Monthly Petrol Expense:
              </label>
              <span className="font-mono text-sm font-bold text-white bg-white/[0.06] px-2.5 py-0.5 rounded border border-white/10">
                ₹{monthlyFuel.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <input
              type="range"
              min={1500}
              max={10000}
              step={250}
              value={monthlyFuel}
              onChange={(e) => setMonthlyFuel(Number(e.target.value))}
              className="w-full accent-[#00E08A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1">
              <span>₹1,500 (~20 km/d)</span>
              <span>₹5,000</span>
              <span>₹10,000 (~120 km/d)</span>
            </div>
          </div>

          {/* SLIDER 2: Compounding Time Horizon */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white">
                Time Horizon:
              </label>
              <span className="font-mono text-sm font-bold text-[#00E08A] bg-[#00E08A]/10 px-2.5 py-0.5 rounded border border-[#00E08A]/25">
                {years} Years ({years * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-[#00E08A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1">
              <span>1 Year</span>
              <span>3 Yrs (Free Ather)</span>
              <span>5 Yrs</span>
              <span>10 Yrs</span>
            </div>
          </div>

          {/* SLIDER 3: Mutual Fund / Index CAGR Return */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white">
                Expected Annual Return (CAGR):
              </label>
              <span className="font-mono text-sm font-bold text-white bg-white/[0.06] px-2.5 py-0.5 rounded border border-white/10">
                {cagrPercent}% p.a.
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={16}
              step={0.5}
              value={cagrPercent}
              onChange={(e) => setCagrPercent(Number(e.target.value))}
              className="w-full accent-[#00E08A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9AA3AF] font-mono mt-1">
              <span>8% (Conservative)</span>
              <span>12% (Nifty Index Avg)</span>
              <span>16% (Aggressive)</span>
            </div>
          </div>

          {/* Model Price Benchmark */}
          <div>
            <label className="block text-xs text-[#9AA3AF] font-mono mb-2">
              Benchmark Target Scooter:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ATHER_SCOOTER_PRICES) as Array<keyof typeof ATHER_SCOOTER_PRICES>).map((key) => {
                const item = ATHER_SCOOTER_PRICES[key];
                const isSelected = selectedAtherModel === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedAtherModel(key)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00E08A]/10 border-[#00E08A] text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#9AA3AF] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.name}</div>
                    <div className="text-[11px] font-mono text-[#00E08A] mt-0.5">
                      ₹{item.onRoadPrice.toLocaleString('en-IN')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Petrol Inflation Toggle */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Account for Fuel Inflation (+5%/yr)</span>
              <span className="text-[11px] text-[#9AA3AF]">Petrol has risen ~5.5% CAGR in India historically</span>
            </div>
            <button
              type="button"
              onClick={() => setIncludeInflation(!includeInflation)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                includeInflation ? 'bg-[#00E08A]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  includeInflation ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Chart & Life Milestones (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Top Scorecard: The Shocking Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. Money Burned to Ashes */}
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25">
              <span className="text-[10px] uppercase font-mono text-red-400 block tracking-wider">
                Petrol Burned to Smoke
              </span>
              <div className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
                ₹{wealth.totalPetrolBurned.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-red-300/80 block mt-0.5">
                0% return • Zero wealth left
              </span>
            </div>

            {/* 2. Total Compounded Net Worth */}
            <div className="p-4 rounded-xl bg-[#00E08A]/15 border border-[#00E08A]/35 shadow-[0_0_20px_rgba(0,224,138,0.15)] sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-[#00E08A] block tracking-wider font-bold">
                  Compounded SIP Wealth Created
                </span>
                <span className="text-[10px] font-mono bg-[#00E08A]/20 text-[#00E08A] px-2 py-0.5 rounded-full">
                  +{cagrPercent}% CAGR
                </span>
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
                ₹{wealth.totalCompoundedWealth.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#9AA3AF] mt-1 flex items-center gap-1.5 flex-wrap">
                <span>Principal: ₹{wealth.totalPrincipalInvested.toLocaleString('en-IN')}</span>
                <span>•</span>
                <span className="text-[#00E08A] font-semibold">
                  Free Compound Interest: +₹{wealth.freeInterestEarned.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>

          {/* Visual Tabs: Interactive Chart vs Tangible Milestones */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('chart')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors cursor-pointer ${
                activeTab === 'chart'
                  ? 'bg-[#00E08A]/15 text-[#00E08A] border border-[#00E08A]/30'
                  : 'text-[#9AA3AF] hover:text-white'
              }`}
            >
              Compounding Wealth Growth Curve
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('milestones')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors cursor-pointer ${
                activeTab === 'milestones'
                  ? 'bg-[#00E08A]/15 text-[#00E08A] border border-[#00E08A]/30'
                  : 'text-[#9AA3AF] hover:text-white'
              }`}
            >
              Life Milestones Funded ({activeMilestones.length})
            </button>
          </div>

          {/* TAB 1: Chart View */}
          {activeTab === 'chart' && (
            <div className="p-5 rounded-2xl bg-[#090B0E] border border-white/[0.08] relative">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={wealth.timeline} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wealthGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E08A" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#00E08A" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="petrolRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                      dataKey="year"
                      stroke="#9AA3AF"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `Yr ${val}`}
                    />
                    <YAxis
                      stroke="#9AA3AF"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111418',
                        borderColor: '#ffffff15',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                      formatter={(value: any, name: any) => {
                        const num = Number(value);
                        if (name === 'sipCompoundedCorpus') {
                          return [`₹${num.toLocaleString('en-IN')}`, 'Compounded SIP Wealth'];
                        }
                        if (name === 'petrolBurnedCumulative') {
                          return [`₹${num.toLocaleString('en-IN')}`, 'Petrol Burned with 0 Return'];
                        }
                        return [`₹${num.toLocaleString('en-IN')}`, name];
                      }}
                      labelFormatter={(label) => `Year ${label} Timeline`}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(value) => (value === 'sipCompoundedCorpus' ? 'Compounded Wealth (SIP)' : 'Petrol Burned to Smoke')}
                    />
                    <Area
                      type="monotone"
                      dataKey="sipCompoundedCorpus"
                      stroke="#00E08A"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#wealthGreen)"
                    />
                    <Area
                      type="monotone"
                      dataKey="petrolBurnedCumulative"
                      stroke="#EF4444"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#petrolRed)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#9AA3AF]">
                <span>Assumption: 12% Nifty index CAGR with 5% annual petrol inflation</span>
                <span className="text-[#00E08A] font-semibold">
                  Free Ather Point: Month {wealth.freeAtherMonth}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Milestones View */}
          {activeTab === 'milestones' && (
            <div className="space-y-3">
              {activeMilestones.map((m, idx) => (
                <div
                  key={m.title}
                  className="p-4 rounded-xl bg-[#090B0E] border border-white/[0.06] flex items-start gap-3.5 hover:border-[#00E08A]/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] flex items-center justify-center shrink-0 mt-0.5">
                    {m.iconName === 'Scooter' && <ShieldCheck size={18} />}
                    {m.iconName === 'Plane' && <Plane size={18} />}
                    {m.iconName === 'Coins' && <Coins size={18} />}
                    {m.iconName === 'GraduationCap' && <GraduationCap size={18} />}
                    {m.iconName === 'Home' && <Home size={18} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E08A]">
                        {m.badge}
                      </span>
                      <span className="font-heading font-bold text-sm text-white">
                        ₹{m.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <h4 className="font-heading text-sm font-semibold text-white mt-0.5">
                      {m.title}
                    </h4>
                    <p className="text-xs text-[#9AA3AF] mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-xs font-semibold text-white block">
                Stop Burning ₹{monthlyFuel.toLocaleString('en-IN')} Every Month
              </span>
              <span className="text-[11px] text-[#9AA3AF]">
                Switch to Ather and begin auto-investing your fuel delta today.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleShareWealthSummary}
                className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check size={14} className="text-[#00E08A]" /> : <Share2 size={14} />}
                <span>{copiedLink ? 'Copied' : 'Share Report'}</span>
              </button>

              <button
                type="button"
                onClick={handleBookTestRide}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-[#00E08A] hover:bg-[#00c97b] text-[#0B0D10] font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(0,224,138,0.3)]"
              >
                <span>Book VIP Test Ride</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
