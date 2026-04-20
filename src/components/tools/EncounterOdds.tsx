'use client';

import React, { useMemo } from 'react';
import { useRunStore } from '@/store/runStore';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import { Target, Info, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PokemonType } from '@/types/pokemon';

// Encounter data for FireRed/LeafGreen routes
// Format: { speciesId, rate (percentage) }
const ENCOUNTER_DATA: Record<string, { speciesId: number; rate: number; method: string }[]> = {
  'route-1': [
    { speciesId: 19, rate: 50, method: 'walking' }, // Rattata
    { speciesId: 16, rate: 50, method: 'walking' }, // Pidgey
  ],
  'route-2': [
    { speciesId: 19, rate: 45, method: 'walking' },
    { speciesId: 16, rate: 45, method: 'walking' },
    { speciesId: 10, rate: 5, method: 'walking' },  // Caterpie
    { speciesId: 13, rate: 5, method: 'walking' },  // Weedle
  ],
  'viridian-forest': [
    { speciesId: 10, rate: 40, method: 'walking' }, // Caterpie
    { speciesId: 11, rate: 10, method: 'walking' }, // Metapod
    { speciesId: 13, rate: 40, method: 'walking' }, // Weedle
    { speciesId: 14, rate: 5, method: 'walking' },  // Kakuna
    { speciesId: 25, rate: 5, method: 'walking' },  // Pikachu
  ],
  'route-3': [
    { speciesId: 21, rate: 35, method: 'walking' }, // Spearow
    { speciesId: 27, rate: 25, method: 'walking' }, // Sandshrew (FR) / Ekans (LG)
    { speciesId: 32, rate: 14, method: 'walking' }, // Nidoran M
    { speciesId: 29, rate: 14, method: 'walking' }, // Nidoran F
    { speciesId: 39, rate: 10, method: 'walking' }, // Jigglypuff
    { speciesId: 56, rate: 2, method: 'walking' },  // Mankey (FR only)
  ],
  'mt-moon': [
    { speciesId: 41, rate: 64, method: 'walking' }, // Zubat
    { speciesId: 74, rate: 25, method: 'walking' }, // Geodude
    { speciesId: 35, rate: 6, method: 'walking' },  // Clefairy
    { speciesId: 46, rate: 5, method: 'walking' },  // Paras
  ],
  'route-4': [
    { speciesId: 19, rate: 35, method: 'walking' },
    { speciesId: 21, rate: 35, method: 'walking' },
    { speciesId: 27, rate: 15, method: 'walking' },
    { speciesId: 23, rate: 15, method: 'walking' }, // Ekans
    { speciesId: 129, rate: 100, method: 'fishing' }, // Magikarp (Old Rod)
  ],
  'route-24': [
    { speciesId: 10, rate: 25, method: 'walking' },
    { speciesId: 11, rate: 5, method: 'walking' },
    { speciesId: 43, rate: 25, method: 'walking' }, // Oddish
    { speciesId: 69, rate: 25, method: 'walking' }, // Bellsprout
    { speciesId: 63, rate: 15, method: 'walking' }, // Abra
    { speciesId: 16, rate: 5, method: 'walking' },
  ],
  'route-25': [
    { speciesId: 10, rate: 25, method: 'walking' },
    { speciesId: 11, rate: 5, method: 'walking' },
    { speciesId: 43, rate: 25, method: 'walking' },
    { speciesId: 69, rate: 25, method: 'walking' },
    { speciesId: 63, rate: 15, method: 'walking' },
    { speciesId: 16, rate: 5, method: 'walking' },
  ],
  'cerulean-cave': [
    { speciesId: 42, rate: 25, method: 'walking' },  // Golbat
    { speciesId: 64, rate: 10, method: 'walking' },  // Kadabra
    { speciesId: 82, rate: 5, method: 'walking' },   // Magneton
    { speciesId: 132, rate: 20, method: 'walking' }, // Ditto
    { speciesId: 101, rate: 5, method: 'walking' },  // Electrode
    { speciesId: 112, rate: 5, method: 'walking' },  // Rhydon
    { speciesId: 150, rate: 1, method: 'special' },  // Mewtwo (static)
  ],
};

// Catch rate calculation (simplified Gen 3 formula)
function calculateCatchRate(catchRate: number, hpPercent: number = 100, ballModifier: number = 1): number {
  // Simplified catch rate calculation
  const hpFactor = (3 - (2 * hpPercent / 100));
  const a = (3 * catchRate * hpFactor * ballModifier) / (3 * 255);
  return Math.min(100, Math.round(a * 100));
}

interface EncounterOddsProps {
  locationId?: string;
  compact?: boolean;
}

export function EncounterOdds({ locationId, compact = false }: EncounterOddsProps) {
  const currentRun = useRunStore((s) => s.currentRun);
  
  const location = useMemo(() => {
    if (!currentRun || !locationId) return null;
    return currentRun.locations[locationId];
  }, [currentRun, locationId]);
  
  const encounters = useMemo(() => {
    if (!locationId) return [];
    const data = ENCOUNTER_DATA[locationId] || [];
    
    return data.map(enc => {
      const species = POKEMON_SPECIES[enc.speciesId];
      if (!species) return null;
      
      const catchRate = calculateCatchRate(species.catchRate);
      const atLowHp = calculateCatchRate(species.catchRate, 10);
      
      return {
        ...enc,
        species,
        catchRate,
        catchRateLowHp: atLowHp,
      };
    }).filter(Boolean);
  }, [locationId]);
  
  if (!location || encounters.length === 0) {
    return compact ? null : (
      <div className="p-4 rounded-xl border bg-card text-center text-muted-foreground">
        <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No encounter data available for this location</p>
      </div>
    );
  }
  
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Target className="w-3 h-3" />
          Encounter Odds
        </div>
        <div className="flex flex-wrap gap-1">
          {encounters.slice(0, 5).map((enc) => (
            <Tooltip key={enc!.speciesId}>
              <TooltipTrigger>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-xs">
                  <img 
                    src={enc!.species.spriteUrl} 
                    alt={enc!.species.name}
                    className="w-5 h-5 pixelated"
                  />
                  <span>{enc!.rate}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{enc!.species.name}</p>
                <p className="text-xs text-muted-foreground">
                  Catch rate: {enc!.catchRate}% (PokéBall, full HP)
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold">Encounter Odds</h3>
        <Badge variant="outline">{location.name}</Badge>
      </div>
      
      <div className="space-y-2">
        {encounters.map((enc) => (
          <div 
            key={enc!.speciesId}
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border"
          >
            <img 
              src={enc!.species.spriteUrl} 
              alt={enc!.species.name}
              className="w-10 h-10 pixelated"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{enc!.species.name}</span>
                <div className="flex gap-1">
                  {enc!.species.types.map((type) => (
                    <span
                      key={type}
                      className="px-1.5 py-0.5 rounded text-[8px] font-semibold text-white"
                      style={{ backgroundColor: TYPE_COLORS[type as PokemonType] }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={enc!.rate} className="h-1.5 flex-1" />
                <span className="text-xs font-medium w-10">{enc!.rate}%</span>
              </div>
            </div>
            
            <Tooltip>
              <TooltipTrigger>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs">
                    <Percent className="w-3 h-3" />
                    <span>{enc!.catchRate}%</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    catch rate
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{enc!.species.name} Catch Rates</p>
                <div className="text-xs space-y-1 mt-1">
                  <p>Full HP: {enc!.catchRate}%</p>
                  <p>Low HP (10%): {enc!.catchRateLowHp}%</p>
                  <p className="text-muted-foreground">Using PokéBall</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
      
      <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          Catch rates shown are approximate for PokéBall. Great Ball has 1.5x modifier, Ultra Ball has 2x.
          Lowering HP and inflicting status conditions greatly improves catch rate.
        </p>
      </div>
    </div>
  );
}
