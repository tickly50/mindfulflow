import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

const entryTime = (e) => new Date(e.timestamp).getTime();

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

/**
 * @param {{ filter?: (entry: object) => boolean }} [query]
 * @param {unknown[]} [extraDeps]
 */
export const useMoodEntriesCount = (query = {}, extraDeps = []) => {
  const filter = query.filter;
  return useLiveQuery(
    () =>
      db.moods
        .orderBy('timestamp')
        .toArray()
        .then((rows) => (filter ? rows.filter(filter).length : rows.length)),
    filter ? [filter, ...extraDeps] : extraDeps
  );
};

/**
 * @param {{ reverse?: boolean; limit: number; offset: number; filter?: (entry: object) => boolean }} query
 * @param {unknown[]} [extraDeps]
 */
export const useMoodEntriesPage = (query, extraDeps = []) => {
  const { reverse = true, limit, offset, filter } = query;
  return useLiveQuery(
    () =>
      db.moods
        .orderBy('timestamp')
        .toArray()
        .then((rows) => {
          let list = rows;
          if (filter) list = list.filter(filter);
          const ordered = reverse ? [...list].reverse() : [...list];
          return { entries: ordered.slice(offset, offset + limit) };
        }),
    [reverse, limit, offset, filter, ...extraDeps]
  );
};

/**
 * @param {{ reverse?: boolean; startDate?: Date; endDate?: Date }} query
 */
export const useMoodEntriesRange = (query) => {
  const { reverse = false, startDate, endDate } = query;
  return useLiveQuery(
    () =>
      db.moods
        .orderBy('timestamp')
        .toArray()
        .then((rows) => {
          let list = rows;
          if (startDate) {
            const t0 = startDate.getTime();
            list = list.filter((e) => entryTime(e) >= t0);
          }
          if (endDate) {
            const t1 = endDate.getTime();
            list = list.filter((e) => entryTime(e) <= t1);
          }
          return reverse ? [...list].reverse() : list;
        }),
    [reverse, startDate, endDate]
  );
};

/**
 * @param {{ reverse?: boolean }} [query]
 */
export const useMoodEntryTimestamps = (query = {}) => {
  const { reverse = false } = query;
  return useLiveQuery(
    () =>
      db.moods
        .orderBy('timestamp')
        .toArray()
        .then((rows) => {
          const ts = rows.map((e) => e.timestamp);
          return reverse ? [...ts].reverse() : ts;
        }),
    [reverse]
  );
};
