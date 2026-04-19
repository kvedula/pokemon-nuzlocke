'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { Pokemon, Nature, PokemonStats } from '@/types';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import {
  Users,
  Heart,
  Swords,
  Shield,
  Zap,
  Sparkles,
  Box,
  Skull,
  Edit,
  Save,
  X,
  Pencil,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NATURES: Nature[] = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky',
];

interface PokemonDetailSheetProps {
  pokemon: Pokemon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditFormState {
  nickname: string;
  level: string;
  nature: Nature;
  ability: string;
  heldItem: string;
  currentHp: string;
  maxHp: string;
  stats: {
    hp: string;
    attack: string;
    defense: string;
    spAtk: string;
    spDef: string;
    speed: string;
  };
  notes: string;
}

function PokemonDetailSheet({ pokemon, open, onOpenChange }: PokemonDetailSheetProps) {
  const updatePokemon = useRunStore((s) => s.updatePokemon);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);

  const species = pokemon ? POKEMON_SPECIES[pokemon.speciesId] : null;

  useEffect(() => {
    if (pokemon && isEditing) {
      setEditForm({
        nickname: pokemon.nickname,
        level: pokemon.level.toString(),
        nature: pokemon.nature,
        ability: pokemon.ability,
        heldItem: pokemon.heldItem || '',
        currentHp: pokemon.currentHp.toString(),
        maxHp: pokemon.maxHp.toString(),
        stats: {
          hp: pokemon.stats.hp.toString(),
          attack: pokemon.stats.attack.toString(),
          defense: pokemon.stats.defense.toString(),
          spAtk: pokemon.stats.spAtk.toString(),
          spDef: pokemon.stats.spDef.toString(),
          speed: pokemon.stats.speed.toString(),
        },
        notes: pokemon.notes,
      });
    }
  }, [pokemon, isEditing]);

  if (!pokemon) return null;

  const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
  const abilities = species?.abilities || [];
  if (species?.hiddenAbility) {
    abilities.push(species.hiddenAbility);
  }

  const handleSave = () => {
    if (!editForm) return;
    
    updatePokemon(pokemon.id, {
      nickname: editForm.nickname || pokemon.species,
      level: parseInt(editForm.level) || pokemon.level,
      nature: editForm.nature,
      ability: editForm.ability,
      heldItem: editForm.heldItem || null,
      currentHp: parseInt(editForm.currentHp) || pokemon.currentHp,
      maxHp: parseInt(editForm.maxHp) || pokemon.maxHp,
      stats: {
        hp: parseInt(editForm.stats.hp) || pokemon.stats.hp,
        attack: parseInt(editForm.stats.attack) || pokemon.stats.attack,
        defense: parseInt(editForm.stats.defense) || pokemon.stats.defense,
        spAtk: parseInt(editForm.stats.spAtk) || pokemon.stats.spAtk,
        spDef: parseInt(editForm.stats.spDef) || pokemon.stats.spDef,
        speed: parseInt(editForm.stats.speed) || pokemon.stats.speed,
      },
      notes: editForm.notes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleCancel(); onOpenChange(o); }}>
      <SheetContent className="w-[420px] sm:w-[540px] px-6">
        <SheetHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center">
                {species && (
                  <img
                    src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
                    alt={pokemon.species}
                    className="w-16 h-16 pixelated"
                  />
                )}
              </div>
              {pokemon.isShiny && (
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400" />
              )}
            </div>
            <div className="flex-1">
              {isEditing && editForm ? (
                <Input
                  value={editForm.nickname}
                  onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                  className="font-semibold text-lg h-8 mb-1"
                  placeholder={pokemon.species}
                />
              ) : (
                <SheetTitle className="text-left">
                  {pokemon.nickname}
                  {pokemon.status === 'dead' && (
                    <Skull className="inline w-4 h-4 ml-2 text-red-500" />
                  )}
                </SheetTitle>
              )}
              <SheetDescription className="text-left flex items-center gap-2">
                {pokemon.species} • 
                {isEditing && editForm ? (
                  <Input
                    type="number"
                    value={editForm.level}
                    onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    className="w-16 h-6 text-xs"
                    min="1"
                    max="100"
                  />
                ) : (
                  <span>Lv.{pokemon.level}</span>
                )}
              </SheetDescription>
              <div className="flex gap-1 mt-2">
                {pokemon.types.map((type) => (
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
            
            {/* Edit Toggle */}
            <div>
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <Button size="sm" onClick={handleSave} className="gap-1">
                    <Check className="w-3 h-3" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="h-[calc(100vh-200px)] mt-6 overflow-auto">
          <div className="space-y-6">
            {/* HP Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  HP
                </span>
                {isEditing && editForm ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={editForm.currentHp}
                      onChange={(e) => setEditForm({ ...editForm, currentHp: e.target.value })}
                      className="w-16 h-6 text-xs text-right"
                      min="0"
                    />
                    <span>/</span>
                    <Input
                      type="number"
                      value={editForm.maxHp}
                      onChange={(e) => setEditForm({ ...editForm, maxHp: e.target.value })}
                      className="w-16 h-6 text-xs"
                      min="1"
                    />
                  </div>
                ) : (
                  <span>{pokemon.currentHp}/{pokemon.maxHp}</span>
                )}
              </div>
              <Progress value={hpPercent} className="h-3" />
            </div>

            <Separator />

            {/* Stats */}
            <div>
              <h4 className="font-semibold mb-3">Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'attack', label: 'Attack', icon: Swords, color: 'text-orange-500' },
                  { key: 'defense', label: 'Defense', icon: Shield, color: 'text-blue-500' },
                  { key: 'spAtk', label: 'Sp. Atk', icon: Sparkles, color: 'text-purple-500' },
                  { key: 'spDef', label: 'Sp. Def', icon: Shield, color: 'text-green-500' },
                ].map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="flex items-center gap-2 text-sm">
                      <Icon className={cn('w-4 h-4', color)} />
                      {label}
                    </span>
                    {isEditing && editForm ? (
                      <Input
                        type="number"
                        value={editForm.stats[key as keyof typeof editForm.stats]}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          stats: { ...editForm.stats, [key]: e.target.value }
                        })}
                        className="w-16 h-6 text-xs text-right"
                        min="1"
                      />
                    ) : (
                      <span className="font-medium">{pokemon.stats[key as keyof PokemonStats]}</span>
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-between p-2 rounded bg-muted/50 col-span-2">
                  <span className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Speed
                  </span>
                  {isEditing && editForm ? (
                    <Input
                      type="number"
                      value={editForm.stats.speed}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        stats: { ...editForm.stats, speed: e.target.value }
                      })}
                      className="w-16 h-6 text-xs text-right"
                      min="1"
                    />
                  ) : (
                    <span className="font-medium">{pokemon.stats.speed}</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Info */}
            <div>
              <h4 className="font-semibold mb-3">Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nature</span>
                  {isEditing && editForm ? (
                    <Select 
                      value={editForm.nature} 
                      onValueChange={(v) => v && setEditForm({ ...editForm, nature: v as Nature })}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NATURES.map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{pokemon.nature}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ability</span>
                  {isEditing && editForm ? (
                    abilities.length > 0 ? (
                      <Select 
                        value={editForm.ability} 
                        onValueChange={(v) => v && setEditForm({ ...editForm, ability: v })}
                      >
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {abilities.map((a) => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={editForm.ability}
                        onChange={(e) => setEditForm({ ...editForm, ability: e.target.value })}
                        className="w-32 h-7 text-xs"
                      />
                    )
                  ) : (
                    <span>{pokemon.ability}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Held Item</span>
                  {isEditing && editForm ? (
                    <Input
                      value={editForm.heldItem}
                      onChange={(e) => setEditForm({ ...editForm, heldItem: e.target.value })}
                      className="w-32 h-7 text-xs"
                      placeholder="None"
                    />
                  ) : (
                    <span>{pokemon.heldItem || 'None'}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="capitalize">{pokemon.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Met at</span>
                  <span className="capitalize">{pokemon.encounteredAt.replace(/-/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Met Level</span>
                  <span>Lv.{pokemon.metLevel}</span>
                </div>
              </div>
            </div>

            {pokemon.status === 'dead' && pokemon.deathCause && (
              <>
                <Separator />
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold text-red-500 flex items-center gap-2 mb-2">
                    <Skull className="w-4 h-4" />
                    Cause of Death
                  </h4>
                  <p className="text-sm">{pokemon.deathCause}</p>
                  {pokemon.deathLocation && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Location: {pokemon.deathLocation}
                    </p>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Notes */}
            <div>
              <h4 className="font-semibold mb-3">Notes</h4>
              {isEditing && editForm ? (
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Add notes about this Pokémon..."
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {pokemon.notes || 'No notes yet. Click Edit to add notes.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PokemonCard({ pokemon, onClick }: { pokemon: Pokemon; onClick: () => void }) {
  const species = POKEMON_SPECIES[pokemon.speciesId];
  const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;

  return (
    <motion.button
      layout
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border bg-card text-left transition-all',
        'hover:border-primary/50 hover:shadow-lg'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={cn(
            'w-16 h-16 bg-muted rounded-lg flex items-center justify-center',
            pokemon.status === 'dead' && 'grayscale'
          )}>
            {species && (
              <img
                src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
                alt={pokemon.species}
                className="w-14 h-14 pixelated"
              />
            )}
          </div>
          {pokemon.isShiny && (
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{pokemon.nickname}</span>
            <span className="text-xs text-muted-foreground">Lv.{pokemon.level}</span>
            {pokemon.status === 'dead' && (
              <Skull className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{pokemon.species}</p>
          <div className="flex gap-1 mt-1">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-1.5 py-0.5 rounded text-[10px] text-white"
                style={{ backgroundColor: TYPE_COLORS[type] }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">HP</p>
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden mt-1">
            <div
              className={cn(
                'h-full',
                hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function TeamView() {
  const currentRun = useRunStore((s) => s.currentRun);
  const { selectedPokemonId, selectPokemon } = useUIStore();

  const selectedPokemon = selectedPokemonId && currentRun?.pokemon[selectedPokemonId]
    ? currentRun.pokemon[selectedPokemonId]
    : null;

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No active run
      </div>
    );
  }

  const partyPokemon = currentRun.party.map((id) => currentRun.pokemon[id]).filter(Boolean);
  const boxedPokemon = currentRun.box.map((id) => currentRun.pokemon[id]).filter(Boolean);
  const graveyardPokemon = currentRun.graveyard.map((id) => currentRun.pokemon[id]).filter(Boolean);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Management
        </h2>
      </div>

      <Tabs defaultValue="party" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="party" className="flex-1">
            Party ({partyPokemon.length}/6)
          </TabsTrigger>
          <TabsTrigger value="box" className="flex-1">
            Box ({boxedPokemon.length})
          </TabsTrigger>
          <TabsTrigger value="graveyard" className="flex-1">
            Graveyard ({graveyardPokemon.length})
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="party" className="p-4 space-y-3 mt-0">
            {partyPokemon.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Your party is empty.</p>
              </div>
            ) : (
              partyPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => selectPokemon(pokemon.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="box" className="p-4 space-y-3 mt-0">
            {boxedPokemon.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Box className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No Pokémon in the box.</p>
              </div>
            ) : (
              boxedPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => selectPokemon(pokemon.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="graveyard" className="p-4 space-y-3 mt-0">
            {graveyardPokemon.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Skull className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No fallen Pokémon.</p>
              </div>
            ) : (
              graveyardPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => selectPokemon(pokemon.id)}
                />
              ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <PokemonDetailSheet
        pokemon={selectedPokemon}
        open={!!selectedPokemon}
        onOpenChange={(open) => !open && selectPokemon(null)}
      />
    </div>
  );
}
