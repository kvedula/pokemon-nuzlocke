import { useRunStore } from './runStore';
import { saveRun, getRun, getAllRuns } from '@/lib/db';
import { NuzlockeRun } from '@/types';

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 1000;

export function initializePersistence(): () => void {
  const unsubscribe = useRunStore.subscribe(
    (state) => state.currentRun,
    async (currentRun) => {
      if (!currentRun) return;

      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      saveTimeout = setTimeout(async () => {
        try {
          await saveRun(currentRun);
          console.log('Run auto-saved:', currentRun.id);
        } catch (error) {
          console.error('Failed to save run:', error);
        }
      }, SAVE_DEBOUNCE_MS);
    }
  );

  return () => {
    unsubscribe();
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
  };
}

export async function loadMostRecentRun(): Promise<NuzlockeRun | null> {
  try {
    const runs = await getAllRuns();
    if (runs.length === 0) return null;

    const sortedRuns = runs.sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    const activeRuns = sortedRuns.filter((r) => r.status === 'active');
    return activeRuns[0] || sortedRuns[0] || null;
  } catch (error) {
    console.error('Failed to load runs:', error);
    return null;
  }
}

export async function loadRunById(id: string): Promise<NuzlockeRun | null> {
  try {
    return (await getRun(id)) || null;
  } catch (error) {
    console.error('Failed to load run:', error);
    return null;
  }
}

export async function forceSaveCurrentRun(): Promise<void> {
  const currentRun = useRunStore.getState().currentRun;
  if (currentRun) {
    await saveRun(currentRun);
  }
}
