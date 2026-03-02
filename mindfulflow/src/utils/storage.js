import { db, migrateFromLocalStorage } from './db';
import { calculateStreak as calcStreak } from './moodCalculations';

/**
 * Storage utilities – powered by Dexie.js (IndexedDB)
 */

// Initialize migration from legacy localStorage on first load
migrateFromLocalStorage().catch(err => {
  if (import.meta.env.DEV) console.error(err);
});

/** Save a new mood entry, returns new ID */
export const saveMoodEntry = async (entry) => {
  try {
    return await db.moods.add({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    });
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error saving mood entry:', error);
    throw error;
  }
};

/** Get all mood entries sorted oldest-first */
export const getAllEntries = async () =>
  db.moods.orderBy('timestamp').toArray();

/** Calculate the current daily streak */
export const calculateStreak = async () => {
  const entries = await db.moods.orderBy('timestamp').reverse().toArray();
  return calcStreak(entries);
};

/** Clear all data and fully reset the app */
export const clearAllEntries = async () => {
  try {
    await db.moods.clear();
    await db.achievements.clear();
    await db.settings.clear();
    return true;
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error clearing entries:', error);
    return false;
  }
};

/** Download a JSON backup of all data */
export const downloadBackup = async () => {
  try {
    const [moods, achievements] = await Promise.all([
      db.moods.toArray(),
      db.achievements.toArray(),
    ]);
    const data = JSON.stringify({ version: 2, moods, achievements }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `mindfulflow-backup-${new Date().toISOString().split('T')[0]}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) console.error('Backup failed:', error);
    return false;
  }
};

/** Import data from a JSON backup string */
export const importData = async (jsonString) => {
  try {
    const rawData = JSON.parse(jsonString);

    let entriesToImport = [];
    let achievementsToImport = [];

    if (Array.isArray(rawData)) {
      entriesToImport = rawData;
    } else if (rawData && typeof rawData === 'object' && Array.isArray(rawData.moods)) {
      entriesToImport = rawData.moods;
      if (Array.isArray(rawData.achievements)) {
        achievementsToImport = rawData.achievements;
      }
    } else {
      throw new Error('Invalid data format');
    }

    // Strip old auto-increment IDs so IndexedDB assigns fresh ones
    // eslint-disable-next-line no-unused-vars
    const cleanEntries = entriesToImport.map(({ id, ...rest }) => ({
      ...rest,
      timestamp: rest.timestamp || new Date().toISOString(),
    }));

    await db.moods.clear();
    await db.moods.bulkAdd(cleanEntries);

    if (achievementsToImport.length > 0) {
      await db.achievements.clear();
      await db.achievements.bulkAdd(achievementsToImport);
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error importing data:', error);
    return false;
  }
};
