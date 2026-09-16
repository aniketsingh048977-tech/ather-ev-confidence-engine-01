/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { AtherSwitchEngine } from './AtherSwitchEngine';

interface SwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwitchModal: React.FC<SwitchModalProps> = ({ isOpen, onClose }) => {
  // Prevent background scrolling and pause Lenis while modal is open
  useEffect(() => {
    if (isOpen) {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        if (lenis) lenis.start();
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-md p-3 sm:p-6 md:p-8 flex justify-center items-start"
      >
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-5xl my-4 sm:my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <AtherSwitchEngine onBookRide={onClose} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
