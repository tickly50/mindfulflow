import { db } from './db';
import { devError } from './devLog';
import { calculateLongestStreak, getTags } from './moodCalculations';

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
    id: 'night-owl',
    title: 'Noční sova',
    description: 'Záznam vytvořený po 22:00.',
    icon: 'Moon',
    gradient: 'from-indigo-400 to-purple-600',
    shadow: 'shadow-glow-violet',
    condition: (entries) => entries.some(e => new Date(e.timestamp).getHours() >= 22)
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
    condition: (_entries, longestStreak) => longestStreak >= 7
  },
  {
    id: 'marathon',
    title: 'Maratonec',
    description: 'Zaznamenávání nálady 30 dní v řadě.',
    icon: 'Trophy',
    gradient: 'from-yellow-400 to-amber-600',
    shadow: 'shadow-glow-orange',
    condition: (_entries, longestStreak) => longestStreak >= 30
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
         const tags = getTags(e);
         return tags.includes('sleep') || tags.includes('health');
       });
       return calmEntries.length >= 5;
    }
  },
  {
    id: 'novice',
    title: 'Nováček',
    description: 'První úspěšně vytvořený záznam.',
    icon: 'Star',
    gradient: 'from-sky-300 to-blue-500',
    shadow: 'shadow-glow-cyan',
    condition: (entries) => entries.length >= 1
  },
  {
    id: 'dedicated',
    title: 'Oddaný',
    description: 'Zaznamenáno celkem 50 dnů.',
    icon: 'Heart',
    gradient: 'from-rose-400 to-pink-600',
    shadow: 'shadow-glow-red',
    condition: (entries) => entries.length >= 50
  },
  {
    id: 'century',
    title: 'Stovka',
    description: 'Zaznamenáno celkem 100 dnů.',
    icon: 'Crown',
    gradient: 'from-fuchsia-400 to-purple-600',
    shadow: 'shadow-glow-violet',
    condition: (entries) => entries.length >= 100
  },
  {
    id: 'weekend-warrior',
    title: 'Víkendový chill',
    description: 'Záznam vytvořený o víkendu.',
    icon: 'Coffee',
    gradient: 'from-orange-300 to-amber-500',
    shadow: 'shadow-glow-orange',
    condition: (entries) => entries.some(e => {
      const day = new Date(e.timestamp).getDay();
      return day === 0 || day === 6;
    })
  },
  {
    id: 'emotional-rollercoaster',
    title: 'Na houpačce',
    description: 'Zaznamenáno 5 různých nálad.',
    icon: 'Activity',
    gradient: 'from-indigo-300 to-cyan-500',
    shadow: 'shadow-glow-cyan',
    condition: (entries) => new Set(entries.map(e => Math.round(e.mood))).size >= 5
  },
  {
    id: 'perfect-week',
    title: 'Skvělý týden',
    description: '7 dní v řadě se skvělou náladou (4 nebo 5).',
    icon: 'Sparkles',
    gradient: 'from-amber-300 to-yellow-500',
    shadow: 'shadow-glow-orange',
    condition: (entries) => {
      const goodEntries = entries.filter(e => e.mood >= 4);
      return calculateLongestStreak(goodEntries) >= 7;
    }
  },
  {
    id: 'optimist',
    title: 'Optimista',
    description: 'Zaznamenána nálada s nejvyšším skóre (5) alespoň 10x.',
    icon: 'Smile',
    gradient: 'from-green-400 to-emerald-600',
    shadow: 'shadow-glow-emerald',
    condition: (entries) => entries.filter(e => Math.round(e.mood) === 5).length >= 10
  },
  {
    id: 'social-butterfly',
    title: 'Společenský typ',
    description: 'Alespoň 10 záznamů s tagy Rodina nebo Sociální život.',
    icon: 'Users',
    gradient: 'from-pink-400 to-rose-600',
    shadow: 'shadow-glow-red',
    condition: (entries) => {
       const socialEntries = entries.filter(e => {
         const tags = getTags(e);
         return tags.includes('family') || tags.includes('social');
       });
       return socialEntries.length >= 10;
    }
  },
  {
    id: 'workaholic',
    title: 'Pracant',
    description: 'Alespoň 10 záznamů s tagem Práce.',
    icon: 'Briefcase',
    gradient: 'from-slate-400 to-gray-600',
    shadow: 'shadow-glow-cyan',
    condition: (entries) => {
       const workEntries = entries.filter(e => {
         const tags = getTags(e);
         return tags.includes('work');
       });
       return workEntries.length >= 10;
    }
  }
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

    // Cache streak computation — used by multiple achievement conditions
    const _longestStreak = calculateLongestStreak(entries);

    for (const achievement of ACHIEVEMENTS) {
      if (!existingIds.has(achievement.id)) {
        if (achievement.condition(entries, _longestStreak)) {
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
    devError('Failed to check achievements', err);
  }

  return unlockedNow.map(a => a.id);
};
