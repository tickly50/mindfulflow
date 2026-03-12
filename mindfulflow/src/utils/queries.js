import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

/**
 * Hook to get all mood entries, sorted by timestamp
 * @param {boolean} reverse - If true, returns newest first (default). If false, oldest first.
 * @returns {Array|undefined} Array of entries
 */
export const useMoodEntries = (reverse = true) =>
  useLiveQuery(
    () => {
      const collection = db.moods.orderBy('timestamp');
      return reverse ? collection.reverse().toArray() : collection.toArray();
    },
    [reverse]
  );
