/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Workflow,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  ShieldAlert,
  Bell,
  Mail,
  MessageSquare,
  Users,
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Badge } from '../components/ui/Badge';
import { useAppState } from '../context/AppContext';
import { usePresentation } from '../context/PresentationContext';
import { Link } from 'react-router-dom';

interface WorkflowNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
}

interface WorkflowItem {
  id: string;
  code: string;
  title: string;
  description: string;
  channel: string;
  nodes: WorkflowNode[];
  countCalculator: (leads: any[], testRides: any[]) => number;
}

export const AdminAutomationsPage: React.FC = () => {
  const { leads, testRides } = useAppState();
  const { isActive: isPresentationActive, currentStep: presentationStep } = usePresentation();

  // State to track active simulation for each workflow
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [simulationStep, setSimulationStep] = useState<number>(-1);

  // Auto-run simulation on Workflow B (High-Intent Escalation) during Step 12
  useEffect(() => {
    if (isPresentationActive && presentationStep === 12) {
      const timer = setTimeout(() => {
        runSimulation('wf-b', 4);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isPresentationActive, presentationStep]);

  const workflows: WorkflowItem[] = useMemo(
    () => [
      {
        id: 'wf-a',
        code: 'A',
        title: 'New Lead Ingestion & Scoring Engine',
        description:
          'Synchronous intake trigger immediately upon customer completion of the 7-question confidence evaluation.',
        channel: 'Ather State Engine & CRM DB',
        nodes: [
          { id: 'a1', label: 'Quiz completed', sublabel: '7 questions validated' },
          { id: 'a2', label: 'Profile generated', sublabel: 'Archetype match' },
          { id: 'a3', label: 'Score calculated', sublabel: '0–100 rubric' },
          { id: 'a4', label: 'CRM record', sublabel: 'State updated' },
          { id: 'a5', label: 'Result shown', sublabel: 'Personalized UI' },
        ],
        countCalculator: (l) =>
          l.filter((item) => item.journeyStage === 'NEW LEAD' || item.journeyStage === 'PROFILE GENERATED').length + 3,
      },
      {
        id: 'wf-b',
        code: 'B',
        title: 'High-Intent Hot Lead Escalation',
        description:
          'Instant notification dispatch to local Ather Space Concierge team when an evaluator scores above 80 points.',
        channel: 'WhatsApp VIP & Concierge Desk',
        nodes: [
          { id: 'b1', label: 'Score > 80', sublabel: 'Hot threshold' },
          { id: 'b2', label: 'High-intent tag', sublabel: 'Priority flag' },
          { id: 'b3', label: 'Sales notification', sublabel: 'Ather Space alert' },
          { id: 'b4', label: 'Test ride CTA', sublabel: 'Direct slot dispatch' },
        ],
        countCalculator: (l) => l.filter((item) => item.leadScore >= 80).length,
      },
      {
        id: 'wf-c',
        code: 'C',
        title: 'Abandoned Quiz Re-Engagement Journey',
        description:
          'Nurture sequence triggered when visitors begin questionnaire but exit before archetype calculation.',
        channel: 'Web Push & Smart SMS',
        nodes: [
          { id: 'c1', label: 'Quiz started', sublabel: 'Step 1 recorded' },
          { id: 'c2', label: 'No completion', sublabel: '15m inactivity' },
          { id: 'c3', label: 'Reminder journey', sublabel: 'Commute quick-link' },
        ],
        countCalculator: () => 5,
      },
      {
        id: 'wf-d',
        code: 'D',
        title: 'Hesitation Remediation & Test-Ride Drip',
        description:
          'Multi-stage educational drip tailored specifically to the customer\'s identified primary concern.',
        channel: 'Multi-day WhatsApp & Email',
        nodes: [
          { id: 'd1', label: 'Day 1 result', sublabel: 'Savings overview' },
          { id: 'd2', label: 'Day 3 concern content', sublabel: 'Charging / Range guide' },
          { id: 'd3', label: 'Day 6 education', sublabel: 'Battery warranty & Grid' },
          { id: 'd4', label: 'Day 10 invite', sublabel: 'Home test-ride booking' },
        ],
        countCalculator: (l) =>
          l.filter(
            (item) =>
              item.journeyStage === 'QUALIFIED' ||
              item.journeyStage === 'TEST RIDE INVITED' ||
              item.testRideStatus === 'Pending'
          ).length,
      },
    ],
    []
  );

  const runSimulation = (workflowId: string, nodeCount: number) => {
    if (simulatingId) return; // already simulating
    setSimulatingId(workflowId);
    setSimulationStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= nodeCount) {
        clearInterval(interval);
        setTimeout(() => {
          setSimulatingId(null);
          setSimulationStep(-1);
        }, 800);
      } else {
        setSimulationStep(current);
      }
    }, 650);
  };

  return (
    <AdminLayout activeTab="automations">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header with Mandatory Simulated Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00E08A] font-semibold">
                Event-Driven Architecture
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#9AA3AF]">Marketing Automation Workflows</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              Automated Lifecycle Orchestration
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold flex items-center gap-1.5">
              <ShieldAlert size={14} />
              SIMULATED. No real messages are sent.
            </span>
          </div>
        </div>

        {/* PRESENTATION DEMO BANNER */}
        {isPresentationActive && presentationStep === 12 && (
          <div className="p-4 rounded-2xl bg-[#00E08A]/10 border border-[#00E08A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#00E08A]">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-[#00E08A] shrink-0 animate-pulse" />
              <div>
                <span className="font-bold text-white block text-sm">
                  Step 12: Automated High-Intent Escalation Triggered for Riya Desai
                </span>
                <span className="text-[#9AA3AF] text-xs">
                  Lead score of 85 surpassed &gt;80 threshold, triggering instant VIP Concierge dispatch. Next: view behavioral funnel on Analytics.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => runSimulation('wf-b', 4)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
              >
                Replay Run
              </button>
              <Link
                to="/admin/analytics"
                className="px-3.5 py-1.5 rounded-lg bg-[#00E08A] hover:bg-[#00c97b] text-[#0B0D10] font-semibold transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,224,138,0.3)]"
              >
                <span>Analytics Funnel</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* 4 WORKFLOW CARDS DRAWN AS CONNECTED NODE DIAGRAMS */}
        <div className="grid grid-cols-1 gap-6">
          {workflows.map((wf) => {
            const activeLeadsInWorkflow = wf.countCalculator(leads, testRides);
            const isThisWfSimulating = simulatingId === wf.id;

            return (
              <div
                key={wf.id}
                className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 lg:p-7 relative overflow-hidden group hover:border-[#00E08A]/30 transition-all duration-200"
              >
                {/* Header row of Card */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#00E08A]/10 border border-[#00E08A]/30 flex items-center justify-center font-heading text-xs font-bold text-[#00E08A]">
                        {wf.code}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-[#F5F7FA]">
                        {wf.title}
                      </h3>
                      <span className="text-xs text-[#9AA3AF] hidden sm:inline">&bull;</span>
                      <span className="text-xs font-mono text-[#9AA3AF] hidden sm:inline">
                        {wf.channel}
                      </span>
                    </div>
                    <p className="text-xs text-[#9AA3AF] max-w-2xl leading-relaxed">
                      {wf.description}
                    </p>
                  </div>

                  {/* Actions & Live count */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-right">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3AF]">
                        Active In Flow
                      </div>
                      <div className="text-base font-heading font-bold text-[#00E08A] tabular-nums">
                        {activeLeadsInWorkflow} Leads
                      </div>
                    </div>

                    <button
                      onClick={() => runSimulation(wf.id, wf.nodes.length)}
                      disabled={isThisWfSimulating || simulatingId !== null}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all shadow-md ${
                        isThisWfSimulating
                          ? 'bg-[#00E08A]/20 text-[#00E08A] border border-[#00E08A]/40'
                          : 'bg-white/[0.08] text-[#F5F7FA] hover:bg-[#00E08A] hover:text-[#0B0D10] border border-white/10'
                      }`}
                    >
                      {isThisWfSimulating ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#00E08A] animate-ping" />
                          <span>Simulating...</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} className="fill-current" />
                          <span>Run Simulation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* CONNECTED NODE DIAGRAM */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0B0D10] border border-white/[0.06] relative overflow-x-auto">
                  <div className="flex items-center justify-between min-w-[720px] relative py-4">
                    {/* Connecting background rail */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-white/[0.06] z-0" />

                    {/* Animated Travelling Simulation Progress Bar */}
                    {isThisWfSimulating && (
                      <motion.div
                        className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#00E08A] z-0 shadow-[0_0_12px_#00E08A]"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(simulationStep / (wf.nodes.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    )}

                    {wf.nodes.map((node, nIdx) => {
                      const isNodeActive = isThisWfSimulating && simulationStep === nIdx;
                      const isNodePassed = isThisWfSimulating && simulationStep > nIdx;

                      return (
                        <div key={node.id} className="relative z-10 flex flex-col items-center group">
                          {/* Node Circle Box */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 relative ${
                              isNodeActive
                                ? 'bg-[#00E08A] text-[#0B0D10] shadow-[0_0_24px_rgba(0,224,138,0.7)] scale-110'
                                : isNodePassed
                                ? 'bg-[#00E08A]/20 border border-[#00E08A]/60 text-[#00E08A]'
                                : 'bg-[#16191E] border border-white/10 text-[#9AA3AF]'
                            }`}
                          >
                            {/* Animated travelling glowing dot */}
                            {isNodeActive && (
                              <motion.span
                                layoutId={`pulse-${wf.id}`}
                                className="absolute inset-0 rounded-2xl border-2 border-[#00E08A] animate-ping pointer-events-none"
                              />
                            )}

                            {isNodePassed ? (
                              <CheckCircle2 size={18} className="text-[#00E08A]" />
                            ) : (
                              <span>0{nIdx + 1}</span>
                            )}
                          </div>

                          {/* Node Labels */}
                          <div className="text-center mt-3 max-w-[140px]">
                            <span
                              className={`text-xs font-semibold block transition-colors ${
                                isNodeActive
                                  ? 'text-[#00E08A]'
                                  : isNodePassed
                                  ? 'text-[#F5F7FA]'
                                  : 'text-[#F5F7FA]'
                              }`}
                            >
                              {node.label}
                            </span>
                            {node.sublabel && (
                              <span className="text-[10px] font-mono text-[#9AA3AF] block mt-0.5">
                                {node.sublabel}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer simulation notice */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-[#9AA3AF]">
                  <span>Triggered by customer behavior telemetry and CRM stage transitions</span>
                  <span className="font-mono text-white/40">SIMULATED WORKFLOW &bull; SANDBOX</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};
