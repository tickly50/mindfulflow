import React, { useState, useCallback, useEffect } from 'react';
import { MotionConfig, LazyMotion, domAnimation, AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import Header from './components/Layout/Header';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './features/settings/SettingsContext';
import BreathingOverlay from './components/Breathing/BreathingOverlay';
import useIsLowEndDevice from './hooks/useIsLowEndDevice';
import { isStandaloneDisplay } from './utils/standalone';
import InstallLanding from './components/InstallLanding/InstallLanding';
import ErrorBoundary from './components/common/ErrorBoundary';
import CheckInView from './features/checkin/CheckInView';
import JournalView from './features/journal/JournalView';
import StatisticsView from './features/statistics/StatisticsView';
import AchievementsView from './components/Achievements/AchievementsView';
import { pageVariants, reducedMotionVariants } from './utils/animations';

function AppContent() {
  const prefersReduced = useReducedMotion();
  const viewMotion = prefersReduced ? reducedMotionVariants.page : pageVariants;
  const [currentView, setCurrentView] = useState('checkin');
  const [showBreathing, setShowBreathing] = useState(false);
  const [activeMood, setActiveMood] = useState(null);

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }
  }, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    if (view !== 'checkin') {
      setActiveMood(null);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBreathingOpen = useCallback(() => {
    setShowBreathing(true);
  }, []);

  const handleBreathingClose = useCallback(() => {
    setShowBreathing(false);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-theme-bg text-theme-text flex flex-col pt-safe font-sans antialiased selection:bg-[var(--accent-glow)]/50 transition-[background-color,color] duration-theme ease-out">
      <div className="w-full max-w-app mx-auto px-[var(--container-pad-x)] py-[var(--section-pad-y)] md:py-8 flex-1 pb-8 md:pb-12 flex flex-col min-w-0 gap-8">
        <Header
          onBreathingClick={handleBreathingOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        <ErrorBoundary>
          <main className="flex-1 w-full relative overflow-x-hidden">
            <AnimatePresence mode="wait">
              {currentView === 'checkin' && (
                <motion.div
                  key="checkin"
                  variants={viewMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full min-w-0"
                >
                  <CheckInView onMoodChange={setActiveMood} />
                </motion.div>
              )}
              {currentView === 'journal' && (
                <motion.div
                  key="journal"
                  variants={viewMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full min-w-0"
                >
                  <JournalView />
                </motion.div>
              )}
              {currentView === 'statistics' && (
                <motion.div
                  key="statistics"
                  variants={viewMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full min-w-0"
                >
                  <StatisticsView />
                </motion.div>
              )}
              {currentView === 'achievements' && (
                <motion.div
                  key="achievements"
                  variants={viewMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full min-w-0"
                >
                  <AchievementsView />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </ErrorBoundary>
      </div>

      {showBreathing && <BreathingOverlay isOpen={showBreathing} onClose={handleBreathingClose} />}
    </div>
  );
}

function App() {
  const isLowEnd = useIsLowEndDevice();
  const allowFullApp = isStandaloneDisplay();

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={isLowEnd ? 'always' : 'user'}>
        <SettingsProvider>
          <ToastProvider>
            {allowFullApp ? <AppContent /> : <InstallLanding />}
            {!import.meta.env.DEV && <VercelAnalytics />}
          </ToastProvider>
        </SettingsProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
