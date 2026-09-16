import React from 'react';
import { motion } from 'motion/react';

export const ScooterSvgFallback: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center w-full h-full min-h-[360px] ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-[#00E08A]/10 blur-[60px] pointer-events-none" />

      {/* Pulsing Floor Ring */}
      <motion.div
        className="absolute bottom-8 w-64 h-8 rounded-[100%] border border-[#00E08A]/40 pointer-events-none"
        animate={{
          scale: [0.9, 1.35, 0.9],
          opacity: [0.3, 0.8, 0.3],
          boxShadow: [
            '0 0 10px rgba(0,224,138,0.2)',
            '0 0 25px rgba(0,224,138,0.6)',
            '0 0 10px rgba(0,224,138,0.2)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <svg
        viewBox="0 0 600 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[520px] h-auto relative z-10 drop-shadow-[0_10px_30px_rgba(0,224,138,0.25)]"
      >
        <defs>
          <linearGradient id="neonGreenStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E08A" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00E08A" stopOpacity="1" />
            <stop offset="100%" stopColor="#00E08A" stopOpacity="0.5" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Floor Horizon / Grid Line */}
        <motion.path
          d="M40 310 L560 310"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />

        {/* Rear Wheel Spoke Hub & Tire */}
        <motion.circle
          cx="140"
          cy="270"
          r="45"
          stroke="#3A414A"
          strokeWidth="6"
          fill="#111418"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="140"
          cy="270"
          r="26"
          stroke="#00E08A"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        {/* Rotating Rear Spokes */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '140px 270px' }}
        >
          <line x1="140" y1="244" x2="140" y2="296" stroke="#00E08A" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="114" y1="270" x2="166" y2="270" stroke="#00E08A" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="122" y1="252" x2="158" y2="288" stroke="#9AA3AF" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="158" y1="252" x2="122" y2="288" stroke="#9AA3AF" strokeWidth="1" strokeOpacity="0.5" />
        </motion.g>

        {/* Front Wheel Spoke Hub & Tire */}
        <motion.circle
          cx="460"
          cy="270"
          r="45"
          stroke="#3A414A"
          strokeWidth="6"
          fill="#111418"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="460"
          cy="270"
          r="26"
          stroke="#00E08A"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        {/* Rotating Front Spokes */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '460px 270px' }}
        >
          <line x1="460" y1="244" x2="460" y2="296" stroke="#00E08A" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="434" y1="270" x2="486" y2="270" stroke="#00E08A" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="442" y1="252" x2="478" y2="288" stroke="#9AA3AF" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="478" y1="252" x2="442" y2="288" stroke="#9AA3AF" strokeWidth="1" strokeOpacity="0.5" />
        </motion.g>

        {/* Main Chassis Silhouette & Fairing */}
        <motion.path
          d="M 140 270 
             L 190 270 
             L 220 285 
             L 370 285 
             L 410 240 
             L 450 140 
             L 435 90 
             L 420 85 
             M 450 140 
             L 460 270"
          stroke="#F5F7FA"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />

        {/* Rear Body & Seat Outline */}
        <motion.path
          d="M 130 245 
             C 140 200, 180 180, 230 180 
             L 340 180 
             C 365 180, 380 200, 395 240 
             L 370 280 
             L 210 280 
             Z"
          fill="#16191E"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />

        {/* Seat Cushion Contour */}
        <motion.path
          d="M 175 180 
             C 195 165, 260 162, 335 174 
             L 340 186 
             L 180 186 
             Z"
          fill="#252A32"
          stroke="#3A414A"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />

        {/* Glowing Green Accent Streamline along Flank */}
        <motion.path
          d="M 160 220 C 220 215, 290 220, 365 240"
          stroke="url(#neonGreenStroke)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#glowFilter)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.5 }}
        />

        {/* Handlebar & Stem */}
        <motion.path
          d="M 435 90 L 415 80 L 450 78 L 475 75"
          stroke="#F5F7FA"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        {/* Grip Left and Right */}
        <line x1="400" y1="78" x2="420" y2="82" stroke="#00E08A" strokeWidth="4" strokeLinecap="round" />
        <line x1="455" y1="76" x2="475" y2="74" stroke="#00E08A" strokeWidth="4" strokeLinecap="round" />

        {/* Soft Headlight Glow */}
        <motion.circle
          cx="460"
          cy="135"
          r="8"
          fill="#E8FAFF"
          filter="url(#glowFilter)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Headlight beam projection */}
        <polygon
          points="465,135 560,90 560,180"
          fill="url(#neonGreenStroke)"
          opacity="0.12"
        />

        {/* Swirling Charging Particles (SVG) */}
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <motion.circle
            key={idx}
            r="3"
            fill="#00E08A"
            filter="url(#glowFilter)"
            animate={{
              cx: [280 + Math.cos(idx * 1.05) * 80, 290, 295],
              cy: [220 + Math.sin(idx * 1.05) * 50, 240, 245],
              opacity: [0, 0.9, 0],
              scale: [0.6, 1.2, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: idx * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
};
