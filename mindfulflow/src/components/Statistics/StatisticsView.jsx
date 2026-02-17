import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodEntries } from '../../utils/queries';
import { calculateMoodStats, calculateStreak, calculateLongestStreak } from '../../utils/moodCalculations';
import { variants } from '../../utils/animations';

// Components
import EmptyState from './EmptyState';
import StatsOverview from './StatsOverview';
import MoodTrendChart from './MoodTrendChart';
import MoodDistribution from './MoodDistribution';


/**
 * Statistics view – central dashboard with all mood insights.
 */
export default function StatisticsView() {
  const entries = useMoodEntries(false); // Get all entries, oldest first
  const [timeRange, setTimeRange] = useState('30'); // '7', '30', 'all'

  // Filter entries based on time range
  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    
    if (timeRange === 'all') return entries;

    const now = new Date();
    const days = parseInt(timeRange);
    const cutoff = new Date(now.setDate(now.getDate() - days));

    return entries.filter(e => new Date(e.timestamp) >= cutoff);
  }, [entries, timeRange]);

  // Calculate stats based on filtered data
  const stats = useMemo(() => {
    return calculateMoodStats(filteredEntries);
  }, [filteredEntries]);

  // Streak is always calculated from ALL data for accuracy
  const streak = useMemo(() => {
    return calculateStreak(entries);
  }, [entries]);

  const longestStreak = useMemo(() => {
    return calculateLongestStreak(entries);
  }, [entries]);

  if (!entries) return null; // Loading...

  // Show EmptyState if no data AT ALL (regardless of filter)
  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="stats-dashboard"
        variants={variants.container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-24"
      >
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Přehled Zdraví</h2>
            <p className="text-white/60">Komplexní analýza tvé duševní pohody</p>
          </div>

          <div className="glass p-1 rounded-xl flex gap-1">
            {['7', '30', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  timeRange === range
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {range === 'all' ? 'Vše' : `${range} dní`}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Key Metrics Cards */}
        <StatsOverview stats={stats} streak={streak} longestStreak={longestStreak} />

        {stats.total > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 2. Main Trend Chart - Spans 2 cols */}
            <div className="lg:col-span-2">
              <MoodTrendChart data={filteredEntries} />
            </div>

            {/* 3. Distribution Chart */}
            <MoodDistribution data={filteredEntries} />

          </div>
        ) : (
          <div className="glass p-12 rounded-[2rem] text-center border-none">
            <p className="text-white/50">V tomto období nejsou žádná data.</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
