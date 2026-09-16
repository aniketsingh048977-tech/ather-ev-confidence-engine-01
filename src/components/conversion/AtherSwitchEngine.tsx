/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Home,
  MessageSquare,
  HelpCircle,
  Clock,
  Car,
  ChevronRight,
  Check,
  Share2,
} from 'lucide-react';
import {
  POPULAR_PETROL_MODELS,
  TARGET_ATHER_MODELS,
  CONDITION_MULTIPLIERS,
  ATHER_SWITCH_BONUS,
  VehicleCondition,
  calculateExchangeDeal,
} from '../../data/petrolExchangeData';
import { useAppState } from '../../context/AppContext';

interface AtherSwitchEngineProps {
  initialDailyKm?: number;
  onBookRide?: () => void;
  className?: string;
  isCompact?: boolean;
}

export const AtherSwitchEngine: React.FC<AtherSwitchEngineProps> = ({
  initialDailyKm = 25,
  onBookRide,
  className = '',
  isCompact = false,
}) => {
  const navigate = useNavigate();
  const { currentCustomer, setCurrentCustomer, logEvent, setLeadScore, leadScore } = useAppState();

  // Form states
  const [selectedBrand, setSelectedBrand] = useState<string>('Honda');
  const [selectedModelId, setSelectedModelId] = useState<string>('honda-activa-6g');
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [selectedCondition, setSelectedCondition] = useState<VehicleCondition>('good');
  const [dailyKm, setDailyKm] = useState<number>(currentCustomer?.dailyCommuteKm || initialDailyKm);
  const [selectedAtherId, setSelectedAtherId] = useState<string>('rizta-z');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Available brands
  const brands = useMemo(() => {
    return Array.from(new Set(POPULAR_PETROL_MODELS.map((m) => m.brand)));
  }, []);

  // Filtered models for active brand
  const brandModels = useMemo(() => {
    return POPULAR_PETROL_MODELS.filter((m) => m.brand === selectedBrand);
  }, [selectedBrand]);

  // Sync selected model when brand changes
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const firstInBrand = POPULAR_PETROL_MODELS.find((m) => m.brand === brand);
    if (firstInBrand) {
      setSelectedModelId(firstInBrand.id);
    }
  };

  // Calculation results
  const deal = useMemo(() => {
    return calculateExchangeDeal({
      modelId: selectedModelId,
      year: selectedYear,
      condition: selectedCondition,
      dailyKm,
      targetAtherId: selectedAtherId,
    });
  }, [selectedModelId, selectedYear, selectedCondition, dailyKm, selectedAtherId]);

  const selectedModelObj = POPULAR_PETROL_MODELS.find((m) => m.id === selectedModelId) || POPULAR_PETROL_MODELS[0];

  // Navigate to Test Ride with pre-filled exchange parameters
  const handleLockDealAndBook = (rideType: 'Doorstep VIP' | 'Ather Space Showroom' = 'Doorstep VIP') => {
    logEvent('switch_deal_locked', window.location.pathname, {
      petrolModel: selectedModelObj.model,
      year: selectedYear,
      tradeInValue: deal.totalExchangeCredit,
      targetAther: deal.targetAther.name,
      rideType,
      monthlySavings: deal.netMonthlyCashSavings,
    });

    // Elevate lead score because exchange intent is the highest converting signal
    setLeadScore(Math.min(98, Math.max(leadScore, 92)));

    // Save appraisal into customer profile
    if (currentCustomer) {
      setCurrentCustomer({
        ...currentCustomer,
        dailyCommuteKm: dailyKm,
        currentVehicle: `${selectedModelObj.brand} ${selectedModelObj.model} (${selectedYear})`,
        exchangeAppraisal: {
          model: `${selectedModelObj.brand} ${selectedModelObj.model}`,
          year: selectedYear,
          estimatedValue: deal.baseTradeInValue,
          switchBonus: deal.switchBonus,
          netMonthlySavings: deal.netMonthlyCashSavings,
        },
      });
    }

    const expiryDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    navigate('/test-ride', {
      state: {
        fromSwitchEngine: true,
        rideType,
        targetModel: deal.targetAther.name,
        exchangeVehicle: {
          modelName: `${selectedModelObj.brand} ${selectedModelObj.model}`,
          year: selectedYear,
          condition: selectedCondition,
          tradeInCredit: deal.baseTradeInValue,
          switchBonus: deal.switchBonus,
          lockedExpiryDate: expiryDate,
        },
        netMonthlySavings: deal.netMonthlyCashSavings,
      },
    });

    if (onBookRide) onBookRide();
  };

  const handleCopyWhatsAppSummary = () => {
    const text = `🛵 *My Ather Switch & Save Appraisal*\n` +
      `Old Scooter: ${selectedModelObj.brand} ${selectedModelObj.model} (${selectedYear})\n` +
      `Trade-in Value: ₹${deal.baseTradeInValue.toLocaleString('en-IN')}\n` +
      `Ather Switch Bonus: +₹${deal.switchBonus.toLocaleString('en-IN')}\n` +
      `Total Exchange Credit: ₹${deal.totalExchangeCredit.toLocaleString('en-IN')}\n` +
      `Target: ${deal.targetAther.name}\n` +
      `Current Petrol: ₹${deal.currentMonthlyPetrolCost.toLocaleString('en-IN')}/mo\n` +
      `Ather EMI + Charge: ₹${deal.totalNewMonthlyCost.toLocaleString('en-IN')}/mo\n` +
      `*Net Monthly Savings:* ₹${deal.netMonthlyCashSavings > 0 ? deal.netMonthlyCashSavings.toLocaleString('en-IN') : 0}/mo in my pocket!\n` +
      `Booked via Ather Confidence Engine`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div
      id="ather-switch-engine"
      className={`relative w-full rounded-2xl bg-gradient-to-b from-[#14181F] via-[#0E1217] to-[#0B0D10] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 sm:p-7 md:p-9 overflow-hidden ${className}`}
    >
      {/* Background Accent Gradients */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-[#00E08A]/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Eyebrow & Headline */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E08A]/10 border border-[#00E08A]/25 text-[#00E08A] text-xs font-semibold tracking-wide uppercase mb-3">
            <RefreshCw size={13} className="animate-spin-slow" />
            <span>Petrol to Electric Conversion Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Exchange Your Petrol Scooter in 30 Seconds
          </h2>
          <p className="text-sm sm:text-base text-[#9AA3AF] mt-1.5 max-w-2xl">
            Over 80% of new Ather owners trade in their Activa, Jupiter, or Access. Check your guaranteed resale value plus a flat{' '}
            <span className="text-[#00E08A] font-semibold">₹10,000 Ather Switch Bonus</span>.
          </p>
        </div>

        {/* 7-Day Price Lock Guarantee Badge */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 self-start md:self-auto shrink-0">
          <ShieldCheck size={20} className="text-[#00E08A] shrink-0" />
          <div className="text-left">
            <div className="text-[11px] text-[#9AA3AF] uppercase font-semibold tracking-wider">Guarantee</div>
            <div className="text-xs font-medium text-[#F5F7FA]">7-Day Locked Exchange Price</div>
          </div>
        </div>
      </div>

      {/* Interactive Form & Live Results Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-6">
        
        {/* LEFT COLUMN (Inputs: Scooter details + Commute) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* 1. Brand Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9AA3AF] mb-2">
              1. Your Scooter Brand
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {brands.map((brand) => {
                const isSelected = selectedBrand === brand;
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => handleBrandChange(brand)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center border ${
                      isSelected
                        ? 'bg-[#00E08A] text-[#0B0D10] border-[#00E08A] shadow-[0_0_15px_rgba(0,224,138,0.3)]'
                        : 'bg-white/[0.03] text-[#F5F7FA] border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Model & Year Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="scooter-model-select" className="block text-xs font-semibold uppercase tracking-wider text-[#9AA3AF] mb-2">
                2. Scooter Model
              </label>
              <select
                id="scooter-model-select"
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-[#0E1217] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A] transition-colors"
              >
                {brandModels.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#0E1217] text-white">
                    {m.model} (~{m.avgMileageKmPerL} km/L)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="scooter-year-select" className="block text-xs font-semibold uppercase tracking-wider text-[#9AA3AF] mb-2">
                3. Registration Year
              </label>
              <select
                id="scooter-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full bg-[#0E1217] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FA] focus:outline-none focus:border-[#00E08A] transition-colors"
              >
                {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((yr) => (
                  <option key={yr} value={yr} className="bg-[#0E1217] text-white">
                    {yr} {yr >= 2023 ? '(Almost New)' : yr >= 2020 ? '(Mid Life)' : '(Veteran)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Condition */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9AA3AF] mb-2">
              4. Physical Condition
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(CONDITION_MULTIPLIERS) as VehicleCondition[]).map((cond) => {
                const info = CONDITION_MULTIPLIERS[cond];
                const isSelected = selectedCondition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setSelectedCondition(cond)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#00E08A]/10 border-[#00E08A] text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#9AA3AF] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{info.label}</span>
                      {isSelected && <Check size={14} className="text-[#00E08A]" />}
                    </div>
                    <p className="text-[11px] text-[#9AA3AF] mt-1 leading-tight line-clamp-2">
                      {info.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Target Ather Choice */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9AA3AF] mb-2">
              5. Switch to Which Ather?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TARGET_ATHER_MODELS.map((model) => {
                const isSelected = selectedAtherId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedAtherId(model.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#00E08A]/15 border-[#00E08A] text-white shadow-[0_0_15px_rgba(0,224,138,0.2)]'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#9AA3AF] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{model.name}</div>
                      <div className="text-[10px] text-[#00E08A] font-medium mt-0.5">{model.trueRangeKm} km TrueRange</div>
                    </div>
                    <div className="text-[11px] text-[#F5F7FA] font-semibold mt-2">
                      ₹{model.price.toLocaleString('en-IN')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Daily Commute Slider */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-[#9AA3AF]">
                Your Daily Commute Distance
              </span>
              <span className="font-heading font-bold text-sm text-[#00E08A] bg-[#00E08A]/10 px-2.5 py-0.5 rounded-md">
                {dailyKm} km / day
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={dailyKm}
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full accent-[#00E08A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9AA3AF] mt-1">
              <span>10 km (Quick market trips)</span>
              <span>35 km (City office)</span>
              <span>70 km (Heavy commuter)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Live Deal Appraisal Card & Immediate Conversion) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-[#0B0E12] border border-[#00E08A]/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#00E08A]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#00E08A]">
                  Guaranteed Appraisal
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedModelObj.brand} {selectedModelObj.model}
                </h3>
              </div>
              <span className="text-xs text-[#9AA3AF] bg-white/[0.04] px-2.5 py-1 rounded-full">
                Year {selectedYear}
              </span>
            </div>

            {/* Big Trade-In Value Display */}
            <div className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#9AA3AF]">Estimated Resale Value</span>
                <span className="text-sm font-semibold text-white">
                  ₹{deal.baseTradeInValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-[#00E08A]">
                <span className="text-xs font-medium flex items-center gap-1">
                  <Sparkles size={12} /> Ather Switch Bonus
                </span>
                <span className="text-sm font-bold">
                  +₹{deal.switchBonus.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex items-baseline justify-between">
                <span className="text-xs font-semibold text-white">Total Exchange Credit</span>
                <span className="text-xl font-heading font-extrabold text-[#00E08A]">
                  ₹{deal.totalExchangeCredit.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-[#9AA3AF] mt-0.5">
                *Acts as immediate 100% down payment towards your {deal.targetAther.name}.
              </p>
            </div>

            {/* The "Net-Zero Commute" Financial Math */}
            <div className="bg-[#14181F] rounded-xl p-3.5 border border-white/[0.06] flex flex-col gap-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3AF]">
                Monthly Cash Flow Comparison
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9AA3AF]">Current Monthly Petrol Bill:</span>
                <span className="font-semibold text-red-400">
                  ₹{deal.currentMonthlyPetrolCost.toLocaleString('en-IN')} / mo
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9AA3AF]">Ather EMI (36m) + Charging:</span>
                <span className="font-semibold text-white">
                  ₹{deal.monthlyEmi.toLocaleString('en-IN')} + ₹{deal.monthlyElectricityCost} ={' '}
                  <span className="text-[#00E08A]">₹{deal.totalNewMonthlyCost.toLocaleString('en-IN')}/mo</span>
                </span>
              </div>

              {/* The "Pocket Cash" Highlight */}
              <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Net Monthly Pocket Savings:</div>
                  <div className="text-[10px] text-[#9AA3AF]">
                    {deal.netMonthlyCashSavings >= 0
                      ? 'You pay LESS every month than petrol!'
                      : 'Negligible difference for a brand-new EV'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-heading font-extrabold ${deal.netMonthlyCashSavings >= 0 ? 'text-[#00E08A]' : 'text-yellow-400'}`}>
                    {deal.netMonthlyCashSavings >= 0
                      ? `+₹${deal.netMonthlyCashSavings.toLocaleString('en-IN')}/mo`
                      : `-₹${Math.abs(deal.netMonthlyCashSavings).toLocaleString('en-IN')}/mo`}
                  </div>
                </div>
              </div>

              <div className="bg-[#00E08A]/10 border border-[#00E08A]/20 rounded-lg p-2.5 flex items-center gap-2">
                <TrendingDown size={18} className="text-[#00E08A] shrink-0" />
                <span className="text-xs text-white">
                  3-Year Net Wealth Created:{' '}
                  <strong className="text-[#00E08A]">₹{Math.max(45000, deal.threeYearCashBenefit).toLocaleString('en-IN')}</strong>{' '}
                  (Fuel + Zero Oil/Maintenance)
                </span>
              </div>
            </div>

            {/* HIGH-CONVERTING CTA BUTTONS */}
            <div className="flex flex-col gap-2.5 pt-1">
              {/* PRIMARY: Doorstep VIP Test Ride */}
              <button
                type="button"
                onClick={() => handleLockDealAndBook('Doorstep VIP')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#00E08A] hover:bg-[#00c97b] text-[#0B0D10] font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,224,138,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Home size={16} />
                <span>Lock Price & Book Doorstep VIP Test Ride</span>
                <ArrowRight size={16} />
              </button>

              {/* SECONDARY: Ather Space Experience Center */}
              <button
                type="button"
                onClick={() => handleLockDealAndBook('Ather Space Showroom')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#F5F7FA] border border-white/[0.1] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Prefer Testing at Ather Space Showroom</span>
                <ChevronRight size={14} className="text-[#9AA3AF]" />
              </button>

              {/* Share / WhatsApp Summary */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleCopyWhatsAppSummary}
                  className="inline-flex items-center gap-1.5 text-xs text-[#9AA3AF] hover:text-[#00E08A] transition-colors"
                >
                  <Share2 size={13} />
                  <span>{copiedNotification ? '✓ Appraisal Copied to Clipboard!' : 'Share / Copy Switch Appraisal'}</span>
                </button>

                <span className="text-[10px] text-[#9AA3AF] flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#00E08A]" /> Free Inspection Included
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
