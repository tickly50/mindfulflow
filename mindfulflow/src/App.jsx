import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  LazyMotion,
  domAnimation,
  useReducedMotion,
} from 'framer-motion';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import Header from './components/Layout/Header';
import BottomNavigation from './components/Layout/BottomNavigation';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './features/settings/SettingsContext';
import { pageVariants, reducedMotionVariants } from './utils/animations';
import BreathingOverlay from './components/Breathing/BreathingOverlay';
import BackgroundAurora from './components/Layout/BackgroundAurora';
import FloatingParticles from './components/Layout/FloatingParticles';
import useIsLowEndDevice from './hooks/useIsLowEndDevice';
import { isStandaloneDisplay } from './utils/standalone';
import InstallLanding from './components/InstallLanding/InstallLanding';
import ErrorBoundary from './components/common/ErrorBoundary';

const CheckInView = lazy(() => import('./features/checkin/CheckInView'));
const JournalView = lazy(() => import('./features/journal/JournalView'));
const StatisticsView = lazy(() => import('./features/statistics/StatisticsView'));
const AchievementsView = lazy(() => import('./components/Achievements/AchievementsView'));

function ViewFallback() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[40vh] text-white/50 text-sm font-medium">
      Načítám…
    </div>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState('checkin');
  const [showBreathing, setShowBreathing] = useState(false);
  const [activeMood, setActiveMood] = useState(null);
  const [backgroundMounted] = useState(true);
  const prefersReduced = useReducedMotion();
  const activePageVariants = prefersReduced ? reducedMotionVariants.page : pageVariants;

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }

    document.documentElement.removeAttribute('data-theme');
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
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] transition-colors duration-500 flex flex-col pt-safe relative font-sans antialiased">
      {backgroundMounted && (
        <>
          <BackgroundAurora
            currentMood={
              currentView === 'checkin'
                ? activeMood
                : currentView === 'journal'
                  ? 4
                  : currentView === 'statistics'
                    ? 5
                    : currentView === 'achievements'
                      ? 3
                      : null
            }
          />
          <FloatingParticles />
        </>
      )}

      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-10 py-3 md:py-6 flex-1 pb-28 sm:pb-10 flex flex-col relative z-10">
        <Header
          onBreathingClick={handleBreathingOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        <ErrorBoundary>
          <main className="flex-1 w-full relative">
            <Suspense fallback={<ViewFallback />}>
              <AnimatePresence mode="sync" initial={false}>
                {currentView === 'checkin' && (
                  <motion.div
                    key="checkin"
                    variants={activePageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ willChange: 'opacity' }}
                  >
                    <CheckInView onMoodChange={setActiveMood} />
                  </motion.div>
                )}

                {currentView === 'journal' && (
                  <motion.div
                    key="journal"
                    variants={activePageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ willChange: 'opacity' }}
                  >
                    <JournalView />
                  </motion.div>
                )}

                {currentView === 'statistics' && (
                  <motion.div
                    key="statistics"
                    variants={activePageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ willChange: 'opacity' }}
                  >
                    <StatisticsView />
                  </motion.div>
                )}

                {currentView === 'achievements' && (
                  <motion.div
                    key="achievements"
                    variants={activePageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ willChange: 'opacity' }}
                  >
                    <AchievementsView />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </main>
        </ErrorBoundary>
      </div>

      <BottomNavigation currentView={currentView} onViewChange={handleViewChange} />

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
