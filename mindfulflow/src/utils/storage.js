import { db, migrateFromLocalStorage } from './db';
import { calculateMoodStats, calculateStreak as calcStreak } from './moodCalculations';


/**
 * Storage utilities - Powered by Dexie.js (IndexedDB)
 * Asynchronous operations for better performance and scalability
 */

// Initialize migration check (silently in production)
migrateFromLocalStorage().catch(err => {
  if (import.meta.env.DEV) console.error(err);
});

/**
 * Save a new mood entry
 * @returns {Promise<number>} The new entry ID
 */
export const saveMoodEntry = async (entry) => {
  try {
    const newEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    };
    
    const id = await db.moods.add(newEntry);
    return id;
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error saving mood entry:', error);
    throw error;
  }
};

/**
 * Get all mood entries
 * @returns {Promise<Array>}
 */
export const getAllEntries = async () => {
  return await db.moods.orderBy('timestamp').toArray();
};

/**
 * Get recent entries (optimized with limit)
 * @returns {Promise<Array>}
 */
export const getRecentEntries = async (limit = 7) => {
  return await db.moods.orderBy('timestamp').reverse().limit(limit).toArray();
};

/**
 * Get entries for a specific date range
 * @returns {Promise<Array>}
 */
export const getEntriesByDateRange = async (startDate, endDate) => {
  return await db.moods
    .where('timestamp')
    .between(startDate, endDate)
    .toArray();
};

/**
 * Calculate average mood from recent entries
 * @returns {Promise<number>}
 */
export const getAverageMood = async (days = 7) => {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  const cutoffISO = cutoffDate.toISOString();
  
  const recentEntries = await db.moods
    .where('timestamp')
    .aboveOrEqual(cutoffISO)
    .toArray();
  
  if (recentEntries.length === 0) {
    return 3;
  }
  
  const sum = recentEntries.reduce((acc, entry) => acc + entry.mood, 0);
  return sum / recentEntries.length;
};

/**
 * Get mood statistics
 * @returns {Promise<Object>}
 */
export const getMoodStats = async () => {
  const entries = await db.moods.toArray();
  return calculateMoodStats(entries);
};


/**
 * Update an existing mood entry
 * @param {number} id - Entry ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<number>}
 */
export const updateMoodEntry = async (id, updates) => {
  try {
    return await db.moods.update(id, updates);
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error updating mood entry:', error);
    throw error;
  }
};

/**
 * Calculate current streak (consecutive days with entries)
 * @returns {Promise<number>} Number of days in streak
 */
export const calculateStreak = async () => {
  const entries = await db.moods.orderBy('timestamp').reverse().toArray();
  return calcStreak(entries);
};


/**
 * Clear all entries
 * @returns {Promise<boolean>}
 */
export const clearAllEntries = async () => {
  try {
    // Clear moods, achievements, and settings to fully reset the app state
    await db.moods.clear();
    await db.achievements.clear();
    await db.settings.clear();
    return true;
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error clearing entries:', error);
    return false;
  }
};

/**
 * Export data as JSON
 * @returns {Promise<string>}
 */
export const exportData = async () => {
  const moods = await db.moods.toArray();
  const achievements = await db.achievements.toArray();
  
  const backupData = {
    version: 2,
    moods: moods,
    achievements: achievements
  };
  return JSON.stringify(backupData, null, 2);
};

/**
 * Trigger download of backup file
 */
export const downloadBackup = async () => {
  try {
    const data = await exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindfulflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) console.error("Backup failed:", error);
    return false;
  }
};

/**
 * Import data from JSON
 * @returns {Promise<boolean>}
 */
export const importData = async (jsonString) => {
  try {
    const rawData = JSON.parse(jsonString);
    
    let entriesToImport = [];
    let achievementsToImport = [];

    // Zpětná kompatibilita (starší zálohy byly pouze pole nálad)
    if (Array.isArray(rawData)) {
      entriesToImport = rawData;
    } 
    // Nový formát (objekt obsahující moods a achievements)
    else if (rawData && typeof rawData === 'object' && Array.isArray(rawData.moods)) {
      entriesToImport = rawData.moods;
      if (Array.isArray(rawData.achievements)) {
        achievementsToImport = rawData.achievements;
      }
    } else {
      throw new Error('Invalid data format');
    }

    // Clean entries before import (remove old IDs if necessary)
    // eslint-disable-next-line no-unused-vars
    const cleanEntries = entriesToImport.map(({ id, ...rest }) => ({
      ...rest,
      timestamp: rest.timestamp || new Date().toISOString()
    }));
    
    // Clear existing data before import (as requested by user to overwrite)
    await db.moods.clear();
    await db.moods.bulkAdd(cleanEntries);
    
    if (achievementsToImport.length > 0) {
      // Clear existujících úspěchů a vložení nových
      await db.achievements.clear();
      await db.achievements.bulkAdd(achievementsToImport);
    }
    
    return true;
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error importing data:', error);
    return false;
  }
};
