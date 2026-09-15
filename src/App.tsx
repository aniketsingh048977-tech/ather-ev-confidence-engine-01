/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/motion/PageTransition';
import { SmoothScroll } from './components/motion/SmoothScroll';
import { ScrollProgress } from './components/motion/ScrollProgress';
import { CustomCursor } from './components/motion/CustomCursor';
import { GrainOverlay } from './components/motion/living-backgrounds/GrainOverlay';

import { PresentationProvider } from './context/PresentationContext';
import { PresentationControlBar } from './components/presentation/PresentationControlBar';
import { PresentationLauncherButton } from './components/presentation/PresentationLauncherButton';

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
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLeadsPage } from './pages/AdminLeadsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminAutomationsPage } from './pages/AdminAutomationsPage';

const MainContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#00E08A] selection:text-[#0B0D10] relative">
      {/* 2px green progress bar at the very top of the page */}
      <ScrollProgress />

      {/* Fixed film grain noise over the whole site at 3% opacity */}
      <GrainOverlay />

      {/* Desktop-only custom cursor */}
      <CustomCursor />

      <Header />

      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <div key={location.pathname} className="w-full flex-1 flex flex-col">
            <PageTransition>
              <Routes location={location}>
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

                {/* Custom 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageTransition>
          </div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Presentation Mode Components */}
      <PresentationLauncherButton />
      <PresentationControlBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <PresentationProvider>
          <SmoothScroll>
            <MainContent />
          </SmoothScroll>
        </PresentationProvider>
      </BrowserRouter>
    </AppProvider>
  );
}

