/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, BellRing, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MotionSection, MotionItem } from '../components/motion/MotionSection';

export const AdminAutomationsPage: React.FC = () => {
  const automations = [
    {
      id: 'auto-1',
      title: 'High-Intent Hot Lead Alert (Score ≥ 85)',
      channel: 'WhatsApp & Ather Space Concierge',
      trigger: 'Rider completes quiz with Score ≥ 85 and selects Home Charging = Yes',
      action: 'Direct personalized VIP test-ride invitation dispatch within 10 minutes.',
      status: 'Active',
      icon: <Zap size={18} className="text-[#00E08A]" />,
    },
    {
      id: 'auto-2',
      title: 'Range Anxiety Nurture Sequence (Primary = Range)',
      channel: 'Email Series (3-part)',
      trigger: 'Lead identifies Range as primary concern & commute < 35km',
      action: 'Sends real-world commute breakdown and Ather Grid charging points map.',
      status: 'Active',
      icon: <Mail size={18} className="text-blue-400" />,
    },
    {
      id: 'auto-3',
      title: 'Apartment Parking Charging Guide (Primary = Charging)',
      channel: 'PDF Download & WhatsApp',
      trigger: 'User marks shared apartment parking without existing 5A socket',
      action: 'Dispatches RWA / Society EV charging approval guide & standard Ather installation specs.',
      status: 'Active',
      icon: <MessageSquare size={18} className="text-amber-400" />,
    },
    {
      id: 'auto-4',
      title: 'Post-Ride Feedback & Financing Offer (Stage = Completed)',
      channel: 'SMS & Web Push',
      trigger: 'Test Ride marked Completed in CRM',
      action: 'Triggers 30-minute follow-up rating link and custom lease-vs-buy calculator.',
      status: 'Active',
      icon: <BellRing size={18} className="text-purple-400" />,
    },
  ];

  return (
    <div className="w-full">
      <MotionSection>
        <MotionItem>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Link to="/admin" className="text-xs text-[#9AA3AF] hover:text-white transition-colors">
              Admin
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs font-mono text-white/50">automations</span>
            <span className="text-white/20">•</span>
            <Badge variant="DEMO DATA" />
          </div>
        </MotionItem>

        <MotionItem>
          <SectionHeading
            eyebrow="Marketing Orchestration"
            title="CRM Nurture & Conversion Triggers"
            subtext="Event-driven automation workflows addressing consumer hesitation points and accelerating transition to test rides."
          />
        </MotionItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {automations.map((rule) => (
            <MotionItem key={rule.id}>
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      {rule.icon}
                    </div>
                    <Badge variant="VERIFIED" label={rule.status} />
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-[#F5F7FA] mb-2">
                    {rule.title}
                  </h3>

                  <div className="space-y-3 mt-4 text-xs">
                    <div>
                      <span className="text-[#9AA3AF] uppercase font-semibold tracking-wider block mb-1">
                        Trigger Condition:
                      </span>
                      <p className="text-[#F5F7FA] bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.05]">
                        {rule.trigger}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#9AA3AF] uppercase font-semibold tracking-wider block mb-1">
                        Automated Execution:
                      </span>
                      <p className="text-[#9AA3AF] bg-white/[0.01] p-2.5 rounded-lg border border-white/[0.05]">
                        {rule.action}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#9AA3AF]">
                  <span>Channel: <strong className="text-[#F5F7FA]">{rule.channel}</strong></span>
                  <span className="text-[#00E08A] font-mono">Workflow 0{rule.id.replace('auto-', '')}</span>
                </div>
              </Card>
            </MotionItem>
          ))}
        </div>
      </MotionSection>
    </div>
  );
};
