import { useMemo } from 'react';
import {
  calculateMoodStats,
  calculateStreak,
  calculateLongestStreak,
  calculateAverageSleep,
  calculateActivityStats,
  calculateInsights,
} from '../../utils/moodCalculations';
import { MOOD_LABELS, MOOD_COLORS } from '../../utils/moodConstants';

/**
 * Single hook that computes all statistics data in one useMemo pass.
 * Prevents cascading re-computations across child components.
 */
export function useStatisticsData(entries, filteredEntries) {
  const streak = useMemo(() => calculateStreak(entries), [entries]);
  const longestStreak = useMemo(() => calculateLongestStreak(entries), [entries]);

  return useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return {
        stats: { total: 0, average: 0, mostFrequent: null, trend: 'neutral', stability: 0 },
        streak,
        longestStreak,
        avgSleep: 0,
        chartData: [],
        distributionData: [],
        activityStats: [],
        insights: [],
        heatmapData: new Map(),
      };
    }

    const stats = calculateMoodStats(filteredEntries);
    const avgSleep = calculateAverageSleep(filteredEntries);
    const activityStats = calculateActivityStats(filteredEntries);
    const insights = calculateInsights(filteredEntries, stats.average);

    // Chart data: one point per entry, sorted oldest → newest
    const chartData = [...filteredEntries]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((entry) => {
        const d = new Date(entry.timestamp);
        return {
          mood: entry.mood,
          note: entry.note || '',
          date: d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' }),
          fullDate: d.toLocaleString('cs-CZ', {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
          }),
          moodLabel: MOOD_LABELS[entry.mood],
          color: MOOD_COLORS[entry.mood]?.primary || '#2dd4bf',
          ts: d.getTime(),
        };
      });

    // Distribution: count per mood level
    const moodCounts = {};
    filteredEntries.forEach((e) => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const distributionData = [5, 4, 3, 2, 1]
      .filter((m) => moodCounts[m])
      .map((m) => ({
        mood: m,
        label: MOOD_LABELS[m],
        count: moodCounts[m],
        pct: Math.round((moodCounts[m] / filteredEntries.length) * 100),
        color: MOOD_COLORS[m]?.primary || '#2dd4bf',
      }));

    // Heatmap: map dateStr → { average, count, moods[] }
    const heatmapData = new Map();
    filteredEntries.forEach((e) => {
      const d = new Date(e.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!heatmapData.has(key)) {
        heatmapData.set(key, { sum: 0, count: 0, moods: [] });
      }
      const cell = heatmapData.get(key);
      cell.sum += e.mood;
      cell.count += 1;
      cell.moods.push(e.mood);
    });
    heatmapData.forEach((cell) => {
      cell.average = Math.round((cell.sum / cell.count) * 10) / 10;
    });

    return {
      stats,
      streak,
      longestStreak,
      avgSleep,
      chartData,
      distributionData,
      activityStats,
      insights,
      heatmapData,
    };
  }, [filteredEntries, streak, longestStreak]);
}
