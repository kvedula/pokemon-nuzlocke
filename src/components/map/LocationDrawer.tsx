'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Location, WildEncounter } from '@/types';
import { useRunStore } from '@/store/runStore';
import { POKEMON_SPECIES, TYPE_COLORS, getTypeWeaknesses } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import {
  X,
  MapPin,
  Navigation,
  Save,
  Users,
  Swords,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Footprints,
  Waves,
  Fish,
  Check,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LocationDrawerProps {
  location: Location;
  onClose: () => void;
  onSetCurrent: () => void;
  onSetSave: () => void;
}

function EncounterMethodIcon({ method }: { method: string }) {
  switch (method) {
    case 'surfing':
      return <Waves className="w-3 h-3" />;
    case 'fishing-old':
    case 'fishing-good':
    case 'fishing-super':
      return <Fish className="w-3 h-3" />;
    default:
      return <Footprints className="w-3 h-3" />;
  }
}

function EncounterCard({ encounter }: { encounter: WildEncounter }) {
  const species = POKEMON_SPECIES[encounter.speciesId];
  if (!species) return null;

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <img
        src={species.spriteUrl}
        alt={species.name}
        className="w-10 h-10 pixelated"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{species.name}</span>
          <div className="flex gap-1">
            {species.types.map((type) => (
              <span
                key={type}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                style={{ backgroundColor: TYPE_COLORS[type] }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <EncounterMethodIcon method={encounter.method} />
          <span className="capitalize">{encounter.method.replace('-', ' ')}</span>
          <span>•</span>
          <span>Lv. {encounter.minLevel}-{encounter.maxLevel}</span>
          <span>•</span>
          <span>{encounter.rate}%</span>
        </div>
      </div>
      {encounter.version && encounter.version !== 'both' && (
        <Badge variant="outline" className="text-[10px]">
          {encounter.version === 'firered' ? 'FR' : 'LG'}
        </Badge>
      )}
    </div>
  );
}

export function LocationDrawer({ location, onClose, onSetCurrent, onSetSave }: LocationDrawerProps) {
  const currentRun = useRunStore((s) => s.currentRun);
  const updateLocation = useRunStore((s) => s.updateLocation);
  const defeatTrainer = useRunStore((s) => s.defeatTrainer);
  const undefeatTrainer = useRunStore((s) => s.undefeatTrainer);
  
  const isCurrent = currentRun?.currentLocation === location.id;
  const isSavePoint = currentRun?.saveLocation === location.id;
  const defeatedTrainers = location.defeatedTrainers || [];
  const defeatedCount = defeatedTrainers.length;
  const totalTrainers = location.trainers.length;

  const statusColors = {
    unvisited: 'bg-gray-500',
    current: 'bg-green-500',
    visited: 'bg-blue-500',
    cleared: 'bg-purple-500',
    'saved-here': 'bg-yellow-500',
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-0 top-0 h-full w-96 bg-background border-l shadow-2xl z-20"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">{location.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={cn('capitalize', statusColors[location.status])}
                >
                  {location.status.replace('-', ' ')}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {location.type}
                </Badge>
                {location.gym && (
                  <Badge variant="default" className="bg-red-600">
                    Gym #{location.gym.badgeNumber}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={isCurrent ? 'default' : 'outline'}
              size="sm"
              onClick={onSetCurrent}
              className="flex-1"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isCurrent ? 'Current' : 'Set Current'}
            </Button>
            <Button
              variant={isSavePoint ? 'default' : 'outline'}
              size="sm"
              onClick={onSetSave}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSavePoint ? 'Saved Here' : 'Save Here'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="shrink-0 px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
              <TabsTrigger value="encounters" className="flex-1">
                Encounters
                {location.encounters.length > 0 && (
                  <span className="ml-1 text-xs">({location.encounters.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="trainers" className="flex-1">
                Trainers
                {location.trainers.length > 0 && (
                  <span className="ml-1 text-xs">
                    ({defeatedCount}/{totalTrainers})
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="flex-1 overflow-y-auto px-4 pb-4 mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">{location.description}</p>

              {/* Gym Info */}
              {location.gym && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold flex items-center gap-2 text-red-400">
                    <Swords className="w-4 h-4" />
                    Gym Information
                  </h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Leader:</span>
                      <span className="font-medium">{location.gym.leader}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Badge:</span>
                      <span className="font-medium">{location.gym.badge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Specialty:</span>
                      <Badge 
                        style={{ backgroundColor: TYPE_COLORS[location.gym.specialty as keyof typeof TYPE_COLORS] }}
                        className="text-white"
                      >
                        {location.gym.specialty}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reward:</span>
                      <span className="font-medium">{location.gym.reward}</span>
                    </div>
                    {location.gym.puzzle && (
                      <div className="pt-2 border-t mt-2">
                        <span className="text-muted-foreground">Puzzle: </span>
                        <span>{location.gym.puzzle}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Required HMs */}
              {location.requiredHMs.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <h4 className="font-semibold flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    Required HMs
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {location.requiredHMs.map((hm) => (
                      <Badge key={hm} variant="outline" className="capitalize">
                        {hm}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Level */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm text-muted-foreground">Recommended Level:</span>
                <Badge variant="secondary">Lv. {location.recommendedLevel}</Badge>
              </div>

              {/* Encounter Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm text-muted-foreground">Encounter Used:</span>
                {location.encounterUsed ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Used
                  </Badge>
                ) : (
                  <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                    <CheckCircle className="w-3 h-3" />
                    Available
                  </Badge>
                )}
              </div>

              {/* Facilities */}
              <div className="flex gap-2">
                {location.hasPokeCenter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Pokémon Center
                  </Badge>
                )}
                {location.hasPokeMart && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Poké Mart
                  </Badge>
                )}
                {location.isFlyPoint && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Fly Point
                  </Badge>
                )}
              </div>

              {/* Items */}
              {location.items.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4" />
                    Items ({location.items.length})
                  </h4>
                  <div className="space-y-1">
                    {location.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center justify-between p-2 rounded text-sm',
                          item.obtained ? 'bg-muted/50 line-through opacity-60' : 'bg-muted'
                        )}
                      >
                        <span>{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {item.type}
                          </Badge>
                          {item.notes && (
                            <span className="text-xs text-muted-foreground">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {location.notes && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-semibold flex items-center gap-2 text-blue-400 mb-2">
                    <Info className="w-4 h-4" />
                    Notes
                  </h4>
                  <p className="text-sm">{location.notes}</p>
                </div>
              )}

              {/* Connections */}
              <div>
                <h4 className="font-semibold mb-2">Connected Locations</h4>
                <div className="flex flex-wrap gap-1">
                  {location.connections.map((connId) => {
                    const conn = currentRun?.locations[connId];
                    return conn ? (
                      <Badge key={connId} variant="outline">
                        {conn.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </TabsContent>

          <TabsContent value="encounters" className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
              {location.encounters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No wild encounters at this location.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Group by method */}
                  {['walking', 'surfing', 'fishing-old', 'fishing-good', 'fishing-super', 'static', 'gift'].map((method) => {
                    const methodEncounters = location.encounters.filter(e => e.method === method);
                    if (methodEncounters.length === 0) return null;
                    
                    return (
                      <div key={method}>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                          <EncounterMethodIcon method={method} />
                          {method.replace('-', ' ')}
                        </h4>
                        <div className="space-y-1">
                          {methodEncounters.map((enc, idx) => (
                            <EncounterCard key={`${enc.speciesId}-${idx}`} encounter={enc} />
                          ))}
                        </div>
                        <Separator className="my-3" />
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

          <TabsContent value="trainers" className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
              {location.trainers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notable trainers at this location.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Progress indicator */}
                  {totalTrainers > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-2">
                      <span className="text-sm text-muted-foreground">Trainers Defeated</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${(defeatedCount / totalTrainers) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{defeatedCount}/{totalTrainers}</span>
                      </div>
                    </div>
                  )}
                  
                  {location.trainers.map((trainer) => {
                    const isDefeated = defeatedTrainers.includes(trainer.id);
                    
                    // Calculate all types used by this trainer
                    const trainerTypes = new Set<string>();
                    trainer.pokemon.forEach(poke => {
                      const species = POKEMON_SPECIES[poke.speciesId];
                      if (species) {
                        species.types.forEach(t => trainerTypes.add(t));
                      }
                    });
                    
                    // Get weaknesses for all Pokemon types combined
                    const allWeaknesses = new Set<string>();
                    trainer.pokemon.forEach(poke => {
                      const species = POKEMON_SPECIES[poke.speciesId];
                      if (species) {
                        const weaknesses = getTypeWeaknesses(species.types);
                        weaknesses.forEach(w => allWeaknesses.add(w));
                      }
                    });
                    
                    const handleToggleDefeated = () => {
                      if (isDefeated) {
                        undefeatTrainer(location.id, trainer.id);
                      } else {
                        defeatTrainer(location.id, trainer.id);
                      }
                    };
                    
                    return (
                      <div
                        key={trainer.id}
                        className={cn(
                          'p-4 rounded-lg border transition-all',
                          isDefeated 
                            ? 'bg-green-500/10 border-green-500/30 opacity-75'
                            : trainer.isBoss 
                              ? 'bg-red-500/10 border-red-500/30' 
                              : 'bg-muted/50 border-transparent'
                        )}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {/* Defeat checkbox */}
                            <button
                              onClick={handleToggleDefeated}
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center transition-all border-2',
                                isDefeated 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-muted-foreground/30 hover:border-green-500/50'
                              )}
                            >
                              {isDefeated && <Check className="w-4 h-4" />}
                            </button>
                            <div>
                              <span className={cn(
                                'font-semibold text-base',
                                isDefeated && 'line-through opacity-70'
                              )}>
                                {trainer.name}
                              </span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {trainer.class}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isDefeated && (
                              <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-500">
                                Defeated
                              </Badge>
                            )}
                            {trainer.isBoss && (
                              <Badge variant="destructive">Boss</Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Pokemon Team */}
                        <div className="space-y-2">
                          {trainer.pokemon.map((poke, idx) => {
                            const species = POKEMON_SPECIES[poke.speciesId];
                            const pokeWeaknesses = species ? getTypeWeaknesses(species.types) : [];
                            
                            return (
                              <div
                                key={idx}
                                className={cn(
                                  'flex items-center gap-3 p-2 rounded-lg bg-background/50',
                                  poke.isAce && 'ring-1 ring-yellow-500/50 bg-yellow-500/5'
                                )}
                              >
                                {species && (
                                  <img
                                    src={species.spriteUrl}
                                    alt={poke.speciesName}
                                    className="w-10 h-10 pixelated"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{poke.speciesName}</span>
                                    <span className="text-xs text-muted-foreground">Lv.{poke.level}</span>
                                    {poke.isAce && (
                                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-yellow-500/20 border-yellow-500/50 text-yellow-500">
                                        ACE
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    {species?.types.map((type) => (
                                      <span
                                        key={type}
                                        className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                                        style={{ backgroundColor: TYPE_COLORS[type] }}
                                      >
                                        {type}
                                      </span>
                                    ))}
                                    {pokeWeaknesses.length > 0 && (
                                      <>
                                        <span className="text-[10px] text-muted-foreground mx-1">→</span>
                                        {pokeWeaknesses.slice(0, 3).map((w) => (
                                          <span
                                            key={w}
                                            className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white opacity-70"
                                            style={{ backgroundColor: TYPE_COLORS[w as keyof typeof TYPE_COLORS] }}
                                          >
                                            {w}
                                          </span>
                                        ))}
                                        {pokeWeaknesses.length > 3 && (
                                          <span className="text-[10px] text-muted-foreground">+{pokeWeaknesses.length - 3}</span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Recommended Types */}
                        {allWeaknesses.size > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                              <Swords className="w-3 h-3" />
                              Recommended Types:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {Array.from(allWeaknesses).slice(0, 6).map((type) => (
                                <span
                                  key={type}
                                  className="px-2 py-0.5 rounded text-xs font-medium text-white"
                                  style={{ backgroundColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS] }}
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Reward */}
                        {trainer.reward && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Reward: ₽{trainer.reward.toLocaleString()}
                          </div>
                        )}
                        
                        {trainer.notes && (
                          <p className="text-xs text-amber-400/80 mt-2 p-2 bg-amber-500/10 rounded">
                            ⚠️ {trainer.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
