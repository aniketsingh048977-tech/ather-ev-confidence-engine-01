import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { RevealText } from '../motion/RevealText';
import { TiltCard } from '../motion/TiltCard';
import {
  AnimatedCompassIcon,
  AnimatedSparklesIcon,
  AnimatedZapIcon,
} from './AnimatedIcons';

interface ExperienceCardItem {
  num: string;
  title: string;
  text: string;
  link: string;
  actionLabel: string;
  type: 'compass' | 'sparkles' | 'zap';
}

const CARDS: ExperienceCardItem[] = [
  {
    num: '01',
    title: 'UNDERSTAND MY RIDE',
    text: 'Learn how an EV fits daily life.',
    link: '/savings',
    actionLabel: 'Calculate Economics',
    type: 'compass',
  },
  {
    num: '02',
    title: 'DISCOVER MY MATCH',
    text: 'Answer a few questions and receive a personalised rider profile.',
    link: '/quiz',
    actionLabel: 'Take the Assessment',
    type: 'sparkles',
  },
  {
    num: '03',
    title: 'EXPERIENCE IT',
    text: 'Move from digital confidence to a real test ride.',
    link: '/test-ride',
    actionLabel: 'Book Experience',
    type: 'zap',
  },
];

export const ExperienceCardsSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mouseOffsets, setMouseOffsets] = useState<{ [key: string]: { x: number; y: number } }>({
    '01': { x: 0, y: 0 },
    '02': { x: 0, y: 0 },
    '03': { x: 0, y: 0 },
  });

  const handleMouseMove = (num: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 28;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 28;
    setMouseOffsets((prev) => ({ ...prev, [num]: { x, y } }));
  };

  const handleMouseLeave = (num: string) => {
    setHoveredCard(null);
    setMouseOffsets((prev) => ({ ...prev, [num]: { x: 0, y: 0 } }));
  };

  return (
    <section id="experience-cards" className="w-full bg-[#111418] relative z-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-[120px]">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-2xl mb-12 md:mb-16">
          <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#00E08A] mb-3">
            Confidence Framework
          </span>
          <RevealText
            as="h2"
            text="Three steps to clarity."
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#F5F7FA]"
          />
          <p className="mt-4 text-base md:text-lg text-[#9AA3AF] leading-relaxed">
            Moving past general EV stereotypes requires honest commute physics, personalized
            lifestyle mapping, and unpressured hands-on throttle time.
          </p>
        </div>

        {/* 3D Flip Container with Perspective */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          style={{ perspective: 1200 }}
        >
          {CARDS.map((card, idx) => {
            const isHovered = hoveredCard === card.num;
            const offset = mouseOffsets[card.num] || { x: 0, y: 0 };

            return (
              <motion.div
                key={card.num}
                initial={{
                  opacity: 0,
                  y: prefersReduced ? 0 : 70,
                  rotateX: prefersReduced ? 0 : 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: prefersReduced ? 0.3 : 0.75,
                  delay: prefersReduced ? 0 : idx * 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
                onMouseMove={(e) => handleMouseMove(card.num, e)}
                onMouseEnter={() => setHoveredCard(card.num)}
                onMouseLeave={() => handleMouseLeave(card.num)}
              >
                <Link to={card.link} className="block group h-full focus:outline-none">
                  <TiltCard maxTilt={10} className="h-full">
                    <div className="h-full relative overflow-hidden flex flex-col justify-between p-8 rounded-[20px] bg-[#16191E] border border-white/[0.08] group-hover:border-[#00E08A]/50 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)] transition-all duration-300">
                      {/* Giant faint number with Parallax movement */}
                      <motion.span
                        className="absolute top-3 right-6 font-heading font-extrabold text-7xl sm:text-8xl select-none text-white/[0.03] group-hover:text-[#00E08A]/15 transition-colors pointer-events-none"
                        animate={{
                          x: offset.x * 1.4,
                          y: offset.y * 1.4,
                        }}
                        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                      >
                        {card.num}
                      </motion.span>

                      <div className="relative z-10">
                        {/* Icon badge with Animated SVG */}
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-8 group-hover:border-[#00E08A]/40 group-hover:bg-[#00E08A]/10 transition-all duration-300">
                          {card.type === 'compass' && <AnimatedCompassIcon isHovered={isHovered} />}
                          {card.type === 'sparkles' && <AnimatedSparklesIcon isHovered={isHovered} />}
                          {card.type === 'zap' && <AnimatedZapIcon isHovered={isHovered} />}
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#F5F7FA] tracking-tight mb-3 group-hover:text-[#00E08A] transition-colors">
                          {card.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm md:text-base text-[#9AA3AF] leading-relaxed">
                          {card.text}
                        </p>
                      </div>

                      {/* Bottom action link */}
                      <div className="pt-8 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#9AA3AF] group-hover:text-[#00E08A] transition-colors relative z-10">
                        <span>{card.actionLabel}</span>
                        <ArrowRight
                          size={16}
                          strokeWidth={1.5}
                          className="group-hover:translate-x-1.5 transition-transform text-[#00E08A]"
                        />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
