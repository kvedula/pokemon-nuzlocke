'use client';

import React, { useMemo, useState } from 'react';
import { useRunStore } from '@/store/runStore';
import { GYM_LEADERS, ELITE_FOUR, CHAMPION, GymLeader, GymLeaderPokemon, getLevelCap } from '@/data/gymLeaders';
import { POKEMON_SPECIES, TYPE_COLORS, TYPE_EFFECTIVENESS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import {
  Swords,
  Shield,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Trophy,
  Zap,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PokemonType } from '@/types/pokemon';

interface TypeMatchupResult {
  pokemon: GymLeaderPokemon;
  yourPokemon: string;
  effectiveness: number;
  offensiveTypes: PokemonType[];
  recommendation: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
}

function calculateEffectiveness(attackerTypes: PokemonType[], defenderTypes: PokemonType[]): number {
  let multiplier = 1;
  
  for (const attackType of attackerTypes) {
    for (const defType of defenderTypes) {
      const effectiveness = TYPE_EFFECTIVENESS[attackType]?.[defType] ?? 1;
      multiplier *= effectiveness;
    }
  }
  
  return multiplier;
}

function getRecommendation(effectiveness: number): 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible' {
  if (effectiveness >= 4) return 'excellent';
  if (effectiveness >= 2) return 'good';
  if (effectiveness === 1) return 'neutral';
  if (effectiveness > 0) return 'bad';
  return 'terrible';
}

const RECOMMENDATION_COLORS = {
  excellent: 'text-green-400 bg-green-500/10',
  good: 'text-green-300 bg-green-500/5',
  neutral: 'text-muted-foreground bg-muted/50',
  bad: 'text-orange-400 bg-orange-500/10',
  terrible: 'text-red-400 bg-red-500/10',
};

const RECOMMENDATION_ICONS = {
  excellent: CheckCircle,
  good: CheckCircle,
  neutral: Info,
  bad: AlertTriangle,
  terrible: XCircle,
};

export function BattlePrep() {
  const currentRun = useRunStore((s) => s.currentRun);
  const [expanded, setExpanded] = useState(true);
  const [showAllBosses, setShowAllBosses] = useState(false);
  
  const badgeCount = useMemo(() => {
    if (!currentRun) return 0;
    return currentRun.badges.filter(b => b.obtained).length;
  }, [currentRun]);
  
  const partyPokemon = useMemo(() => {
    if (!currentRun) return [];
    return currentRun.party
      .map((id) => currentRun.pokemon[id])
      .filter(Boolean);
  }, [currentRun]);
  
  const nextBoss = useMemo(() => {
    if (badgeCount < 8) {
      return GYM_LEADERS[badgeCount];
    }
    // Check Elite Four progress
    const eliteDefeated = currentRun?.bossEncounters.filter(b => 
      b.type === 'elite-four' && b.defeated
    ).length || 0;
    
    if (eliteDefeated < 4) {
      return ELITE_FOUR[eliteDefeated];
    }
    
    const championDefeated = currentRun?.bossEncounters.some(b => 
      b.type === 'champion' && b.defeated
    );
    
    if (!championDefeated) {
      return CHAMPION;
    }
    
    return null;
  }, [badgeCount, currentRun]);
  
  const levelCap = getLevelCap(badgeCount);
  
  const matchups = useMemo(() => {
    if (!nextBoss || !partyPokemon.length) return [];
    
    const results: TypeMatchupResult[] = [];
    
    for (const enemyPokemon of nextBoss.team) {
      let bestMatchup: TypeMatchupResult | null = null;
      let bestEffectiveness = 0;
      
      for (const yourPokemon of partyPokemon) {
        // Calculate how effective your Pokemon's types are against the enemy
        const effectiveness = calculateEffectiveness(yourPokemon.types, enemyPokemon.types as PokemonType[]);
        
        if (effectiveness > bestEffectiveness) {
          bestEffectiveness = effectiveness;
          bestMatchup = {
            pokemon: enemyPokemon,
            yourPokemon: yourPokemon.nickname,
            effectiveness,
            offensiveTypes: yourPokemon.types,
            recommendation: getRecommendation(effectiveness),
          };
        }
      }
      
      if (bestMatchup) {
        results.push(bestMatchup);
      } else {
        results.push({
          pokemon: enemyPokemon,
          yourPokemon: 'No good counter',
          effectiveness: 1,
          offensiveTypes: [],
          recommendation: 'neutral',
        });
      }
    }
    
    return results;
  }, [nextBoss, partyPokemon]);
  
  const overallReadiness = useMemo(() => {
    if (!matchups.length) return 'unknown';
    
    const excellentCount = matchups.filter(m => m.recommendation === 'excellent' || m.recommendation === 'good').length;
    const badCount = matchups.filter(m => m.recommendation === 'bad' || m.recommendation === 'terrible').length;
    
    if (excellentCount >= matchups.length * 0.6) return 'ready';
    if (badCount >= matchups.length * 0.5) return 'unprepared';
    return 'caution';
  }, [matchups]);
  
  const levelWarnings = useMemo(() => {
    return partyPokemon.filter(p => p.level > levelCap);
  }, [partyPokemon, levelCap]);
  
  if (!currentRun || !nextBoss) return null;
  
  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="p-4 rounded-xl border bg-card">
        <CollapsibleTrigger className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">Battle Prep</h3>
            <Badge 
              variant={overallReadiness === 'ready' ? 'default' : overallReadiness === 'caution' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {overallReadiness === 'ready' ? 'Ready!' : overallReadiness === 'caution' ? 'Caution' : 'Train More'}
            </Badge>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4">
          {/* Level Cap Warning */}
          {levelWarnings.length > 0 && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
              <p className="text-xs text-yellow-400">
                <span className="font-semibold">{levelWarnings.map(p => p.nickname).join(', ')}</span>
                {' '}exceed{levelWarnings.length === 1 ? 's' : ''} the level cap of {levelCap}!
              </p>
            </div>
          )}
          
          {/* Next Boss Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{nextBoss.name}</span>
                {'badge' in nextBoss && (
                  <Badge variant="outline" className="text-xs">
                    {(nextBoss as GymLeader).badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{nextBoss.title}</p>
            </div>
            <div className="text-right">
              <span 
                className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                style={{ backgroundColor: TYPE_COLORS[nextBoss.specialty] }}
              >
                {nextBoss.specialty}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Level Cap: {nextBoss.levelCap}
              </p>
            </div>
          </div>
          
          {/* Enemy Team & Matchups */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Enemy Team & Best Counters
            </h4>
            <div className="space-y-1.5">
              {matchups.map((matchup, i) => {
                const Icon = RECOMMENDATION_ICONS[matchup.recommendation];
                const species = POKEMON_SPECIES[matchup.pokemon.speciesId];
                
                return (
                  <div 
                    key={i}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg",
                      RECOMMENDATION_COLORS[matchup.recommendation]
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {species && (
                        <img 
                          src={species.spriteUrl} 
                          alt={matchup.pokemon.species}
                          className="w-8 h-8 pixelated"
                        />
                      )}
                      <div>
                        <span className="text-sm font-medium">{matchup.pokemon.species}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Lv.{matchup.pokemon.level}</span>
                          <div className="flex gap-0.5">
                            {matchup.pokemon.types.map((type) => (
                              <span
                                key={type}
                                className="px-1 py-0.5 rounded text-[8px] font-semibold text-white"
                                style={{ backgroundColor: TYPE_COLORS[type] }}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          <span className="text-xs font-medium">{matchup.yourPokemon}</span>
                        </div>
                        {matchup.effectiveness !== 1 && (
                          <span className="text-[10px]">
                            {matchup.effectiveness}x damage
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Tips */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tips
            </h4>
            <ul className="space-y-1">
              {nextBoss.tips.slice(0, 3).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 mt-0.5 text-yellow-500 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Strategy */}
          <div className="p-2 rounded-lg bg-muted/30 border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Strategy: </span>
              {nextBoss.strategy}
            </p>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
