'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useRunStore } from '@/store/runStore';
import { cn } from '@/lib/utils';
import {
  Trophy,
  MapPin,
  Users,
  Target,
  Coins,
  Clock,
  Play,
  Pause,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const updatePlayTime = useRunStore((s) => s.updatePlayTime);
  
  // Timer state - persisted in localStorage
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    if (!currentRun) return;
    const savedState = localStorage.getItem(`timer-${currentRun.id}`);
    if (savedState) {
      const { running, startedAt, remainingSeconds } = JSON.parse(savedState);
      if (running && startedAt) {
        // Calculate elapsed seconds since timer was started
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        setSecondsElapsed(elapsed);
        setIsTimerRunning(true);
      } else if (remainingSeconds && remainingSeconds > 0) {
        // Restore remaining seconds from when timer was paused
        setSecondsElapsed(remainingSeconds);
      }
    }
  }, [currentRun?.id]);

  // Save timer state to localStorage
  useEffect(() => {
    if (!currentRun) return;
    if (isTimerRunning) {
      localStorage.setItem(`timer-${currentRun.id}`, JSON.stringify({
        running: true,
        startedAt: Date.now() - (secondsElapsed * 1000),
      }));
    } else {
      localStorage.setItem(`timer-${currentRun.id}`, JSON.stringify({
        running: false,
        startedAt: null,
        remainingSeconds: secondsElapsed, // Preserve partial minutes
      }));
    }
  }, [isTimerRunning, secondsElapsed, currentRun?.id]);

  // Timer interval
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  // Update store every minute
  useEffect(() => {
    if (!currentRun || !isTimerRunning) return;
    
    const totalMinutes = currentRun.playTime + Math.floor(secondsElapsed / 60);
    const currentStoredMinutes = currentRun.playTime;
    
    // Only update if we've passed another minute
    if (Math.floor(secondsElapsed / 60) > 0 && secondsElapsed % 60 === 0) {
      updatePlayTime(totalMinutes);
      setSecondsElapsed(0); // Reset seconds counter
    }
  }, [secondsElapsed, isTimerRunning, currentRun?.playTime, updatePlayTime]);

  const toggleTimer = () => {
    if (isTimerRunning) {
      // Stopping - save any complete minutes and keep remaining seconds
      const additionalMinutes = Math.floor(secondsElapsed / 60);
      if (additionalMinutes > 0 && currentRun) {
        updatePlayTime(currentRun.playTime + additionalMinutes);
      }
      // Keep remaining seconds so we don't lose partial minutes
      setSecondsElapsed(secondsElapsed % 60);
    }
    setIsTimerRunning(!isTimerRunning);
  };

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

    // Calculate play time including live seconds
    const totalMinutes = currentRun.playTime + Math.floor(secondsElapsed / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const secs = secondsElapsed % 60;
    
    // Show seconds only when timer is running
    const playTimeStr = isTimerRunning
      ? hours > 0 
        ? `${hours}h ${minutes}m ${secs.toString().padStart(2, '0')}s`
        : `${minutes}m ${secs.toString().padStart(2, '0')}s`
      : hours > 0 
        ? `${hours}h ${minutes}m` 
        : `${minutes}m`;

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
  }, [currentRun, secondsElapsed, isTimerRunning]);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-card to-muted/50 border">
      {/* Badges */}
      <Tooltip>
        <TooltipTrigger>
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
        <TooltipTrigger>
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
        <TooltipTrigger>
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
        <TooltipTrigger>
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
        <TooltipTrigger>
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

      {/* Play Time with Timer */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger>
            <div className={cn(
              "flex items-center gap-1.5",
              isTimerRunning ? "text-green-500" : "text-muted-foreground"
            )}>
              <Clock className="w-4 h-4" />
              <span className={cn(
                "text-sm font-mono min-w-[70px]",
                isTimerRunning && "font-medium"
              )}>
                {stats.playTime}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Play Time: {stats.playTime}</p>
            <p className="text-muted-foreground text-xs">
              {isTimerRunning ? 'Timer running' : 'Timer paused'}
            </p>
          </TooltipContent>
        </Tooltip>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6",
            isTimerRunning && "text-green-500 hover:text-green-600"
          )}
          onClick={toggleTimer}
          title={isTimerRunning ? 'Pause timer' : 'Start timer'}
        >
          {isTimerRunning ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
