/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Workflow, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';
import { useAppState } from '../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const { leads } = useAppState();

  const adminSubNav = [
    {
      path: '/admin/leads',
      label: 'Leads CRM',
      desc: '12 seeded demo leads with score sorting, filters, and journey stages.',
      icon: <Users size={20} className="text-[#00E08A]" />,
      count: `${leads.length} Leads`,
    },
    {
      path: '/admin/analytics',
      label: 'Performance Analytics',
      desc: 'Funnel drop-off, source channel attribution, and hesitation distribution.',
      icon: <BarChart3 size={20} className="text-[#00E08A]" />,
      count: '5 Channels',
    },
    {
      path: '/admin/automations',
      label: 'Nurture Automations',
      desc: 'Automated CRM trigger rules based on lead scores (15 to 95) and concerns.',
      icon: <Workflow size={20} className="text-[#00E08A]" />,
      count: '4 Triggers',
    },
  ];

  return (
    <div className="w-full">
      <MotionSection>
        <MotionItem>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-mono text-white/50">/admin</span>
            <span className="text-white/20">•</span>
            <Badge variant="ACADEMIC PROTOTYPE" />
            <Badge variant="DEMO DATA" />
          </div>
        </MotionItem>

        <MotionItem>
          <SectionHeading
            eyebrow="Marketing Operations"
            title="Executive Admin Dashboard"
            subtext="Management control plane monitoring customer journey velocity, scoring distributions, and digital marketing conversion rates."
          />
        </MotionItem>

        {/* Sub-navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {adminSubNav.map((item) => (
            <MotionItem key={item.path}>
              <Link to={item.path} className="block group h-full">
                <Card className="h-full flex flex-col justify-between group-hover:border-[#00E08A]/40">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                        {item.icon}
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#9AA3AF]">
                        {item.count}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-[#F5F7FA] group-hover:text-[#00E08A] transition-colors mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-[#9AA3AF] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#00E08A] font-medium">
                    <span>Access Module</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </MotionItem>
          ))}
        </div>
      </MotionSection>
    </div>
  );
};
