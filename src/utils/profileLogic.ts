/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizAnswers, RiderProfileData } from '../types';

export interface SignalRow {
  customerSignal: string;
  productAttribute: string;
  benefit: string;
}

export function checkPriorityMatchesQ7(priority?: string, yesFactor?: string): boolean {
  if (!priority || !yesFactor) return false;
  if (priority === 'Performance' && yesFactor === 'Great performance') return true;
  if (priority === 'Comfort' && yesFactor === 'Comfortable everyday riding') return true;
  if (priority === 'Range confidence' && yesFactor === 'Easy charging') return true;
  if (priority === 'Savings' && yesFactor === 'Lower running cost') return true;
  if (priority === 'Technology' && yesFactor === 'Better technology') return true;
  return false;
}

export function calculateScores(answers: QuizAnswers, currentLeadScore: number = 25) {
  const commute = answers.dailyCommute || '';
  const parking = answers.parkingType || '';
  const priority = answers.primaryPriority || '';
  const petrolSpend = Number(answers.monthlyFuelExpense || 0);
  const concern = answers.biggestConcern || '';
  const yesFactor = answers.yesFactor || '';

  // MATCH %:
  // Match % = 60 base, +10 if commute under 40 km, +10 if home or workplace parking,
  // +10 if priority matches a Q7 answer theme, +5 if petrol spend > 2000. Cap at 95.
  let matchScore = 60;
  if (commute === 'Under 10 km' || commute === '10-20 km' || commute === '20-40 km') {
    matchScore += 10;
  }
  if (parking === 'Private home parking' || parking === 'Workplace parking') {
    matchScore += 10;
  }
  if (checkPriorityMatchesQ7(priority, yesFactor)) {
    matchScore += 10;
  }
  if (petrolSpend > 2000) {
    matchScore += 5;
  }
  const matchPercentage = Math.min(95, Math.max(10, matchScore));

  // CONFIDENCE %:
  // Confidence % = 50, +15 home parking, +10 workplace, -10 not sure parking,
  // -15 if concern is "Not sure", +10 if commute under 20 km. Clamp 10 to 95.
  let confidenceScore = 50;
  if (parking === 'Private home parking') {
    confidenceScore += 15;
  } else if (parking === 'Workplace parking') {
    confidenceScore += 10;
  } else if (parking === 'Not sure') {
    confidenceScore -= 10;
  }

  if (concern === 'Not sure EVs are right for me') {
    confidenceScore -= 15;
  }

  if (commute === 'Under 10 km' || commute === '10-20 km') {
    confidenceScore += 10;
  }
  const finalConfidenceScore = Math.min(95, Math.max(10, confidenceScore));

  // Intent % = leadScore after quiz
  // LEAD SCORE: base 20, website visit +5, quiz started +10, quiz completed +15, recommendation viewed +10. Cap 100.
  const intentScore = Math.min(100, Math.max(10, currentLeadScore));

  return {
    matchPercentage,
    confidenceScore: finalConfidenceScore,
    intentScore,
  };
}

export function generateRiderProfile(answers: QuizAnswers, leadScoreAfterQuiz: number): RiderProfileData {
  const whoWillUse = answers.whoWillUse || '';
  const priority = answers.primaryPriority || '';
  const petrolSpend = Number(answers.monthlyFuelExpense || 0);
  const concern = answers.biggestConcern || '';

  // DETERMINISTIC PROFILE LOGIC (no AI choosing):
  // - Performance priority -> "The Performance Seeker"
  // - Family or Multiple riders -> "The Practical Family Rider"
  // - Savings priority OR petrol spend > 3000 -> "The Cost-Conscious Commuter"
  // - Concern is "Not sure EVs are right for me" -> "The EV-Curious Explorer"
  // - Otherwise -> "The Smart Urban Explorer"
  // (Apply in this order, first match wins.)

  let persona = 'The Smart Urban Explorer';
  let archetype = 'Connected City Commuter';
  let description = 'Daily city commuter seeking seamless navigation, refined design, and effortless urban agility.';
  let suggestedAtherModel = 'Ather 450X [VERIFIED ATHER PRODUCT DATA REQUIRED]';
  let keyDrivers = ['Connected dashboard controls and Google Maps navigation', 'Agile urban transit and instant response'];
  let addressedConcerns = ['Verified public fast-charging grid access across metropolitan hubs'];

  if (priority === 'Performance') {
    persona = 'The Performance Seeker';
    archetype = 'Thrill & Precision Enthusiast';
    description = 'Values instantaneous electric torque, Warp mode acceleration, and low center-of-gravity handling for spirited riding.';
    suggestedAtherModel = 'Ather 450 Series [VERIFIED ATHER PRODUCT DATA REQUIRED]';
    keyDrivers = ['Instantaneous electric torque from 0 RPM', 'Precision balanced aluminum chassis'];
    addressedConcerns = ['Thermal battery stability engineered for sustained peak performance bursts'];
  } else if (whoWillUse === 'Family' || whoWillUse === 'Multiple riders') {
    persona = 'The Practical Family Rider';
    archetype = 'Comfort & Multi-User Utility';
    description = 'Prioritizes spacious seating, expansive storage, effortless pillion balance, and intuitive multi-rider accessibility.';
    suggestedAtherModel = 'Ather Rizta Series [VERIFIED ATHER PRODUCT DATA REQUIRED]';
    keyDrivers = ['Extended family seat with generous pillion backrest', 'Deep underseat and front utility trunk capacity'];
    addressedConcerns = ['Gentle throttle modulation and SkidControl for shared household safety'];
  } else if (priority === 'Savings' || petrolSpend > 3000) {
    persona = 'The Cost-Conscious Commuter';
    archetype = 'Pragmatic TCO Maximizer';
    description = 'Focused on substantial operational savings, cutting monthly petrol expenses by 80%+, and predictable battery cycle life.';
    suggestedAtherModel = 'Ather 450S / Rizta [VERIFIED ATHER PRODUCT DATA REQUIRED]';
    keyDrivers = [
      `Potential to recover ₹${Math.round(petrolSpend * 0.82).toLocaleString('en-IN')}+ monthly in running cost delta`,
      'Low long-term maintenance costs with regenerative braking',
    ];
    addressedConcerns = ['Long-term battery health protected by factory warranty'];
  } else if (concern === 'Not sure EVs are right for me') {
    persona = 'The EV-Curious Explorer';
    archetype = 'Pragmatic Transitioner';
    description = 'Intrigued by electric convenience but seeking grounded proof on real-world battery health, charging, and weather durability.';
    suggestedAtherModel = 'Ather 450 / Rizta [VERIFIED ATHER PRODUCT DATA REQUIRED]';
    keyDrivers = ['Transparent real-world range calculations', 'Home charging feasibility without society friction'];
    addressedConcerns = ['IP67 water-and-dust proofing for severe monsoon waterlogging'];
  }

  const { matchPercentage, confidenceScore, intentScore } = calculateScores(answers, leadScoreAfterQuiz);

  return {
    persona,
    archetype,
    description,
    suggestedAtherModel,
    matchScore: matchPercentage,
    confidenceScore,
    intentScore,
    keyDrivers,
    addressedConcerns,
    productDataRequirementNote: '[VERIFIED ATHER PRODUCT DATA REQUIRED]',
    generatedAt: new Date().toISOString(),
  };
}

export function generateWhyThisMatchRows(answers: QuizAnswers): SignalRow[] {
  const commute = answers.dailyCommute || '20-40 km';
  const parking = answers.parkingType || 'Private home parking';
  const priority = answers.primaryPriority || 'Efficiency';
  const petrolSpend = answers.monthlyFuelExpense || 3000;
  const concern = answers.biggestConcern || 'Range';

  return [
    {
      customerSignal: `Daily Commute: ${commute}`,
      productAttribute: '[VERIFIED PRODUCT DATA]',
      benefit: `Certified true-range comfortably covers your ${commute} roundtrip with over 50% battery buffer, eliminating midday top-up needs.`,
    },
    {
      customerSignal: `Parking Setup: ${parking}`,
      productAttribute: '[VERIFIED PRODUCT DATA]',
      benefit:
        parking === 'Private home parking'
          ? 'Overnight domestic 5A charging restores full range while you sleep for under ₹25 per cycle without public queues.'
          : 'Compatible with standard 5A sockets and Ather Grid fast chargers distributed across key commercial corridors.',
    },
    {
      customerSignal: `Priority: ${priority} | Monthly Fuel: ₹${petrolSpend.toLocaleString('en-IN')}`,
      productAttribute: '[VERIFIED PRODUCT DATA]',
      benefit: `Direct electric drivetrain efficiency slashes monthly fuel expenses while addressing ${concern.toLowerCase()} concerns via intelligent BMS safeguards.`,
    },
  ];
}
