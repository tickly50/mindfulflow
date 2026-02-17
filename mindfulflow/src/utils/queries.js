import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

/**
 * Hook to get average mood over the last N days
 * @param {number} days - Number of days to look back
 * @returns {number} Average mood (1-5) or default (3)
 */
export const useAverageMood = (days = 3) => {
  return useLiveQuery(async () => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    const cutoffISO = cutoffDate.toISOString();
    
    if (!db || !db.moods) return 3;

    const recentEntries = await db.moods
      .where('timestamp')
      .aboveOrEqual(cutoffISO)
      .toArray();
    
    if (recentEntries.length === 0) return 3;
    
    const sum = recentEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return sum / recentEntries.length;
  }, [days], 3);
};

/**
 * Hook to get all mood entries, sorted by timestamp
 * @param {boolean} reverse - If true, returns newest first (default). If false, oldest first.
 * @returns {Array|undefined} Array of entries
 */
export const useMoodEntries = (reverse = true) => {
  return useLiveQuery(
    () => {
      const collection = db.moods.orderBy('timestamp');
      return reverse ? collection.reverse().toArray() : collection.toArray();
    },
    [reverse]
  );
};

/**
 * Hook to get custom tags settings
 * @returns {Array} Array of custom tag objects
 */
export const useCustomTags = () => {
  const result = useLiveQuery(() => db.settings.get('customTags'));
  return result?.value || [];
};
