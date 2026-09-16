/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { useAppState } from '../context/AppContext';
import { Hero3DSection } from '../components/home/Hero3DSection';
import { AtherSwitchEngine } from '../components/conversion/AtherSwitchEngine';
import { ExperienceCardsSection } from '../components/home/ExperienceCardsSection';
import { StickyScrollStory } from '../components/home/StickyScrollStory';
import { ScrollWordReveal } from '../components/home/ScrollWordReveal';
import { MarqueeSection } from '../components/home/MarqueeSection';
import { JourneyTimeline } from '../components/home/JourneyTimeline';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

export const HomePage: React.FC = () => {
  const { logEvent } = useAppState();
  const hasLoggedRef = useRef(false);

  // Log page_view event on mount
  useEffect(() => {
    if (!hasLoggedRef.current) {
      hasLoggedRef.current = true;
      logEvent('page_view', '/', { page: 'Home', title: 'Ather EV Confidence Engine' });
    }
  }, [logEvent]);

  return (
    <div className="w-full relative overflow-x-clip bg-[#0B0D10]">
      {/* 1. 3D Hero Scene with interactive scooter & headline */}
      <Hero3DSection />

      {/* 2. Interactive Petrol-to-Ather Switch Engine (High-Conversion Exchange Section) */}
      <section className="relative z-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 -mt-4 sm:-mt-8 mb-14 sm:mb-20">
        <AtherSwitchEngine />
      </section>

      {/* 3. Experience Cards: 3D flip stagger, animated SVG icons, parallax numbers */}
      <ExperienceCardsSection />

      {/* 3. Interactive Story Showcase: Commute, Charging, Savings & Ride */}
      <StickyScrollStory />

      {/* 4. "Don't choose your EV based on someone else's life" Word Fill & Floating Factor Tiles */}
      <ScrollWordReveal />

      {/* 5. Marquee: Two rows of opposite-scrolling outlined giant text */}
      <MarqueeSection />

      {/* 6. Journey Timeline: Glowing line drawing on scroll and popping pulsing milestone dots */}
      <JourneyTimeline />

      {/* 7. Final CTA: AuroraBackground, GlowOrb, MagneticButton & Line-by-Line Headline */}
      <FinalCtaSection />
    </div>
  );
};

