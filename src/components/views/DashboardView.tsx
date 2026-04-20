'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { PartyGrid } from '@/components/dashboard/PartyGrid';
import { TypeCoverage } from '@/components/dashboard/TypeCoverage';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { NextSteps } from '@/components/dashboard/NextSteps';
import { BattlePrep } from '@/components/dashboard/BattlePrep';
import { BagPanel } from '@/components/dashboard/BagPanel';
import { BoxPanel } from '@/components/dashboard/BoxPanel';
import { GraveyardPanel } from '@/components/dashboard/GraveyardPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Map,
  Target,
  Trophy,
  ChevronRight,
  Compass,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function DashboardView() {
  const currentRun = useRunStore((s) => s.currentRun);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const [boxExpanded, setBoxExpanded] = React.useState(false);
  const [graveyardExpanded, setGraveyardExpanded] = React.useState(false);

  // Auto-expand if there's content
  React.useEffect(() => {
    if (currentRun) {
      if (currentRun.box.length > 0) setBoxExpanded(true);
      if (currentRun.graveyard.length > 0) setGraveyardExpanded(true);
    }
  }, [currentRun?.box.length, currentRun?.graveyard.length]);

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

  const boxCount = currentRun.box.length;
  const graveyardCount = currentRun.graveyard.length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Progress Bar */}
      <div className="shrink-0 p-4 pb-2">
        <ProgressBar />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 pt-2 pb-24 space-y-6">
          {/* Row 1: Team + Next Steps side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Team - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PartyGrid />
            </div>

            {/* Right Column - Battle Prep & Coverage */}
            <div className="space-y-4">
              {/* Battle Prep */}
              <BattlePrep />
              
              {/* Type Coverage */}
              <TypeCoverage compact />
            </div>
          </div>

          {/* Row 2: Full Next Steps & Gym Prep */}
          <div className="p-4 rounded-xl border bg-card/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              Strategy & Gym Prep
            </h3>
            <NextSteps />
          </div>

          {/* Row 3: Bag + Activity + Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bag */}
            <div className="md:col-span-1">
              <BagPanel />
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-1">
              <RecentActivity />
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-1">
              <div className="p-4 rounded-xl border bg-card h-full">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setActiveTab('map')}
                  >
                    <span className="flex items-center gap-2">
                      <Map className="w-4 h-4" />
                      View Map
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setActiveTab('encounters')}
                  >
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Add Encounter
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setActiveTab('pokedex')}
                  >
                    <span className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      View Pokédex
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Box & Graveyard (Collapsible) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PC Box */}
            <Collapsible open={boxExpanded} onOpenChange={setBoxExpanded}>
              <div className="rounded-xl border bg-card overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📦</span>
                    <span className="font-semibold">PC Box</span>
                    <Badge variant="secondary">{boxCount}</Badge>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${boxExpanded ? 'rotate-90' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    {boxCount === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No Pokémon in the box
                      </p>
                    ) : (
                      <BoxPanel minimal />
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Graveyard */}
            <Collapsible open={graveyardExpanded} onOpenChange={setGraveyardExpanded}>
              <div className="rounded-xl border bg-card overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💀</span>
                    <span className="font-semibold">Graveyard</span>
                    <Badge variant={graveyardCount > 0 ? 'destructive' : 'secondary'}>
                      {graveyardCount}
                    </Badge>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${graveyardExpanded ? 'rotate-90' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    {graveyardCount === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No fallen Pokémon yet. Keep it that way!
                      </p>
                    ) : (
                      <GraveyardPanel minimal />
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version of NextSteps for the sidebar
function NextStepsCompact() {
  const currentRun = useRunStore((s) => s.currentRun);
  
  const nextGym = React.useMemo(() => {
    if (!currentRun) return null;
    const badges = currentRun.badges.filter(b => b.obtained).length;
    
    const gyms = [
      { leader: 'Brock', type: 'Rock', level: 14 },
      { leader: 'Misty', type: 'Water', level: 21 },
      { leader: 'Lt. Surge', type: 'Electric', level: 24 },
      { leader: 'Erika', type: 'Grass', level: 32 },
      { leader: 'Koga', type: 'Poison', level: 43 },
      { leader: 'Sabrina', type: 'Psychic', level: 43 },
      { leader: 'Blaine', type: 'Fire', level: 47 },
      { leader: 'Giovanni', type: 'Ground', level: 50 },
    ];
    
    return badges < 8 ? gyms[badges] : null;
  }, [currentRun]);

  if (!nextGym) return null;

  return (
    <div className="p-3 rounded-xl border bg-red-500/10 border-red-500/30">
      <div className="flex items-center gap-2 mb-1">
        <Trophy className="w-4 h-4 text-red-400" />
        <span className="font-semibold text-sm">Next: {nextGym.leader}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {nextGym.type} Type • Recommended Lv.{nextGym.level}
      </p>
    </div>
  );
}
