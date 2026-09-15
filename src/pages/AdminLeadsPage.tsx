/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronRight, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';
import { City, PrimaryConcern } from '../types';

export const AdminLeadsPage: React.FC = () => {
  const { leads } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'activity'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.riderProfile.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === 'All' || lead.city === selectedCity;
        const matchesConcern =
          selectedConcern === 'All' || lead.primaryConcern === selectedConcern;
        return matchesSearch && matchesCity && matchesConcern;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return sortOrder === 'desc'
            ? b.leadScore - a.leadScore
            : a.leadScore - b.leadScore;
        }
        if (sortBy === 'name') {
          return sortOrder === 'desc'
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        }
        return sortOrder === 'desc'
          ? new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
          : new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
      });
  }, [leads, searchTerm, selectedCity, selectedConcern, sortBy, sortOrder]);

  const toggleSort = (type: 'score' | 'name' | 'activity') => {
    if (sortBy === type) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="w-full">
      <MotionSection>
        <MotionItem>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Link to="/admin" className="text-xs text-[#9AA3AF] hover:text-white transition-colors">
              Admin
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs font-mono text-white/50">leads</span>
            <span className="text-white/20">•</span>
            <Badge variant="DEMO DATA" />
            <span className="text-xs text-[#9AA3AF] tabular-nums">
              ({filteredLeads.length} of 12 Records)
            </span>
          </div>
        </MotionItem>

        <MotionItem>
          <SectionHeading
            eyebrow="Lead Scoring & Attribution"
            title="Customer Pipeline CRM"
            subtext="All 12 seeded fictional leads loaded into memory state, demonstrating customer hesitation analysis and conversion progression."
          />
        </MotionItem>

        {/* Filter Toolbar */}
        <MotionItem className="mt-8">
          <Card className="py-4 px-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA3AF]" />
                <input
                  type="text"
                  placeholder="Search by customer name, profile, campaign..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-full text-sm text-[#F5F7FA] placeholder-[#9AA3AF] focus:outline-none focus:border-[#00E08A]/50 transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-[#9AA3AF]">
                  <Filter size={14} />
                  <span>City:</span>
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
                </div>

                <div className="flex items-center gap-2 text-xs text-[#9AA3AF]">
                  <span>Concern:</span>
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
            </div>
          </Card>
        </MotionItem>

        {/* Leads Table */}
        <MotionItem>
          <div className="overflow-x-auto rounded-[20px] border border-white/[0.06] bg-[#16191E]">
            <table className="w-full text-left text-sm text-[#9AA3AF]">
              <thead className="bg-white/[0.02] text-xs uppercase text-[#F5F7FA] border-b border-white/[0.06] select-none">
                <tr>
                  <th
                    className="py-4 px-6 cursor-pointer hover:text-[#00E08A]"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Customer</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="py-4 px-6">City</th>
                  <th className="py-4 px-6">Primary Concern</th>
                  <th
                    className="py-4 px-6 text-center cursor-pointer hover:text-[#00E08A]"
                    onClick={() => toggleSort('score')}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Lead Score</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center">Match %</th>
                  <th className="py-4 px-6">Stage</th>
                  <th className="py-4 px-6">Source Channel</th>
                  <th className="py-4 px-6">Test Ride</th>
                  <th className="py-4 px-6 text-right">Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-[#F5F7FA]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-semibold text-[#00E08A]">
                          {lead.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span>{lead.name}</span>
                          <span className="block text-xs text-[#9AA3AF] font-normal truncate max-w-[180px]">
                            {lead.riderProfile}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#F5F7FA]">{lead.city}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] text-[#F5F7FA]">
                        {lead.primaryConcern}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-heading font-semibold text-base tabular-nums ${
                        lead.leadScore >= 75 ? 'text-[#00E08A]' : lead.leadScore >= 45 ? 'text-amber-400' : 'text-[#9AA3AF]'
                      }`}>
                        {lead.leadScore}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-xs tabular-nums text-[#F5F7FA]">
                      {lead.matchPercentage}%
                    </td>
                    <td className="py-4 px-6 text-xs text-[#F5F7FA]">
                      {lead.journeyStage}
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <span className="text-[#F5F7FA] block">{lead.source}</span>
                      <span className="text-[11px] text-[#9AA3AF] truncate block max-w-[140px]">
                        {lead.campaignName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        lead.testRideStatus === 'Scheduled'
                          ? 'bg-[#00E08A]/10 text-[#00E08A] border border-[#00E08A]/20'
                          : lead.testRideStatus === 'Completed'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-white/[0.04] text-[#9AA3AF]'
                      }`}>
                        {lead.testRideStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Badge variant="DEMO DATA" label={lead.tag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionItem>
      </MotionSection>
    </div>
  );
};
