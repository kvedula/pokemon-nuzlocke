'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { 
  getCurrentPhase, 
  getGymGuide, 
  checkTeamReadiness, 
  ELITE_FOUR_GUIDES,
  type TeamReadinessResult 
} from '@/data/walkthrough';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle,
  Swords,
  MapPin,
  Zap,
  TrendingUp,
  Shield,
  Lightbulb,
  Info,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function NextSteps() {
  const currentRun = useRunStore((s) => s.currentRun);
  
  const analysis = useMemo(() => {
    if (!currentRun) return null;
    
    const badges = currentRun.badges.filter(b => b.obtained).length;
    const currentPhase = getCurrentPhase(badges);
    const nextGym = getGymGuide(badges + 1);
    
    // Get team info - party array contains IDs of party Pokemon
    const teamPokemon = currentRun.party
      .map(id => currentRun.pokemon[id])
      .filter(p => p && p.status === 'active');
    
    const teamTypes = teamPokemon.flatMap(p => {
      const species = POKEMON_SPECIES[p.speciesId];
      return species?.types || [];
    });
    
    const teamLevels = teamPokemon.map(p => p.level);
    const avgLevel = teamLevels.length > 0 
      ? Math.round(teamLevels.reduce((a, b) => a + b, 0) / teamLevels.length)
      : 0;
    const maxLevel = teamLevels.length > 0 ? Math.max(...teamLevels) : 0;
    
    // Check readiness for next gym
    let gymReadiness: TeamReadinessResult | null = null;
    if (nextGym) {
      gymReadiness = checkTeamReadiness(teamTypes, teamLevels, nextGym);
    }
    
    // Determine current location context
    const currentLocation = currentRun.currentLocation 
      ? currentRun.locations[currentRun.currentLocation] 
      : null;
    
    // Generate recommendations
    const recommendations: {
      type: 'warning' | 'suggestion' | 'ready' | 'info';
      icon: React.ElementType;
      title: string;
      description: string;
      priority: number;
    }[] = [];
    
    // Team size check
    if (teamPokemon.length < 3) {
      recommendations.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Small Team',
        description: `You only have ${teamPokemon.length} Pokemon. Consider catching more for backup.`,
        priority: 1,
      });
    }
    
    // Level check for next gym
    if (nextGym && maxLevel < nextGym.recommendedLevel - 5) {
      recommendations.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Under-leveled',
        description: `Your highest level is ${maxLevel}. ${nextGym.leader} recommends Lv.${nextGym.recommendedLevel}.`,
        priority: 2,
      });
    } else if (nextGym && maxLevel >= nextGym.recommendedLevel) {
      recommendations.push({
        type: 'ready',
        icon: CheckCircle,
        title: 'Level Ready',
        description: `Your team is at the recommended level for ${nextGym.leader}!`,
        priority: 5,
      });
    }
    
    // Type coverage check
    if (nextGym && gymReadiness && !gymReadiness.warnings.some(w => w.includes('No'))) {
      recommendations.push({
        type: 'ready',
        icon: Shield,
        title: 'Type Advantage',
        description: `You have ${nextGym.recommendedTypes.filter(t => teamTypes.includes(t)).join('/')} coverage!`,
        priority: 4,
      });
    } else if (nextGym) {
      recommendations.push({
        type: 'suggestion',
        icon: Lightbulb,
        title: 'Need Counter',
        description: `Catch a ${nextGym.recommendedTypes.slice(0, 2).join(' or ')} type for ${nextGym.leader}.`,
        priority: 3,
      });
    }
    
    // Phase-specific suggestions
    if (currentPhase.id === 1 && !teamTypes.includes('Electric')) {
      recommendations.push({
        type: 'suggestion',
        icon: Zap,
        title: 'Catch Pikachu!',
        description: 'Viridian Forest has 5% Pikachu - essential for Misty later!',
        priority: 2,
      });
    }
    
    if (currentPhase.id === 4 && !teamTypes.includes('Ground')) {
      recommendations.push({
        type: 'suggestion',
        icon: MapPin,
        title: 'Visit Diglett Cave',
        description: 'Catch Diglett/Dugtrio - they\'re immune to Lt. Surge\'s Electric moves!',
        priority: 1,
      });
    }
    
    // Sort by priority
    recommendations.sort((a, b) => a.priority - b.priority);
    
    return {
      badges,
      currentPhase,
      nextGym,
      teamPokemon,
      teamTypes: [...new Set(teamTypes)],
      avgLevel,
      maxLevel,
      gymReadiness,
      currentLocation,
      recommendations: recommendations.slice(0, 4),
    };
  }, [currentRun]);
  
  if (!analysis || !currentRun) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Start a run to see recommendations
      </div>
    );
  }
  
  const { currentPhase, nextGym, gymReadiness, recommendations, maxLevel } = analysis;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left: Current Phase & Progress */}
      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">CURRENT PHASE</span>
            <Badge variant="outline" className="text-[10px]">{analysis.badges}/8</Badge>
          </div>
          <p className="font-bold">{currentPhase.name}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{currentPhase.description}</p>
          <Progress value={(analysis.badges / 8) * 100} className="h-1.5 mt-3" />
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-1.5">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  'p-2 rounded-lg border flex items-start gap-2',
                  rec.type === 'warning' && 'bg-amber-500/10 border-amber-500/30',
                  rec.type === 'suggestion' && 'bg-blue-500/10 border-blue-500/30',
                  rec.type === 'ready' && 'bg-green-500/10 border-green-500/30',
                  rec.type === 'info' && 'bg-muted border-border'
                )}
              >
                <rec.icon className={cn(
                  'w-4 h-4 shrink-0',
                  rec.type === 'warning' && 'text-amber-500',
                  rec.type === 'suggestion' && 'text-blue-400',
                  rec.type === 'ready' && 'text-green-500',
                  rec.type === 'info' && 'text-muted-foreground'
                )} />
                <div className="min-w-0">
                  <p className="font-medium text-xs">{rec.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{rec.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Center: Next Gym Preview */}
      {nextGym && (
        <div className="col-span-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Swords className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="font-semibold">Next: {nextGym.leader}</p>
                <p className="text-xs text-muted-foreground">
                  {nextGym.badge} • {nextGym.specialty} Type • Lv.{nextGym.recommendedLevel}
                </p>
              </div>
            </div>
            {gymReadiness && (
              <Badge 
                variant={gymReadiness.ready ? 'default' : 'secondary'}
                className={cn(
                  'text-sm px-3',
                  gymReadiness.ready 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                )}
              >
                {gymReadiness.ready ? 'Ready!' : `${gymReadiness.score}% Ready`}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Left: Types & Threats */}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">USE THESE TYPES:</p>
                <div className="flex flex-wrap gap-1">
                  {nextGym.recommendedTypes.map(type => (
                    <Badge
                      key={type}
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                      className="text-white text-[10px]"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">KEY THREATS:</p>
                <div className="space-y-1">
                  {nextGym.keyThreats.slice(0, 2).map((threat, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-background/50 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{threat.pokemon}</span>
                        <span className="text-[10px] text-muted-foreground">Lv.{threat.level}</span>
                      </div>
                      <p className="text-[10px] text-red-400 line-clamp-1">{threat.danger}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right: Readiness & Strategy */}
            <div className="space-y-3">
              {gymReadiness && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1.5">YOUR TEAM:</p>
                  <div className="space-y-1">
                    {gymReadiness.teamStrengths.slice(0, 2).map((str, idx) => (
                      <p key={idx} className="text-[10px] text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="line-clamp-1">{str}</span>
                      </p>
                    ))}
                    {gymReadiness.warnings.slice(0, 1).map((warn, idx) => (
                      <p key={idx} className="text-[10px] text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="line-clamp-1">{warn}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                <p className="text-[10px] font-medium text-blue-400 mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Quick Tip
                </p>
                <p className="text-[10px] line-clamp-2">{nextGym.strategy.slice(0, 100)}...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Elite Four (if 8 badges) - Full Width */}
      {analysis.badges === 8 && (
        <div className="col-span-3 p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-amber-500/10 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-semibold">Pokemon League</p>
              <p className="text-xs text-muted-foreground">5 consecutive battles - Recommended Lv.55-65</p>
            </div>
          </div>
          <div className="flex gap-2">
            {ELITE_FOUR_GUIDES.map((e4, idx) => (
              <div 
                key={e4.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-background/50 text-xs"
              >
                <span className="font-medium">{idx + 1}.</span>
                <span>{e4.name}</span>
                <Badge 
                  style={{ backgroundColor: TYPE_COLORS[e4.specialty] }}
                  className="text-white text-[10px] px-1"
                >
                  {e4.specialty}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
