/** Single mood journal row in IndexedDB. */
export interface MoodEntry {
  id?: number;
  timestamp: string;
  mood: number;
  tags?: string[];
  sleep?: number;
  diary?: string;
}

/** Unlocked achievement persisted in IndexedDB. */
export interface AchievementRow {
  id: string;
  unlockedAt: string;
}

/** Key-value settings row (e.g. customTags). */
export interface SettingRow {
  key: string;
  value: unknown;
}
