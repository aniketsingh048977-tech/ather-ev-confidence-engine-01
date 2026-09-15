/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  ExternalLink,
} from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { Card } from '../components/ui/Card';
import { Badge, BadgeVariant } from '../components/ui/Badge';
import { ScoreRing } from '../components/ui/ScoreRing';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { leads, leadScore, currentCustomer } = useAppState();
  const [interactiveScore, setInteractiveScore] = useState<number>(88);

  const allRoutes = [
    { path: '/', label: 'Home / Design System', status: 'Phase 1 Active' },
    { path: '/quiz', label: 'Confidence Quiz (/quiz)', status: 'Placeholder' },
    { path: '/profile', label: 'Rider Profile (/profile)', status: 'Placeholder' },
    { path: '/savings', label: 'Savings Calculator (/savings)', status: 'Placeholder' },
    { path: '/charging', label: 'Charging Confidence (/charging)', status: 'Placeholder' },
    { path: '/concierge', label: 'AI Concierge (/concierge)', status: 'Placeholder' },
    { path: '/test-ride', label: 'Test Ride Booking (/test-ride)', status: 'Placeholder' },
    { path: '/confirmation', label: 'Ride Confirmation (/confirmation)', status: 'Placeholder' },
    { path: '/post-ride', label: 'Post-Ride Feedback (/post-ride)', status: 'Placeholder' },
    { path: '/how-it-works', label: 'How It Works (/how-it-works)', status: 'Placeholder' },
    { path: '/admin', label: 'Admin Overview (/admin)', status: 'Placeholder' },
    { path: '/admin/leads', label: 'Admin Leads Hub (/admin/leads)', status: 'Placeholder' },
    { path: '/admin/analytics', label: 'Admin Analytics (/admin/analytics)', status: 'Placeholder' },
    { path: '/admin/automations', label: 'Admin Automations (/admin/automations)', status: 'Placeholder' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <MotionSection className="pt-20 md:pt-32 pb-24 md:pb-36">
        <MotionItem>
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Badge variant="ACADEMIC PROTOTYPE" />
            <span className="text-white/20">•</span>
            <span className="text-xs uppercase tracking-[0.12em] text-[#9AA3AF]">
              Phase 1: Foundation & Design System
            </span>
          </div>
        </MotionItem>

        <MotionItem>
          <h1 className="font-heading text-[42px] leading-[1.08] sm:text-[60px] md:text-[80px] font-semibold tracking-[-0.02em] text-[#F5F7FA] max-w-5xl">
            From &lsquo;Should I buy an EV?&rsquo; to &lsquo;I should test this.&rsquo;
          </h1>
        </MotionItem>

        <MotionItem className="mt-8">
          <p className="text-lg sm:text-xl md:text-2xl text-[#9AA3AF] max-w-3xl font-normal leading-relaxed">
            The Ather EV Confidence Engine is an academic prototype for an MBA digital marketing assessment.
            Architected to eliminate EV hesitation through personalized commute realities, objective total cost
            of ownership, and zero-friction test ride conversion.
          </p>
        </MotionItem>

        <MotionItem className="mt-12">
          <div className="flex flex-wrap gap-4 items-center">
            <PrimaryButton to="/quiz" size="lg" icon={<ArrowRight size={18} />}>
              Find My Match
            </PrimaryButton>
            <SecondaryButton to="/how-it-works" size="lg">
              Explore How It Works
            </SecondaryButton>
          </div>
        </MotionItem>

        {/* Highlight Stats Row */}
        <MotionItem className="mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-white/[0.06]">
            <div>
              <span className="block font-heading text-4xl sm:text-5xl font-semibold text-[#F5F7FA] tabular-nums">
                12
              </span>
              <span className="text-xs sm:text-sm text-[#9AA3AF] mt-1 block">
                Seeded Demo Leads
              </span>
            </div>
            <div>
              <span className="block font-heading text-4xl sm:text-5xl font-semibold text-[#00E08A] tabular-nums">
                14
              </span>
              <span className="text-xs sm:text-sm text-[#9AA3AF] mt-1 block">
                Connected Routes
              </span>
            </div>
            <div>
              <span className="block font-heading text-4xl sm:text-5xl font-semibold text-[#F5F7FA] tabular-nums">
                0
              </span>
              <span className="text-xs sm:text-sm text-[#9AA3AF] mt-1 block">
                Invented Specs
              </span>
            </div>
            <div>
              <span className="block font-heading text-4xl sm:text-5xl font-semibold text-[#00E08A] tabular-nums">
                100%
              </span>
              <span className="text-xs sm:text-sm text-[#9AA3AF] mt-1 block">
                Academic Integrity
              </span>
            </div>
          </div>
        </MotionItem>
      </MotionSection>

      {/* Design System Showcase (Cards, Buttons, Badges, ScoreRing) */}
      <MotionSection alternate={true} id="design-system">
        <MotionItem>
          <SectionHeading
            eyebrow="Design Tokens & Primitives"
            title="Engineered Design System"
            subtext="Strict adherence to calm, cinematic Indian EV-tech mood. High-contrast typography in Space Grotesk and Inter, electric green accents, 8px spacing grid, and fluid micro-interactions."
          />
        </MotionItem>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
          {/* Component 1: ScoreRing Interactive */}
          <MotionItem>
            <Card className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA3AF]">
                    Component 01
                  </span>
                  <Badge variant="VERIFIED" label="ACTIVE" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-[#F5F7FA] mb-2">
                  ScoreRing Primitive
                </h3>
                <p className="text-sm text-[#9AA3AF] mb-8">
                  Circular SVG progress ring with fluid easeOut animation and counting tabular numbers.
                </p>
                <div className="py-6 flex justify-center items-center">
                  <ScoreRing
                    score={interactiveScore}
                    size={160}
                    strokeWidth={12}
                    label="Confidence"
                    sublabel="Simulated Rider Fit"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-[#9AA3AF]">Test Value:</span>
                <div className="flex gap-2">
                  {[45, 78, 92].map((val) => (
                    <button
                      key={val}
                      onClick={() => setInteractiveScore(val)}
                      className={`px-2.5 py-1 text-xs rounded-md font-mono transition-colors ${
                        interactiveScore === val
                          ? 'bg-[#00E08A] text-[#0B0D10] font-bold'
                          : 'bg-white/5 text-[#9AA3AF] hover:text-white'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </MotionItem>

          {/* Component 2: Badges & Buttons */}
          <MotionItem>
            <Card className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA3AF]">
                    Component 02 & 03
                  </span>
                  <Badge variant="ACADEMIC PROTOTYPE" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-[#F5F7FA] mb-2">
                  Badges & Buttons
                </h3>
                <p className="text-sm text-[#9AA3AF] mb-6">
                  Pill badges with 11px uppercase tracking and rounded-full interactive buttons with green glow.
                </p>

                {/* Badge variants */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs uppercase text-[#9AA3AF] tracking-wider block">
                    All Badge Variants:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="ACADEMIC PROTOTYPE" />
                    <Badge variant="DEMO DATA" />
                    <Badge variant="VERIFIED" />
                    <Badge variant="UNVERIFIED" />
                  </div>
                </div>

                {/* Button variants */}
                <div className="space-y-3">
                  <span className="text-xs uppercase text-[#9AA3AF] tracking-wider block">
                    Button Interactions:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <PrimaryButton size="sm">Primary Button</PrimaryButton>
                    <SecondaryButton size="sm">Secondary Button</SecondaryButton>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] text-xs text-[#9AA3AF]">
                Accent: <code className="text-[#00E08A]">#00E08A</code> • Card: <code className="text-white/70">#16191E</code>
              </div>
            </Card>
          </MotionItem>

          {/* Component 3: Card Micro-interactions */}
          <MotionItem>
            <Card className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA3AF]">
                    Component 04
                  </span>
                  <Badge variant="DEMO DATA" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-[#F5F7FA] mb-2">
                  Elevated Card Hover
                </h3>
                <p className="text-sm text-[#9AA3AF] mb-6">
                  Lifts 4px on hover with 0.3s ease transition, border brightening, and soft shadow dissipation.
                </p>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs text-[#9AA3AF]">
                  <div className="flex justify-between">
                    <span>Card Background</span>
                    <span className="font-mono text-white">#16191E</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Border</span>
                    <span className="font-mono text-white">rgba(255,255,255,0.06)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Border Radius</span>
                    <span className="font-mono text-white">20px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hover Shift</span>
                    <span className="font-mono text-[#00E08A]">translateY(-4px)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06]">
                <PrimaryButton to="/quiz" size="sm" className="w-full">
                  Launch Quiz Flow
                </PrimaryButton>
              </div>
            </Card>
          </MotionItem>
        </div>
      </MotionSection>

      {/* Light Contrast Section (F4F5F2 background, 0B0D10 text) */}
      <MotionSection lightMode={true}>
        <MotionItem>
          <div className="max-w-3xl">
            <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#0B0D10]/70 mb-3 bg-[#0B0D10]/5 px-3 py-1 rounded-full">
              Academic Charter & Data Safeguards
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#0B0D10]">
              Zero Fabrication Standard.
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#0B0D10]/80 leading-relaxed">
              To guarantee absolute academic authenticity for this MBA digital marketing assessment,
              this application explicitly refuses to invent Ather product prices, battery ranges,
              acceleration times, fast charging networks, or promotional offers.
            </p>
          </div>
        </MotionItem>

        <MotionItem className="mt-10">
          <div className="p-6 md:p-8 rounded-[20px] bg-white border border-[#0B0D10]/10 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#0B0D10]/10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={24} className="text-[#0B0D10]" />
                <span className="font-heading font-semibold text-lg text-[#0B0D10]">
                  Academic Data Requirement Tag
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0B0D10] text-[#00E08A]">
                [VERIFIED ATHER PRODUCT DATA REQUIRED]
              </span>
            </div>
            <p className="mt-4 text-sm text-[#0B0D10]/75 leading-relaxed">
              Every card, calculator, and specification slot that depends on proprietary manufacturer
              numbers will clearly display this placeholder until verified product feeds are supplied
              in subsequent phases.
            </p>
          </div>
        </MotionItem>
      </MotionSection>

      {/* Connected Routes Directory (All 14 routes) */}
      <MotionSection alternate={true} id="routes">
        <MotionItem>
          <SectionHeading
            eyebrow="Application Architecture"
            title="All 14 Connected Routes"
            subtext="All pages are fully routed with React Router, responsive on mobile and desktop, ready for Phase 2 functional content."
          />
        </MotionItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {allRoutes.map((r, idx) => (
            <MotionItem key={r.path}>
              <Link to={r.path} className="block group">
                <Card className="h-full py-5 px-6 group-hover:border-[#00E08A]/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#00E08A]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/[0.04] text-[#9AA3AF]">
                      {r.status}
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base text-[#F5F7FA] group-hover:text-[#00E08A] transition-colors flex items-center justify-between">
                    <span>{r.label}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#00E08A]" />
                  </h4>
                </Card>
              </Link>
            </MotionItem>
          ))}
        </div>
      </MotionSection>

      {/* Demo Leads Snapshot (React Context in Memory) */}
      <MotionSection alternate={false} id="demo-leads">
        <MotionItem>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <SectionHeading
              eyebrow="In-Memory State Store"
              title="12 Seeded Demo Leads"
              subtext="Pre-loaded fictional customers for testing digital marketing funnels, lead scoring (15-95), and attribution channels."
            />
            <PrimaryButton to="/admin/leads" size="sm">
              View In Admin Hub
            </PrimaryButton>
          </div>
        </MotionItem>

        <MotionItem>
          <div className="overflow-x-auto rounded-[20px] border border-white/[0.06] bg-[#16191E]">
            <table className="w-full text-left text-sm text-[#9AA3AF]">
              <thead className="bg-white/[0.02] text-xs uppercase text-[#F5F7FA] border-b border-white/[0.06]">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">City</th>
                  <th className="py-4 px-6">Primary Concern</th>
                  <th className="py-4 px-6">Channel</th>
                  <th className="py-4 px-6 text-center">Score</th>
                  <th className="py-4 px-6 text-center">Stage</th>
                  <th className="py-4 px-6 text-right">Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {leads.slice(0, 6).map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-[#F5F7FA]">
                      {lead.name}
                      <span className="block text-xs text-[#9AA3AF] font-normal truncate max-w-[200px]">
                        {lead.riderProfile}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#F5F7FA]">{lead.city}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs bg-white/[0.04] text-[#F5F7FA]">
                        {lead.primaryConcern}
                      </span>
                    </td>
                    <td className="py-4 px-6">{lead.source}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-heading font-semibold text-[#00E08A] tabular-nums">
                        {lead.leadScore}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-xs">
                      {lead.journeyStage}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Badge variant="DEMO DATA" label={lead.tag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#9AA3AF] text-right">
            Showing first 6 of 12 seeded leads. Full database accessible in Admin &gt; Leads.
          </p>
        </MotionItem>
      </MotionSection>
    </div>
  );
};
