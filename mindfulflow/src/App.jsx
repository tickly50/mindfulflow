import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Header from "./components/Layout/Header";
import BottomNavigation from "./components/Layout/BottomNavigation";
import { ToastProvider } from "./context/ToastContext";
import { SettingsProvider } from "./context/SettingsContext";
import { pageVariants } from "./utils/animations";
import { db } from "./utils/db";

import CheckInView from "./components/CheckIn/CheckInView";

import JournalView from "./components/Journal/JournalView";
import StatisticsView from "./components/Statistics/StatisticsView";
import AchievementsView from "./components/Achievements/AchievementsView";

import BreathingOverlay from "./components/Breathing/BreathingOverlay";
import BackgroundAurora from "./components/Layout/BackgroundAurora";

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <pre className="bg-black/20 p-4 rounded text-left overflow-auto text-xs">
            {this.state.error && this.state.error.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/10 rounded hover:bg-white/20"
          >
            Reload
          </button>
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
    // Defer rendering the heavy background to optimize LCP
    setBackgroundMounted(true);
    
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }

    // Enforce default theme
    document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleEntryAdded = useCallback(() => {}, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    if (view !== 'checkin') {
      setActiveMood(null); // Reset mood glow when leaving check-in
    }
    // Smooth scroll to top when changing views
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBreathingOpen = useCallback(() => {
    setShowBreathing(true);
  }, []);

  const handleBreathingClose = useCallback(() => {
    setShowBreathing(false);
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
                  <CheckInView 
                    onEntryAdded={handleEntryAdded} 
                    onMoodChange={setActiveMood} 
                  />
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
                  <JournalView />
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
                  <StatisticsView />
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
                  <AchievementsView />
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
    <SettingsProvider>
      <ToastProvider>
        <AppContent />
        <VercelAnalytics />
      </ToastProvider>
    </SettingsProvider>
  );
}

export default App;
