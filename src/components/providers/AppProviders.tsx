'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { initializePersistence, loadMostRecentRun } from '@/store/persistenceMiddleware';
import { useRunStore } from '@/store/runStore';

function PersistenceInitializer({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const loadRun = useRunStore((s) => s.loadRun);

  useEffect(() => {
    const init = async () => {
      const run = await loadMostRecentRun();
      if (run) {
        loadRun(run);
      }
      setIsHydrated(true);
    };

    init();

    const cleanup = initializePersistence();
    return cleanup;
  }, [loadRun]);

  if (!isHydrated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🔥</span>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delay={200}>
        <PersistenceInitializer>
          {children}
        </PersistenceInitializer>
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
