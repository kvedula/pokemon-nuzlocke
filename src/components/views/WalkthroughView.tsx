'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { 
  GYM_GUIDES, 
  ELITE_FOUR_GUIDES, 
  WALKTHROUGH_PHASES,
  checkTeamReadiness,
  type GymGuide,
} from '@/data/walkthrough';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import { 
  ChevronRight,
  ChevronDown,
  Shield,
  Swords,
  Star,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Scroll,
  Book,
  Info,
  MapPin,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function GymCard({ gym, teamReadiness, isNext, isCompleted }: { 
  gym: GymGuide; 
  teamReadiness: ReturnType<typeof checkTeamReadiness> | null;
  isNext: boolean;
  isCompleted: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(isNext);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border overflow-hidden transition-all',
        isCompleted && 'opacity-60',
        isNext && 'ring-2 ring-primary'
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full p-4 flex items-center justify-between transition-colors',
          isCompleted ? 'bg-muted/30' : 'bg-card hover:bg-muted/50'
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold',
            isCompleted 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-primary/20 text-primary'
          )}>
            {isCompleted ? <CheckCircle className="w-6 h-6" /> : gym.badgeNumber}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{gym.leader}</h3>
              <Badge 
                style={{ backgroundColor: TYPE_COLORS[gym.specialty] }}
                className="text-white"
              >
                {gym.specialty}
              </Badge>
              {isNext && (
                <Badge variant="outline" className="border-primary text-primary">
                  Next
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{gym.badge}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {teamReadiness && !isCompleted && (
            <div className="flex items-center gap-2">
              <Progress 
                value={teamReadiness.score} 
                className="w-16 h-2"
              />
              <span className={cn(
                'text-sm font-medium',
                teamReadiness.ready ? 'text-green-400' : 'text-amber-400'
              )}>
                {teamReadiness.score}%
              </span>
            </div>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t space-y-4 bg-muted/30">
              {/* Recommended Level & Types */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground mb-1">RECOMMENDED LEVEL</p>
                  <p className="text-xl font-bold">Lv. {gym.recommendedLevel}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground mb-1">USE THESE TYPES</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {gym.recommendedTypes.map(type => (
                      <Badge
                        key={type}
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                        className="text-white text-xs"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Key Threats */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Key Threats
                </h4>
                <div className="space-y-2">
                  {gym.keyThreats.map((threat, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-background/50 border-l-2 border-red-500">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{threat.pokemon}</span>
                        <Badge variant="outline">Lv.{threat.level}</Badge>
                      </div>
                      <p className="text-xs text-red-400 mb-1">⚠ {threat.danger}</p>
                      <p className="text-xs text-green-400">→ {threat.counter}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Strategy */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-blue-400">
                  <Info className="w-4 h-4" />
                  Strategy Guide
                </h4>
                <p className="text-sm leading-relaxed">{gym.strategy}</p>
              </div>
              
              {/* Preparation Checklist */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Preparation Checklist
                </h4>
                <ul className="space-y-1">
                  {gym.preparation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Rewards */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <h4 className="text-xs font-semibold mb-2 text-amber-400">REWARDS</h4>
                <div className="flex flex-wrap gap-2">
                  {gym.rewards.map((reward, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-amber-500/20">
                      {reward}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Team Readiness (if applicable) */}
              {teamReadiness && !isCompleted && (
                <div className={cn(
                  'p-4 rounded-lg border',
                  teamReadiness.ready 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-amber-500/10 border-amber-500/30'
                )}>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Shield className={cn(
                      'w-4 h-4',
                      teamReadiness.ready ? 'text-green-400' : 'text-amber-400'
                    )} />
                    Your Team Readiness
                  </h4>
                  
                  <div className="space-y-2">
                    {teamReadiness.teamStrengths.map((str, idx) => (
                      <p key={idx} className="text-sm text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        {str}
                      </p>
                    ))}
                    {teamReadiness.warnings.map((warn, idx) => (
                      <p key={idx} className="text-sm text-amber-400 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        {warn}
                      </p>
                    ))}
                    {teamReadiness.recommendations.map((rec, idx) => (
                      <p key={idx} className="text-sm text-blue-400 flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        {rec}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EliteFourCard({ e4 }: { e4: typeof ELITE_FOUR_GUIDES[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center font-bold">
            {e4.position}
          </div>
          <div className="text-left">
            <h4 className="font-semibold">{e4.name}</h4>
            <div className="flex items-center gap-2">
              <Badge 
                style={{ backgroundColor: TYPE_COLORS[e4.specialty] }}
                className="text-white text-xs"
              >
                {e4.specialty}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Lv.{Math.min(...e4.pokemon.map(p => p.level))}-{Math.max(...e4.pokemon.map(p => p.level))}
              </span>
            </div>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3 border-t bg-muted/30">
              <div className="pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">THEIR TEAM:</p>
                <div className="space-y-2">
                  {e4.pokemon.map((poke, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-background/50">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{poke.name}</span>
                        <div className="flex gap-1">
                          {poke.types.map(type => (
                            <Badge 
                              key={type}
                              style={{ backgroundColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS] }}
                              className="text-white text-[10px] px-1"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant="outline">Lv.{poke.level}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">RECOMMENDED TYPES:</p>
                <div className="flex flex-wrap gap-1">
                  {e4.recommendedTypes.map(type => (
                    <Badge
                      key={type}
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                      className="text-white"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm">{e4.strategy}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EliteFourSection() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-amber-500/10 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="font-bold text-lg">Pokemon League</h3>
            <p className="text-sm text-muted-foreground">
              5 consecutive battles - stock up on Full Restores and Max Revives!
            </p>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-background/50 mb-4">
          <p className="text-sm font-medium text-center">
            Recommended Team Level: <span className="text-primary text-lg">55-65</span>
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {ELITE_FOUR_GUIDES.map((e4) => (
          <EliteFourCard key={e4.id} e4={e4} />
        ))}
      </div>
    </div>
  );
}

function PhaseCard({ phase }: { phase: typeof WALKTHROUGH_PHASES[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
            phase.badge === 0 ? 'bg-muted' : 'bg-primary/20 text-primary'
          )}>
            {phase.badge === 0 ? '⭐' : phase.badge}
          </div>
          <div className="text-left">
            <h4 className="font-semibold">{phase.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {phase.description}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-4 border-t bg-muted/30">
              <div className="pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  STEPS
                </p>
                <div className="space-y-2">
                  {phase.steps.map((step, idx) => (
                    <div 
                      key={step.id}
                      className={cn(
                        'p-3 rounded-lg border text-sm bg-background/50',
                        step.isKeyMoment && 'bg-primary/5 border-primary/30',
                        step.isOptional && 'opacity-70'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                          {idx + 1}.
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{step.title}</span>
                            {step.isKeyMoment && <Star className="w-3 h-3 text-amber-400" />}
                            {step.isOptional && (
                              <Badge variant="outline" className="text-[10px]">Optional</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {phase.keyItems.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">KEY ITEMS:</p>
                  <div className="flex flex-wrap gap-1">
                    {phase.keyItems.map((item, idx) => (
                      <Badge key={idx} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {phase.bossEncounters.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Swords className="w-3 h-3 text-red-400" />
                    BOSS ENCOUNTERS:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {phase.bossEncounters.map((boss, idx) => (
                      <Badge key={idx} variant="outline" className="border-red-500/50 text-red-400">
                        {boss}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FullWalkthroughSection() {
  return (
    <div className="space-y-2">
      {WALKTHROUGH_PHASES.map((phase) => (
        <PhaseCard key={phase.id} phase={phase} />
      ))}
    </div>
  );
}

export function WalkthroughView() {
  const currentRun = useRunStore((s) => s.currentRun);
  const [activeTab, setActiveTab] = useState('gyms');
  
  const badges = useMemo(() => {
    if (!currentRun) return 0;
    return currentRun.badges.filter(b => b.obtained).length;
  }, [currentRun]);
  
  const teamReadinessMap = useMemo(() => {
    if (!currentRun) return new Map<number, ReturnType<typeof checkTeamReadiness>>();
    
    const map = new Map<number, ReturnType<typeof checkTeamReadiness>>();
    
    const teamPokemon = currentRun.party
      .map(id => currentRun.pokemon[id])
      .filter(p => p && p.status === 'active');
    
    const teamTypes = teamPokemon.flatMap(p => {
      const species = POKEMON_SPECIES[p.speciesId];
      return species?.types || p.types || [];
    });
    
    const teamLevels = teamPokemon.map(p => p.level);
    
    GYM_GUIDES.forEach(gym => {
      map.set(gym.badgeNumber, checkTeamReadiness(teamTypes, teamLevels, gym));
    });
    
    return map;
  }, [currentRun]);
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 border-b">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Book className="w-7 h-7" />
          Walkthrough Guide
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete FireRed/LeafGreen walkthrough with gym strategies and team recommendations
        </p>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 px-4 pt-4 pb-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="gyms" className="flex items-center gap-2">
              <Swords className="w-4 h-4" />
              Gym Leaders
            </TabsTrigger>
            <TabsTrigger value="elite4" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Elite Four
            </TabsTrigger>
            <TabsTrigger value="walkthrough" className="flex items-center gap-2">
              <Scroll className="w-4 h-4" />
              Full Walkthrough
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="gyms" className="flex-1 overflow-auto px-4 pb-24 mt-0">
          <div className="space-y-3 pt-2">
            {GYM_GUIDES.map((gym) => (
              <GymCard
                key={gym.gymId}
                gym={gym}
                teamReadiness={teamReadinessMap.get(gym.badgeNumber) || null}
                isNext={gym.badgeNumber === badges + 1}
                isCompleted={gym.badgeNumber <= badges}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="elite4" className="flex-1 overflow-auto px-4 pb-24 mt-0">
          <div className="pt-2">
            <EliteFourSection />
          </div>
        </TabsContent>
        
        <TabsContent value="walkthrough" className="flex-1 overflow-auto px-4 pb-24 mt-0">
          <div className="pt-2">
            <FullWalkthroughSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
