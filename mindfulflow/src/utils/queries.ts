import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import type { MoodEntry } from '../types/models';

const entryTime = (e: MoodEntry) => new Date(e.timestamp).getTime();

export type MoodEntryFilter = (entry: MoodEntry) => boolean;

export interface MoodEntriesPageQuery {
  reverse?: boolean;
  limit: number;
  offset: number;
  filter?: MoodEntryFilter;
}

export interface MoodEntriesPageResult {
  entries: MoodEntry[];
}

export interface MoodEntriesRangeQuery {
  reverse?: boolean;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook to get all mood entries, sorted by timestamp.
 * @param reverse - If true, returns newest first (default). If false, oldest first.
 */
export function useMoodEntries(reverse = true) {
  return useLiveQuery(
    () => {
      const collection = db.moods.orderBy('timestamp');
      return reverse ? collection.reverse().toArray() : collection.toArray();
    },
    [reverse]
  );
}

export function useMoodEntriesCount(
  query: { filter?: MoodEntryFilter } = {},
  extraDeps: unknown[] = []
) {
  const filter = query.filter;
  return useLiveQuery(
    () =>
      db.moods
        .orderBy('timestamp')
        .toArray()
        .then((rows) => (filter ? rows.filter(filter).length : rows.length)),
    filter ? [filter, ...extraDeps] : extraDeps
  );
}

export function useMoodEntriesPage(query: MoodEntriesPageQuery, extraDeps: unknown[] = []) {
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
          return { entries: ordered.slice(offset, offset + limit) } satisfies MoodEntriesPageResult;
        }),
    [reverse, limit, offset, filter, ...extraDeps]
  );
}

export function useMoodEntriesRange(query: MoodEntriesRangeQuery) {
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
}

export function useMoodEntryTimestamps(query: { reverse?: boolean } = {}) {
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
}
