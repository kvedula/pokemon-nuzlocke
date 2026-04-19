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
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Package,
  Star,
  Target,
  Move,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const NATURES: Nature[] = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky',
];

const STAT_COLORS: Record<string, string> = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  spAtk: 'bg-blue-500',
  spDef: 'bg-green-500',
  speed: 'bg-pink-500',
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  hp: <Heart className="w-3 h-3" />,
  attack: <Swords className="w-3 h-3" />,
  defense: <Shield className="w-3 h-3" />,
  spAtk: <Zap className="w-3 h-3" />,
  spDef: <Star className="w-3 h-3" />,
  speed: <Target className="w-3 h-3" />,
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  spAtk: 'SP.A',
  spDef: 'SP.D',
  speed: 'SPD',
};

interface EditFormState {
  nickname: string;
  speciesId: number;
  level: string;
  nature: Nature;
  ability: string;
  heldItem: string;
  currentHp: string;
  maxHp: string;
  gender: 'male' | 'female' | 'genderless';
  metLevel: string;
  encounteredAt: string;
  isShiny: boolean;
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

interface PokemonHeroCardProps {
  pokemon: Pokemon;
  index: number;
  isParty?: boolean;
}

function PokemonHeroCard({ pokemon, index, isParty = false }: PokemonHeroCardProps) {
  const updatePokemon = useRunStore((s) => s.updatePokemon);
  const movePokemonToBox = useRunStore((s) => s.movePokemonToBox);
  const movePokemonToParty = useRunStore((s) => s.movePokemonToParty);
  const markPokemonDead = useRunStore((s) => s.markPokemonDead);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [deathDialogOpen, setDeathDialogOpen] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [deathLocation, setDeathLocation] = useState('');

  const species = POKEMON_SPECIES[pokemon.speciesId];
  const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
  const abilities = species?.abilities || [];
  if (species?.hiddenAbility) {
    abilities.push(species.hiddenAbility);
  }

  useEffect(() => {
    if (isEditing && pokemon) {
      setEditForm({
        nickname: pokemon.nickname,
        speciesId: pokemon.speciesId,
        level: pokemon.level.toString(),
        nature: pokemon.nature,
        ability: pokemon.ability,
        heldItem: pokemon.heldItem || '',
        currentHp: pokemon.currentHp.toString(),
        maxHp: pokemon.maxHp.toString(),
        gender: pokemon.gender,
        metLevel: pokemon.metLevel.toString(),
        encounteredAt: pokemon.encounteredAt,
        isShiny: pokemon.isShiny,
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
  }, [isEditing, pokemon]);

  const handleSave = () => {
    if (!editForm) return;
    
    const newSpecies = POKEMON_SPECIES[editForm.speciesId];
    const speciesChanged = editForm.speciesId !== pokemon.speciesId;
    
    updatePokemon(pokemon.id, {
      nickname: editForm.nickname || pokemon.species,
      speciesId: editForm.speciesId,
      species: newSpecies?.name || pokemon.species,
      types: speciesChanged && newSpecies ? newSpecies.types : pokemon.types,
      level: parseInt(editForm.level) || pokemon.level,
      nature: editForm.nature,
      ability: editForm.ability,
      heldItem: editForm.heldItem || null,
      currentHp: parseInt(editForm.currentHp) || pokemon.currentHp,
      maxHp: parseInt(editForm.maxHp) || pokemon.maxHp,
      gender: editForm.gender,
      metLevel: parseInt(editForm.metLevel) || pokemon.metLevel,
      encounteredAt: editForm.encounteredAt,
      isShiny: editForm.isShiny,
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
    setEditForm(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleMarkDead = () => {
    markPokemonDead(pokemon.id, deathCause, deathLocation);
    setDeathDialogOpen(false);
    setDeathCause('');
    setDeathLocation('');
  };

  const maxStat = Math.max(
    pokemon.stats.hp,
    pokemon.stats.attack,
    pokemon.stats.defense,
    pokemon.stats.spAtk,
    pokemon.stats.spDef,
    pokemon.stats.speed
  );

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          'rounded-2xl border bg-gradient-to-br from-card to-card/80 overflow-hidden',
          'hover:shadow-xl hover:shadow-primary/5 transition-all duration-300',
          pokemon.status === 'dead' && 'opacity-60'
        )}
      >
        {/* Main Card Content */}
        <div className="p-5">
          {/* Header Row */}
          <div className="flex items-start gap-4">
            {/* Sprite */}
            <div className="relative flex-shrink-0">
              {isParty && (
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center z-10 shadow-lg">
                  {index + 1}
                </div>
              )}
              <div className={cn(
                'w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center relative',
                pokemon.status === 'dead' && 'grayscale'
              )}>
                {species && (
                  <img
                    src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
                    alt={pokemon.species}
                    className="w-20 h-20 pixelated drop-shadow-lg"
                  />
                )}
                {pokemon.isShiny && (
                  <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 drop-shadow-lg" />
                )}
                {pokemon.status === 'dead' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                    <Skull className="w-8 h-8 text-red-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg truncate">{pokemon.nickname}</h3>
                <Badge variant="outline" className="text-xs">
                  Lv.{pokemon.level}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{pokemon.species}</p>
              
              {/* Types */}
              <div className="flex gap-1.5 mb-3">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white shadow-sm"
                    style={{ backgroundColor: TYPE_COLORS[type] }}
                  >
                    {type}
                  </span>
                ))}
              </div>

              {/* HP Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-3 h-3 text-red-400" />
                    HP
                  </span>
                  <span className="font-medium">{pokemon.currentHp}/{pokemon.maxHp}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      hpPercent > 50 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                      hpPercent > 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                      'bg-gradient-to-r from-red-500 to-red-400'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${hpPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {(['attack', 'defense', 'speed', 'spAtk', 'spDef', 'hp'] as const).map((stat) => {
              const value = pokemon.stats[stat];
              const percent = (value / Math.max(maxStat, 100)) * 100;
              
              return (
                <Tooltip key={stat}>
                  <TooltipTrigger className="bg-muted/50 rounded-lg p-2 text-center hover:bg-muted transition-colors w-full">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        {STAT_ICONS[stat]}
                        <span>{STAT_LABELS[stat]}</span>
                      </div>
                      <div className="font-bold text-sm">{value}</div>
                      <div className="h-1 bg-muted rounded-full mt-1 overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full', STAT_COLORS[stat])}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{STAT_LABELS[stat]}: {value}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Quick Info Row */}
          <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{pokemon.ability || 'No ability'}</span>
            </div>
            {pokemon.heldItem && (
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span>{pokemon.heldItem}</span>
              </div>
            )}
            <div className="ml-auto">
              <span className="text-muted-foreground/70">{pokemon.nature}</span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-3 gap-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                More
              </>
            )}
          </Button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 border-t pt-4 space-y-4">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {!isEditing && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="gap-1"
                      >
                        <Swords className="w-3 h-3" />
                        Edit
                      </Button>
                      {pokemon.status === 'active' && isParty && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => movePokemonToBox(pokemon.id)}
                          className="gap-1"
                        >
                          <Box className="w-3 h-3" />
                          To Box
                        </Button>
                      )}
                      {pokemon.status === 'boxed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => movePokemonToParty(pokemon.id)}
                          className="gap-1"
                        >
                          <Move className="w-3 h-3" />
                          To Party
                        </Button>
                      )}
                      {pokemon.status !== 'dead' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeathDialogOpen(true)}
                          className="gap-1 text-red-500 hover:text-red-600"
                        >
                          <Skull className="w-3 h-3" />
                          Mark Dead
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Information Display (when not editing) */}
                {!isEditing && (
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-sm">Information</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Nature</span>
                      <span className="text-right">{pokemon.nature}</span>
                      
                      <span className="text-muted-foreground">Ability</span>
                      <span className="text-right">{pokemon.ability || 'Unknown'}</span>
                      
                      <span className="text-muted-foreground">Held Item</span>
                      <span className="text-right">{pokemon.heldItem || 'None'}</span>
                      
                      <span className="text-muted-foreground">Gender</span>
                      <span className="text-right capitalize">{pokemon.gender}</span>
                      
                      <span className="text-muted-foreground">Met at</span>
                      <span className="text-right">{pokemon.encounteredAt || 'Unknown'}</span>
                      
                      <span className="text-muted-foreground">Met Level</span>
                      <span className="text-right">Lv.{pokemon.metLevel}</span>
                      
                      {pokemon.isShiny && (
                        <>
                          <span className="text-muted-foreground">Special</span>
                          <span className="text-right flex items-center justify-end gap-1">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            Shiny
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                {isEditing && editForm && (
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Nickname</label>
                        <Input
                          value={editForm.nickname}
                          onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Level</label>
                        <Input
                          type="number"
                          value={editForm.level}
                          onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                          min="1"
                          max="100"
                          className="h-8"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Species</label>
                        <Select
                          value={editForm.speciesId.toString()}
                          onValueChange={(v) => v && setEditForm({ ...editForm, speciesId: parseInt(v) })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {Object.values(POKEMON_SPECIES).slice(0, 151).map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Nature</label>
                        <Select
                          value={editForm.nature}
                          onValueChange={(v) => v && setEditForm({ ...editForm, nature: v as Nature })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {NATURES.map((n) => (
                              <SelectItem key={n} value={n}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Ability</label>
                        {abilities.length > 0 ? (
                          <Select
                            value={editForm.ability}
                            onValueChange={(v) => v && setEditForm({ ...editForm, ability: v })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select ability" />
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
                            className="h-8"
                          />
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Held Item</label>
                        <Input
                          value={editForm.heldItem}
                          onChange={(e) => setEditForm({ ...editForm, heldItem: e.target.value })}
                          placeholder="None"
                          className="h-8"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                        <Select
                          value={editForm.gender}
                          onValueChange={(v) => v && setEditForm({ ...editForm, gender: v as 'male' | 'female' | 'genderless' })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="genderless">Genderless</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Met Level</label>
                        <Input
                          type="number"
                          value={editForm.metLevel}
                          onChange={(e) => setEditForm({ ...editForm, metLevel: e.target.value })}
                          min="1"
                          max="100"
                          className="h-8"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer h-8">
                          <input
                            type="checkbox"
                            checked={editForm.isShiny}
                            onChange={(e) => setEditForm({ ...editForm, isShiny: e.target.checked })}
                            className="w-4 h-4 rounded border-muted-foreground"
                          />
                          <span className="text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            Shiny
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Met at Location</label>
                      <Input
                        value={editForm.encounteredAt}
                        onChange={(e) => setEditForm({ ...editForm, encounteredAt: e.target.value })}
                        placeholder="Where was this Pokémon caught?"
                        className="h-8"
                      />
                    </div>

                    {/* HP */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">HP</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editForm.currentHp}
                          onChange={(e) => setEditForm({ ...editForm, currentHp: e.target.value })}
                          className="h-8 w-20"
                        />
                        <span className="text-muted-foreground">/</span>
                        <Input
                          type="number"
                          value={editForm.maxHp}
                          onChange={(e) => setEditForm({ ...editForm, maxHp: e.target.value })}
                          className="h-8 w-20"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Stats</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'] as const).map((stat) => (
                          <div key={stat} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-10">{STAT_LABELS[stat]}</span>
                            <Input
                              type="number"
                              value={editForm.stats[stat]}
                              onChange={(e) => setEditForm({
                                ...editForm,
                                stats: { ...editForm.stats, [stat]: e.target.value }
                              })}
                              className="h-7 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                      <Textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        placeholder="Add notes..."
                        rows={2}
                        className="text-sm"
                      />
                    </div>

                    {/* Save/Cancel */}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} className="gap-1">
                        <Check className="w-3 h-3" />
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancel}>
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Notes (when not editing) */}
                {!isEditing && pokemon.notes && (
                  <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                    {pokemon.notes}
                  </div>
                )}

                {/* Death info */}
                {pokemon.status === 'dead' && (
                  <div className="text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 font-medium">Fallen</p>
                    {pokemon.deathCause && (
                      <p className="text-muted-foreground">Cause: {pokemon.deathCause}</p>
                    )}
                    {pokemon.deathLocation && (
                      <p className="text-muted-foreground">Location: {pokemon.deathLocation}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Death Dialog */}
      <Dialog open={deathDialogOpen} onOpenChange={setDeathDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark {pokemon.nickname} as Dead</DialogTitle>
            <DialogDescription>
              Record what happened to {pokemon.nickname}. This will move them to the graveyard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Cause of Death</label>
              <Input
                value={deathCause}
                onChange={(e) => setDeathCause(e.target.value)}
                placeholder="e.g., Critical hit from Geodude's Rock Throw"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                value={deathLocation}
                onChange={(e) => setDeathLocation(e.target.value)}
                placeholder="e.g., Mt. Moon"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeathDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleMarkDead}>
                Confirm Death
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EmptySlot({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 min-h-[200px] flex flex-col items-center justify-center"
    >
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center mb-3">
        <span className="text-2xl text-muted-foreground/30">+</span>
      </div>
      <span className="text-sm text-muted-foreground/50">Empty Slot {index + 1}</span>
    </motion.div>
  );
}

export function TeamView() {
  const currentRun = useRunStore((s) => s.currentRun);

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
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          Team Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your party, PC box, and fallen Pokémon
        </p>
      </div>

      <Tabs defaultValue="party" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-6 mt-4 p-1">
          <TabsTrigger value="party" className="flex-1 gap-2">
            <Swords className="w-4 h-4" />
            Party ({partyPokemon.length}/6)
          </TabsTrigger>
          <TabsTrigger value="box" className="flex-1 gap-2">
            <Box className="w-4 h-4" />
            Box ({boxedPokemon.length})
          </TabsTrigger>
          <TabsTrigger value="graveyard" className="flex-1 gap-2">
            <Skull className="w-4 h-4" />
            Graveyard ({graveyardPokemon.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto min-h-0">
          <TabsContent value="party" className="p-6 pb-24 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {partyPokemon.map((pokemon, index) => (
                  <PokemonHeroCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    index={index}
                    isParty
                  />
                ))}
              </AnimatePresence>
              {Array.from({ length: 6 - partyPokemon.length }).map((_, i) => (
                <EmptySlot key={`empty-${i}`} index={partyPokemon.length + i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="box" className="p-6 pb-24 mt-0">
            {boxedPokemon.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Box className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No Pokémon in the box</p>
                <p className="text-sm mt-1">Move Pokémon here when your party is full</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {boxedPokemon.map((pokemon, index) => (
                    <PokemonHeroCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="graveyard" className="p-6 pb-24 mt-0">
            {graveyardPokemon.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Skull className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No fallen Pokémon</p>
                <p className="text-sm mt-1">Keep it that way!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {graveyardPokemon.map((pokemon, index) => (
                    <PokemonHeroCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
