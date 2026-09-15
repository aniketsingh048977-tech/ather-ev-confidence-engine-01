/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  Users,
  HelpCircle,
  CheckCircle2,
  Award,
  Zap,
  Bike,
  UserCheck,
  ShoppingBag,
  Share2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Filter,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useAppState } from '../context/AppContext';

// Smooth animated count-up number
const CountUp: React.FC<{
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}> = ({ value, suffix = '', prefix = '', decimals = 0 }) => {
  const prefersReduced = useReducedMotion();
  const [current, setCurrent] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (prefersReduced) {
      setCurrent(value);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    const startVal = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(startVal + (value - startVal) * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value, prefersReduced]);

  return (
    <span className="tabular-nums font-heading font-bold">
      {prefix}
      {decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

export const AdminDashboardPage: React.FC = () => {
  const { leads, testRides, events, quizAnswers } = useAppState();

  // Compute live KPI metrics from state
  const metrics = useMemo(() => {
    // 1. Visitors: Baseline + session events
    const visitors = 1420 + events.length * 3;

    // 2. Quiz Starts: Baseline + quiz initiated
    const quizStartedCount = events.filter((e) => e.type.includes('quiz')).length;
    const quizStarts = 890 + quizStartedCount * 2 + (quizAnswers.dailyCommute ? 1 : 0);

    // 3. Quiz Completion %
    const completedQuizCount = leads.length + (quizAnswers.completed ? 1 : 0);
    const quizCompletionRate = Math.min(
      94,
      Math.max(68, Math.round(((680 + completedQuizCount * 4) / quizStarts) * 100))
    );

    // 4. Qualified Leads (Score >= 60)
    const qualifiedLeads = leads.filter((l) => l.leadScore >= 60).length + 420;

    // 5. High Intent Leads (Score >= 80)
    const highIntentLeads = leads.filter((l) => l.leadScore >= 80).length + 185;

    // 6. Test Rides
    const totalTestRides = testRides.length + leads.filter((l) => l.testRideStatus !== 'Not Booked').length + 120;

    // 7. Show-up %
    const completedRides = testRides.filter((t) => t.status === 'Completed').length + 
      leads.filter((l) => l.testRideStatus === 'Completed').length + 98;
    const showUpRate = Math.min(96, Math.max(72, Math.round((completedRides / totalTestRides) * 100)));

    // 8. Purchases
    const purchaseCount = leads.filter(
      (l) => l.journeyStage === 'PURCHASED' || l.journeyStage === 'Decision Ready'
    ).length + 38;

    // 9. Referral Rate %
    const referralCount = leads.filter((l) => l.source === 'Referral' || l.journeyStage === 'ADVOCATE').length + 
      testRides.filter((t) => t.referralEmail).length + 26;
    const referralRate = Math.min(48, Math.max(14, Math.round((referralCount / totalTestRides) * 100)));

    return {
      visitors,
      quizStarts,
      quizCompletionRate,
      qualifiedLeads,
      highIntentLeads,
      totalTestRides,
      showUpRate,
      purchaseCount,
      referralRate,
    };
  }, [events, leads, quizAnswers, testRides]);

  // Funnel data computed from state metrics
  const funnelStages = useMemo(() => {
    return [
      {
        name: 'Visitors',
        count: metrics.visitors,
        pct: 100,
        color: '#9AA3AF',
        note: 'Direct & organic search',
      },
      {
        name: 'Quiz Started',
        count: metrics.quizStarts,
        pct: Math.round((metrics.quizStarts / metrics.visitors) * 100),
        color: '#38BDF8',
        note: 'Engagement trigger',
      },
      {
        name: 'Quiz Completed',
        count: Math.round(metrics.quizStarts * (metrics.quizCompletionRate / 100)),
        pct: Math.round(((metrics.quizStarts * (metrics.quizCompletionRate / 100)) / metrics.visitors) * 100),
        color: '#818CF8',
        note: 'Archetype synthesized',
      },
      {
        name: 'Qualified',
        count: metrics.qualifiedLeads,
        pct: Math.round((metrics.qualifiedLeads / metrics.visitors) * 100),
        color: '#FBBF24',
        note: 'Score >= 60 threshold',
      },
      {
        name: 'High Intent',
        count: metrics.highIntentLeads,
        pct: Math.round((metrics.highIntentLeads / metrics.visitors) * 100),
        color: '#FB923C',
        note: 'Score >= 80 hot leads',
      },
      {
        name: 'Test Ride',
        count: metrics.totalTestRides,
        pct: Math.round((metrics.totalTestRides / metrics.visitors) * 100),
        color: '#00E08A',
        note: 'Experience Center visits',
      },
      {
        name: 'Purchase',
        count: metrics.purchaseCount,
        pct: Math.round((metrics.purchaseCount / metrics.visitors) * 100),
        color: '#34D399',
        note: 'Closed delivery bookings',
      },
    ];
  }, [metrics]);

  // AI Growth Insights computed from demo data
  const growthInsights = [
    {
      id: 'ins-1',
      title: 'Range Hesitation Drives 42% of Mid-Funnel Stalls',
      finding:
        'Bengaluru and Delhi leads with daily commutes between 25-35 km show 1.8x longer deliberation before scheduling test rides, despite needing less than 30% of daily TrueRange™ capacity.',
      action:
        'Deploy automated interactive route simulations comparing actual daily office routes against ARAI vs TrueRange™ margins.',
      impact: '+18% Test Ride Velocity',
    },
    {
      id: 'ins-2',
      title: 'Apartment Charging Anxiety Correlates with Weekend Test-Ride Drop-Off',
      finding:
        '64% of leads residing in high-rise apartments without dedicated parking sockets abandon the funnel at the scheduling stage.',
      action:
        'Trigger the automated RWA & Society EV Permission Toolkit via WhatsApp immediately after apartment parking selection in the quiz.',
      impact: '+24% Show-Up Conversion',
    },
    {
      id: 'ins-3',
      title: 'Post-Ride Advocacy Rate Climbs to 78% Following Warp-Mode Trial',
      finding:
        'Riders who complete the post-ride evaluation rating "Loved it" submit friend referrals at 3.2x the baseline rate when financing EMI breakdowns are pre-populated.',
      action:
        'Embed the one-click zero-spam friend referral invitation on all completed test-ride confirmation pages.',
      impact: '+31% Organic Viral Coefficient',
    },
  ];

  return (
    <AdminLayout activeTab="overview">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* TOP BAR / WELCOME */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00E08A] font-semibold">
                Executive Overview
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#9AA3AF]">Full-Funnel Telemetry</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              Customer Confidence & Acquisition Velocity
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/leads"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E08A] text-[#0B0D10] font-heading font-semibold text-xs hover:bg-[#00E08A]/90 transition-colors shadow-[0_0_20px_rgba(0,224,138,0.25)]"
            >
              <span>Manage CRM Pipeline</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 9 KPI CARDS WITH ANIMATED COUNT-UPS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm font-semibold tracking-wider uppercase text-[#9AA3AF] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#00E08A]" />
              Core Performance Indicators (Live State)
            </h3>
            <span className="text-[11px] font-mono text-[#9AA3AF]">
              Updated Real-Time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {/* KPI 1: Visitors */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Unique Visitors</span>
                <Users size={16} className="text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#F5F7FA]">
                <CountUp value={metrics.visitors} />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                <span className="text-[#00E08A] font-medium">+14.2%</span> vs last week
              </p>
            </Card>

            {/* KPI 2: Quiz Starts */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Quiz Starts</span>
                <HelpCircle size={16} className="text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#F5F7FA]">
                <CountUp value={metrics.quizStarts} />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                <span className="text-[#00E08A] font-medium">62.6%</span> visitor engagement
              </p>
            </Card>

            {/* KPI 3: Quiz Completion % */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Quiz Completion %</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#00E08A]">
                <CountUp value={metrics.quizCompletionRate} suffix="%" />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                <span className="text-[#00E08A] font-medium">+4.8%</span> 7-question retention
              </p>
            </Card>

            {/* KPI 4: Qualified Leads */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Qualified Leads</span>
                <Award size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#F5F7FA]">
                <CountUp value={metrics.qualifiedLeads} />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                Score &ge; 60 threshold
              </p>
            </Card>

            {/* KPI 5: High Intent Leads */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>High Intent Leads</span>
                <Zap size={16} className="text-orange-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-orange-400">
                <CountUp value={metrics.highIntentLeads} />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                Score &ge; 80 hot conversion
              </p>
            </Card>

            {/* KPI 6: Test Rides */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Test Rides Scheduled</span>
                <Bike size={16} className="text-[#00E08A]" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#F5F7FA]">
                <CountUp value={metrics.totalTestRides} />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                Across 14 Ather Spaces
              </p>
            </Card>

            {/* KPI 7: Show-up % */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Show-up %</span>
                <UserCheck size={16} className="text-teal-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#F5F7FA]">
                <CountUp value={metrics.showUpRate} suffix="%" />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                WhatsApp calendar sync
              </p>
            </Card>

            {/* KPI 8: Purchases */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Completed Deliveries</span>
                <ShoppingBag size={16} className="text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#F5F7FA]">
                <CountUp value={metrics.purchaseCount} />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                Paid reservation + booking
              </p>
            </Card>

            {/* KPI 9: Referral Rate */}
            <Card className="p-4 sm:p-5 relative overflow-hidden group hover:border-white/20">
              <div className="flex items-center justify-between text-xs text-[#9AA3AF] mb-2">
                <span>Referral Rate</span>
                <Share2 size={16} className="text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl text-[#00E08A]">
                <CountUp value={metrics.referralRate} suffix="%" />
              </div>
              <p className="text-[11px] text-[#9AA3AF] mt-1 flex items-center gap-1 font-mono">
                Post-ride advocacy invites
              </p>
            </Card>
          </div>
        </div>

        {/* FUNNEL CHART SECTION */}
        <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={16} className="text-[#00E08A]" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#00E08A] font-semibold">
                  End-to-End Pipeline Conversion
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#F5F7FA]">
                Conversion Funnel: Discovery to Purchase
              </h3>
            </div>

            <div className="text-xs text-[#9AA3AF] font-mono">
              Overall Funnel Efficiency: <strong className="text-[#00E08A]">{((metrics.purchaseCount / metrics.visitors) * 100).toFixed(1)}%</strong>
            </div>
          </div>

          {/* Funnel visual bars */}
          <div className="space-y-4">
            {funnelStages.map((stage, idx) => {
              const prevStage = idx > 0 ? funnelStages[idx - 1] : null;
              const stepConversion = prevStage
                ? Math.round((stage.count / prevStage.count) * 100)
                : 100;

              // Normalized bar width percentage relative to max
              const barWidth = Math.max(12, Math.round((stage.count / funnelStages[0].count) * 100));

              return (
                <div key={stage.name} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#9AA3AF] w-5">0{idx + 1}</span>
                      <span className="font-heading font-semibold text-[#F5F7FA] text-sm">
                        {stage.name}
                      </span>
                      <span className="text-[#9AA3AF] text-[11px] hidden md:inline">
                        — {stage.note}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-[#F5F7FA] font-bold">
                        {stage.count.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[#9AA3AF]">({stage.pct}% total)</span>
                      {idx > 0 && (
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-[#00E08A]">
                          {stepConversion}% step
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Funnel Bar */}
                  <div className="w-full h-4 rounded-full bg-white/[0.04] overflow-hidden p-0.5 flex items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full transition-all"
                      style={{ backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#9AA3AF]">
            <span>Computed from live simulation sessions and customer journey progression</span>
            <Link to="/admin/analytics" className="text-[#00E08A] hover:underline flex items-center gap-1 font-medium">
              View Detailed Analytics <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* AI GROWTH INSIGHTS PANEL */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-[#00E08A]" />
              <h3 className="font-heading text-lg font-bold text-[#F5F7FA]">
                AI Growth Insights
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#9AA3AF]">
              Synthesized from current demo cohort
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {growthInsights.map((insight) => (
              <div
                key={insight.id}
                className="bg-[#111418] border border-white/[0.08] rounded-[22px] p-5 sm:p-6 flex flex-col justify-between hover:border-[#00E08A]/40 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00E08A]/10 text-[#00E08A] text-[10px] font-mono uppercase font-semibold">
                      {insight.impact}
                    </span>
                    <Sparkles size={14} className="text-[#00E08A]" />
                  </div>

                  <h4 className="font-heading text-base font-bold text-[#F5F7FA] leading-snug">
                    {insight.title}
                  </h4>

                  <p className="text-xs text-[#9AA3AF] leading-relaxed">
                    {insight.finding}
                  </p>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E08A] font-semibold block">
                      Suggested Action:
                    </span>
                    <p className="text-xs text-[#F5F7FA] leading-relaxed">
                      {insight.action}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono text-[#9AA3AF]/70 italic block">
                    Illustrative insight. Validate with production data.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
