/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Workflow,
  Menu,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAppState } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: 'overview' | 'leads' | 'analytics' | 'automations';
}

const NAV_ITEMS = [
  {
    path: '/admin',
    label: 'Overview',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    path: '/admin/leads',
    label: 'CRM Pipeline',
    icon: Users,
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    path: '/admin/automations',
    label: 'Automations',
    icon: Workflow,
  },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { leads, testRides, resetToDefault } = useAppState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    resetToDefault();
    setTimeout(() => {
      setResetting(false);
    }, 600);
  };

  const isLinkActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex bg-[#0B0D10] text-[#F5F7FA] relative">
      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-20 left-0 z-40 h-[calc(100vh-80px)] shrink-0 bg-[#0E1116] border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#00E08A]/10 border border-[#00E08A]/30 flex items-center justify-center text-[#00E08A] font-heading font-bold text-sm shrink-0">
              Æ
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-heading font-bold text-xs tracking-wider uppercase text-[#F5F7FA] block truncate">
                  Ather Command
                </span>
                <span className="text-[10px] font-mono text-[#00E08A] block">
                  v2.6 Intelligence
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#9AA3AF] hover:text-white hover:bg-white/[0.05]"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation items */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isLinkActive(item.path, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  active
                    ? 'bg-[#00E08A]/10 text-[#00E08A] border border-[#00E08A]/30 shadow-[0_0_15px_rgba(0,224,138,0.12)]'
                    : 'text-[#9AA3AF] hover:text-[#F5F7FA] hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={item.label}
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-transform ${
                    active ? 'text-[#00E08A]' : 'group-hover:text-white'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          {/* Live system indicator */}
          {!collapsed ? (
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] space-y-1">
              <div className="flex items-center justify-between text-[#9AA3AF]">
                <span>Pipeline Status</span>
                <span className="inline-flex items-center gap-1.5 text-[#00E08A] font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E08A] animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-[#9AA3AF]">
                <span>{leads.length} Active Leads</span>
                <span>{testRides.length} Bookings</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="Active Pipeline">
              <span className="w-2 h-2 rounded-full bg-[#00E08A] animate-pulse" />
            </div>
          )}

          {/* Return to Customer Experience */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#9AA3AF] hover:text-white hover:bg-white/[0.04] transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Return to Customer Portal"
          >
            <ExternalLink size={14} className="shrink-0" />
            {!collapsed && <span>Customer View</span>}
          </Link>

          {/* Reset Demo State Button */}
          <button
            onClick={handleReset}
            disabled={resetting}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#9AA3AF] hover:text-rose-400 hover:bg-rose-500/10 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Reset to initial seed leads"
          >
            <RefreshCw
              size={14}
              className={`shrink-0 ${resetting ? 'animate-spin text-[#00E08A]' : ''}`}
            />
            {!collapsed && <span>Reset State</span>}
          </button>

          {/* Collapse desktop toggle */}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden lg:flex w-full items-center justify-center p-1.5 rounded-lg text-[#9AA3AF] hover:text-white hover:bg-white/[0.05] transition-colors text-xs"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Banner */}
        <header className="sticky top-20 z-30 bg-[#0B0D10]/80 backdrop-blur-md border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#9AA3AF] hover:text-white hover:bg-white/[0.05]"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-sm sm:text-base lg:text-lg font-bold tracking-tight text-[#F5F7FA] truncate">
                  ATHER CONFIDENCE COMMAND CENTER
                </h1>
                <Badge variant="DEMO DATA" />
              </div>
              <span className="text-[11px] font-mono text-[#9AA3AF] hidden sm:block truncate">
                Customer Acquisition, Hesitation Remediation & Conversion Analytics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#9AA3AF]">
              <Sparkles size={13} className="text-[#00E08A]" />
              Simulation Engine
            </span>
          </div>
        </header>

        {/* Render Page Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
