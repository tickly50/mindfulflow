// Mood calculation utilities
// Handles mood-based gradient generation and mood label mapping

/**
 * Mood labels in Czech (1-5 scale)
 */
export const MOOD_LABELS = {
  1: "Špatně",
  2: "Ve stresu",
  3: "Unaveně",
  4: "Klidně",
  5: "Skvěle",
};

/**
 * Mood adjectives in Czech (1-5 scale) - Feminine form for "Nálada"
 */
export const MOOD_ADJECTIVES = {
  1: "Špatná",
  2: "Stresová",
  3: "Unavená",
  4: "Klidná",
  5: "Skvělá",
};

/**
 * Mood colors - Premium Palette
 * Each mood has a specific gradient configuration for a deep, rich look
 */
export const MOOD_COLORS = {
  1: {
    // Angry/Bad -> Deep Crimson/Charcoal
    primary: "#ef4444",
    gradient: "linear-gradient(135deg, #18181b 0%, #290505 50%, #450a0a 100%)",
    text: "#fca5a5",
  },
  2: {
    // Stressed -> Deep Amber/Brown
    primary: "#f59e0b",
    gradient: "linear-gradient(135deg, #18181b 0%, #271a00 50%, #451a03 100%)",
    text: "#fcd34d",
  },
  3: {
    // Tired -> Deep Indigo/Slate
    // 3 is middle. Let's make it "Calm Slate".
    primary: "#94a3b8",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    text: "#e2e8f0",
  },
  4: {
    // Calm -> Deep Emerald/Teal
    primary: "#10b981",
    gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)",
    text: "#6ee7b7",
  },
  5: {
    // Great -> Deep Violet/Fuchsia
    primary: "#8b5cf6",
    gradient: "linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #5b21b6 100%)",
    text: "#c4b5fd",
  },
};

/**
 * Context tags available for mood entries
 */
export const CONTEXT_TAGS = [
  { id: "work", label: "Práce", icon: "Briefcase" },
  { id: "sleep", label: "Spánek", icon: "Moon" },
  { id: "family", label: "Rodina", icon: "Users" },
  { id: "health", label: "Zdraví", icon: "Heart" },
  { id: "finance", label: "Finance", icon: "DollarSign" },
  { id: "social", label: "Sociální život", icon: "MessageCircle" },
];

/**
 * Generate premium gradient based on mood
 * @param {number} avgMood - Average mood (1-5)
 * @returns {string} CSS gradient string
 */
export const getGradientForMood = (avgMood) => {
  // Round to nearest integer for color selection
  const moodLevel = Math.round(Math.max(1, Math.min(5, avgMood)));

  // If undefined (e.g. loading), return a neutral dark gradient
  if (!MOOD_COLORS[moodLevel])
    return "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)";

  return MOOD_COLORS[moodLevel].gradient;
};

/**
 * Interpolate between two colors based on a factor
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {string} Interpolated hex color
 */
export const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return rgbToHex(r, g, b);
};

/**
 * Convert hex color to RGB object
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Convert RGB values to hex color
 */
const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

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
      // Prefer new `tags` field, but keep backward compatibility with old `activities`
      const sourceIds = Array.isArray(entry.tags) && entry.tags.length > 0
        ? entry.tags
        : Array.isArray(entry.activities)
          ? entry.activities
          : [];

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
 * Calculate average mood by hour of day (0-23)
 * @param {Array} entries
 * @returns {Array} Array of { hour, average, count } sorted by hour
 */
export const calculateHourlyStats = (entries) => {
  if (!entries || entries.length === 0) return [];

  const hourMap = {};

  entries.forEach((entry) => {
    const date = new Date(entry.timestamp);
    const hour = date.getHours();

    if (!hourMap[hour]) {
      hourMap[hour] = { totalMood: 0, count: 0 };
    }
    hourMap[hour].totalMood += entry.mood;
    hourMap[hour].count += 1;
  });

  const stats = [];
  for (let i = 0; i < 24; i++) {
    if (hourMap[i]) {
      stats.push({
        hour: i,
        average: Math.round((hourMap[i].totalMood / hourMap[i].count) * 10) / 10,
        count: hourMap[i].count,
      });
    } else {
      stats.push({ hour: i, average: 0, count: 0 });
    }
  }

  return stats;
};

/**
 * Calculate average mood by day of week (0-6, Sunday-Saturday)
 * @param {Array} entries
 * @returns {Array} Array of { dayIndex, dayName, average, count }
 */
export const calculateDayOfWeekStats = (entries) => {
  if (!entries || entries.length === 0) return [];

  const dayMap = {};
  const dayNames = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

  entries.forEach((entry) => {
    const date = new Date(entry.timestamp);
    const day = date.getDay();

    if (!dayMap[day]) {
      dayMap[day] = { totalMood: 0, count: 0 };
    }
    dayMap[day].totalMood += entry.mood;
    dayMap[day].count += 1;
  });

  const stats = [];
  // Start from Monday (1) to Sunday (0) for European week
  const order = [1, 2, 3, 4, 5, 6, 0];
  
  order.forEach(dayIndex => {
     if (dayMap[dayIndex]) {
      stats.push({
        dayIndex,
        dayName: dayNames[dayIndex],
        average: Math.round((dayMap[dayIndex].totalMood / dayMap[dayIndex].count) * 10) / 10,
        count: dayMap[dayIndex].count,
      });
    } else {
      stats.push({ dayIndex, dayName: dayNames[dayIndex], average: 0, count: 0 });
    }
  });

  return stats;
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
    const tags = Array.isArray(e.tags) ? e.tags : (Array.isArray(e.activities) ? e.activities : []);
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
