import Dexie, { type Table } from 'dexie';
import type { AchievementRow, MoodEntry, SettingRow } from '../types/models';
import { devError } from './devLog';

class MindfulFlowDB extends Dexie {
  moods!: Table<MoodEntry, number>;
  settings!: Table<SettingRow, string>;
  achievements!: Table<AchievementRow, string>;

  constructor() {
    super('MindfulFlowDB');
    this.version(3).stores({
      moods: '++id, timestamp, mood, *tags, sleep, diary',
      settings: 'key',
    });
    this.version(4).stores({
      achievements: 'id, unlockedAt',
    });
  }
}

export const db = new MindfulFlowDB();

/**
 * Migrate data from localStorage if it exists and hasn't been migrated yet.
 */
export async function migrateFromLocalStorage(): Promise<void> {
  const STORAGE_KEY = 'mindfulflow_entries';
  const MIGRATION_KEY = 'mindfulflow_migration_complete';

  if (localStorage.getItem(MIGRATION_KEY) === 'true') {
    return;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const entries = JSON.parse(stored) as unknown;

      if (Array.isArray(entries) && entries.length > 0) {
        const cleanEntries = entries.map((row: Record<string, unknown> & { id?: number }) => {
          const { id: _id, ...rest } = row;
          return {
            ...rest,
            timestamp:
              typeof rest.timestamp === 'string'
                ? rest.timestamp
                : new Date().toISOString(),
          } as Omit<MoodEntry, 'id'>;
        });

        await db.moods.bulkAdd(cleanEntries);
      }
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
  } catch (error) {
    devError('Migration failed:', error);
  }
}
