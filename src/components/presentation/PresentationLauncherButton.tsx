/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Presentation } from 'lucide-react';
import { usePresentation } from '../../context/PresentationContext';

export const PresentationLauncherButton: React.FC = () => {
  const { isActive, startTour } = usePresentation();

  if (isActive) return null;

  return (
    <motion.button
      id="presentation-demo-launcher-button"
      onClick={() => startTour(1)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      aria-label="Start Presentation Demo (Riya Desai, Pune)"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0B0D10]/90 backdrop-blur-md border border-[#00E08A]/60 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_24px_rgba(0,224,138,0.25)] text-[#F5F7FA] font-heading font-semibold text-xs tracking-wider uppercase hover:border-[#00E08A] hover:shadow-[0_10px_36px_rgba(0,0,0,0.8),0_0_32px_rgba(0,224,138,0.4)] transition-all cursor-pointer group"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[#00E08A] animate-pulse shadow-[0_0_10px_#00E08A]" />
      <span className="text-[#00E08A] font-bold group-hover:text-white transition-colors">
        START PRESENTATION DEMO
      </span>
      <Sparkles size={14} className="text-[#00E08A] group-hover:rotate-12 transition-transform" />
    </motion.button>
  );
};
