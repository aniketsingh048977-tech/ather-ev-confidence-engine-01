/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { SectionHeading } from '../ui/SectionHeading';
import { MotionSection, MotionItem } from '../motion/MotionSection';

interface PlaceholderPageProps {
  route: string;
  eyebrow: string;
  title: string;
  description: string;
  nextRoute?: {
    path: string;
    label: string;
  };
  secondaryAction?: {
    path: string;
    label: string;
  };
  phase2PreviewPoints?: string[];
  requiresProductData?: boolean;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  route,
  eyebrow,
  title,
  description,
  nextRoute,
  secondaryAction,
  phase2PreviewPoints = [],
  requiresProductData = true,
}) => {
  return (
    <div className="w-full">
      <MotionSection alternate={false}>
        <MotionItem>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#9AA3AF] hover:text-[#00E08A] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Overview
            </Link>
            <span className="text-white/20">•</span>
            <span className="text-xs font-mono text-white/50">{route}</span>
            <span className="text-white/20">•</span>
            <Badge variant="ACADEMIC PROTOTYPE" />
            {requiresProductData && <Badge variant="UNVERIFIED" label="DATA PENDING" />}
          </div>
        </MotionItem>

        <MotionItem>
          <SectionHeading eyebrow={eyebrow} title={title} subtext={description} />
        </MotionItem>

        <MotionItem className="mt-10">
          <Card className="max-w-3xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-sm text-[#F5F7FA] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#00E08A]" />
                  <span>Phase 1 Architecture Active</span>
                </div>
                <span className="text-xs text-[#9AA3AF] font-mono">
                  State: In-Memory Client Store
                </span>
              </div>

              {requiresProductData && (
                <div className="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
                  <ShieldAlert size={18} className="shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-amber-300 mb-0.5">
                      Academic Integrity Directive:
                    </span>
                    Never invent Ather prices, range, specs, charging times, offers or locations.
                    Product data status:{' '}
                    <span className="font-mono text-amber-100 font-bold">
                      [VERIFIED ATHER PRODUCT DATA REQUIRED]
                    </span>
                    .
                  </div>
                </div>
              )}

              {phase2PreviewPoints.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9AA3AF]">
                    Planned Interaction Scope (Phase 2 Roadmap):
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#F5F7FA]">
                    {phase2PreviewPoints.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#00E08A] shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                {nextRoute && (
                  <PrimaryButton to={nextRoute.path}>
                    {nextRoute.label}
                  </PrimaryButton>
                )}
                {secondaryAction && (
                  <SecondaryButton to={secondaryAction.path}>
                    {secondaryAction.label}
                  </SecondaryButton>
                )}
              </div>
            </div>
          </Card>
        </MotionItem>
      </MotionSection>
    </div>
  );
};
