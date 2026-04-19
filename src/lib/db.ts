import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { NuzlockeRun, RunSummary } from '@/types';

interface NuzlockeDB extends DBSchema {
  runs: {
    key: string;
    value: NuzlockeRun;
    indexes: {
      'by-date': string;
      'by-status': string;
    };
  };
  settings: {
    key: string;
    value: unknown;
  };
  sprites: {
    key: string;
    value: {
      id: string;
      data: string;
      timestamp: number;
    };
  };
}

const DB_NAME = 'nuzlocke-tracker';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<NuzlockeDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<NuzlockeDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<NuzlockeDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('runs')) {
        const runsStore = db.createObjectStore('runs', { keyPath: 'id' });
        runsStore.createIndex('by-date', 'lastModified');
        runsStore.createIndex('by-status', 'status');
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }

      if (!db.objectStoreNames.contains('sprites')) {
        db.createObjectStore('sprites', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

export async function saveRun(run: NuzlockeRun): Promise<void> {
  const db = await getDB();
  await db.put('runs', { ...run, lastModified: new Date().toISOString() });
}

export async function getRun(id: string): Promise<NuzlockeRun | undefined> {
  const db = await getDB();
  return db.get('runs', id);
}

export async function getAllRuns(): Promise<NuzlockeRun[]> {
  const db = await getDB();
  return db.getAllFromIndex('runs', 'by-date');
}

export async function getRunSummaries(): Promise<RunSummary[]> {
  const runs = await getAllRuns();
  return runs.map(run => ({
    id: run.id,
    name: run.name,
    game: run.game,
    gameMode: run.gameMode || 'nuzlocke',
    status: run.status,
    startedAt: run.startedAt,
    completedAt: run.completedAt,
    badgeCount: run.badges.filter(b => b.obtained).length,
    partyCount: run.party.length,
    deathCount: run.deathCount,
    lastModified: run.lastModified,
  })).sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
}

export async function deleteRun(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('runs', id);
}

export async function exportRunToJSON(id: string): Promise<string> {
  const run = await getRun(id);
  if (!run) throw new Error('Run not found');
  return JSON.stringify(run, null, 2);
}

export async function importRunFromJSON(json: string): Promise<NuzlockeRun> {
  const run = JSON.parse(json) as NuzlockeRun;
  
  if (!run.id || !run.name || !run.game) {
    throw new Error('Invalid run data');
  }
  
  run.id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  run.lastModified = new Date().toISOString();
  
  await saveRun(run);
  return run;
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put('settings', value, key);
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get('settings', key) as Promise<T | undefined>;
}

export async function cacheSprite(id: string, data: string): Promise<void> {
  const db = await getDB();
  await db.put('sprites', { id, data, timestamp: Date.now() });
}

export async function getCachedSprite(id: string): Promise<string | undefined> {
  const db = await getDB();
  const sprite = await db.get('sprites', id);
  return sprite?.data;
}

export async function exportAllData(): Promise<string> {
  const runs = await getAllRuns();
  const db = await getDB();
  const settings: Record<string, unknown> = {};
  
  const settingsKeys = await db.getAllKeys('settings');
  for (const key of settingsKeys) {
    settings[key as string] = await db.get('settings', key);
  }
  
  return JSON.stringify({ runs, settings, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json);
  const db = await getDB();
  
  if (data.runs && Array.isArray(data.runs)) {
    for (const run of data.runs) {
      await db.put('runs', run);
    }
  }
  
  if (data.settings && typeof data.settings === 'object') {
    for (const [key, value] of Object.entries(data.settings)) {
      await db.put('settings', value, key);
    }
  }
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('runs');
  await db.clear('settings');
  await db.clear('sprites');
}
