import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import Header from './components/Layout/Header';
import BottomNavigation from './components/Layout/BottomNavigation';
import { ToastProvider } from './context/ToastContext';
import { pageVariants } from './utils/animations';

import CheckInView from './components/CheckIn/CheckInView';
import JournalView from './components/Journal/JournalView';
import StatisticsView from './components/Statistics/StatisticsView';
import BreathingOverlay from './components/Breathing/BreathingOverlay';
import InstallPrompt from './components/Layout/InstallPrompt';

import React from 'react';

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
  const [currentView, setCurrentView] = useState('checkin');
  const [showBreathing, setShowBreathing] = useState(false);

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }
  }, []);

  const handleEntryAdded = useCallback(() => {}, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    // Smooth scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBreathingOpen = useCallback(() => {
    setShowBreathing(true);
  }, []);

  const handleBreathingClose = useCallback(() => {
    setShowBreathing(false);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#0f172a] flex flex-col pt-safe">
      {/* 
        Adjusted padding for mobile vs desktop:
        Mobile: px-2 py-4, Desktop: px-4 py-8
        Added pb-24 (mobile) to avoid overlapping content with BottomNavigation
      */}
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 flex-1 pb-24 sm:pb-8 flex flex-col">
        <Header
          onBreathingClick={handleBreathingOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        {/* Page transitions — slide + crossfade */}
        <ErrorBoundary>
          <main className="flex-1 w-full relative">
            <AnimatePresence mode="wait" initial={true}>
              {currentView === 'checkin' && (
                <motion.div
                  key="checkin"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: 'opacity, transform' }}
                >
                  <CheckInView onEntryAdded={handleEntryAdded} />
                </motion.div>
              )}

              {currentView === 'journal' && (
                <motion.div
                  key="journal"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: 'opacity, transform' }}
                >
                  <JournalView />
                </motion.div>
              )}

              {currentView === 'statistics' && (
                <motion.div
                  key="statistics"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: 'opacity, transform' }}
                >
                  <StatisticsView />
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

      <BreathingOverlay
        isOpen={showBreathing}
        onClose={handleBreathingClose}
      />

      <InstallPrompt />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
      <VercelAnalytics />
    </ToastProvider>
  );
}

export default App;
