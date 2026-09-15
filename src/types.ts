/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type City = 'Bengaluru' | 'Pune' | 'Mumbai' | 'Delhi' | 'Chennai' | 'Hyderabad';

export type PrimaryConcern = 'Range' | 'Charging' | 'Price' | 'Performance' | 'Service';

export type LeadSource = 'Instagram' | 'Google' | 'YouTube' | 'Referral' | 'Direct';

export type JourneyStage = 
  | 'Awareness'
  | 'Evaluation'
  | 'Intent'
  | 'PROFILE GENERATED'
  | 'Profile Generated'
  | 'Test Ride Booked'
  | 'Deliberation'
  | 'Decision Ready';

export type TestRideStatus = 'Scheduled' | 'Completed' | 'Pending' | 'Not Booked' | 'Cancelled';

export interface DemoLead {
  id: string;
  name: string;
  city: City;
  riderProfile: string;
  primaryConcern: PrimaryConcern | string;
  matchPercentage: number;
  leadScore: number; // 15 to 95
  journeyStage: JourneyStage;
  source: LeadSource;
  campaignName: string;
  testRideStatus: TestRideStatus;
  lastActivity: string; // ISO date string
  tag: 'DEMO CUSTOMER';
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city: City;
  dailyCommuteKm?: number;
  monthlyFuelExpense?: number;
  currentVehicle?: string;
  homeChargingAccess?: boolean;
}

export interface QuizAnswers {
  dailyCommute?: string; // Q1
  whoWillUse?: string; // Q2
  primaryPriority?: string; // Q3
  parkingType?: string; // Q4
  monthlyFuelExpense?: number; // Q5
  biggestConcern?: string; // Q6
  yesFactor?: string; // Q7
  weekendRiding?: string;
  pillionFrequency?: string;
  answersMap?: Record<string, any>;
  completed?: boolean;
}

export interface RiderProfileData {
  persona: string;
  archetype: string;
  description?: string;
  suggestedAtherModel: string;
  matchScore: number;
  confidenceScore: number;
  intentScore: number;
  keyDrivers: string[];
  addressedConcerns: string[];
  productDataRequirementNote: string;
  generatedAt?: string;
}

export interface UserEvent {
  id: string;
  timestamp: string;
  type: string;
  page: string;
  metadata?: Record<string, any>;
}

export interface TestRideBooking {
  id: string;
  customerName: string;
  phone: string;
  city: City;
  preferredDate: string;
  preferredTimeSlot: string;
  status: TestRideStatus;
  modelInterest: string;
  experienceCenter: string;
}

export interface AppStateContextType {
  currentCustomer: CustomerProfile | null;
  quizAnswers: QuizAnswers;
  riderProfile: RiderProfileData | null;
  leadScore: number;
  events: UserEvent[];
  leads: DemoLead[];
  testRides: TestRideBooking[];
  // Mutators/Actions
  setCurrentCustomer: (customer: CustomerProfile | null) => void;
  updateQuizAnswers: (answers: Partial<QuizAnswers>) => void;
  setRiderProfile: (profile: RiderProfileData | null) => void;
  setLeadScore: (score: number) => void;
  logEvent: (type: string, page: string, metadata?: Record<string, any>) => void;
  addTestRide: (ride: Omit<TestRideBooking, 'id'>) => void;
  addLead: (lead: DemoLead) => void;
  updateLead: (id: string, updates: Partial<DemoLead>) => void;
  resetToDefault: () => void;
}
