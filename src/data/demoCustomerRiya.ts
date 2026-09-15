/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DemoLead, TestRideBooking, QuizAnswers, RiderProfileData, CustomerProfile } from '../types';

export const RIYA_DESAI_CUSTOMER: CustomerProfile = {
  id: 'cust-riya-desai',
  name: 'Riya Desai',
  phone: '+91 98230 12345',
  email: 'riya.desai@example.com',
  city: 'Pune',
  dailyCommuteKm: 15,
  monthlyFuelExpense: 3500,
  currentVehicle: '110cc Petrol Scooter',
  homeChargingAccess: true,
};

export const RIYA_DESAI_QUIZ_ANSWERS: QuizAnswers = {
  dailyCommute: '10-20 km',
  whoWillUse: 'Me',
  primaryPriority: 'Range confidence',
  parkingType: 'Apartment parking',
  monthlyFuelExpense: 3500,
  biggestConcern: 'Charging',
  yesFactor: 'Easy charging',
  completed: true,
};

export const RIYA_DESAI_PROFILE: RiderProfileData = {
  persona: 'The Smart Urban Commuter',
  archetype: 'Balanced Daily Commuter',
  description:
    'Focused daily city commuter prioritizing battery range predictability, reliable apartment charging ergonomics, and significant operational cost reduction.',
  suggestedAtherModel: 'Ather 450X Series [VERIFIED ATHER PRODUCT DATA REQUIRED]',
  matchScore: 92,
  confidenceScore: 88,
  intentScore: 85,
  keyDrivers: [
    'Daily 15 km Pune commute with 75%+ TrueRange™ buffer remaining',
    'Standard 5A domestic overnight socket charging feasibility',
    '~₹35,000+ verified annual fuel savings over petrol scooters',
  ],
  addressedConcerns: [
    'Apartment & RWA charging installation blueprint with standard sub-meter protocol',
    'IP67 weatherproof battery pack protected against monsoon waterlogging',
  ],
  productDataRequirementNote:
    'Ather 450X Series product attributes and Pune experience center data for academic demonstration. [VERIFIED ATHER PRODUCT DATA REQUIRED]',
  generatedAt: new Date().toISOString(),
};

export const RIYA_DESAI_BOOKING: TestRideBooking = {
  id: 'tr-riya-desai-001',
  customerName: 'Riya Desai',
  phone: '+91 98230 12345',
  email: 'riya.desai@example.com',
  city: 'Pune',
  preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  preferredTimeSlot: '11:30 AM - 01:00 PM',
  status: 'Scheduled',
  modelInterest: 'Ather 450X Series [VERIFIED ATHER PRODUCT DATA REQUIRED]',
  experienceCenter: 'Ather Space, Deccan Gymkhana [VERIFIED LOCATION DATA REQUIRED]',
  bookingRef: 'ATH-PUN-748291',
  primaryConcern: 'Charging in Apartment',
  consentTimestamp: new Date().toISOString(),
};

export const RIYA_DESAI_LEAD: DemoLead = {
  id: 'lead-riya-desai',
  name: 'Riya Desai',
  city: 'Pune',
  riderProfile: 'Smart Urban Commuter (Kothrud to Hinjewadi)',
  primaryConcern: 'Charging',
  matchPercentage: 92,
  leadScore: 85,
  journeyStage: 'TEST RIDE BOOKED',
  source: 'Direct',
  campaignName: 'Presentation Tour Live Assessment',
  testRideStatus: 'Scheduled',
  lastActivity: new Date().toISOString(),
  tag: 'DEMO CUSTOMER',
};
