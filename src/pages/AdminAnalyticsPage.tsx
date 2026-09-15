/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';

export const AdminAnalyticsPage: React.FC = () => {
  const { leads } = useAppState();

  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const concernCounts = leads.reduce((acc, lead) => {
    acc[lead.primaryConcern] = (acc[lead.primaryConcern] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full">
      <MotionSection>
        <MotionItem>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Link to="/admin" className="text-xs text-[#9AA3AF] hover:text-white transition-colors">
              Admin
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs font-mono text-white/50">analytics</span>
            <span className="text-white/20">•</span>
            <Badge variant="DEMO DATA" />
          </div>
        </MotionItem>

        <MotionItem>
          <SectionHeading
            eyebrow="Marketing Performance"
            title="Channel Attribution & Funnel Analytics"
            subtext="Comprehensive breakdown of incoming acquisition sources, primary consumer hesitation drivers, and journey velocity."
          />
        </MotionItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Source Attribution */}
          <MotionItem>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg font-semibold text-[#F5F7FA]">
                  Lead Source Distribution
                </h3>
                <span className="text-xs text-[#9AA3AF] font-mono">12 Demo Leads</span>
              </div>
              <div className="space-y-4">
                {Object.entries(sourceCounts).map(([source, count]) => {
                  const percentage = Math.round((count / leads.length) * 100);
                  return (
                    <div key={source} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#F5F7FA] font-medium">{source}</span>
                        <span className="text-[#9AA3AF] font-mono">{count} leads ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-[#00E08A] rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </MotionItem>

          {/* Primary Hesitation Drivers */}
          <MotionItem>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg font-semibold text-[#F5F7FA]">
                  Primary Hesitation Focus
                </h3>
                <span className="text-xs text-[#9AA3AF] font-mono">Psychographic Drivers</span>
              </div>
              <div className="space-y-4">
                {Object.entries(concernCounts).map(([concern, count]) => {
                  const percentage = Math.round((count / leads.length) * 100);
                  return (
                    <div key={concern} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#F5F7FA] font-medium">{concern} Anxiety</span>
                        <span className="text-[#9AA3AF] font-mono">{count} leads ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </MotionItem>
        </div>
      </MotionSection>
    </div>
  );
};
