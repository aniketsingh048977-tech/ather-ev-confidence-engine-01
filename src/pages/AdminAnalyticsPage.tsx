/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Award,
  Users,
  Compass,
  Calendar,
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppState } from '../context/AppContext';
import { normalizeStage } from './AdminLeadsPage';

// Custom Recharts Dark Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141820] border border-white/10 rounded-xl p-3 shadow-2xl text-xs font-mono">
        <p className="text-[#F5F7FA] font-bold mb-1">{label || payload[0].name}</p>
        {payload.map((item: any, idx: number) => (
          <p key={idx} className="flex items-center gap-2" style={{ color: item.color || '#00E08A' }}>
            <span>{item.name}:</span>
            <span className="font-bold">{item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminAnalyticsPage: React.FC = () => {
  const { leads } = useAppState();

  // 1. Lead Score Distribution (Bar)
  const scoreDistributionData = useMemo(() => {
    const buckets = [
      { range: '0–20', count: 0, label: 'Explorer' },
      { range: '21–40', count: 0, label: 'Early' },
      { range: '41–60', count: 0, label: 'Interested' },
      { range: '61–80', count: 0, label: 'Consideration' },
      { range: '81–100', count: 0, label: 'High Intent' },
    ];

    leads.forEach((l) => {
      const s = l.leadScore;
      if (s <= 20) buckets[0].count++;
      else if (s <= 40) buckets[1].count++;
      else if (s <= 60) buckets[2].count++;
      else if (s <= 80) buckets[3].count++;
      else buckets[4].count++;
    });

    return buckets;
  }, [leads]);

  // 2. Concern Distribution (Donut)
  const concernDonutData = useMemo(() => {
    const map: Record<string, number> = {
      Range: 0,
      Charging: 0,
      Price: 0,
      Performance: 0,
      Service: 0,
    };

    leads.forEach((l) => {
      if (map[l.primaryConcern] !== undefined) {
        map[l.primaryConcern]++;
      } else {
        map['Range']++;
      }
    });

    const colors: Record<string, string> = {
      Range: '#00E08A',
      Charging: '#38BDF8',
      Price: '#FBBF24',
      Performance: '#F43F5E',
      Service: '#A855F7',
    };

    return Object.entries(map).map(([concern, count]) => ({
      name: concern,
      value: count,
      color: colors[concern] || '#9AA3AF',
    }));
  }, [leads]);

  // 3. Rider Profile Distribution (Bar)
  const riderProfileData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      // Shorten label for clean bar display
      const shortProfile = l.riderProfile.split('(')[0].split('&')[0].trim();
      counts[shortProfile] = (counts[shortProfile] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([profile, count]) => ({
        profile,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [leads]);

  // 4. Campaign Source (Horizontal Bar)
  const sourceHorizontalData = useMemo(() => {
    const sources: Record<string, number> = {
      Instagram: 0,
      Google: 0,
      YouTube: 0,
      Referral: 0,
      Direct: 0,
    };

    leads.forEach((l) => {
      if (sources[l.source] !== undefined) {
        sources[l.source]++;
      } else {
        sources['Direct']++;
      }
    });

    return Object.entries(sources).map(([source, count]) => ({
      source,
      leads: count,
    }));
  }, [leads]);

  // 5. Journey Stage Distribution (Bar)
  const stageDistributionData = useMemo(() => {
    const stages: Record<string, number> = {
      'New Lead': 0,
      'Profile Gen': 0,
      'Qualified': 0,
      'Invited': 0,
      'Test Ride': 0,
      'Completed': 0,
      'Consideration': 0,
      'Purchased': 0,
      'Advocate': 0,
    };

    leads.forEach((l) => {
      const norm = normalizeStage(l.journeyStage);
      if (norm === 'NEW LEAD') stages['New Lead']++;
      else if (norm === 'PROFILE GENERATED') stages['Profile Gen']++;
      else if (norm === 'QUALIFIED') stages['Qualified']++;
      else if (norm === 'TEST RIDE INVITED') stages['Invited']++;
      else if (norm === 'TEST RIDE BOOKED') stages['Test Ride']++;
      else if (norm === 'TEST RIDE COMPLETED') stages['Completed']++;
      else if (norm === 'PURCHASE CONSIDERATION') stages['Consideration']++;
      else if (norm === 'PURCHASED') stages['Purchased']++;
      else if (norm === 'ADVOCATE') stages['Advocate']++;
    });

    return Object.entries(stages).map(([stage, count]) => ({
      stage,
      count,
    }));
  }, [leads]);

  // 6. Test Ride Conversion (Line over 8 weeks, demo)
  const weeklyTrendData = [
    { week: 'Wk 1', scheduled: 18, completed: 14, purchases: 4 },
    { week: 'Wk 2', scheduled: 24, completed: 19, purchases: 6 },
    { week: 'Wk 3', scheduled: 31, completed: 25, purchases: 9 },
    { week: 'Wk 4', scheduled: 29, completed: 23, purchases: 8 },
    { week: 'Wk 5', scheduled: 38, completed: 32, purchases: 12 },
    { week: 'Wk 6', scheduled: 45, completed: 39, purchases: 15 },
    { week: 'Wk 7', scheduled: 52, completed: 46, purchases: 19 },
    { week: 'Wk 8', scheduled: 64, completed: 58, purchases: 24 },
  ];

  return (
    <AdminLayout activeTab="analytics">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00E08A] font-semibold">
                Intelligence & Telemetry
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#9AA3AF]">Recharts Visualization Engine</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              Customer Conversion & Behavior Analytics
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9AA3AF] font-mono">
              Live State: {leads.length} Leads Analyzed
            </span>
          </div>
        </div>

        {/* 6 GRAPHS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. LEAD SCORE DISTRIBUTION (BAR) */}
          <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-[#00E08A]" />
                  <h3 className="font-heading text-base font-bold text-[#F5F7FA]">
                    Lead Score Distribution
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#9AA3AF]">0 to 100 Scale</span>
              </div>
              <p className="text-xs text-[#9AA3AF] mb-4">
                Distribution of consumer qualification tiers across currently registered leads.
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="range" stroke="#9AA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9AA3AF" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Leads" fill="#00E08A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. CONCERN DISTRIBUTION (DONUT) */}
          <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <PieIcon size={16} className="text-[#38BDF8]" />
                  <h3 className="font-heading text-base font-bold text-[#F5F7FA]">
                    Primary Hesitation Concerns
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#9AA3AF]">Donut Breakdown</span>
              </div>
              <p className="text-xs text-[#9AA3AF] mb-4">
                Core hesitation categories identified during the 7-question confidence quiz.
              </p>
            </div>

            <div className="w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={concernDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {concernDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#111418" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(val) => <span className="text-xs text-[#9AA3AF]">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. RIDER PROFILE DISTRIBUTION (BAR) */}
          <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Compass size={16} className="text-[#FBBF24]" />
                  <h3 className="font-heading text-base font-bold text-[#F5F7FA]">
                    Rider Profile Archetypes
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#9AA3AF]">Cluster Match</span>
              </div>
              <p className="text-xs text-[#9AA3AF] mb-4">
                Dominant commuter personas synthesized by the Ather matching model.
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riderProfileData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="profile"
                    stroke="#9AA3AF"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#9AA3AF" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Riders" fill="#FBBF24" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. CAMPAIGN SOURCE (HORIZONTAL BAR) */}
          <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#A855F7]" />
                  <h3 className="font-heading text-base font-bold text-[#F5F7FA]">
                    Acquisition Channel Attribution
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#9AA3AF]">Inbound Channels</span>
              </div>
              <p className="text-xs text-[#9AA3AF] mb-4">
                Lead origination sources driving confidence engine evaluations.
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={sourceHorizontalData}
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#9AA3AF" fontSize={11} tickLine={false} allowDecimals={false} />
                  <YAxis dataKey="source" type="category" stroke="#9AA3AF" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="leads" name="Leads" fill="#A855F7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. JOURNEY STAGE DISTRIBUTION (BAR) */}
          <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#38BDF8]" />
                  <h3 className="font-heading text-base font-bold text-[#F5F7FA]">
                    Journey Stage Distribution
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#9AA3AF]">Kanban Stages</span>
              </div>
              <p className="text-xs text-[#9AA3AF] mb-4">
                Lead distribution across the 9 defined CRM lifecycle progression columns.
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="stage"
                    stroke="#9AA3AF"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis stroke="#9AA3AF" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Leads" fill="#38BDF8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6. TEST RIDE CONVERSION (LINE OVER 8 WEEKS, DEMO) */}
          <div className="bg-[#111418] border border-white/[0.08] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#00E08A]" />
                  <h3 className="font-heading text-base font-bold text-[#F5F7FA]">
                    Test Ride & Delivery Conversion (8 Weeks)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#00E08A]">Demo Cohort</span>
              </div>
              <p className="text-xs text-[#9AA3AF] mb-4">
                Rolling weekly velocity comparing scheduled test rides vs completions and retail bookings.
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="#9AA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9AA3AF" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    formatter={(val) => <span className="text-xs text-[#9AA3AF] capitalize">{val}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="scheduled"
                    name="Scheduled"
                    stroke="#9AA3AF"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#9AA3AF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#38BDF8' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchases"
                    name="Purchases"
                    stroke="#00E08A"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#00E08A' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
