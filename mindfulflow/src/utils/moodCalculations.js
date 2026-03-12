import { CONTEXT_TAGS } from './moodConstants';

/**
 * Normalize tags from an entry — handles backward compatibility with old `activities` field.
 * @param {Object} entry - Mood entry
 * @returns {string[]} Array of tag ids
 */
export const getTags = (entry) =>
  Array.isArray(entry.tags) && entry.tags.length > 0
    ? entry.tags
    : Array.isArray(entry.activities)
      ? entry.activities
      : [];

/**
 * Calculate mood statistics from an array of entries
 * @param {Array} entries - Array of mood entries
 * @returns {Object} Statistics object
 */
export const calculateMoodStats = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      total: 0,
      average: 0,
      mostFrequent: null,
      trend: "neutral",
      stability: 0,
    };
  }

  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const mostFrequent = Object.entries(moodCounts).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0];

  const sum = entries.reduce((acc, entry) => acc + entry.mood, 0);
  const average = sum / entries.length;

  // Calculate trend (last 7 days vs previous 7 days) - optimized
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - sevenDaysMs;
  const fourteenDaysAgo = now - (2 * sevenDaysMs);

  let recentSum = 0, recentCount = 0;
  let previousSum = 0, previousCount = 0;

  entries.forEach((e) => {
    const timestamp = new Date(e.timestamp).getTime();
    if (timestamp >= sevenDaysAgo) {
      recentSum += e.mood;
      recentCount++;
    } else if (timestamp >= fourteenDaysAgo) {
      previousSum += e.mood;
      previousCount++;
    }
  });

  const recentAvg = recentCount > 0 ? recentSum / recentCount : average;
  const previousAvg = previousCount > 0 ? previousSum / previousCount : average;

  const trend =
    recentAvg > previousAvg + 0.3
      ? "improving"
      : recentAvg < previousAvg - 0.3
        ? "declining"
        : "stable";

  // Calculate stability (standard deviation)
  const variance =
    entries.reduce((acc, entry) => {
      return acc + Math.pow(entry.mood - average, 2);
    }, 0) / entries.length;
  const stdDev = Math.sqrt(variance);
  const stability = Math.max(0, Math.min(100, 100 - stdDev * 20));

  return {
    total: entries.length,
    average: Math.round(average * 10) / 10,
    mostFrequent: parseInt(mostFrequent),
    trend,
    stability: Math.round(stability),
  };
};

/**
 * Calculate current streak (consecutive days with entries)
 * STRICT VERSION: Streak must include Today or Yesterday to be active.
 * Optimized to avoid creating Date objects in loop.
 * @param {Array} entries - Array of mood entries
 * @returns {number} Number of consecutive days
 */
export const calculateStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;

  const uniqueDates = new Set(
    entries.map((e) => new Date(e.timestamp).toDateString()),
  );

  const today = new Date();
  const todayStr = today.toDateString();
  
  today.setDate(today.getDate() - 1);
  const yesterdayStr = today.toDateString();

  const hasToday = uniqueDates.has(todayStr);
  const hasYesterday = uniqueDates.has(yesterdayStr);

  if (!hasToday && !hasYesterday) {
    return 0;
  }

  // Start from today or yesterday
  const startDate = new Date();
  if (!hasToday) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let streak = 0;
  // Prevent infinite loop with a reasonable cap (e.g., 3650 days = 10 years)
  for (let i = 0; i < 3650; i++) {
    if (uniqueDates.has(startDate.toDateString())) {
      streak++;
      startDate.setDate(startDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculate longest streak ever (consecutive days with entries)
 * @param {Array} entries - Array of mood entries
 * @returns {number} Max number of consecutive days
 */
export const calculateLongestStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;

  const uniqueDates = Array.from(new Set(
    entries.map((e) => new Date(e.timestamp).toDateString())
  )).map(dateStr => new Date(dateStr).getTime()).sort((a, b) => a - b);

  if (uniqueDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = uniqueDates[i - 1];
    const currentDate = uniqueDates[i];
    
    // Check if dates are consecutive (difference is exactly 24 hours +/- small margin for DST/leap seconds logic if needed, 
    // but here we are comparing timestamps of midnight/date-strings so roughly 86400000ms)
    // Actually, since we converted toDateString() back to timestamp, they are exactly 24h apart if consecutive.
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (currentDate - prevDate === oneDay) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }
  
  return Math.max(maxStreak, currentStreak);
};



/**
 * Calculate average mood for each activity/tag context
 * @param {Array} entries - Array of mood entries
 * @returns {Array} Sorted array of { id, label, icon, average, count }
 */
export const calculateActivityStats = (entries) => {
  const activityMap = {};

  // Always pre-fill with core tags so the widget never looks empty
  CONTEXT_TAGS.forEach(tag => {
    activityMap[tag.id] = {
      id: tag.id,
      label: tag.label,
      icon: tag.icon,
      totalMood: 0,
      count: 0
    };
  });

  if (entries && entries.length > 0) {
    entries.forEach((entry) => {
      const sourceIds = getTags(entry);

      sourceIds.forEach((activityId) => {
        if (!activityMap[activityId]) {
          // Find label/icon from CONTEXT_TAGS
          const tagInfo = CONTEXT_TAGS.find((t) => t.id === activityId) || {
            label: activityId,
            icon: "Activity",
          };
          activityMap[activityId] = {
            id: activityId,
            label: tagInfo.label,
            icon: tagInfo.icon,
            totalMood: 0,
            count: 0,
          };
        }
        activityMap[activityId].totalMood += entry.mood;
        activityMap[activityId].count += 1;
      });
    });
  }

  const stats = Object.values(activityMap).map((item) => ({
    ...item,
    average: item.count > 0 ? Math.round((item.totalMood / item.count) * 10) / 10 : 0,
  }));

  // Sort by count (most frequent) then average (highest mood)
  return stats.sort((a, b) => b.count - a.count || b.average - a.average);
};

/**
 * Calculate average sleep hours from entries
 * @param {Array} entries - Array of mood entries
 * @returns {number} Average sleep in hours
 */
export const calculateAverageSleep = (entries) => {
  if (!entries || entries.length === 0) return 0;
  
  let totalSleep = 0;
  let count = 0;

  entries.forEach((entry) => {
    if (typeof entry.sleep === 'number') {
      totalSleep += entry.sleep;
      count += 1;
    }
  });

  if (count === 0) return 0;
  return Math.round((totalSleep / count) * 10) / 10;
};

/**
 * Calculate simple insights based on entry correlations (Tags vs Mood)
 */
export const calculateInsights = (entries) => {
  if (!entries || entries.length < 5) return []; // Require at least 5 entries for meaningful correlations

  const insights = [];
  const tagMoods = {};

  const avgMood = calculateMoodStats(entries).average;

  entries.forEach(e => {
    const tags = getTags(e);
    tags.forEach(tag => {
      if (!tagMoods[tag]) tagMoods[tag] = { sum: 0, count: 0 };
      tagMoods[tag].sum += e.mood;
      tagMoods[tag].count += 1;
    });
  });

  Object.keys(tagMoods).forEach(tag => {
    const stat = tagMoods[tag];
    if (stat.count >= 3) {
      const tagAvg = stat.sum / stat.count;
      const tagInfo = CONTEXT_TAGS.find(t => t.id === tag) || { label: tag };
      
      const diff = tagAvg - avgMood;
      if (diff >= 0.6) {
        insights.push({
          id: `insight-pos-${tag}`,
          type: 'positive',
          title: 'Zlepšovač nálady',
          text: `Dny, kdy používáte štítek "${tagInfo.label}", máte průměrně o dost lepší náladu. Pokračujte v tom!`,
          icon: tagInfo.icon
        });
      } else if (diff <= -0.6) {
        insights.push({
          id: `insight-neg-${tag}`,
          type: 'negative',
          title: 'Možný stresor',
          text: `Podle dat bývá "${tagInfo.label}" spojen s náročnějšími dny. Zkuste si najít čas na chvíli klidu.`,
          icon: tagInfo.icon
        });
      }
    }
  });

  // Sort logically or return top ones
  return insights.slice(0, 3);
};

/**
 * Generate data specifically for the Monthly Report (Wrapped style)
 */
export const generateMonthlyReportData = (entries, targetMonth, targetYear) => {
  const monthData = entries.filter(e => {
    const d = new Date(e.timestamp);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });

  if (monthData.length === 0) return null;

  const stats = calculateMoodStats(monthData);
  const activities = calculateActivityStats(monthData);
  
  // Find the highest mood day
  let bestDayObj = monthData[0];
  monthData.forEach(d => {
    if (d.mood > bestDayObj.mood) bestDayObj = d;
  });

  return {
    totalEntries: monthData.length,
    averageMood: stats.average,
    topTags: activities.slice(0, 3),
    bestDayDate: new Date(bestDayObj.timestamp).toLocaleDateString('cs-CZ'),
    bestDayMood: bestDayObj.mood
  };
};
