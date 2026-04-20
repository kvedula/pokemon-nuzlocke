'use client';

import React, { useMemo } from 'react';
import { useRunStore } from '@/store/runStore';
import { cn } from '@/lib/utils';
import {
  Trophy,
  Target,
  Skull,
  Clock,
  TrendingUp,
  Activity,
  Award,
  Zap,
  Shield,
  Swords,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

function StatCard({ icon, label, value, subtext, color = 'text-primary' }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", color.replace('text-', 'bg-') + '/10')}>
        <span className={color}>{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {subtext && <div className="text-[10px] text-muted-foreground/70 mt-1">{subtext}</div>}
    </div>
  );
}

export function RunStatistics() {
  const currentRun = useRunStore((s) => s.currentRun);
  
  const stats = useMemo(() => {
    if (!currentRun) return null;
    
    const allPokemon = Object.values(currentRun.pokemon);
    const party = currentRun.party.map(id => currentRun.pokemon[id]).filter(Boolean);
    const boxed = currentRun.box.map(id => currentRun.pokemon[id]).filter(Boolean);
    const dead = currentRun.graveyard.map(id => currentRun.pokemon[id]).filter(Boolean);
    
    const totalCaught = allPokemon.length;
    const totalDeaths = dead.length;
    const survivalRate = totalCaught > 0 ? Math.round(((totalCaught - totalDeaths) / totalCaught) * 100) : 100;
    
    const badgesEarned = currentRun.badges.filter(b => b.obtained).length;
    
    // Average level of party
    const avgLevel = party.length > 0 
      ? Math.round(party.reduce((sum, p) => sum + p.level, 0) / party.length)
      : 0;
    
    // Highest level Pokemon
    const highestLevel = allPokemon.reduce((max, p) => Math.max(max, p.level), 0);
    const highestLevelPokemon = allPokemon.find(p => p.level === highestLevel);
    
    // Type distribution
    const typeCount: Record<string, number> = {};
    party.forEach(p => {
      p.types.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
    });
    const dominantType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    
    // Encounters used
    const encountersUsed = Object.values(currentRun.locations).filter(l => l.encounterUsed).length;
    const totalEncounters = Object.values(currentRun.locations).filter(l => l.encounters.length > 0).length;
    const encounterRate = totalEncounters > 0 ? Math.round((encountersUsed / totalEncounters) * 100) : 0;
    
    // Shiny count
    const shinyCount = allPokemon.filter(p => p.isShiny).length;
    
    // Play time
    const hours = Math.floor(currentRun.playTime / 60);
    const minutes = currentRun.playTime % 60;
    const playTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    // Pokemon per hour
    const pokemonPerHour = currentRun.playTime > 0 
      ? (totalCaught / (currentRun.playTime / 60)).toFixed(1)
      : '0';
    
    // Deaths per badge
    const deathsPerBadge = badgesEarned > 0 
      ? (totalDeaths / badgesEarned).toFixed(1)
      : '0';
    
    return {
      totalCaught,
      totalDeaths,
      survivalRate,
      badgesEarned,
      avgLevel,
      highestLevel,
      highestLevelPokemon,
      dominantType,
      encountersUsed,
      totalEncounters,
      encounterRate,
      shinyCount,
      playTimeStr,
      pokemonPerHour,
      deathsPerBadge,
      partySize: party.length,
      boxSize: boxed.length,
      money: currentRun.money,
    };
  }, [currentRun]);
  
  if (!stats) return null;
  
  return (
    <div className="space-y-6">
      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Trophy className="w-4 h-4" />}
          label="Badges Earned"
          value={`${stats.badgesEarned}/8`}
          color="text-yellow-500"
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Pokémon Caught"
          value={stats.totalCaught}
          subtext={`${stats.pokemonPerHour}/hr`}
          color="text-green-500"
        />
        <StatCard
          icon={<Skull className="w-4 h-4" />}
          label="Deaths"
          value={stats.totalDeaths}
          subtext={`${stats.deathsPerBadge}/badge`}
          color="text-red-500"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Play Time"
          value={stats.playTimeStr}
          color="text-blue-500"
        />
      </div>
      
      {/* Progress Bars */}
      <div className="space-y-4 p-4 rounded-xl border bg-card">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Progress
        </h4>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Survival Rate</span>
              <span className={cn(
                stats.survivalRate >= 80 ? 'text-green-500' :
                stats.survivalRate >= 50 ? 'text-yellow-500' : 'text-red-500'
              )}>
                {stats.survivalRate}%
              </span>
            </div>
            <Progress value={stats.survivalRate} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Encounters Used</span>
              <span>{stats.encountersUsed}/{stats.totalEncounters}</span>
            </div>
            <Progress value={stats.encounterRate} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Gym Progress</span>
              <span>{stats.badgesEarned}/8 badges</span>
            </div>
            <Progress value={(stats.badgesEarned / 8) * 100} className="h-2" />
          </div>
        </div>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-muted-foreground">Avg Level</span>
          </div>
          <div className="text-lg font-bold">{stats.avgLevel}</div>
        </div>
        
        <div className="p-3 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Highest Level</span>
          </div>
          <div className="text-lg font-bold">
            {stats.highestLevel}
            {stats.highestLevelPokemon && (
              <span className="text-xs text-muted-foreground ml-1">
                ({stats.highestLevelPokemon.nickname})
              </span>
            )}
          </div>
        </div>
        
        <div className="p-3 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3 h-3 text-purple-500" />
            <span className="text-xs text-muted-foreground">Dominant Type</span>
          </div>
          <Badge variant="secondary">{stats.dominantType}</Badge>
        </div>
        
        <div className="p-3 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-3 h-3 text-pink-500" />
            <span className="text-xs text-muted-foreground">Shinies Found</span>
          </div>
          <div className="text-lg font-bold">{stats.shinyCount}</div>
        </div>
      </div>
      
      {/* Team Composition */}
      <div className="p-4 rounded-xl border bg-card">
        <h4 className="text-sm font-semibold mb-3">Team Composition</h4>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-green-500" />
            <span>Party: <strong>{stats.partySize}/6</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 flex items-center justify-center">📦</span>
            <span>Box: <strong>{stats.boxSize}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-red-500" />
            <span>Graveyard: <strong>{stats.totalDeaths}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
