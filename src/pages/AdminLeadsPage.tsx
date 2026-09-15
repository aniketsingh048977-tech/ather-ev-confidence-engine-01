/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Badge } from '../components/ui/Badge';
import { useAppState } from '../context/AppContext';
import { DemoLead, JourneyStage, City, PrimaryConcern } from '../types';
import { usePresentation } from '../context/PresentationContext';
import { RIYA_DESAI_LEAD } from '../data/demoCustomerRiya';

// Standard 9 Kanban Columns
export const KANBAN_COLUMNS: JourneyStage[] = [
  'NEW LEAD',
  'PROFILE GENERATED',
  'QUALIFIED',
  'TEST RIDE INVITED',
  'TEST RIDE BOOKED',
  'TEST RIDE COMPLETED',
  'PURCHASE CONSIDERATION',
  'PURCHASED',
  'ADVOCATE',
];

// Normalize any stage string to match one of the 9 columns
export const normalizeStage = (stage: string): JourneyStage => {
  const s = stage.toUpperCase();
  if (s.includes('NEW')) return 'NEW LEAD';
  if (s.includes('PROFILE')) return 'PROFILE GENERATED';
  if (s.includes('EVALUATION') || s.includes('QUALIFIED')) return 'QUALIFIED';
  if (s.includes('INVITED') || s.includes('INTENT')) return 'TEST RIDE INVITED';
  if (s.includes('TEST RIDE BOOKED') || s === 'TEST RIDE BOOKED') return 'TEST RIDE BOOKED';
  if (s.includes('TEST RIDE COMPLETED') || s.includes('COMPLETED')) return 'TEST RIDE COMPLETED';
  if (s.includes('PURCHASE CONSIDERATION') || s.includes('CONSIDERATION') || s.includes('DECISION')) return 'PURCHASE CONSIDERATION';
  if (s.includes('PURCHASED') || s.includes('PURCHASE')) return 'PURCHASED';
  if (s.includes('ADVOCATE') || s.includes('REFERRAL')) return 'ADVOCATE';
  return 'NEW LEAD';
};

// Compact SVG Score Ring
const CompactScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 38 }) => {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const ringColor =
    score >= 80 ? '#00E08A' : score >= 60 ? '#FBBF24' : score >= 35 ? '#38BDF8' : '#9AA3AF';

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-mono font-bold text-[#F5F7FA]">
        {score}
      </span>
    </div>
  );
};

// Temperature Pill helper
const getTemperaturePill = (score: number) => {
  if (score <= 30) {
    return { label: 'EXPLORER', cls: 'bg-white/[0.04] text-[#9AA3AF] border-white/10' };
  }
  if (score <= 60) {
    return { label: 'INTERESTED', cls: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
  }
  if (score <= 80) {
    return { label: 'CONSIDERATION', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  }
  return { label: 'HIGH INTENT', cls: 'bg-[#00E08A]/10 text-[#00E08A] border-[#00E08A]/30 font-semibold' };
};

export const AdminLeadsPage: React.FC = () => {
  const { leads, updateLead } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [activeDrawerLead, setActiveDrawerLead] = useState<DemoLead | null>(null);

  const { isActive: isPresentationActive, currentStep: presentationStep } = usePresentation();

  // Auto-open Riya Desai's dossier drawer during Step 11 of Presentation Demo
  useEffect(() => {
    if (isPresentationActive && presentationStep === 11) {
      const riya = leads.find((l) => l.name.toLowerCase().includes('riya')) || RIYA_DESAI_LEAD;
      setActiveDrawerLead(riya);
    }
  }, [isPresentationActive, presentationStep, leads]);

  // The most recent lead gets the "NEW" highlight
  const newestLeadId = useMemo(() => {
    if (leads.length === 0) return null;
    const sorted = [...leads].sort(
      (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
    return sorted[0]?.id;
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.riderProfile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'All' || lead.city === selectedCity;
      const matchesConcern = selectedConcern === 'All' || lead.primaryConcern === selectedConcern;
      return matchesSearch && matchesCity && matchesConcern;
    });
  }, [leads, searchTerm, selectedCity, selectedConcern]);

  // Group filtered leads into Kanban columns
  const columnLeads = useMemo(() => {
    const map: Record<JourneyStage, DemoLead[]> = {
      'NEW LEAD': [],
      'PROFILE GENERATED': [],
      'QUALIFIED': [],
      'TEST RIDE INVITED': [],
      'TEST RIDE BOOKED': [],
      'TEST RIDE COMPLETED': [],
      'PURCHASE CONSIDERATION': [],
      'PURCHASED': [],
      'ADVOCATE': [],
      'Awareness': [],
      'Evaluation': [],
      'Intent': [],
      'Deliberation': [],
      'Decision Ready': [],
      'Profile Generated': [],
      'Purchase Consideration': [],
      'Test Ride Booked': [],
    };

    filteredLeads.forEach((lead) => {
      const normalized = normalizeStage(lead.journeyStage);
      if (!map[normalized]) {
        map[normalized] = [];
      }
      map[normalized].push(lead);
    });

    return map;
  }, [filteredLeads]);

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>, leadId: string) => {
    e.stopPropagation();
    const newStage = e.target.value as JourneyStage;
    updateLead(leadId, {
      journeyStage: newStage,
      lastActivity: new Date().toISOString(),
    });
    // If open in drawer, update drawer state as well
    if (activeDrawerLead && activeDrawerLead.id === leadId) {
      setActiveDrawerLead((prev) => (prev ? { ...prev, journeyStage: newStage } : null));
    }
  };

  return (
    <AdminLayout activeTab="leads">
      <div className="space-y-6 max-w-full">
        {/* HEADER & NOTE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00E08A] font-semibold">
                CRM Pipeline & Orchestration
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#9AA3AF]">{filteredLeads.length} Leads Active</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              Customer Journey Kanban Board
            </h2>
            <p className="text-xs text-[#9AA3AF] mt-1 italic">
              Note: DEMO LEAD SCORING MODEL. Production scoring should be calibrated using actual conversion data.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative min-w-[200px] sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3AF]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, city, campaign..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-[#F5F7FA] placeholder-[#9AA3AF] focus:outline-none focus:border-[#00E08A]/50 transition-colors"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#16191E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
            >
              <option value="All">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>

            <select
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
              className="bg-[#16191E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#00E08A]"
            >
              <option value="All">All Concerns</option>
              <option value="Range">Range</option>
              <option value="Charging">Charging</option>
              <option value="Price">Price</option>
              <option value="Performance">Performance</option>
              <option value="Service">Service</option>
            </select>
          </div>
        </div>

        {/* KANBAN BOARD CONTAINER (HORIZONTAL SCROLL ON SMALL/MEDIUM SCREENS) */}
        <div className="w-full overflow-x-auto pb-6 pt-2 scrollbar-thin">
          <div className="flex gap-4 min-w-[2700px] items-start">
            {KANBAN_COLUMNS.map((columnKey) => {
              const columnItems = columnLeads[columnKey] || [];

              return (
                <div
                  key={columnKey}
                  className="w-[290px] shrink-0 bg-[#0E1116] border border-white/[0.08] rounded-2xl flex flex-col max-h-[calc(100vh-230px)] shadow-lg"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02] rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00E08A]" />
                      <h4 className="font-heading text-xs font-bold tracking-wider text-[#F5F7FA] uppercase">
                        {columnKey}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-[#9AA3AF]">
                      {columnItems.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1 min-h-[300px]">
                    <AnimatePresence mode="popLayout">
                      {columnItems.map((lead) => {
                        const temp = getTemperaturePill(lead.leadScore);
                        const isNew = lead.id === newestLeadId;

                        const isRiya = lead.name.toLowerCase().includes('riya');

                        return (
                          <motion.div
                            key={lead.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setActiveDrawerLead(lead)}
                            className={`p-3.5 rounded-xl bg-[#141820] border transition-all cursor-pointer relative group ${
                              isRiya
                                ? 'border-[#00E08A] ring-2 ring-[#00E08A]/70 shadow-[0_0_24px_rgba(0,224,138,0.25)] bg-[#00E08A]/[0.04]'
                                : isNew
                                ? 'border-[#00E08A]/60 shadow-[0_0_16px_rgba(0,224,138,0.18)]'
                                : 'border-white/[0.07] hover:border-white/20 hover:bg-[#181D26]'
                            }`}
                          >
                            {/* DEMO / NEW Glow Highlight */}
                            {isRiya ? (
                              <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-[#00E08A] text-[#0B0D10] text-[9px] font-bold font-mono tracking-wider shadow-[0_0_12px_#00E08A] animate-pulse">
                                DEMO CUSTOMER
                              </span>
                            ) : isNew ? (
                              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#00E08A] text-[#0B0D10] text-[9px] font-bold font-mono tracking-wider shadow-[0_0_10px_#00E08A] animate-pulse">
                                NEW
                              </span>
                            ) : null}

                            {/* Top row: Name & Score Ring */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="min-w-0">
                                <h5 className="font-heading text-sm font-bold text-[#F5F7FA] truncate group-hover:text-[#00E08A] transition-colors">
                                  {lead.name}
                                </h5>
                                <div className="flex items-center gap-1.5 text-[11px] text-[#9AA3AF]">
                                  <MapPin size={11} className="text-white/40 shrink-0" />
                                  <span>{lead.city}</span>
                                </div>
                              </div>
                              <CompactScoreRing score={lead.leadScore} size={36} />
                            </div>

                            {/* Temperature Pill & Concern */}
                            <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                              <span
                                className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${temp.cls}`}
                              >
                                {temp.label}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#F5F7FA] border border-white/[0.06]">
                                {lead.primaryConcern}
                              </span>
                              <span className="text-[10px] font-mono text-[#00E08A] ml-auto">
                                {lead.matchPercentage}% match
                              </span>
                            </div>

                            {/* Profile descriptor */}
                            <p className="text-xs text-[#9AA3AF] line-clamp-2 mb-3 leading-relaxed">
                              {lead.riderProfile}
                            </p>

                            {/* Metadata: Source, Campaign, Test Ride Status */}
                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1 text-[10px] text-[#9AA3AF] mb-3">
                              <div className="flex items-center justify-between">
                                <span>Source: <strong className="text-[#F5F7FA]">{lead.source}</strong></span>
                                <span className={`px-1.5 py-0.2 rounded font-mono ${
                                  lead.testRideStatus === 'Scheduled'
                                    ? 'text-[#00E08A] bg-[#00E08A]/10'
                                    : lead.testRideStatus === 'Completed'
                                    ? 'text-blue-400 bg-blue-500/10'
                                    : 'text-[#9AA3AF]'
                                }`}>
                                  {lead.testRideStatus}
                                </span>
                              </div>
                              <div className="truncate text-white/50 font-mono">
                                {lead.campaignName}
                              </div>
                            </div>

                            {/* Footer: Stage Dropdown & Last Activity */}
                            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                              <div className="text-[10px] font-mono text-white/40 truncate">
                                {new Date(lead.lastActivity).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </div>

                              {lead.tag && (
                                <span className="text-[9px] font-mono text-white/40 uppercase bg-white/[0.04] px-1.5 py-0.5 rounded">
                                  DEMO
                                </span>
                              )}

                              {/* Stage Dropdown to move card */}
                              <select
                                value={normalizeStage(lead.journeyStage)}
                                onChange={(e) => handleStageChange(e, lead.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#1B202A] border border-white/10 rounded px-2 py-1 text-[10px] font-medium text-[#00E08A] hover:border-[#00E08A] focus:outline-none cursor-pointer"
                              >
                                {KANBAN_COLUMNS.map((col) => (
                                  <option key={col} value={col}>
                                    &rarr; {col}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {columnItems.length === 0 && (
                      <div className="h-28 rounded-xl border border-dashed border-white/[0.08] flex items-center justify-center text-xs text-[#9AA3AF]/50 font-mono">
                        No leads in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDE DRAWER FOR LEAD DETAILS */}
        <AnimatePresence>
          {activeDrawerLead && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveDrawerLead(null)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              />

              {/* Drawer panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 240 }}
                className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#0E1116] border-l border-white/10 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
              >
                <div>
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#00E08A]">
                        Lead Profile Dossier
                      </span>
                      <Badge variant="DEMO DATA" />
                    </div>
                    <button
                      onClick={() => setActiveDrawerLead(null)}
                      className="p-1.5 rounded-lg text-[#9AA3AF] hover:text-white hover:bg-white/[0.05]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Customer Hero summary */}
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#F5F7FA]">
                        {activeDrawerLead.name}
                      </h3>
                      <p className="text-xs text-[#9AA3AF] flex items-center gap-1.5 mt-0.5">
                        <MapPin size={13} className="text-[#00E08A]" />
                        {activeDrawerLead.city} &bull; {activeDrawerLead.source} Channel
                      </p>
                    </div>
                    <CompactScoreRing score={activeDrawerLead.leadScore} size={48} />
                  </div>

                  {/* Stage Switcher in Drawer */}
                  <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-[#9AA3AF]">Current Stage:</span>
                    <select
                      value={normalizeStage(activeDrawerLead.journeyStage)}
                      onChange={(e) => handleStageChange(e, activeDrawerLead.id)}
                      className="bg-[#181D26] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#00E08A] font-semibold focus:outline-none focus:border-[#00E08A]"
                    >
                      {KANBAN_COLUMNS.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lead Score Breakdown */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#9AA3AF] flex items-center gap-1.5">
                      <Zap size={14} className="text-[#00E08A]" />
                      Lead Score Breakdown (Total: {activeDrawerLead.leadScore}/100)
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-[#F5F7FA]">Archetype & Lifestyle Alignment</span>
                        <span className="font-mono text-[#00E08A] font-bold">+25 pts</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-[#F5F7FA]">7-Step Quiz Intent Completed</span>
                        <span className="font-mono text-[#00E08A] font-bold">+20 pts</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-[#F5F7FA]">Commute Feasibility (TrueRange™ Fit)</span>
                        <span className="font-mono text-[#00E08A] font-bold">+15 pts</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-[#F5F7FA]">Home / Dedicated Charging Access</span>
                        <span className="font-mono text-[#00E08A] font-bold">+15 pts</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-[#F5F7FA]">
                          {activeDrawerLead.testRideStatus === 'Scheduled' || activeDrawerLead.testRideStatus === 'Completed'
                            ? 'Test Ride Engagement Scheduled'
                            : 'Digital Concierge Interaction'}
                        </span>
                        <span className="font-mono text-[#00E08A] font-bold">
                          +{Math.max(5, activeDrawerLead.leadScore - 75)} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consent & Privacy Status */}
                  <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#00E08A]">
                      <ShieldCheck size={16} />
                      <span>DPDP Act 2023 Compliant Consent</span>
                    </div>
                    <div className="text-[11px] text-[#9AA3AF] space-y-1 font-mono">
                      <p>Status: <strong className="text-emerald-400">Explicit Consent Granted</strong></p>
                      <p>Timestamp: {new Date(activeDrawerLead.lastActivity).toLocaleString()}</p>
                      <p>Communication: WhatsApp, SMS & Concierge Phone</p>
                    </div>
                  </div>

                  {/* Event Timeline */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#9AA3AF] flex items-center gap-1.5">
                      <Activity size={14} className="text-[#00E08A]" />
                      Customer Event Timeline
                    </h4>

                    <div className="relative pl-5 border-l border-white/10 space-y-4 text-xs">
                      <div className="relative">
                        <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-[#00E08A]" />
                        <span className="text-[#F5F7FA] font-medium block">
                          Stage: {activeDrawerLead.journeyStage}
                        </span>
                        <span className="text-[10px] font-mono text-[#9AA3AF]">
                          Last Action: {new Date(activeDrawerLead.lastActivity).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[25px] top-1 w-2 h-2 rounded-full bg-white/40" />
                        <span className="text-[#9AA3AF] block">
                          Attribution: {activeDrawerLead.campaignName} via {activeDrawerLead.source}
                        </span>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[25px] top-1 w-2 h-2 rounded-full bg-white/40" />
                        <span className="text-[#9AA3AF] block">
                          Persona Assigned: {activeDrawerLead.riderProfile}
                        </span>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[25px] top-1 w-2 h-2 rounded-full bg-white/40" />
                        <span className="text-[#9AA3AF] block">
                          Primary Hesitation: {activeDrawerLead.primaryConcern}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center gap-3">
                  <button
                    onClick={() => setActiveDrawerLead(null)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.06] text-[#F5F7FA] text-xs font-semibold hover:bg-white/[0.1] transition-colors"
                  >
                    Close Dossier
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};
