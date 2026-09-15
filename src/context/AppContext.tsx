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
  quizAnswers: { completed: false },
  riderProfile: null,
  leadScore: 25,
  events: [],
  leads: SEEDED_DEMO_LEADS,
  testRides: [],
  latestTestRide: null,
  setLatestTestRide: () => {},
  setCurrentCustomer: () => {},
  updateQuizAnswers: () => {},
  setRiderProfile: () => {},
  setLeadScore: () => {},
  logEvent: () => {},
  addTestRide: () => ({} as TestRideBooking),
  updateTestRide: () => {},
  addLead: () => {},
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
    completed: false,
  });

  const [riderProfile, setRiderProfile] = useState<RiderProfileData | null>(null);

  const [leadScore, setLeadScore] = useState<number>(25); // base 20 + website visit 5
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
  const [latestTestRide, setLatestTestRide] = useState<TestRideBooking | null>(null);

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

  const addTestRide = useCallback((rideData: Omit<TestRideBooking, 'id'>): TestRideBooking => {
    const newRide: TestRideBooking = {
      ...rideData,
      id: `tr-${Date.now()}`,
    };
    setTestRides((prev) => [newRide, ...prev]);
    setLatestTestRide(newRide);
    logEvent('TEST_RIDE_BOOKED', '/test-ride', { bookingId: newRide.id, city: newRide.city });
    return newRide;
  }, [logEvent]);

  const updateTestRide = useCallback((id: string, updates: Partial<TestRideBooking>) => {
    setTestRides((prev) =>
      prev.map((ride) => (ride.id === id ? { ...ride, ...updates } : ride))
    );
    setLatestTestRide((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  }, []);

  const addLead = useCallback((newLead: DemoLead) => {
    setLeads((prev) => [newLead, ...prev.filter((l) => l.id !== newLead.id)]);
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<DemoLead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setLeads(SEEDED_DEMO_LEADS);
    setLeadScore(25);
    setRiderProfile(null);
    setQuizAnswers({ completed: false });
    setLatestTestRide(null);
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
      latestTestRide,
      setLatestTestRide,
      setCurrentCustomer,
      updateQuizAnswers,
      setRiderProfile,
      setLeadScore,
      logEvent,
      addTestRide,
      updateTestRide,
      addLead,
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
      latestTestRide,
      updateQuizAnswers,
      logEvent,
      addTestRide,
      updateTestRide,
      addLead,
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
