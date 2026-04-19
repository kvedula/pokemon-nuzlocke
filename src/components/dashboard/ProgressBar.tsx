'use client';

import React, { useMemo } from 'react';
import { useRunStore } from '@/store/runStore';
import { cn } from '@/lib/utils';
import {
  Trophy,
  MapPin,
  Users,
  Target,
  Coins,
  Clock,
  Save,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const BADGE_COLORS = [
  '#A8A878', // Boulder - gray/brown
  '#6890F0', // Cascade - blue
  '#F8D030', // Thunder - yellow
  '#F85888', // Rainbow - pink/rainbow
  '#F08030', // Soul - orange
  '#A040A0', // Marsh - purple
  '#F08030', // Volcano - orange/red
  '#E0C068', // Earth - tan
];

export function ProgressBar() {
  const currentRun = useRunStore((s) => s.currentRun);

  const stats = useMemo(() => {
    if (!currentRun) return null;

    const badges = currentRun.badges.filter(b => b.obtained);
    const partyCount = currentRun.party.length;
    
    // Count encounters used
    const encountersUsed = Object.values(currentRun.locations).filter(l => l.encounterUsed).length;
    const totalEncounterLocations = Object.values(currentRun.locations).filter(l => l.encounters.length > 0).length;

    const currentLocation = currentRun.currentLocation
      ? currentRun.locations[currentRun.currentLocation]
      : null;

    const saveLocation = currentRun.saveLocation
      ? currentRun.locations[currentRun.saveLocation]
      : null;

    // Calculate play time
    const hours = Math.floor(currentRun.playTime / 60);
    const minutes = currentRun.playTime % 60;
    const playTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return {
      badges,
      badgeCount: badges.length,
      partyCount,
      encountersUsed,
      totalEncounterLocations,
      money: currentRun.money || 0,
      currentLocation,
      saveLocation,
      playTime: playTimeStr,
      deaths: currentRun.graveyard.length,
    };
  }, [currentRun]);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-card to-muted/50 border">
      {/* Badges */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <div
                  key={i}
                  className={cn(
                    'w-3 h-3 rounded-full border-2',
                    i < stats.badgeCount
                      ? 'border-transparent'
                      : 'border-muted-foreground/30 bg-transparent'
                  )}
                  style={i < stats.badgeCount ? { backgroundColor: BADGE_COLORS[i] } : undefined}
                />
              ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{stats.badgeCount}/8 Badges</p>
        </TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border" />

      {/* Current Location */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-sm truncate max-w-[120px]">
              {stats.currentLocation?.name || 'Unknown'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Current: {stats.currentLocation?.name || 'Unknown'}</p>
          {stats.saveLocation && <p className="text-muted-foreground">Saved: {stats.saveLocation.name}</p>}
        </TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border" />

      {/* Party */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{stats.partyCount}/6</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Party: {stats.partyCount}/6 Pokémon</p>
        </TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border" />

      {/* Encounters */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-orange-500" />
            <span className="text-sm">{stats.encountersUsed}/{stats.totalEncounterLocations}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Encounters: {stats.encountersUsed} used / {stats.totalEncounterLocations} available</p>
        </TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border" />

      {/* Money */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="text-sm">₽{stats.money.toLocaleString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Money: ₽{stats.money.toLocaleString()}</p>
        </TooltipContent>
      </Tooltip>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Deaths */}
      {stats.deaths > 0 && (
        <>
          <Badge variant="destructive" className="text-xs">
            {stats.deaths} death{stats.deaths > 1 ? 's' : ''}
          </Badge>
          <div className="w-px h-6 bg-border" />
        </>
      )}

      {/* Play Time */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{stats.playTime}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Play Time: {stats.playTime}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
