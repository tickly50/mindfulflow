import { useState, useMemo, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodEntriesCount, useMoodEntriesRange, useMoodEntryTimestamps } from '../../utils/queries';
import { useStatisticsData } from './useStatisticsData';
import { MOOD_COLORS, CONTEXT_TAG_ICONS } from '../../utils/moodConstants';
import { variants } from '../../utils/animations';

import KpiCards from './KpiCards';
import MoodTrendChart from './MoodTrendChart';
import MoodDistributionBar from './MoodDistributionBar';
import HeatmapCalendar from './HeatmapCalendar';
import InsightsList from './InsightsList';
import GlassCard from '../../components/common/GlassCard';
import { Tag } from 'lucide-react';

const ICON_MAP = { ...CONTEXT_TAG_ICONS, Tag };

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl">
        📊
      </div>
      <h3 className="text-xl font-bold text-white font-display">Zatím žádná data</h3>
      <p className="text-white/50 max-w-xs text-sm leading-relaxed">
        Přidej svůj první záznam nálady a tady uvidíš detailní statistiky tvé pohody.
      </p>
    </div>
  );
}

// ─── Tab navigation ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Přehled' },
  { id: 'trend',    label: 'Trend' },
  { id: 'calendar', label: 'Kalendář' },
  { id: 'insights', label: 'Postřehy' },
];

// ─── Activity list (overview tab) ────────────────────────────────────────────
function ActivityList({ activityStats }) {
  if (!activityStats || activityStats.length === 0) return null;
  const top = activityStats.slice(0, 6);

  return (
    <GlassCard className="p-5 sm:p-6">
      <h3 className="text-lg font-bold text-white mb-1">Vliv aktivit</h3>
      <p className="text-white/50 text-sm mb-4">Průměrná nálada dle aktivity</p>
      <div className="flex flex-col gap-2">
        {top.map(({ id, label, icon, count, average }) => {
          const IconComp = ICON_MAP[icon] || Tag;
          const moodLevel = count > 0 ? Math.round(average) : 3;
          const moodColor = MOOD_COLORS[moodLevel]?.primary || '#8b5cf6';
          return (
            <div
              key={id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <IconComp size={15} className="text-white/70" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{label}</div>
                  <div className="text-white/40 text-xs">
                    {count > 0 ? `${count} ${count === 1 ? 'záznam' : count < 5 ? 'záznamy' : 'záznamů'}` : 'žádný záznam'}
                  </div>
                </div>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                style={{
                  background: count > 0 ? MOOD_COLORS[moodLevel]?.gradient : 'rgba(255,255,255,0.05)',
                  boxShadow: count > 0 ? `0 4px 15px -3px ${moodColor}40` : 'none',
                  color: count > 0 ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              >
                {count > 0 ? average : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─── Main StatisticsView ──────────────────────────────────────────────────────
const StatisticsView = memo(function StatisticsView() {
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  const [rangeEndMs, setRangeEndMs] = useState(() => Date.now());

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setRangeEndMs(Date.now());
    });
    return () => cancelAnimationFrame(id);
  }, [timeRange]);

  const rangeQuery = useMemo(() => {
    if (timeRange === 'all') {
      return { reverse: false };
    }

    return {
      reverse: false,
      startDate: new Date(rangeEndMs - parseInt(timeRange, 10) * 86_400_000),
      endDate: new Date(rangeEndMs),
    };
  }, [timeRange, rangeEndMs]);

  const entries = useMoodEntriesRange(rangeQuery);
  const totalEntries = useMoodEntriesCount();
  const historicalTimestamps = useMoodEntryTimestamps({ reverse: false });
  const historyEntries = useMemo(
    () => historicalTimestamps?.map((timestamp) => ({ timestamp })) || [],
    [historicalTimestamps]
  );

  const { stats, streak, longestStreak, avgSleep, chartData, distributionData, activityStats, insights, heatmapData } =
    useStatisticsData(historyEntries, entries || []);

  if (!entries || totalEntries === undefined || historicalTimestamps === undefined) {
    return <div className="max-w-4xl mx-auto px-4 pb-24 pt-8 min-h-screen" />;
  }
  if (totalEntries === 0) return <EmptyState />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">

      {/* ── Header ── */}
      <motion.div
        variants={variants.slideUp}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-1"
      >
        <div>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight">Statistiky</h2>
          <p className="text-white/50 text-sm">Analýza tvé duševní pohody</p>
        </div>
        <div className="relative bg-white/5 p-1 rounded-xl flex gap-1 self-start sm:self-auto">
          {['7', '30', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`relative px-4 py-1.5 rounded-lg text-sm font-medium outline-none z-10 transition-colors duration-200 ${
                timeRange === range
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {timeRange === range && (
                <motion.div
                  layoutId="time-range-indicator"
                  className="absolute inset-0 bg-white/15 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.5 }}
                  style={{ willChange: 'transform' }}
                />
              )}
              {range === 'all' ? 'Vše' : `${range} dní`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <KpiCards stats={stats} streak={streak} longestStreak={longestStreak} avgSleep={avgSleep} />

      {/* ── Tab navigation ── */}
      <div className="relative flex gap-1 bg-white/5 p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium outline-none whitespace-nowrap z-10 transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="stats-tab-indicator"
                className="absolute inset-0 bg-white/15 rounded-lg -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.5 }}
                style={{ willChange: 'transform' }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            variants={variants.tabContent}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-5"
            style={{ willChange: 'opacity, transform' }}
          >
            <MoodDistributionBar distributionData={distributionData} />
            <ActivityList activityStats={activityStats} />
          </motion.div>
        )}

        {activeTab === 'trend' && (
          <motion.div
            key="trend"
            variants={variants.tabContent}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-5"
            style={{ willChange: 'opacity, transform' }}
          >
            {chartData.length > 1 ? (
              <MoodTrendChart chartData={chartData} />
            ) : (
              <GlassCard className="p-12 text-center">
                <p className="text-white/50">Přidej alespoň 2 záznamy pro zobrazení grafu.</p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            variants={variants.tabContent}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ willChange: 'opacity, transform' }}
          >
            <HeatmapCalendar heatmapData={heatmapData} />
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            variants={variants.tabContent}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-5"
            style={{ willChange: 'opacity, transform' }}
          >
            {insights.length > 0 ? (
              <InsightsList insights={insights} />
            ) : (
              <GlassCard className="p-12 text-center">
                <p className="text-white/50">
                  Potřebuji alespoň 5 záznamů a 3 záznamy se stejnou aktivitou pro zobrazení postřehů.
                </p>
              </GlassCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default StatisticsView;
