/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/motion/PageTransition';

// Pages
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { ProfilePage } from './pages/ProfilePage';
import { SavingsPage } from './pages/SavingsPage';
import { ChargingPage } from './pages/ChargingPage';
import { ConciergePage } from './pages/ConciergePage';
import { TestRidePage } from './pages/TestRidePage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { PostRidePage } from './pages/PostRidePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLeadsPage } from './pages/AdminLeadsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminAutomationsPage } from './pages/AdminAutomationsPage';

// Scroll to top on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#00E08A] selection:text-[#0B0D10]">
          <Header />
          <main className="flex-1 flex flex-col">
            <PageTransition>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/charging" element={<ChargingPage />} />
                <Route path="/concierge" element={<ConciergePage />} />
                <Route path="/test-ride" element={<TestRidePage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/post-ride" element={<PostRidePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/leads" element={<AdminLeadsPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/admin/automations" element={<AdminAutomationsPage />} />
                
                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
