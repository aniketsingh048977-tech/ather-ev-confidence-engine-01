/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PetrolModel {
  id: string;
  brand: string;
  model: string;
  category: 'scooter' | 'motorcycle';
  avgMileageKmPerL: number;
  // Estimated base resale value in 2026 by model year (in INR)
  yearValues: {
    [year: number]: number;
  };
}

export const ATHER_SWITCH_BONUS = 10000; // Flat ₹10,000 festive exchange top-up
export const DEFAULT_PETROL_PRICE_PER_LITRE = 104.5;
export const ATHER_ELEC_COST_PER_KM = 0.32; // ~₹0.32 per km charging at home

export const POPULAR_PETROL_MODELS: PetrolModel[] = [
  // Honda
  {
    id: 'honda-activa-6g',
    brand: 'Honda',
    model: 'Activa 6G (110cc)',
    category: 'scooter',
    avgMileageKmPerL: 45,
    yearValues: {
      2024: 56000,
      2023: 50000,
      2022: 44000,
      2021: 39000,
      2020: 34000,
      2019: 29000,
      2018: 24000,
    },
  },
  {
    id: 'honda-activa-125',
    brand: 'Honda',
    model: 'Activa 125',
    category: 'scooter',
    avgMileageKmPerL: 42,
    yearValues: {
      2024: 60000,
      2023: 54000,
      2022: 47000,
      2021: 42000,
      2020: 36000,
      2019: 31000,
      2018: 26000,
    },
  },
  {
    id: 'honda-dio',
    brand: 'Honda',
    model: 'Dio 110 / 125',
    category: 'scooter',
    avgMileageKmPerL: 44,
    yearValues: {
      2024: 53000,
      2023: 47000,
      2022: 41000,
      2021: 36000,
      2020: 31000,
      2019: 27000,
      2018: 22000,
    },
  },

  // TVS
  {
    id: 'tvs-jupiter-110',
    brand: 'TVS',
    model: 'Jupiter 110',
    category: 'scooter',
    avgMileageKmPerL: 46,
    yearValues: {
      2024: 54000,
      2023: 48000,
      2022: 42000,
      2021: 37000,
      2020: 32000,
      2019: 27000,
      2018: 22000,
    },
  },
  {
    id: 'tvs-jupiter-125',
    brand: 'TVS',
    model: 'Jupiter 125',
    category: 'scooter',
    avgMileageKmPerL: 43,
    yearValues: {
      2024: 59000,
      2023: 52000,
      2022: 46000,
      2021: 40000,
      2020: 35000,
      2019: 30000,
      2018: 25000,
    },
  },
  {
    id: 'tvs-ntorq-125',
    brand: 'TVS',
    model: 'NTorq 125 (Race/Disc)',
    category: 'scooter',
    avgMileageKmPerL: 38,
    yearValues: {
      2024: 63000,
      2023: 56000,
      2022: 49000,
      2021: 43000,
      2020: 37000,
      2019: 32000,
      2018: 27000,
    },
  },

  // Suzuki
  {
    id: 'suzuki-access-125',
    brand: 'Suzuki',
    model: 'Access 125 (Ride Connect/Special)',
    category: 'scooter',
    avgMileageKmPerL: 45,
    yearValues: {
      2024: 58000,
      2023: 51000,
      2022: 45000,
      2021: 40000,
      2020: 35000,
      2019: 30000,
      2018: 25000,
    },
  },
  {
    id: 'suzuki-burgman-125',
    brand: 'Suzuki',
    model: 'Burgman Street 125',
    category: 'scooter',
    avgMileageKmPerL: 42,
    yearValues: {
      2024: 64000,
      2023: 57000,
      2022: 50000,
      2021: 44000,
      2020: 38000,
      2019: 33000,
      2018: 27000,
    },
  },

  // Hero
  {
    id: 'hero-maestro-edge',
    brand: 'Hero',
    model: 'Maestro Edge 110 / 125',
    category: 'scooter',
    avgMileageKmPerL: 44,
    yearValues: {
      2024: 50000,
      2023: 44000,
      2022: 38000,
      2021: 33000,
      2020: 28000,
      2019: 24000,
      2018: 20000,
    },
  },
  {
    id: 'hero-pleasure-plus',
    brand: 'Hero',
    model: 'Pleasure+ 110',
    category: 'scooter',
    avgMileageKmPerL: 48,
    yearValues: {
      2024: 48000,
      2023: 42000,
      2022: 36000,
      2021: 31000,
      2020: 26000,
      2019: 22000,
      2018: 18000,
    },
  },
  {
    id: 'hero-splendor-plus',
    brand: 'Hero',
    model: 'Splendor Plus (100cc)',
    category: 'motorcycle',
    avgMileageKmPerL: 60,
    yearValues: {
      2024: 52000,
      2023: 46000,
      2022: 40000,
      2021: 35000,
      2020: 30000,
      2019: 26000,
      2018: 21000,
    },
  },

  // Yamaha
  {
    id: 'yamaha-fascino-125',
    brand: 'Yamaha',
    model: 'Fascino 125 Fi Hybrid',
    category: 'scooter',
    avgMileageKmPerL: 48,
    yearValues: {
      2024: 59000,
      2023: 52000,
      2022: 46000,
      2021: 40000,
      2020: 35000,
      2019: 30000,
      2018: 25000,
    },
  },

  // Bajaj
  {
    id: 'bajaj-pulsar-150',
    brand: 'Bajaj',
    model: 'Pulsar 150',
    category: 'motorcycle',
    avgMileageKmPerL: 42,
    yearValues: {
      2024: 65000,
      2023: 58000,
      2022: 51000,
      2021: 44000,
      2020: 38000,
      2019: 32000,
      2018: 26000,
    },
  },
];

export interface TargetAtherModel {
  id: string;
  name: string;
  tagline: string;
  price: number; // Approximate Ex-Showroom INR
  trueRangeKm: number;
  highlight: string;
  batteryKwh: string;
}

export const TARGET_ATHER_MODELS: TargetAtherModel[] = [
  {
    id: 'rizta-s',
    name: 'Ather Rizta S',
    tagline: 'The Sensible Family Scooter',
    price: 109999,
    trueRangeKm: 105,
    batteryKwh: '2.9 kWh',
    highlight: '34L Underseat Boot • DeepView Display',
  },
  {
    id: 'rizta-z',
    name: 'Ather Rizta Z',
    tagline: 'Family Comfort with SkidControl™',
    price: 144999,
    trueRangeKm: 125,
    batteryKwh: '3.7 kWh',
    highlight: 'Pillion Backrest • SkidControl™ • Google Maps',
  },
  {
    id: '450x-2-9',
    name: 'Ather 450X (2.9 kWh)',
    tagline: 'Pure Agility & Warp Acceleration',
    price: 139999,
    trueRangeKm: 90,
    batteryKwh: '2.9 kWh',
    highlight: '0-40 in 3.3s • Warp Mode • 7" Touchscreen',
  },
  {
    id: '450x-3-7',
    name: 'Ather 450X (3.7 kWh)',
    tagline: 'Flagship Performance & Range',
    price: 154999,
    trueRangeKm: 110,
    batteryKwh: '3.7 kWh',
    highlight: '110 km TrueRange • AutoHold™ • Alexa/WhatsApp',
  },
];

export type VehicleCondition = 'excellent' | 'good' | 'fair';

export const CONDITION_MULTIPLIERS: Record<VehicleCondition, { label: string; multiplier: number; desc: string }> = {
  excellent: {
    label: 'Mint / Excellent',
    multiplier: 1.06,
    desc: 'Single owner, regular authorized service, scratch-free bodywork',
  },
  good: {
    label: 'Good / Normal Wear',
    multiplier: 1.0,
    desc: 'Usual minor cosmetic scratches, mechanically sound, clean engine',
  },
  fair: {
    label: 'Fair / Working Daily',
    multiplier: 0.88,
    desc: 'Moderate wear, dented panels or due for minor maintenance',
  },
};

export interface ExchangeCalculationResult {
  baseTradeInValue: number;
  switchBonus: number;
  totalExchangeCredit: number;
  targetAther: TargetAtherModel;
  financedAmount: number;
  monthlyEmi: number;
  monthlyElectricityCost: number;
  totalNewMonthlyCost: number;
  currentMonthlyPetrolCost: number;
  netMonthlyCashSavings: number;
  threeYearCashBenefit: number;
  dailyCommuteKm: number;
}

export function calculateExchangeDeal({
  modelId,
  year,
  condition,
  dailyKm,
  targetAtherId,
  tenureMonths = 36,
  interestRateAnnual = 0.089, // 8.9% p.a.
}: {
  modelId: string;
  year: number;
  condition: VehicleCondition;
  dailyKm: number;
  targetAtherId: string;
  tenureMonths?: number;
  interestRateAnnual?: number;
}): ExchangeCalculationResult {
  const model = POPULAR_PETROL_MODELS.find((m) => m.id === modelId) || POPULAR_PETROL_MODELS[0];
  const targetAther = TARGET_ATHER_MODELS.find((a) => a.id === targetAtherId) || TARGET_ATHER_MODELS[1]; // default Rizta Z

  const rawYearValue = model.yearValues[year] || model.yearValues[2021] || 35000;
  const conditionMulti = CONDITION_MULTIPLIERS[condition].multiplier;
  const baseTradeInValue = Math.round((rawYearValue * conditionMulti) / 500) * 500;
  const switchBonus = ATHER_SWITCH_BONUS;
  const totalExchangeCredit = baseTradeInValue + switchBonus;

  // Monthly commute km (26 working days)
  const monthlyKm = dailyKm * 26;

  // Current petrol cost
  const monthlyLitres = monthlyKm / model.avgMileageKmPerL;
  const currentMonthlyPetrolCost = Math.round(monthlyLitres * DEFAULT_PETROL_PRICE_PER_LITRE);

  // Ather electric cost
  const monthlyElectricityCost = Math.round(monthlyKm * ATHER_ELEC_COST_PER_KM);

  // Financed principal (Ex-showroom price minus exchange credit, min ₹15,000)
  const financedAmount = Math.max(15000, targetAther.price - totalExchangeCredit);

  // Standard flat/reducing EMI estimation for EV loans
  // Flat rate approximation: (P + P * r * (tenure/12)) / tenure
  const totalInterest = financedAmount * interestRateAnnual * (tenureMonths / 12);
  const monthlyEmi = Math.round((financedAmount + totalInterest) / tenureMonths);

  // Total new monthly expenditure: Ather EMI + Electricity
  const totalNewMonthlyCost = monthlyEmi + monthlyElectricityCost;

  // Net difference: If petrol cost is ₹3,200 and Ather cost is ₹2,450 -> rider saves ₹750/mo!
  const netMonthlyCashSavings = currentMonthlyPetrolCost - totalNewMonthlyCost;

  // 3-Year total financial benefit:
  // (36 months * net monthly savings) + ~₹12,000 maintenance savings (oil, clutch, sparkplugs)
  const threeYearCashBenefit = (netMonthlyCashSavings * 36) + 14000;

  return {
    baseTradeInValue,
    switchBonus,
    totalExchangeCredit,
    targetAther,
    financedAmount,
    monthlyEmi,
    monthlyElectricityCost,
    totalNewMonthlyCost,
    currentMonthlyPetrolCost,
    netMonthlyCashSavings,
    threeYearCashBenefit,
    dailyCommuteKm: dailyKm,
  };
}

export function calculateTradeInValue(
  modelId: string,
  year: number,
  condition: VehicleCondition = 'good'
): number {
  const model = POPULAR_PETROL_MODELS.find((m) => m.id === modelId) || POPULAR_PETROL_MODELS[0];
  const rawYearValue = model.yearValues[year] || model.yearValues[2021] || 35000;
  const conditionMulti = CONDITION_MULTIPLIERS[condition]?.multiplier || 1.0;
  return Math.round((rawYearValue * conditionMulti) / 500) * 500;
}

