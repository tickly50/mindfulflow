import Dexie from 'dexie';

/**
 * Database configuration using Dexie.js (IndexedDB wrapper)
 */
export const db = new Dexie('MindfulFlowDB');

// Define schema
db.version(3).stores({
  moods: '++id, timestamp, mood, *tags, sleep, diary', // Primary key and indexed props
  settings: 'key' // Key-value store for preferences (customTags, notifications, etc.)
});

/**
 * Migrate data from localStorage if it exists and hasn't been migrated yet
 */
export const migrateFromLocalStorage = async () => {
  const STORAGE_KEY = 'mindfulflow_entries';
  const MIGRATION_KEY = 'mindfulflow_migration_complete';

  // Check if migration already happened
  if (localStorage.getItem(MIGRATION_KEY) === 'true') {
    return;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      const entries = JSON.parse(stored);
      
      if (Array.isArray(entries) && entries.length > 0) {
        // Prepare entries for Dexie (remove any old ID format if necessary)
        // Dexie auto-increments 'id' if not provided
        // eslint-disable-next-line no-unused-vars
        const cleanEntries = entries.map(({ id, ...rest }) => ({
          ...rest,
          timestamp: rest.timestamp || new Date().toISOString() // Ensure timestamp exists
        }));

        await db.moods.bulkAdd(cleanEntries);
      }
    }
    
    // Mark migration as complete
    localStorage.setItem(MIGRATION_KEY, 'true');
    
    // Optional: Keep old data in localStorage for backup, or clear it.
    // user might want to go back? safer to keep for now, but maybe rename key?
    // for now we just mark as migrated.
    
  } catch (error) {
    // Silently fail migration - user can still use app
    if (import.meta.env.DEV) console.error('Migration failed:', error);
  }
};
