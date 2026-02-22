import { useState, useMemo, memo, useEffect } from 'react';
import { useMoodEntries } from '../../utils/queries';
import { calculateMoodStats, calculateStreak, calculateLongestStreak, calculateAverageSleep } from '../../utils/moodCalculations';
import { motion } from 'framer-motion';

// Components
import EmptyState from './EmptyState';
import StatsOverview from './StatsOverview';
import MoodTrendChart from './MoodTrendChart';
import MoodDistribution from './MoodDistribution';
import ActivityStats from './ActivityStats';

import { variants } from '../../utils/animations';

/**
 * Statistics view – central dashboard with all mood insights.
 */
const StatisticsView = memo(function StatisticsView() {
  const entries = useMoodEntries(false);
  const [timeRange, setTimeRange] = useState('30');

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
      </motion.div>

      {/* Metric Cards */}
      <StatsOverview stats={stats} streak={streak} longestStreak={longestStreak} avgSleep={avgSleep} />

      {stats.total > 0 ? (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={variants.staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Main Trend Chart -  2 cols */}
          <motion.div variants={variants.item} className="lg:col-span-2">
            <MoodTrendChart data={filteredEntries} />
          </motion.div>

          {/* Distribution */}
          <motion.div variants={variants.item}>
            <MoodDistribution data={filteredEntries} />
          </motion.div>

          {/* Activity Stats */}
          <motion.div variants={variants.item} className="lg:col-span-full">
            <ActivityStats data={filteredEntries} />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="glass p-12 rounded-[2rem] text-center border-none"
        >
          <p className="text-white/50">V tomto období nejsou žádná data.</p>
        </motion.div>
      )}
    </div>
  );
});

export default StatisticsView;
