/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SipProjectionPoint {
  year: number;
  month: number;
  petrolBurnedCumulative: number;
  sipInvestedPrincipal: number;
  sipCompoundedCorpus: number;
  compoundInterestEarned: number;
}

export interface SipMilestone {
  year: number;
  month: number;
  title: string;
  amount: number;
  description: string;
  badge: string;
  iconName: 'Scooter' | 'Plane' | 'GraduationCap' | 'Home' | 'Coins';
}

export interface SipWealthResult {
  monthlyPetrolSaved: number;
  years: number;
  cagrPercent: number;
  totalPetrolBurned: number; // what you would have set on fire
  totalPrincipalInvested: number;
  totalCompoundedWealth: number;
  freeInterestEarned: number;
  freeAtherMonth: number; // Month at which accumulated savings equal scooter on-road price
  timeline: SipProjectionPoint[];
  milestones: SipMilestone[];
}

export const ATHER_SCOOTER_PRICES = {
  'rizta-z': { name: 'Ather Rizta Z (3.7 kWh)', onRoadPrice: 145000 },
  '450x': { name: 'Ather 450X (3.7 kWh)', onRoadPrice: 155000 },
  '450-apex': { name: 'Ather 450 Apex', onRoadPrice: 189000 },
};

export function calculatePetrolToSip(
  monthlyFuelSavings: number = 3200,
  years: number = 10,
  cagrPercent: number = 12,
  includePetrolInflation: boolean = true,
  targetAtherId: keyof typeof ATHER_SCOOTER_PRICES = 'rizta-z'
): SipWealthResult {
  const targetAtherPrice = ATHER_SCOOTER_PRICES[targetAtherId].onRoadPrice;
  const annualInflation = includePetrolInflation ? 0.05 : 0.0; // 5% petrol price rise/yr
  const monthlyCagr = cagrPercent / 12 / 100;

  const timeline: SipProjectionPoint[] = [];
  let cumulativePetrol = 0;
  let cumulativePrincipal = 0;
  let currentCorpus = 0;
  let freeAtherMonth = -1;

  const totalMonths = years * 12;

  for (let m = 1; m <= totalMonths; m++) {
    const currentYear = Math.ceil(m / 12);
    // Adjusted monthly petrol cost with inflation
    const inflationFactor = Math.pow(1 + annualInflation, currentYear - 1);
    const effectiveMonthly = monthlyFuelSavings * inflationFactor;

    cumulativePetrol += effectiveMonthly;
    cumulativePrincipal += effectiveMonthly;

    // Compound monthly
    currentCorpus = (currentCorpus + effectiveMonthly) * (1 + monthlyCagr);

    // Detect when cumulative savings surpasses the Ather scooter price
    if (freeAtherMonth === -1 && cumulativePetrol >= targetAtherPrice) {
      freeAtherMonth = m;
    }

    // Record yearly timeline points (or key half-year points)
    if (m % 12 === 0 || m === 1) {
      timeline.push({
        year: Math.round((m / 12) * 10) / 10,
        month: m,
        petrolBurnedCumulative: Math.round(cumulativePetrol),
        sipInvestedPrincipal: Math.round(cumulativePrincipal),
        sipCompoundedCorpus: Math.round(currentCorpus),
        compoundInterestEarned: Math.round(Math.max(0, currentCorpus - cumulativePrincipal)),
      });
    }
  }

  // Generate real-world tangible life milestones
  const milestones: SipMilestone[] = [
    {
      year: Math.round((freeAtherMonth / 12) * 10) / 10,
      month: freeAtherMonth,
      title: 'Scooter 100% Free of Cost',
      amount: targetAtherPrice,
      description: `Cumulative fuel diversion has fully paid off the entire ₹${targetAtherPrice.toLocaleString('en-IN')} on-road cost of your ${ATHER_SCOOTER_PRICES[targetAtherId].name}.`,
      badge: 'BREAK-EVEN MILESTONE',
      iconName: 'Scooter',
    },
    {
      year: 3,
      month: 36,
      title: 'International Family Vacation Fund',
      amount: Math.round(timeline.find((t) => t.year === 3)?.sipCompoundedCorpus || 140000),
      description: 'Bali or Dubai all-inclusive getaway funded 100% by money that would have been burned at petrol pumps.',
      badge: 'YEAR 3 CORNERSTONE',
      iconName: 'Plane',
    },
    {
      year: 5,
      month: 60,
      title: 'Gold Reserve / Emergency Safety Net',
      amount: Math.round(timeline.find((t) => t.year === 5)?.sipCompoundedCorpus || 275000),
      description: 'Substantial liquid buffer providing 6 months of financial independence for your family.',
      badge: 'YEAR 5 COMPOUNDING JUMP',
      iconName: 'Coins',
    },
    {
      year: 7,
      month: 84,
      title: 'Child Higher Education Semester',
      amount: Math.round(timeline.find((t) => t.year === 7)?.sipCompoundedCorpus || 460000),
      description: 'Pay a full engineering or management semester fee without touching your salary or loans.',
      badge: 'YEAR 7 MILESTONE',
      iconName: 'GraduationCap',
    },
    {
      year: 10,
      month: 120,
      title: 'Apartment Down Payment / Dream Asset',
      amount: Math.round(timeline.find((t) => t.year === 10)?.sipCompoundedCorpus || 800000),
      description: 'Your daily scooter commute alone created three-quarters of a million rupees in compounding mutual fund wealth.',
      badge: 'DECADE COMPOUNDING WEALTH',
      iconName: 'Home',
    },
  ];

  return {
    monthlyPetrolSaved: monthlyFuelSavings,
    years,
    cagrPercent,
    totalPetrolBurned: Math.round(cumulativePetrol),
    totalPrincipalInvested: Math.round(cumulativePrincipal),
    totalCompoundedWealth: Math.round(currentCorpus),
    freeInterestEarned: Math.round(Math.max(0, currentCorpus - cumulativePrincipal)),
    freeAtherMonth: freeAtherMonth > 0 ? freeAtherMonth : 30,
    timeline,
    milestones,
  };
}
