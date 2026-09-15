/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppState } from './AppContext';
import {
  RIYA_DESAI_CUSTOMER,
  RIYA_DESAI_QUIZ_ANSWERS,
  RIYA_DESAI_PROFILE,
  RIYA_DESAI_BOOKING,
  RIYA_DESAI_LEAD,
} from '../data/demoCustomerRiya';

export interface PresentationStep {
  number: number;
  title: string;
  shortName: string;
  route: string;
  caption: string;
  subcaption?: string;
  tag: string;
}

export const PRESENTATION_STEPS: PresentationStep[] = [
  {
    number: 1,
    title: 'Inbound Discovery & Frictionless Hook',
    shortName: 'Home Discovery',
    route: '/',
    tag: 'AWARENESS',
    caption:
      'Riya Desai from Pune explores whether an electric scooter can replace her petrol scooter for her daily 15 km commute. The hero provides immediate value clarity with a direct 2-minute confidence evaluation.',
    subcaption: 'Demo Persona: Riya Desai • 15 km Commute • Pune • ₹3,500 Petrol Spend',
  },
  {
    number: 2,
    title: '7-Question Confidence Quiz (Auto-Fill)',
    shortName: 'Confidence Quiz',
    route: '/quiz',
    tag: 'EVALUATION',
    caption:
      'The 7 questions auto-fill for Riya: 15 km commute (10–20 km), solo rider (Me), Range confidence priority, Apartment parking, ₹3,500 monthly petrol spend, Charging hesitation, and Easy charging catalyst.',
    subcaption: 'Visible animated selection with zero friction and continuous scoring telemetry.',
  },
  {
    number: 3,
    title: 'Proprietary Recommendation Analysis',
    shortName: 'Algorithm Analysis',
    route: '/quiz',
    tag: 'SYNTHESIS',
    caption:
      'Proprietary recommendation algorithm synthesizes commute distance, TrueRange™ safety buffer, residential apartment charging logistics, and financial ROI before revealing the tailored archetype.',
    subcaption: 'Deterministic recommendation logic matching specific lifestyle variables.',
  },
  {
    number: 4,
    title: 'Personalized Profile & Score Rings',
    shortName: 'Rider Profile',
    route: '/profile',
    tag: 'PROFILE GENERATED',
    caption:
      'Riya\'s profile reveals a 92% match score, interactive multi-attribute score rings, and direct reassurance addressing her apartment charging hesitation with verified TrueRange™ predictability.',
    subcaption: 'Score rings: Commute Match (95%), Charging (82%), Savings (90%), Ecosystem (88%).',
  },
  {
    number: 5,
    title: 'TCO Savings Calculator',
    shortName: 'Savings Calculator',
    route: '/savings',
    tag: 'FINANCIAL ROI',
    caption:
      'Pre-filled with Riya\'s ₹3,500 monthly fuel spend. Demonstrates an immediate ~85% reduction in recurring commute energy costs, unlocking ~₹35,000+ in annual direct fuel savings.',
    subcaption: 'Interactive 12-month Recharts comparison and lifestyle savings goals.',
  },
  {
    number: 6,
    title: 'Daily Commute Range Simulator ("Can I Make It?")',
    shortName: 'Range Simulator',
    route: '/savings',
    tag: 'FEASIBILITY',
    caption:
      'Simulating Riya\'s 15 km Pune commute (Kothrud to Hinjewadi) uses <15% battery, proving effortless roundtrip range with a comfortable 75%+ reserve margin remaining.',
    subcaption: 'TrueRange™ real-world traffic prediction vs lab-tested ARAI claims.',
  },
  {
    number: 7,
    title: 'Apartment Charging Feasibility & RWA Blueprint',
    shortName: 'Charging Feasibility',
    route: '/charging',
    tag: 'HESITATION REMOVED',
    caption:
      'Directly resolves Riya\'s primary hesitation by showing apartment parking feasibility: standard 5A domestic socket simplicity, society/RWA permissions, sub-meter protocols, and NOC blueprints.',
    subcaption: 'Over 40% of Ather owners live in apartments with dedicated sub-meters.',
  },
  {
    number: 8,
    title: 'Real-Time AI Ride Concierge Consultation',
    shortName: 'AI Ride Concierge',
    route: '/concierge',
    tag: 'AI INTERACTION',
    caption:
      'Auto-asking: "How can I think about charging in an apartment?" The concierge streams practical, zero-jargon advice tailored to Riya\'s society parking and overnight routine.',
    subcaption: 'Streaming AI guidance with DPDP consent and human specialist hand-off.',
  },
  {
    number: 9,
    title: 'Friction-Free Test Ride Scheduling',
    shortName: 'Test Ride Form',
    route: '/test-ride',
    tag: 'CONVERSION PIVOT',
    caption:
      'The test ride booking form is auto-populated for Riya Desai in Pune, generating a personalized checklist addressing apartment charging ergonomics, then submitted with DPDP Act consent.',
    subcaption: 'Dynamic checklist highlights: 5A Home Charging, Ather Grid, and Society NOC.',
  },
  {
    number: 10,
    title: 'Instant Appointment Confirmation & Checklist',
    shortName: 'Booking Confirmation',
    route: '/confirmation',
    tag: 'CONFIRMED',
    caption:
      'Displays Riya\'s verified booking reference (ATH-PUN-748291), Deccan Gymkhana Ather Space location, scheduled date & time slot, and test-ride preparation guidelines.',
    subcaption: 'Instant confirmation with SMS/WhatsApp dispatch and calendar sync.',
  },
  {
    number: 11,
    title: 'CRM Kanban Pipeline & Lead Scoring Dossier',
    shortName: 'CRM Kanban',
    route: '/admin/leads',
    tag: 'ADMIN PIPELINE',
    caption:
      'Riya Desai is ingested into the 9-stage CRM under "TEST RIDE BOOKED" with a high-intent score of 85. Her full Dossier Drawer is open showing rubric point breakdowns and consent logs.',
    subcaption: 'Glowing "NEW" badge, temperature pill, and DPDP compliance timestamp.',
  },
  {
    number: 12,
    title: 'Automated Lifecycle Workflows & Telemetry Funnel',
    shortName: 'Automations & Funnel',
    route: '/admin/automations',
    tag: 'AUTOMATION & KPI',
    caption:
      'Workflow B ("High-Intent Hot Lead Escalation") simulates real-time node progression for Riya\'s 85 score. Explore Recharts behavioral analytics and conversion funnel across all 6 visualizations.',
    subcaption: 'Full loop closed: Inbound Visitor &rarr; Quiz &rarr; Score &rarr; Test Ride &rarr; CRM &rarr; Automation.',
  },
];

interface PresentationContextType {
  isActive: boolean;
  currentStep: number;
  stepInfo: PresentationStep;
  startTour: (fromStep?: number) => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepNumber: number) => void;
  resetDemoCustomer: () => void;
  isAutoFillingQuiz: boolean;
  setIsAutoFillingQuiz: (val: boolean) => void;
  autoQuizStep: number;
  setAutoQuizStep: (val: number) => void;
  autoConciergeAsked: boolean;
  setAutoConciergeAsked: (val: boolean) => void;
  isTestRideAutoSubmitted: boolean;
  setIsTestRideAutoSubmitted: (val: boolean) => void;
  openDossierOnStep11: boolean;
  setOpenDossierOnStep11: (val: boolean) => void;
  runAutomationTrigger: boolean;
  setRunAutomationTrigger: (val: boolean) => void;
}

const PresentationContext = createContext<PresentationContextType | null>(null);

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoFillingQuiz, setIsAutoFillingQuiz] = useState(false);
  const [autoQuizStep, setAutoQuizStep] = useState(0);
  const [autoConciergeAsked, setAutoConciergeAsked] = useState(false);
  const [isTestRideAutoSubmitted, setIsTestRideAutoSubmitted] = useState(false);
  const [openDossierOnStep11, setOpenDossierOnStep11] = useState(true);
  const [runAutomationTrigger, setRunAutomationTrigger] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    setCurrentCustomer,
    updateQuizAnswers,
    setRiderProfile,
    setLeadScore,
    addLead,
    updateLead,
    leads,
    addTestRide,
    setLatestTestRide,
    resetToDefault,
  } = useAppState();

  const stepInfo = PRESENTATION_STEPS[currentStep - 1] || PRESENTATION_STEPS[0];

  // Helper to ensure Riya's state is configured up to the active step
  const syncStateForStep = useCallback(
    (stepNum: number) => {
      if (stepNum >= 2) {
        setCurrentCustomer(RIYA_DESAI_CUSTOMER);
      }
      if (stepNum >= 4) {
        updateQuizAnswers(RIYA_DESAI_QUIZ_ANSWERS);
        setRiderProfile(RIYA_DESAI_PROFILE);
        setLeadScore(Math.max(50, 85));
      }
      if (stepNum >= 9) {
        // Ensure Riya booking & lead exists
        setLatestTestRide(RIYA_DESAI_BOOKING);
        const existing = leads.find((l) => l.name === 'Riya Desai');
        if (!existing) {
          addLead(RIYA_DESAI_LEAD);
        } else {
          updateLead(existing.id, {
            journeyStage: 'TEST RIDE BOOKED',
            testRideStatus: 'Scheduled',
            leadScore: 85,
            lastActivity: new Date().toISOString(),
          });
        }
      }
    },
    [setCurrentCustomer, updateQuizAnswers, setRiderProfile, setLeadScore, setLatestTestRide, leads, addLead, updateLead]
  );

  // Navigate to step's target route
  const executeStep = useCallback(
    (targetStep: number) => {
      const step = PRESENTATION_STEPS[targetStep - 1];
      if (!step) return;

      syncStateForStep(targetStep);

      if (targetStep === 2) {
        setIsAutoFillingQuiz(true);
        setAutoQuizStep(0);
        navigate('/quiz');
      } else if (targetStep === 3) {
        // Quiz analysing screen
        navigate('/quiz?step=analyzing');
      } else if (targetStep === 6) {
        // Range section on savings page
        navigate('/savings#range-section');
        setTimeout(() => {
          const el = document.getElementById('range-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (targetStep === 8) {
        setAutoConciergeAsked(true);
        navigate('/concierge');
      } else if (targetStep === 9) {
        navigate('/test-ride?demo=riya');
      } else if (targetStep === 10) {
        navigate('/confirmation', {
          state: {
            booking: RIYA_DESAI_BOOKING,
            bookingRef: RIYA_DESAI_BOOKING.bookingRef,
          },
        });
      } else if (targetStep === 11) {
        setOpenDossierOnStep11(true);
        navigate('/admin/leads');
      } else if (targetStep === 12) {
        setRunAutomationTrigger(true);
        navigate('/admin/automations');
      } else {
        navigate(step.route);
      }
    },
    [navigate, syncStateForStep]
  );

  const startTour = useCallback(
    (fromStep: number = 1) => {
      setIsActive(true);
      setCurrentStep(fromStep);
      executeStep(fromStep);
    },
    [executeStep]
  );

  const stopTour = useCallback(() => {
    setIsActive(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 12) {
      const next = currentStep + 1;
      setCurrentStep(next);
      executeStep(next);
    } else {
      // Completed tour!
      stopTour();
    }
  }, [currentStep, executeStep, stopTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      executeStep(prev);
    }
  }, [currentStep, executeStep]);

  const goToStep = useCallback(
    (stepNumber: number) => {
      if (stepNumber >= 1 && stepNumber <= 12) {
        setCurrentStep(stepNumber);
        executeStep(stepNumber);
      }
    },
    [executeStep]
  );

  const resetDemoCustomer = useCallback(() => {
    resetToDefault();
    setIsAutoFillingQuiz(false);
    setAutoQuizStep(0);
    setAutoConciergeAsked(false);
    setIsTestRideAutoSubmitted(false);
    setOpenDossierOnStep11(false);
    setRunAutomationTrigger(false);
    if (isActive) {
      setCurrentStep(1);
      executeStep(1);
    }
  }, [resetToDefault, isActive, executeStep]);

  // Keyboard navigation support for presenters
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        stopTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, nextStep, prevStep, stopTour]);

  return (
    <PresentationContext.Provider
      value={{
        isActive,
        currentStep,
        stepInfo,
        startTour,
        stopTour,
        nextStep,
        prevStep,
        goToStep,
        resetDemoCustomer,
        isAutoFillingQuiz,
        setIsAutoFillingQuiz,
        autoQuizStep,
        setAutoQuizStep,
        autoConciergeAsked,
        setAutoConciergeAsked,
        isTestRideAutoSubmitted,
        setIsTestRideAutoSubmitted,
        openDossierOnStep11,
        setOpenDossierOnStep11,
        runAutomationTrigger,
        setRunAutomationTrigger,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};
