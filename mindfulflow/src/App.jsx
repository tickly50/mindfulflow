import { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Layout/Header';
import { ToastProvider } from './context/ToastContext';
import { variants } from './utils/animations';

// Lazy load heavy components for better performance
const CheckInView = lazy(() => import('./components/CheckIn/CheckInView'));
const JournalView = lazy(() => import('./components/Journal/JournalView'));
const StatisticsView = lazy(() => import('./components/Statistics/StatisticsView'));
const BreathingOverlay = lazy(() => import('./components/Breathing/BreathingOverlay'));
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

/**
 * Main App Content - separated to use Toast Context if needed in future
 */
function AppContent() {
  const [currentView, setCurrentView] = useState('checkin');
  const [showBreathing, setShowBreathing] = useState(false);


  // Reactive background update using shared hook - REMOVED
  
  // Initial setup: Persistence
  useEffect(() => {
    // Request persistent storage
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }
  }, []);

  // Callback for child components
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
    <div
      className="min-h-screen bg-[#0f172a]"
      style={{
        transform: 'translateZ(0)'
      }}
    >
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Header
          onBreathingClick={handleBreathingOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        {/* Page transitions — simultaneous crossfade, no gap */}
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {currentView === 'checkin' && (
              <motion.div
                key="checkin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <CheckInView onEntryAdded={handleEntryAdded} />
                </Suspense>
              </motion.div>
            )}
            
            {currentView === 'journal' && (
              <motion.div
                key="journal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <JournalView />
                </Suspense>
              </motion.div>
            )}

            {currentView === 'statistics' && (
              <motion.div
                key="statistics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <StatisticsView />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </ErrorBoundary>
      </div>

      {/* SOS Breathing Overlay with Suspense */}
      <Suspense fallback={null}>
        <BreathingOverlay
          isOpen={showBreathing}
          onClose={handleBreathingClose}
        />
      </Suspense>

      <InstallPrompt />
    </div>
  );
}

/**
 * Main App component - Premium Enhanced
 */
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

// Optimized loading fallback component with GPU acceleration
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
      style={{ transform: 'translateZ(0)' }}
    >
      <motion.div
        className="w-12 h-12 border-3 border-violet-400 border-t-transparent rounded-full mx-auto mb-3"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ 
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />
    </motion.div>
  </div>
);

export default App;


