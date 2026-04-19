'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { PartyPanel } from '@/components/dashboard/PartyPanel';
import { BadgeTracker } from '@/components/dashboard/BadgeTracker';
import { GraveyardPanel } from '@/components/dashboard/GraveyardPanel';
import { BoxPanel } from '@/components/dashboard/BoxPanel';
import { RunStats } from '@/components/dashboard/RunStats';
import { NextSteps } from '@/components/dashboard/NextSteps';
import { BagPanel } from '@/components/dashboard/BagPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Map, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';

export function DashboardView() {
  const currentRun = useRunStore((s) => s.currentRun);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <span className="text-4xl">🔥</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Nuzlocke Tracker</h2>
          <p className="text-muted-foreground mb-6">
            Start a new run to begin tracking your Pokémon FireRed or LeafGreen Nuzlocke adventure.
          </p>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Start New Run
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Column - Stats & Badges & Bag */}
      <div className="w-72 shrink-0 border-r overflow-auto">
        <div className="p-4 space-y-4">
          <RunStats />
          <BagPanel />
          <BadgeTracker />
        </div>
      </div>

      {/* Center Column - Next Steps + Party */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Next Steps - Collapsible panel above party */}
        <div className="shrink-0 border-b bg-card/50 max-h-[300px] overflow-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Next Steps & Gym Prep
            </h3>
            <NextSteps />
          </div>
        </div>
        
        {/* Party */}
        <div className="flex-1 overflow-auto min-h-0">
          <PartyPanel />
        </div>
      </div>

      {/* Right Column - Box & Graveyard */}
      <div className="w-80 shrink-0 border-l overflow-auto">
        <div className="p-4 space-y-4">
          <BoxPanel />
          <GraveyardPanel />

          {/* Quick Actions */}
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start w-full overflow-hidden"
                onClick={() => setActiveTab('map')}
              >
                <Map className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">View Map</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start w-full overflow-hidden"
                onClick={() => setActiveTab('encounters')}
              >
                <Users className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">Add Encounter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
