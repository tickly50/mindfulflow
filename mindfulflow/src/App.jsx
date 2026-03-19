import React, { useState, useCallback, useEffect, Suspense, lazy } from "react";
import { AnimatePresence, motion, MotionConfig, LazyMotion, domAnimation } from "framer-motion";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Header from "./components/Layout/Header";
import BottomNavigation from "./components/Layout/BottomNavigation";
import { ToastProvider } from "./context/ToastContext";
import { SettingsProvider } from "./context/SettingsContext";
import { pageVariants } from "./utils/animations";
import BreathingOverlay from "./components/Breathing/BreathingOverlay";
import BackgroundAurora from "./components/Layout/BackgroundAurora";

import CheckInView from "./components/CheckIn/CheckInView";
const JournalView = lazy(() => import("./components/Journal/JournalView"));
const StatisticsView = lazy(() => import("./components/Statistics/StatisticsView"));
const AchievementsView = lazy(() => import("./components/Achievements/AchievementsView"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex items-center justify-center p-8 text-white text-center">
          <div className="max-w-md">
            <div className="text-5xl mb-4">😵</div>
            <h2 className="text-2xl font-bold mb-3">Něco se pokazilo</h2>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              Došlo k neočekávané chybě. Zkus stránku znovu načíst.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors"
            >
              Znovu načíst
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [currentView, setCurrentView] = useState("checkin");
  const [showBreathing, setShowBreathing] = useState(false);
  const [activeMood, setActiveMood] = useState(null);
  const [backgroundMounted, setBackgroundMounted] = useState(false);

  useEffect(() => {
    setBackgroundMounted(true);

    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }

    document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    if (view !== 'checkin') {
      setActiveMood(null);
    }
    // Delay scroll until after exit animation (200ms) to avoid jank
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 220);
  }, []);

  const handleBreathingOpen = useCallback(() => {
    setShowBreathing(true);
  }, []);

  const handleBreathingClose = useCallback(() => {
    setShowBreathing(false);
  }, []);

  // Warm up lazy chunks in background to keep future tab switches instant.
  useEffect(() => {
    // Warm-up can cause Lighthouse "unused JavaScript" on cold load.
    // So we only do it during development; prod stays lean.
    if (!import.meta.env.DEV) return;

    const prefersSaveData = navigator?.connection?.saveData;
    if (prefersSaveData) return;

    const preload = () => {
      // Check-In is intentionally not lazy-loaded to keep LCP fast.
      import("./components/Journal/JournalView");
      import("./components/Statistics/StatisticsView");
      import("./components/Achievements/AchievementsView");
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(preload, { timeout: 2000 });
    } else {
      setTimeout(preload, 800);
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] transition-colors duration-500 flex flex-col pt-safe relative">
      
      {/* Dynamic Aurora Background - syncs with checkin mood or sets general themes per view */}
      {backgroundMounted && (
        <BackgroundAurora currentMood={
          currentView === 'checkin' ? activeMood : 
          currentView === 'journal' ? 4 : 
          currentView === 'statistics' ? 5 : 
          currentView === 'achievements' ? 3 : null
        } />
      )}

      {/* 
        Adjusted padding for mobile vs desktop:
        Mobile: px-2 py-4, Desktop: px-4 py-8
        Added pb-24 (mobile) to avoid overlapping content with BottomNavigation
      */}
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-10 py-3 md:py-6 flex-1 pb-28 sm:pb-10 flex flex-col relative z-10">
        <Header
          onBreathingClick={handleBreathingOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        {/* Page transitions — slide + crossfade */}
        <ErrorBoundary>
          <main className="flex-1 w-full relative">
            <AnimatePresence mode="wait" initial={true}>
              {currentView === "checkin" && (
                <motion.div
                  key="checkin"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: "opacity, transform" }}
                >
                  <CheckInView onMoodChange={setActiveMood} />
                </motion.div>
              )}

              {currentView === "journal" && (
                <motion.div
                  key="journal"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: "opacity, transform" }}
                >
                  <Suspense fallback={null}>
                    <JournalView />
                  </Suspense>
                </motion.div>
              )}

              {currentView === "statistics" && (
                <motion.div
                  key="statistics"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: "opacity, transform" }}
                >
                  <Suspense fallback={null}>
                    <StatisticsView />
                  </Suspense>
                </motion.div>
              )}

              {currentView === "achievements" && (
                <motion.div
                  key="achievements"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: "opacity, transform" }}
                >
                  <Suspense fallback={null}>
                    <AchievementsView />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </ErrorBoundary>
      </div>

      <BottomNavigation
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {showBreathing && <BreathingOverlay isOpen={showBreathing} onClose={handleBreathingClose} />}
    </div>
  );
}

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <SettingsProvider>
          <ToastProvider>
            <AppContent />
            {!import.meta.env.DEV && <VercelAnalytics />}
          </ToastProvider>
        </SettingsProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
