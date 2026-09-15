/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppStateContextType,
  CustomerProfile,
  QuizAnswers,
  RiderProfileData,
  UserEvent,
  DemoLead,
  TestRideBooking,
} from '../types';
import { SEEDED_DEMO_LEADS } from '../data/demoLeads';

const defaultContext: AppStateContextType = {
  currentCustomer: null,
  quizAnswers: {},
  riderProfile: null,
  leadScore: 42,
  events: [],
  leads: SEEDED_DEMO_LEADS,
  testRides: [],
  setCurrentCustomer: () => {},
  updateQuizAnswers: () => {},
  setRiderProfile: () => {},
  setLeadScore: () => {},
  logEvent: () => {},
  addTestRide: () => {},
  updateLead: () => {},
  resetToDefault: () => {},
};

const AppContext = createContext<AppStateContextType>(defaultContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState<CustomerProfile | null>({
    id: 'cust-current-guest',
    name: 'Academic Evaluator',
    city: 'Bengaluru',
    dailyCommuteKm: 28,
    monthlyFuelExpense: 3200,
    currentVehicle: '110cc Petrol Scooter',
    homeChargingAccess: true,
  });

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    dailyCommute: '25-35 km/day',
    monthlyFuelExpense: 3200,
    parkingType: 'Dedicated covered parking with 5A socket',
    primaryPriority: 'Range',
    weekendRiding: 'City only (occasional ring-road coffee runs)',
    pillionFrequency: 'Sometimes with friend or spouse',
  });

  const [riderProfile, setRiderProfile] = useState<RiderProfileData | null>({
    persona: 'Urban Efficiency Seeker',
    archetype: 'Pragmatic Tech Commuter',
    suggestedAtherModel: 'Ather 450 Series [VERIFIED ATHER PRODUCT DATA REQUIRED]',
    confidenceScore: 88,
    keyDrivers: ['Monthly fuel-to-electric operational delta', 'Dedicated home slow-charging access'],
    addressedConcerns: ['Range anxiety mitigated by daily commute analysis'],
    productDataRequirementNote: '[VERIFIED ATHER PRODUCT DATA REQUIRED]',
  });

  const [leadScore, setLeadScore] = useState<number>(76);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [leads, setLeads] = useState<DemoLead[]>(SEEDED_DEMO_LEADS);
  const [testRides, setTestRides] = useState<TestRideBooking[]>([
    {
      id: 'tr-001',
      customerName: 'Aarav Sharma',
      phone: '+91 98450 XXXXX',
      city: 'Bengaluru',
      preferredDate: '2026-09-18',
      preferredTimeSlot: '11:00 AM',
      status: 'Scheduled',
      modelInterest: 'Ather 450X [VERIFIED ATHER PRODUCT DATA REQUIRED]',
      experienceCenter: 'Ather Space, Indiranagar [VERIFIED ATHER PRODUCT DATA REQUIRED]',
    },
    {
      id: 'tr-002',
      customerName: 'Isha Nair',
      phone: '+91 97900 XXXXX',
      city: 'Chennai',
      preferredDate: '2026-09-19',
      preferredTimeSlot: '04:00 PM',
      status: 'Scheduled',
      modelInterest: 'Ather Rizta [VERIFIED ATHER PRODUCT DATA REQUIRED]',
      experienceCenter: 'Ather Space, Nungambakkam [VERIFIED ATHER PRODUCT DATA REQUIRED]',
    },
  ]);

  const updateQuizAnswers = useCallback((newAnswers: Partial<QuizAnswers>) => {
    setQuizAnswers((prev) => ({ ...prev, ...newAnswers }));
  }, []);

  const logEvent = useCallback((type: string, page: string, metadata?: Record<string, any>) => {
    const newEvt: UserEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      page,
      metadata,
    };
    setEvents((prev) => [newEvt, ...prev].slice(0, 100)); // retain last 100 events
  }, []);

  const addTestRide = useCallback((rideData: Omit<TestRideBooking, 'id'>) => {
    const newRide: TestRideBooking = {
      ...rideData,
      id: `tr-${Date.now()}`,
    };
    setTestRides((prev) => [newRide, ...prev]);
    logEvent('TEST_RIDE_BOOKED', '/test-ride', { bookingId: newRide.id, city: newRide.city });
  }, [logEvent]);

  const updateLead = useCallback((id: string, updates: Partial<DemoLead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setLeads(SEEDED_DEMO_LEADS);
    setLeadScore(76);
    setEvents([]);
  }, []);

  // Initial event
  useEffect(() => {
    logEvent('SESSION_INITIATED', '/', { mode: 'ACADEMIC_PROTOTYPE' });
  }, [logEvent]);

  const contextValue = useMemo(
    () => ({
      currentCustomer,
      quizAnswers,
      riderProfile,
      leadScore,
      events,
      leads,
      testRides,
      setCurrentCustomer,
      updateQuizAnswers,
      setRiderProfile,
      setLeadScore,
      logEvent,
      addTestRide,
      updateLead,
      resetToDefault,
    }),
    [
      currentCustomer,
      quizAnswers,
      riderProfile,
      leadScore,
      events,
      leads,
      testRides,
      updateQuizAnswers,
      logEvent,
      addTestRide,
      updateLead,
      resetToDefault,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
