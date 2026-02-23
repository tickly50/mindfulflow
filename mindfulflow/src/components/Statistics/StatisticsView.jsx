import { useState, useMemo, memo } from 'react';
import { useMoodEntries } from '../../utils/queries';
import { calculateMoodStats, calculateStreak, calculateLongestStreak, calculateAverageSleep } from '../../utils/moodCalculations';
import { motion } from 'framer-motion';

import EmptyState from './EmptyState';
import StatsOverview from './StatsOverview';
import MoodTrendChart from './MoodTrendChart';
import MoodDistribution from './MoodDistribution';
import ActivityStats from './ActivityStats';
import InsightsCard from './InsightsCard';
import MonthlyReportView from './MonthlyReportView';
import MoodCalendar from './MoodCalendar';

import { variants } from '../../utils/animations';

/**
 * Statistics view – central dashboard with all mood insights.
 */
const StatisticsView = memo(function StatisticsView() {
  const entries = useMoodEntries(false);
  const [timeRange, setTimeRange] = useState('30');
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    if (timeRange === 'all') return entries;

    const now = new Date();
    const days = parseInt(timeRange);
    const cutoff = new Date(now.setDate(now.getDate() - days));
    return entries.filter((e) => new Date(e.timestamp) >= cutoff);
  }, [entries, timeRange]);

  const stats = useMemo(() => calculateMoodStats(filteredEntries), [filteredEntries]);
  const streak = useMemo(() => calculateStreak(entries), [entries]);
  const longestStreak = useMemo(() => calculateLongestStreak(entries), [entries]);
  const avgSleep = useMemo(() => calculateAverageSleep(filteredEntries), [filteredEntries]);

  const isEndOfMonth = useMemo(() => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return today.getDate() >= lastDayOfMonth - 2; // Show in the last 3 days (e.g., 29..31 for a 31-day month)
  }, []);


  if (!entries) return null;
  if (entries.length === 0) return <EmptyState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      {/* Header & Controls */}
      <motion.div
        variants={variants.slideUp}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Přehled Zdraví</h2>
          <p className="text-white/60">Komplexní analýza tvé duševní pohody</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          {isEndOfMonth && (
            <button 
              onClick={() => setShowMonthlyReport(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 font-medium hover:from-indigo-500/30 hover:to-purple-500/30 transition-all border border-indigo-500/30 flex items-center gap-2"
            >
              <span className="text-lg">✨</span> Měsíční report
            </button>
          )}

          {/* Time range pills */}
          <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1">
          {['7', '30', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none border-none ring-0 hover:scale-105 active:scale-95 transform-gpu ${
                timeRange === range
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {range === 'all' ? 'Vše' : `${range} dní`}
            </button>
          ))}
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <StatsOverview stats={stats} streak={streak} longestStreak={longestStreak} avgSleep={avgSleep} />

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={variants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Left Column: Calendar & Insights (Always visible) */}
        <motion.div variants={variants.item} className="flex flex-col gap-6 lg:col-span-1 relative z-20 transform-gpu" style={{ willChange: 'opacity, transform' }}>
          <MoodCalendar entries={entries} />
          <InsightsCard entries={filteredEntries} />
        </motion.div>

        {/* Right Column: Charts */}
        <motion.div variants={variants.item} className="flex flex-col gap-6 lg:col-span-2 transform-gpu" style={{ willChange: 'opacity, transform' }}>
          {stats.total > 0 ? (
            <>
              <MoodTrendChart data={filteredEntries} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MoodDistribution data={filteredEntries} />
                <ActivityStats data={filteredEntries} />
              </div>
            </>
          ) : (
            <div className="glass p-12 rounded-[2rem] text-center border-none h-full flex flex-col justify-center items-center">
              <p className="text-white/50">Zatím tu nejsou žádná data pro grafy.</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      <MonthlyReportView 
        isOpen={showMonthlyReport} 
        onClose={() => setShowMonthlyReport(false)} 
        entries={entries} 
      />
    </div>
  );
});

export default StatisticsView;
