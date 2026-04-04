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
import RevealOnScroll from '../../components/common/RevealOnScroll';
import { Tag } from 'lucide-react';

const ICON_MAP = { ...CONTEXT_TAG_ICONS, Tag };

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 gap-5 text-center max-w-app mx-auto w-full min-w-0">
      <div className="relative w-20 h-20 rounded-[1.35rem] rotate-3 bg-[var(--accent-glow)] border border-theme-border flex items-center justify-center text-4xl shrink-0 shadow-glow-accent">
        <span className="-rotate-3">📊</span>
      </div>
      <h3 className="text-fluid-2xl font-bold text-theme-text tracking-tight">Zatím žádná data</h3>
      <p className="text-theme-muted max-w-md text-fluid-sm leading-relaxed">
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
      <h3 className="text-lg font-bold text-theme-text mb-1 tracking-tight">Vliv aktivit</h3>
      <p className="text-theme-muted text-sm mb-4">Průměrná nálada dle aktivity</p>
      <div className="flex flex-col gap-2">
        {top.map(({ id, label, icon, count, average }) => {
          const IconComp = ICON_MAP[icon] || Tag;
          const moodLevel = count > 0 ? Math.round(average) : 3;
          const moodColor = MOOD_COLORS[moodLevel]?.primary || '#7c3aed';
          return (
            <div
              key={id}
              className="flex items-center justify-between gap-2 p-3 rounded-xl bg-theme-elevated hover:bg-[var(--accent-glow)] transition-colors duration-theme min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center">
                  <IconComp size={15} className="text-theme-muted" />
                </div>
                <div className="min-w-0">
                  <div className="text-theme-text text-fluid-sm font-medium truncate">{label}</div>
                  <div className="text-theme-muted text-xs">
                    {count > 0 ? `${count} ${count === 1 ? 'záznam' : count < 5 ? 'záznamy' : 'záznamů'}` : 'žádný záznam'}
                  </div>
                </div>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                style={{
                  background: count > 0 ? MOOD_COLORS[moodLevel]?.gradient : 'var(--bg-elevated)',
                  boxShadow: count > 0 ? `0 4px 15px -3px ${moodColor}40` : 'none',
                  color: count > 0 ? '#fff' : 'var(--text-muted)',
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
    return (
      <div className="max-w-app mx-auto pb-12 md:pb-16 pt-6 md:pt-8 min-h-[50vh] w-full min-w-0" />
    );
  }
  if (totalEntries === 0) return <EmptyState />;

  return (
    <div className="max-w-app mx-auto w-full min-w-0 pb-12 md:pb-20">

      {/* ── Header ── */}
      <motion.div
        variants={variants.slideUp}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-1"
      >
        <div className="min-w-0">
          <h2 className="text-fluid-2xl sm:text-fluid-3xl font-semibold text-theme-text tracking-tight">Statistiky</h2>
          <p className="text-theme-muted text-fluid-sm mt-1 leading-relaxed">Analýza tvé duševní pohody</p>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-5 self-stretch md:self-auto w-full md:w-auto justify-start md:justify-end border-b border-theme-border pb-2">
          {['7', '30', 'all'].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`relative pb-1 min-h-[44px] text-sm font-medium outline-none transition-colors duration-200 -mb-px border-b-2 ${
                timeRange === range
                  ? 'text-theme-text border-[var(--accent)]'
                  : 'text-theme-muted border-transparent hover:text-theme-text'
              }`}
            >
              {range === 'all' ? 'Vše' : `${range} dní`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <RevealOnScroll delay={0.04} y={24}>
        <KpiCards stats={stats} streak={streak} longestStreak={longestStreak} avgSleep={avgSleep} />
      </RevealOnScroll>

      {/* ── Tab navigation ── */}
      <div className="flex gap-5 sm:gap-6 mb-6 overflow-x-auto no-scrollbar snap-x snap-mandatory border-b border-theme-border pb-2 [-webkit-overflow-scrolling:touch]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-shrink-0 min-w-[44%] sm:min-w-max snap-start pb-2 min-h-[44px] text-sm font-medium outline-none sm:whitespace-nowrap transition-colors duration-200 -mb-px border-b-2 ${
              activeTab === tab.id
                ? 'text-theme-text border-[var(--accent)]'
                : 'text-theme-muted border-transparent hover:text-theme-text'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
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
                <p className="text-theme-muted leading-relaxed">Přidej alespoň 2 záznamy pro zobrazení grafu.</p>
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
                <p className="text-theme-muted leading-relaxed">
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
