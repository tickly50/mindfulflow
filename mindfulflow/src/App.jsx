import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Layout/Header';
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
  }, []);

  const handleBreathingOpen = useCallback(() => {
    setShowBreathing(true);
  }, []);

  const handleBreathingClose = useCallback(() => {
    setShowBreathing(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Header
          onBreathingClick={handleBreathingOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        {/* Page transitions — slide + crossfade */}
        <ErrorBoundary>
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
        </ErrorBoundary>
      </div>

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
      <Analytics />
    </ToastProvider>
  );
}

export default App;
