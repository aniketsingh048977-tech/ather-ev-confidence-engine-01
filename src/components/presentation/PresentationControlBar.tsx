/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  CheckCircle2,
  List,
  Layers,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { usePresentation, PRESENTATION_STEPS } from '../../context/PresentationContext';

export const PresentationControlBar: React.FC = () => {
  const {
    isActive,
    currentStep,
    stepInfo,
    stopTour,
    nextStep,
    prevStep,
    goToStep,
    resetDemoCustomer,
  } = usePresentation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

  if (!isActive) return null;

  const handleReset = () => {
    resetDemoCustomer();
    setIsResetConfirming(false);
    setResetSuccessMessage(true);
    setTimeout(() => setResetSuccessMessage(false), 3000);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[95%] max-w-2xl pointer-events-auto">
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="rounded-2xl bg-[#0B0D10]/95 backdrop-blur-xl border border-[#00E08A]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,224,138,0.15)] overflow-hidden"
      >
        {/* Top Progress Track */}
        <div className="w-full bg-white/[0.06] h-1.5 flex">
          {PRESENTATION_STEPS.map((s) => (
            <div
              key={s.number}
              onClick={() => goToStep(s.number)}
              title={`Step ${s.number}: ${s.shortName}`}
              className={`h-full flex-1 transition-all duration-300 cursor-pointer ${
                s.number < currentStep
                  ? 'bg-[#00E08A]'
                  : s.number === currentStep
                  ? 'bg-[#00E08A] shadow-[0_0_8px_#00E08A]'
                  : 'bg-transparent hover:bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Bar Body */}
        <div className="p-3.5 sm:p-4.5 space-y-3">
          {/* Header row: Step badge, quick selector toggle, reset & exit */}
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00E08A]/15 border border-[#00E08A]/40 text-[#00E08A] font-mono font-bold text-[11px] tracking-wider uppercase">
                Step {currentStep} of 12
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-[#9AA3AF] uppercase tracking-wider">
                {stepInfo.tag}
              </span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1 text-[11px] text-[#9AA3AF] hover:text-[#F5F7FA] transition-colors px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]"
              >
                <span>Jump</span>
                {isMenuOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset Demo Button */}
              {isResetConfirming ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold hover:bg-rose-500/30"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setIsResetConfirming(false)}
                    className="px-2 py-1 rounded bg-white/5 text-[#9AA3AF] text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsResetConfirming(true)}
                  title="Clear Riya Desai state to run fresh demo"
                  className="flex items-center gap-1 text-[11px] text-[#9AA3AF] hover:text-amber-400 px-2 py-1 rounded hover:bg-white/5 transition-colors"
                >
                  <RotateCcw size={12} />
                  <span className="hidden sm:inline">Reset Demo</span>
                </button>
              )}

              {/* Exit Tour */}
              <button
                onClick={stopTour}
                title="Exit Presentation Tour"
                className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#9AA3AF] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Step Quick Jump Menu Drawer */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-white/[0.08] pb-2"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1 py-1">
                  {PRESENTATION_STEPS.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => {
                        goToStep(s.number);
                        setIsMenuOpen(false);
                      }}
                      className={`text-left p-2 rounded-lg text-xs transition-colors border ${
                        s.number === currentStep
                          ? 'bg-[#00E08A]/15 border-[#00E08A]/40 text-[#00E08A]'
                          : 'bg-white/[0.02] border-white/[0.04] text-[#9AA3AF] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="font-mono text-[10px] font-bold">
                        {s.number}. {s.shortName}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset Toast Notification */}
          {resetSuccessMessage && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs">
              <CheckCircle2 size={14} />
              <span>Demo customer & pipeline reset successfully. Ready for fresh assessment run.</span>
            </div>
          )}

          {/* Main Content Area */}
          <div className="space-y-1.5">
            <h3 className="font-heading font-bold text-sm sm:text-base text-[#F5F7FA] tracking-tight">
              {stepInfo.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed line-clamp-3 sm:line-clamp-none">
              {stepInfo.caption}
            </p>
            {stepInfo.subcaption && (
              <p className="text-[11px] font-mono text-[#00E08A]/90 pt-0.5">
                {stepInfo.subcaption}
              </p>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/[0.06]">
            <div className="text-[11px] text-[#9AA3AF] font-mono hidden sm:block">
              Tip: Use &larr; and &rarr; keys to advance
            </div>

            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/10 text-[#F5F7FA] hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>

              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold bg-[#00E08A] text-[#0B0D10] hover:bg-[#1ae596] hover:shadow-[0_0_20px_rgba(0,224,138,0.4)] active:scale-95 transition-all cursor-pointer"
              >
                <span>{currentStep === 12 ? 'Finish Tour' : 'Next Step'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
