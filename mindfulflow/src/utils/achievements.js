import { db } from './db';
import { calculateLongestStreak } from './moodCalculations';

export const ACHIEVEMENTS = [
  {
    id: 'early-bird',
    title: 'Ranní ptáče',
    description: 'Záznam vytvořený před 8:00 ráno.',
    icon: 'Sun',
    gradient: 'from-amber-300 to-orange-500',
    shadow: 'shadow-glow-orange',
    condition: (entries) => entries.some(e => new Date(e.timestamp).getHours() < 8)
  },
  {
    id: 'writer',
    title: 'Spisovatel',
    description: 'Deníkový záznam delší než 50 slov.',
    icon: 'BookOpen',
    gradient: 'from-violet-400 to-purple-600',
    shadow: 'shadow-glow-violet',
    condition: (entries) => entries.some(e => e.diary && e.diary.split(/\s+/).length >= 50)
  },
  {
    id: 'consistent',
    title: 'Konzistentní',
    description: 'Zaznamenávání nálady 7 dní v řadě.',
    icon: 'Flame',
    gradient: 'from-rose-400 to-red-600',
    shadow: 'shadow-glow-violet', // fallback
    condition: (entries) => calculateLongestStreak(entries) >= 7
  },
  {
    id: 'zen-master',
    title: 'Zen Master',
    description: 'Časté využívání štítku Zdraví nebo Spánek (alespoň 5x).',
    icon: 'Wind',
    gradient: 'from-emerald-400 to-teal-600',
    shadow: 'shadow-glow-emerald',
    condition: (entries) => {
       const calmEntries = entries.filter(e => {
         const tags = Array.isArray(e.tags) ? e.tags : (Array.isArray(e.activities) ? e.activities : []);
         return tags.includes('sleep') || tags.includes('health');
       });
       return calmEntries.length >= 5;
    }
  },
];

/**
 * Checks if new achievements are unlocked based on entries, and saves them.
 * @returns Array of newly unlocked achievement ids
 */
export const checkAndUnlockAchievements = async (entries) => {
  if (!entries || entries.length === 0) return [];
  
  const unlockedNow = [];
  try {
    const existing = await db.achievements.toArray();
    const existingIds = new Set(existing.map(a => a.id));

    for (const achievement of ACHIEVEMENTS) {
      if (!existingIds.has(achievement.id)) {
        if (achievement.condition(entries)) {
          unlockedNow.push({
            id: achievement.id,
            unlockedAt: new Date().toISOString()
          });
        }
      }
    }

    if (unlockedNow.length > 0) {
      await db.achievements.bulkAdd(unlockedNow);
    }
  } catch (err) {
    console.error("Failed to check achievements", err);
  }

  return unlockedNow.map(a => a.id);
};
