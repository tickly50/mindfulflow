import { db, migrateFromLocalStorage } from './db';
import { calculateStreak as calcStreak } from './moodCalculations';
import type { AchievementRow, MoodEntry } from '../types/models';
import { devError } from './devLog';

migrateFromLocalStorage().catch((err: unknown) => devError(err));

type NewMoodEntry = Omit<MoodEntry, 'id'> & { id?: number };

/** Save a new mood entry, returns new ID */
export async function saveMoodEntry(entry: NewMoodEntry): Promise<number> {
  try {
    return await db.moods.add({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    });
  } catch (error) {
    devError('Error saving mood entry:', error);
    throw error;
  }
}

/** Calculate the current daily streak */
export async function calculateStreak(): Promise<number> {
  const entries = await db.moods.orderBy('timestamp').reverse().toArray();
  return calcStreak(entries);
}

/** Update specific fields of an existing mood entry by id */
export async function updateMoodEntry(
  id: number,
  updates: Partial<Omit<MoodEntry, 'id' | 'timestamp'>> & { timestamp?: string }
): Promise<boolean> {
  try {
    await db.moods.update(id, updates);
    return true;
  } catch (error) {
    devError('Error updating mood entry:', error);
    throw error;
  }
}

/** Clear all data and fully reset the app */
export async function clearAllEntries(): Promise<boolean> {
  try {
    await db.moods.clear();
    await db.achievements.clear();
    await db.settings.clear();
    return true;
  } catch (error) {
    devError('Error clearing entries:', error);
    return false;
  }
}

/** Download a JSON backup of all data */
export async function downloadBackup(): Promise<boolean> {
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
    devError('Backup failed:', error);
    return false;
  }
}

/** Import data from a JSON backup string */
export async function importData(jsonString: string): Promise<boolean> {
  try {
    const rawData = JSON.parse(jsonString) as unknown;

    let entriesToImport: Record<string, unknown>[] = [];
    let achievementsToImport: AchievementRow[] = [];

    if (Array.isArray(rawData)) {
      entriesToImport = rawData;
    } else if (
      rawData &&
      typeof rawData === 'object' &&
      'moods' in rawData &&
      Array.isArray((rawData as { moods: unknown }).moods)
    ) {
      entriesToImport = (rawData as { moods: Record<string, unknown>[] }).moods;
      if (
        'achievements' in rawData &&
        Array.isArray((rawData as { achievements: unknown }).achievements)
      ) {
        achievementsToImport = (rawData as { achievements: AchievementRow[] }).achievements;
      }
    } else {
      throw new Error('Invalid data format');
    }

    const cleanEntries = entriesToImport.map(({ id: _id, ...rest }) => ({
      ...rest,
      timestamp:
        typeof rest.timestamp === 'string' ? rest.timestamp : new Date().toISOString(),
    })) as Omit<MoodEntry, 'id'>[];

    await db.moods.clear();
    await db.moods.bulkAdd(cleanEntries);

    if (achievementsToImport.length > 0) {
      await db.achievements.clear();
      await db.achievements.bulkAdd(achievementsToImport);
    }

    return true;
  } catch (error) {
    devError('Error importing data:', error);
    return false;
  }
}
