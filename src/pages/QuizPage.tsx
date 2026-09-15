/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Navigation,
  Users,
  SlidersHorizontal,
  BatteryCharging,
  Wallet,
  ShieldAlert,
  ThumbsUp,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Badge } from '../components/ui/Badge';
import { useAppState } from '../context/AppContext';
import { generateRiderProfile } from '../utils/profileLogic';
import { usePresentation } from '../context/PresentationContext';
import { RIYA_DESAI_QUIZ_ANSWERS, RIYA_DESAI_PROFILE } from '../data/demoCustomerRiya';

interface QuestionConfig {
  id: number;
  key: 'dailyCommute' | 'whoWillUse' | 'primaryPriority' | 'parkingType' | 'monthlyFuelExpense' | 'biggestConcern' | 'yesFactor';
  category: string;
  question: string;
  subtitle?: string;
  type: 'options' | 'slider';
  options?: {
    label: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
}

const QUESTIONS: QuestionConfig[] = [
  {
    id: 1,
    key: 'dailyCommute',
    category: 'Commute Profile',
    question: 'Typical daily commute:',
    subtitle: 'Select your standard total roundtrip distance on weekdays.',
    type: 'options',
    options: [
      { label: 'Under 10 km', description: 'Hyperlocal errands & neighborhood transit' },
      { label: '10-20 km', description: 'Standard intra-city office commute' },
      { label: '20-40 km', description: 'Cross-city transit across major corridors' },
      { label: '40+ km', description: 'Long-range highway & outer ring-road commuting' },
    ],
  },
  {
    id: 2,
    key: 'whoWillUse',
    category: 'Rider Dynamics',
    question: 'Who will use it:',
    subtitle: 'Helps configure seat comfort, storage ergonomics, and handling characteristics.',
    type: 'options',
    options: [
      { label: 'Me', description: 'Solo daily commuter prioritizing agility' },
      { label: 'Me + partner', description: 'Frequent pillion transit with dual ergonomics' },
      { label: 'Family', description: 'Shared household usage with wide comfort needs' },
      { label: 'Multiple riders', description: 'Different family members with varied riding styles' },
    ],
  },
  {
    id: 3,
    key: 'primaryPriority',
    category: 'Vehicle Attributes',
    question: 'What matters most:',
    subtitle: 'The single most decisive engineering attribute for your next two-wheeler.',
    type: 'options',
    options: [
      { label: 'Performance', description: 'Warp torque, instant response & swift overtaking' },
      { label: 'Comfort', description: 'Plush suspension & relaxed ergonomic posture' },
      { label: 'Range confidence', description: 'Substantial battery buffer for unpredictable days' },
      { label: 'Savings', description: 'Maximum reduction in fuel & recurring operational costs' },
      { label: 'Technology', description: 'Google Maps onboard, smart theft alerts & OTA updates' },
    ],
  },
  {
    id: 4,
    key: 'parkingType',
    category: 'Charging Feasibility',
    question: 'Where would you park:',
    subtitle: 'Understanding your access to a standard domestic 5A electrical point.',
    type: 'options',
    options: [
      { label: 'Private home parking', description: 'Dedicated driveway or garage with 5A socket access' },
      { label: 'Apartment parking', description: 'Basement or stilted parking bay in a housing society' },
      { label: 'Workplace parking', description: 'Office campus with designated vehicle charging points' },
      { label: 'Public parking', description: 'Street parking or open residential common area' },
      { label: 'Not sure', description: 'Need guidance on socket installation feasibility' },
    ],
  },
  {
    id: 5,
    key: 'monthlyFuelExpense',
    category: 'Fuel Economics',
    question: 'Monthly petrol spend:',
    subtitle: 'Drag the slider to calculate your electric operational savings.',
    type: 'slider',
  },
  {
    id: 6,
    key: 'biggestConcern',
    category: 'Hesitation Factors',
    question: 'Biggest EV concern:',
    subtitle: 'We tailor your report to directly mitigate and address this question.',
    type: 'options',
    options: [
      { label: 'Range', description: 'Fear of running out of battery before reaching destination' },
      { label: 'Charging', description: 'Time taken to charge and availability of fast plugs' },
      { label: 'Price', description: 'Upfront acquisition cost vs long-term payback timeline' },
      { label: 'Performance', description: 'Durability under steep inclines and monsoon waterlogging' },
      { label: 'Service/support', description: 'Service center network and battery degradation warranty' },
      { label: 'Not sure EVs are right for me', description: 'Uncertain about overall lifestyle compatibility' },
    ],
  },
  {
    id: 7,
    key: 'yesFactor',
    category: 'Decision Catalyst',
    question: 'What would make you say YES:',
    subtitle: 'The primary factor that would turn your curiosity into a physical test ride.',
    type: 'options',
    options: [
      { label: 'Lower running cost', description: 'Proving immediate 80%+ fuel expense reduction' },
      { label: 'Better technology', description: 'Intuitive navigation, auto-hold & reverse assist' },
      { label: 'Easy charging', description: 'Plug-and-play home routine requiring zero friction' },
      { label: 'Great performance', description: 'Thrilling silent acceleration that petrol scooters cannot match' },
      { label: 'Comfortable everyday riding', description: 'Zero engine vibration and fatigue-free posture' },
      { label: 'Environmental impact', description: 'Zero tailpipe emissions and cleaner city air' },
    ],
  },
];

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizAnswers, updateQuizAnswers, setRiderProfile, leadScore, setLeadScore, logEvent } = useAppState();
  const prefersReduced = useReducedMotion();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [answers, setAnswers] = useState<{
    dailyCommute: string;
    whoWillUse: string;
    primaryPriority: string;
    parkingType: string;
    monthlyFuelExpense: number;
    biggestConcern: string;
    yesFactor: string;
  }>({
    dailyCommute: quizAnswers.dailyCommute || '',
    whoWillUse: quizAnswers.whoWillUse || '',
    primaryPriority: quizAnswers.primaryPriority || '',
    parkingType: quizAnswers.parkingType || '',
    monthlyFuelExpense: quizAnswers.monthlyFuelExpense || 3000,
    biggestConcern: quizAnswers.biggestConcern || '',
    yesFactor: quizAnswers.yesFactor || '',
  });

  const {
    isActive: isPresentationActive,
    currentStep: presentationStep,
    nextStep: presentationNextStep,
    goToStep: presentationGoToStep,
  } = usePresentation();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const hasLoggedStartRef = useRef(false);
  const autoFillTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-trigger analysis screen if presentation step is 3 or query param is set
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('step') === 'analyzing' || (isPresentationActive && presentationStep === 3)) {
      setIsAnalyzing(true);
      const timer1 = setTimeout(() => setAnalysisPhase(1), 700);
      const timer2 = setTimeout(() => setAnalysisPhase(2), 1400);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isPresentationActive, presentationStep]);

  // Sequence for auto-filling Riya Desai's answers in presentation mode
  const runRiyaAutoFill = useCallback(() => {
    const stepsData = [
      { step: 0, key: 'dailyCommute', val: '10-20 km' },
      { step: 1, key: 'whoWillUse', val: 'Me' },
      { step: 2, key: 'primaryPriority', val: 'Range confidence' },
      { step: 3, key: 'parkingType', val: 'Apartment parking' },
      { step: 4, key: 'monthlyFuelExpense', val: 3500 },
      { step: 5, key: 'biggestConcern', val: 'Charging' },
      { step: 6, key: 'yesFactor', val: 'Easy charging' },
    ];

    let currentIdx = 0;
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      if (currentIdx < stepsData.length) {
        const item = stepsData[currentIdx];
        setAnswers((prev) => ({ ...prev, [item.key]: item.val }));
        setCurrentStep(item.step);

        currentIdx++;
        if (currentIdx === stepsData.length) {
          clearInterval(stepInterval);
          // Wait 600ms then trigger analyzing / step 3
          autoFillTimerRef.current = setTimeout(() => {
            if (isPresentationActive) {
              presentationGoToStep(3);
            } else {
              handleCompleteQuiz();
            }
          }, 800);
        }
      }
    }, 650);

    return () => clearInterval(stepInterval);
  }, [isPresentationActive, presentationGoToStep]);

  // Run auto-fill when entering step 2 in presentation mode
  useEffect(() => {
    if (isPresentationActive && presentationStep === 2) {
      const timer = setTimeout(() => {
        runRiyaAutoFill();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPresentationActive, presentationStep, runRiyaAutoFill]);

  // Log quiz_started on first view & update lead score (+10)
  useEffect(() => {
    if (!hasLoggedStartRef.current) {
      hasLoggedStartRef.current = true;
      logEvent('quiz_started', '/quiz', { totalQuestions: 7 });
      setLeadScore(Math.min(100, Math.max(35, leadScore + 10)));
    }
  }, [logEvent, setLeadScore, leadScore]);

  // Current question metadata
  const currentQ = QUESTIONS[currentStep];

  // Check if current question is answered
  const isCurrentAnswered = (() => {
    const val = answers[currentQ.key];
    if (currentQ.type === 'slider') {
      return typeof val === 'number' && val >= 500;
    }
    return Boolean(val && String(val).trim().length > 0);
  })();

  const handleSelectOption = (value: string) => {
    const updated = { ...answers, [currentQ.key]: value };
    setAnswers(updated);
    logEvent('quiz_question_answered', '/quiz', {
      questionIndex: currentStep + 1,
      questionKey: currentQ.key,
      value,
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    setAnswers((prev) => ({ ...prev, monthlyFuelExpense: num }));
  };

  const handleNext = () => {
    if (!isCurrentAnswered) return;

    if (currentStep === 4) {
      // Log slider answer when leaving Q5
      logEvent('quiz_question_answered', '/quiz', {
        questionIndex: 5,
        questionKey: 'monthlyFuelExpense',
        value: answers.monthlyFuelExpense,
      });
    }

    if (currentStep < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Completed last question!
      handleCompleteQuiz();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteQuiz = () => {
    setIsAnalyzing(true);
    // Cycle animation phases for 2.5s
    const timer1 = setTimeout(() => setAnalysisPhase(1), 800);
    const timer2 = setTimeout(() => setAnalysisPhase(2), 1600);

    const finishTimer = setTimeout(() => {
      // Calculate lead score: base 20 + visit 5 + quiz started 10 + quiz completed 15 = 50
      const scoreAfterQuiz = 50;
      setLeadScore(scoreAfterQuiz);

      // Save answers in context
      const fullAnswers = {
        ...answers,
        completed: true,
      };
      updateQuizAnswers(fullAnswers);

      // Compute deterministic profile
      const profile = generateRiderProfile(fullAnswers, scoreAfterQuiz);
      setRiderProfile(profile);

      // Log events
      logEvent('quiz_completed', '/quiz', {
        answers: fullAnswers,
        persona: profile.persona,
        matchScore: profile.matchScore,
        confidenceScore: profile.confidenceScore,
      });
      logEvent('profile_generated', '/profile', {
        persona: profile.persona,
        matchScore: profile.matchScore,
        confidenceScore: profile.confidenceScore,
        intentScore: profile.intentScore,
      });

      // Navigate to /profile or advance presentation
      if (isPresentationActive) {
        presentationGoToStep(4);
      } else {
        navigate('/profile');
      }
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(finishTimer);
    };
  };

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReduced ? 0 : dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: prefersReduced ? 0 : dir > 0 ? -60 : 60,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 sm:px-6 py-8 relative overflow-hidden bg-[#0B0D10]">
      {/* Subtle ambient emerald background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none rounded-full blur-[140px] opacity-20 bg-[#00E08A]/30"
        aria-hidden="true"
      />

      {/* 2.5s ANALYZING SCREEN OVERLAY */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B0D10]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Concentric pulsing rings */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center mb-8">
              <motion.div
                animate={
                  prefersReduced
                    ? {}
                    : {
                        scale: [1, 1.4, 1.8],
                        opacity: [0.6, 0.3, 0],
                      }
                }
                transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-[#00E08A]/40"
              />
              <motion.div
                animate={
                  prefersReduced
                    ? {}
                    : {
                        scale: [1, 1.3, 1.6],
                        opacity: [0.8, 0.4, 0],
                      }
                }
                transition={{ repeat: Infinity, duration: 2, delay: 0.4, ease: 'easeOut' }}
                className="absolute inset-4 rounded-full border border-[#00E08A]/60"
              />
              <motion.div
                animate={
                  prefersReduced
                    ? {}
                    : {
                        scale: [1, 1.15, 1.3],
                        opacity: [0.9, 0.5, 0.1],
                      }
                }
                transition={{ repeat: Infinity, duration: 2, delay: 0.8, ease: 'easeOut' }}
                className="absolute inset-8 rounded-full border border-[#00E08A]"
              />

              {/* Central Glowing Orb */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#111418] border-2 border-[#00E08A] shadow-[0_0_35px_rgba(0,224,138,0.5)] flex items-center justify-center relative z-10">
                <Cpu size={36} className="text-[#00E08A] animate-pulse" />
              </div>
            </div>

            {/* Analysis Headline */}
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F5F7FA] mb-3">
              Analysing your ride...
            </h2>

            {/* Dynamic Status Steps */}
            <div className="h-8 flex items-center justify-center text-sm font-medium text-[#9AA3AF]">
              {analysisPhase === 0 && (
                <motion.span
                  key="phase-0"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={14} className="animate-spin text-[#00E08A]" />
                  Mapping daily commute distance & traffic profile...
                </motion.span>
              )}
              {analysisPhase === 1 && (
                <motion.span
                  key="phase-1"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <BatteryCharging size={14} className="text-[#00E08A]" />
                  Evaluating domestic 5A charging accessibility...
                </motion.span>
              )}
              {analysisPhase === 2 && (
                <motion.span
                  key="phase-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-[#00E08A]" />
                  Synthesizing personalized rider archetype...
                </motion.span>
              )}
            </div>

            <div className="mt-6">
              <Badge variant="ACADEMIC PROTOTYPE" label="DETERMINISTIC EVALUATION" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUIZ CONTAINER */}
      <div className="w-full max-w-2xl relative z-10">
        {/* PRESENTATION DEMO BANNER */}
        {isPresentationActive && presentationStep === 2 && (
          <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/30 text-xs text-[#00E08A]">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles size={14} className="animate-spin text-[#00E08A]" />
              <span>Step 2 Demo: Auto-filling answers for Riya Desai (Pune • 15 km Commute)</span>
            </div>
            <button
              onClick={runRiyaAutoFill}
              className="text-[11px] underline hover:text-white transition-colors cursor-pointer"
            >
              Replay
            </button>
          </div>
        )}

        {/* TOP PROGRESS BAR & HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2.5">
            <span className="font-semibold uppercase tracking-[0.14em] text-[#00E08A]">
              Question {currentStep + 1} of 7
            </span>
            <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#F5F7FA]">
              {currentQ.category}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#00E08A] rounded-full"
              initial={{ width: `${(currentStep / 7) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / 7) * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* FULL-SCREEN CENTERED CARD */}
        <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {/* Question Headline */}
              <div className="mb-8">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9AA3AF] mb-1 block">
                  Step {currentStep + 1}
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F5F7FA] tracking-tight">
                  {currentQ.question}
                </h1>
                {currentQ.subtitle && (
                  <p className="text-sm sm:text-base text-[#9AA3AF] mt-2">
                    {currentQ.subtitle}
                  </p>
                )}
              </div>

              {/* QUESTION CONTENT */}
              {currentQ.type === 'options' && currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {currentQ.options.map((option) => {
                    const isSelected = answers[currentQ.key] === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => handleSelectOption(option.label)}
                        className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#00E08A] bg-[#00E08A]/[0.08] shadow-[0_0_24px_rgba(0,224,138,0.18)]'
                            : 'border-white/[0.08] bg-[#16191E] hover:border-white/20 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 w-full mb-2">
                          <span
                            className={`font-heading font-semibold text-base sm:text-lg transition-colors ${
                              isSelected ? 'text-[#00E08A]' : 'text-[#F5F7FA] group-hover:text-white'
                            }`}
                          >
                            {option.label}
                          </span>

                          {/* Selected checkmark indicator */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? 'bg-[#00E08A] text-[#0B0D10]'
                                : 'border border-white/20 bg-white/[0.03] text-transparent'
                            }`}
                          >
                            <Check size={14} strokeWidth={2.5} />
                          </div>
                        </div>

                        {option.description && (
                          <p className="text-xs text-[#9AA3AF] leading-relaxed">
                            {option.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Q5 SLIDER: Monthly petrol spend */}
              {currentQ.type === 'slider' && (
                <div className="flex flex-col items-center py-4 sm:py-6">
                  {/* Big Live Display */}
                  <div className="mb-8 text-center">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#9AA3AF] block mb-2">
                      Current Monthly Fuel Bill
                    </span>
                    <div className="font-heading font-bold text-5xl sm:text-6xl text-[#00E08A] tabular-nums tracking-tight">
                      ₹{answers.monthlyFuelExpense.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-[#9AA3AF] mt-1 block">
                      approx. ₹{Math.round(answers.monthlyFuelExpense / 102)} litres of petrol per month
                    </span>
                  </div>

                  {/* Slider Control */}
                  <div className="w-full px-2 max-w-lg mb-8">
                    <input
                      type="range"
                      min={500}
                      max={8000}
                      step={100}
                      value={answers.monthlyFuelExpense}
                      onChange={handleSliderChange}
                      className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E08A] focus:outline-none focus:ring-2 focus:ring-[#00E08A]/50"
                    />
                    <div className="flex justify-between text-xs text-[#9AA3AF] font-mono mt-2">
                      <span>₹500</span>
                      <span>₹4,000</span>
                      <span>₹8,000+</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[1000, 2000, 3000, 4500, 6000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, monthlyFuelExpense: preset }))
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono border transition-all ${
                          answers.monthlyFuelExpense === preset
                            ? 'border-[#00E08A] bg-[#00E08A]/10 text-[#00E08A]'
                            : 'border-white/10 bg-white/[0.04] text-[#9AA3AF] hover:border-white/20'
                        }`}
                      >
                        ₹{preset.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  {/* Estimated Monthly Savings Teaser */}
                  <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#9AA3AF] text-center w-full max-w-lg">
                    <span className="text-[#00E08A] font-semibold">
                      Estimated Electric Running Cost:{' '}
                    </span>
                    ₹{Math.round(answers.monthlyFuelExpense * 0.16).toLocaleString('en-IN')}/mo (Saving ~₹{Math.round(answers.monthlyFuelExpense * 0.84).toLocaleString('en-IN')} every month)
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* BOTTOM CONTROLS: Back and Next */}
          <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[#9AA3AF] hover:text-[#F5F7FA] bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Back</span>
            </button>

            <PrimaryButton
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              size="md"
              icon={<ArrowRight size={16} strokeWidth={2} />}
            >
              {currentStep === QUESTIONS.length - 1 ? 'Analyze My Ride' : 'Continue'}
            </PrimaryButton>
          </div>
        </div>

        {/* Small academic disclaimer under quiz */}
        <div className="mt-6 text-center text-[11px] text-[#9AA3AF]/70">
          Deterministic assessment logic calibrates commute physics, socket readiness, and TCO delta.
        </div>
      </div>
    </div>
  );
};
