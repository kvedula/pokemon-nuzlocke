'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { Pokemon, Nature, PokemonMove } from '@/types';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { MOVES, MOVE_NAMES } from '@/data/moves';
import { cn } from '@/lib/utils';
import {
  Heart,
  Swords,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Box,
  Skull,
  Sparkles,
  Star,
  Target,
  Package,
  Pencil,
  Check,
  X,
  Move,
  ArrowLeftRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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

const STAT_COLORS: Record<string, string> = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  spAtk: 'bg-blue-500',
  spDef: 'bg-green-500',
  speed: 'bg-pink-500',
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  spAtk: 'Sp. Atk',
  spDef: 'Sp. Def',
  speed: 'Speed',
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
  stats: {
    hp: string;
    attack: string;
    defense: string;
    spAtk: string;
    spDef: string;
    speed: string;
  };
  notes: string;
  moves: string[];
}

interface PokemonDetailModalProps {
  pokemon: Pokemon | null;
  open: boolean;
  onClose: () => void;
  onMoveToBox: () => void;
  onMarkDead: () => void;
  onLevelChange: (delta: number) => void;
  onSave: (updates: Partial<Pokemon>) => void;
}

function PokemonDetailModal({ pokemon, open, onClose, onMoveToBox, onMarkDead, onLevelChange, onSave }: PokemonDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);

  useEffect(() => {
    if (pokemon && isEditing) {
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
        stats: {
          hp: pokemon.stats.hp.toString(),
          attack: pokemon.stats.attack.toString(),
          defense: pokemon.stats.defense.toString(),
          spAtk: pokemon.stats.spAtk.toString(),
          spDef: pokemon.stats.spDef.toString(),
          speed: pokemon.stats.speed.toString(),
        },
        notes: pokemon.notes,
        moves: pokemon.moves?.map(m => m.name) || [],
      });
    }
  }, [pokemon, isEditing]);

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setEditForm(null);
    }
  }, [open]);

  if (!pokemon) return null;
  
  const species = POKEMON_SPECIES[pokemon.speciesId];
  const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
  const maxStat = Math.max(
    pokemon.stats.hp,
    pokemon.stats.attack,
    pokemon.stats.defense,
    pokemon.stats.spAtk,
    pokemon.stats.spDef,
    pokemon.stats.speed,
    150
  );

  const abilities = species?.abilities || [];
  if (species?.hiddenAbility) {
    abilities.push(species.hiddenAbility);
  }

  const handleSave = () => {
    if (!editForm) return;
    
    const newSpecies = POKEMON_SPECIES[editForm.speciesId];
    const speciesChanged = editForm.speciesId !== pokemon.speciesId;
    
    // Convert move names to PokemonMove objects
    const moves: PokemonMove[] = editForm.moves
      .filter(name => name && MOVES[name])
      .map(name => {
        const moveData = MOVES[name];
        return {
          name: moveData.name,
          type: moveData.type,
          category: moveData.category,
          power: moveData.power,
          accuracy: moveData.accuracy,
          pp: moveData.pp,
          currentPp: moveData.pp,
        };
      });
    
    onSave({
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
      stats: {
        hp: parseInt(editForm.stats.hp) || pokemon.stats.hp,
        attack: parseInt(editForm.stats.attack) || pokemon.stats.attack,
        defense: parseInt(editForm.stats.defense) || pokemon.stats.defense,
        spAtk: parseInt(editForm.stats.spAtk) || pokemon.stats.spAtk,
        spDef: parseInt(editForm.stats.spDef) || pokemon.stats.spDef,
        speed: parseInt(editForm.stats.speed) || pokemon.stats.speed,
      },
      notes: editForm.notes,
      moves,
    });
    setIsEditing(false);
    setEditForm(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pr-8">
          <div className="flex items-start gap-4">
            {/* Sprite */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                {species && (
                  <img
                    src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
                    alt={pokemon.species}
                    className="w-16 h-16 pixelated drop-shadow-lg"
                  />
                )}
              </div>
              {pokemon.isShiny && (
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400" />
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              {isEditing && editForm ? (
                <Input
                  value={editForm.nickname}
                  onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                  className="font-bold text-lg h-8 mb-1"
                />
              ) : (
                <DialogTitle className="text-xl">{pokemon.nickname}</DialogTitle>
              )}
              
              {isEditing && editForm ? (
                <Select
                  value={editForm.speciesId.toString()}
                  onValueChange={(v) => v && setEditForm({ ...editForm, speciesId: parseInt(v) })}
                >
                  <SelectTrigger className="h-7 text-xs w-32">
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
              ) : (
                <DialogDescription>{pokemon.species}</DialogDescription>
              )}
              
              {/* Level with +/- controls */}
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onLevelChange(-1)}
                  disabled={pokemon.level <= 1}
                >
                  <span className="text-sm font-bold">−</span>
                </Button>
                {isEditing && editForm ? (
                  <Input
                    type="number"
                    value={editForm.level}
                    onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    className="w-16 h-6 text-center text-sm"
                    min="1"
                    max="100"
                  />
                ) : (
                  <span className="font-bold text-sm min-w-[50px] text-center">
                    Lv.{pokemon.level}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onLevelChange(1)}
                  disabled={pokemon.level >= 100}
                >
                  <span className="text-sm font-bold">+</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1.5">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white"
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                
                {/* Edit Toggle - Inline with types */}
                <div className="ml-auto">
                  {isEditing ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 px-2 text-xs">
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} className="gap-1 h-6 px-2 text-xs">
                        <Check className="w-3 h-3" />
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="gap-1 h-6 px-2 text-xs">
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* HP Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-400" />
                HP
              </span>
              {isEditing && editForm ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={editForm.currentHp}
                    onChange={(e) => setEditForm({ ...editForm, currentHp: e.target.value })}
                    className="w-14 h-6 text-xs text-center"
                  />
                  <span>/</span>
                  <Input
                    type="number"
                    value={editForm.maxHp}
                    onChange={(e) => setEditForm({ ...editForm, maxHp: e.target.value })}
                    className="w-14 h-6 text-xs text-center"
                  />
                </div>
              ) : (
                <span className="font-medium">{pokemon.currentHp} / {pokemon.maxHp}</span>
              )}
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
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Stats</h4>
            {isEditing && editForm ? (
              <div className="grid grid-cols-3 gap-2">
                {(['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'] as const).map((stat) => (
                  <div key={stat} className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground w-8">{STAT_LABELS[stat].slice(0, 3)}</span>
                    <Input
                      type="number"
                      value={editForm.stats[stat]}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        stats: { ...editForm.stats, [stat]: e.target.value }
                      })}
                      className="h-6 text-xs"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {(['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'] as const).map((stat) => {
                  const value = pokemon.stats[stat];
                  const percent = (value / maxStat) * 100;
                  
                  return (
                    <div key={stat} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-14">{STAT_LABELS[stat]}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full', STAT_COLORS[stat])}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, delay: 0.05 }}
                        />
                      </div>
                      <span className="text-xs font-medium w-6 text-right">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-muted/50 rounded-lg p-2">
              <span className="text-muted-foreground text-[10px]">Nature</span>
              {isEditing && editForm ? (
                <Select
                  value={editForm.nature}
                  onValueChange={(v) => v && setEditForm({ ...editForm, nature: v as Nature })}
                >
                  <SelectTrigger className="h-6 text-xs mt-0.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {NATURES.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-sm">{pokemon.nature}</p>
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <span className="text-muted-foreground text-[10px]">Ability</span>
              {isEditing && editForm ? (
                abilities.length > 0 ? (
                  <Select
                    value={editForm.ability}
                    onValueChange={(v) => v && setEditForm({ ...editForm, ability: v })}
                  >
                    <SelectTrigger className="h-6 text-xs mt-0.5">
                      <SelectValue placeholder="Select" />
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
                    className="h-6 text-xs mt-0.5"
                  />
                )
              ) : (
                <p className="font-medium text-sm">{pokemon.ability || 'Unknown'}</p>
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <span className="text-muted-foreground text-[10px]">Held Item</span>
              {isEditing && editForm ? (
                <Input
                  value={editForm.heldItem}
                  onChange={(e) => setEditForm({ ...editForm, heldItem: e.target.value })}
                  placeholder="None"
                  className="h-6 text-xs mt-0.5"
                />
              ) : (
                <p className="font-medium text-sm flex items-center gap-1">
                  {pokemon.heldItem ? (
                    <>
                      <Package className="w-3 h-3" />
                      {pokemon.heldItem}
                    </>
                  ) : (
                    'None'
                  )}
                </p>
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <span className="text-muted-foreground text-[10px]">Gender</span>
              {isEditing && editForm ? (
                <Select
                  value={editForm.gender}
                  onValueChange={(v) => v && setEditForm({ ...editForm, gender: v as 'male' | 'female' | 'genderless' })}
                >
                  <SelectTrigger className="h-6 text-xs mt-0.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="genderless">Genderless</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-sm capitalize">{pokemon.gender}</p>
              )}
            </div>
          </div>

          {/* Moves */}
          <div className="bg-muted/30 rounded-lg p-2">
            <span className="text-muted-foreground text-[10px]">Moves</span>
            {isEditing && editForm ? (
              <div className="space-y-1 mt-1">
                {[0, 1, 2, 3].map((i) => (
                  <Select
                    key={i}
                    value={editForm.moves[i] || ''}
                    onValueChange={(v) => {
                      const newMoves = [...editForm.moves];
                      newMoves[i] = v || '';
                      setEditForm({ ...editForm, moves: newMoves });
                    }}
                  >
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue placeholder={`Move ${i + 1}`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      <SelectItem value="">-- None --</SelectItem>
                      {MOVE_NAMES.map(name => {
                        const move = MOVES[name];
                        return (
                          <SelectItem key={name} value={name}>
                            <span className="flex items-center gap-2">
                              <span 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: TYPE_COLORS[move.type] }}
                              />
                              {name} ({move.type})
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            ) : (
              <div className="space-y-0.5 mt-1">
                {pokemon.moves && pokemon.moves.length > 0 ? (
                  pokemon.moves.map((move, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <span 
                        className="w-2 h-2 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: TYPE_COLORS[move.type] }}
                      />
                      <span>{move.name}</span>
                      {move.power && (
                        <span className="text-muted-foreground">({move.power})</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No moves set</p>
                )}
              </div>
            )}
          </div>

          {/* Met Info */}
          <div className="bg-muted/30 rounded-lg p-2 text-sm">
            <p className="text-muted-foreground text-xs">
              Met at <span className="text-foreground font-medium">{pokemon.encounteredAt || 'Unknown'}</span> at Lv.{pokemon.metLevel}
            </p>
          </div>

          {/* Notes */}
          <div className="bg-muted/30 rounded-lg p-2 text-sm">
            <span className="text-muted-foreground text-[10px]">Notes</span>
            {isEditing && editForm ? (
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes..."
                rows={2}
                className="text-xs mt-1"
              />
            ) : (
              <p className="mt-0.5 text-xs">{pokemon.notes || 'No notes'}</p>
            )}
          </div>
        </div>

        {!isEditing && (
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={onMoveToBox} className="gap-1" size="sm">
              <Box className="w-3 h-3" />
              Move to Box
            </Button>
            <Button variant="outline" onClick={onMarkDead} className="gap-1 text-red-500 hover:text-red-600" size="sm">
              <Skull className="w-3 h-3" />
              Mark Dead
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
  isSelected: boolean;
  swapTargetId: string | null;
  onSelect: () => void;
  onClick: () => void;
}

function PokemonCard({ pokemon, index, isSelected, swapTargetId, onSelect, onClick }: PokemonCardProps) {
  const species = POKEMON_SPECIES[pokemon.speciesId];
  const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500';
  const isSwapTarget = swapTargetId !== null && swapTargetId !== pokemon.id;

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'group relative p-4 pt-6 rounded-xl border bg-gradient-to-b from-card to-card/80',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-primary border-primary shadow-lg shadow-primary/20',
        isSwapTarget && 'hover:ring-2 hover:ring-green-500 hover:border-green-500',
        !isSelected && !isSwapTarget && 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
      )}
    >
      {/* Slot badge */}
      <div className={cn(
        "absolute top-1.5 left-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {index + 1}
      </div>

      {/* Swap button - shows when another card is selected */}
      {isSwapTarget && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-green-600 transition-colors shadow-lg z-10"
        >
          <ArrowLeftRight className="w-3 h-3" />
          Swap
        </button>
      )}

      {/* Select for swap button */}
      {!isSwapTarget && !isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground shadow-lg"
          title="Select to swap position"
        >
          <Move className="w-3 h-3" />
        </button>
      )}

      {/* Cancel selection button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          title="Cancel selection"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Clickable area for details */}
      <button 
        onClick={onClick}
        className="w-full text-center focus:outline-none"
      >
        {/* Sprite */}
        <div className="relative w-16 h-16 mx-auto mb-2">
          {species && (
            <img
              src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
              alt={pokemon.species}
              className="w-full h-full pixelated drop-shadow-md"
            />
          )}
          {pokemon.isShiny && (
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
          )}
        </div>

        {/* Name & Level */}
        <h4 className="font-semibold text-sm truncate">{pokemon.nickname}</h4>
        <p className="text-[10px] text-muted-foreground">Lv.{pokemon.level}</p>

        {/* Types */}
        <div className="flex justify-center gap-1.5 mb-3 mt-1">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* HP Bar */}
        <div className="space-y-1 mb-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all', hpColor)}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {pokemon.currentHp}/{pokemon.maxHp}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground border-t pt-2">
          <span className="flex items-center gap-1">
            <Swords className="w-3 h-3 text-orange-400" />
            {pokemon.stats.attack}
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-yellow-400" />
            {pokemon.stats.defense}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-pink-400" />
            {pokemon.stats.speed}
          </span>
        </div>
      </button>
    </motion.div>
  );
}

export function PartyGrid() {
  const currentRun = useRunStore((s) => s.currentRun);
  const reorderParty = useRunStore((s) => s.reorderParty);
  const movePokemonToBox = useRunStore((s) => s.movePokemonToBox);
  const markPokemonDead = useRunStore((s) => s.markPokemonDead);
  const updatePokemon = useRunStore((s) => s.updatePokemon);
  
  const [expanded, setExpanded] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [swapSourceId, setSwapSourceId] = useState<string | null>(null);
  const [deathDialogOpen, setDeathDialogOpen] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [deathLocation, setDeathLocation] = useState('');

  const partyIds = currentRun?.party || [];
  
  const partyPokemon = useMemo(() => {
    if (!currentRun) return [];
    return partyIds
      .map((id) => currentRun.pokemon[id])
      .filter(Boolean);
  }, [currentRun?.pokemon, partyIds]);

  const avgLevel = partyPokemon.length > 0
    ? Math.round(partyPokemon.reduce((sum, p) => sum + p.level, 0) / partyPokemon.length)
    : 0;

  const handleSwapSelect = (pokemonId: string) => {
    if (swapSourceId === null) {
      // First selection
      setSwapSourceId(pokemonId);
    } else if (swapSourceId === pokemonId) {
      // Deselect
      setSwapSourceId(null);
    } else {
      // Swap the two
      const sourceIndex = partyIds.indexOf(swapSourceId);
      const targetIndex = partyIds.indexOf(pokemonId);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newOrder = [...partyIds];
        [newOrder[sourceIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[sourceIndex]];
        reorderParty(newOrder);
      }
      setSwapSourceId(null);
    }
  };

  const handleLevelChange = (pokemonId: string, delta: number) => {
    const pokemon = currentRun?.pokemon[pokemonId];
    if (!pokemon) return;
    
    const newLevel = Math.max(1, Math.min(100, pokemon.level + delta));
    updatePokemon(pokemonId, { level: newLevel });
    
    // Update selected pokemon state if it's the same one
    if (selectedPokemon?.id === pokemonId) {
      setSelectedPokemon({ ...selectedPokemon, level: newLevel });
    }
  };

  const handleMoveToBox = () => {
    if (selectedPokemon) {
      movePokemonToBox(selectedPokemon.id);
      setSelectedPokemon(null);
    }
  };

  const handleOpenDeathDialog = () => {
    setDeathDialogOpen(true);
  };

  const handleConfirmDeath = () => {
    if (selectedPokemon) {
      markPokemonDead(selectedPokemon.id, deathCause || 'Unknown', deathLocation || 'Unknown');
      setSelectedPokemon(null);
      setDeathDialogOpen(false);
      setDeathCause('');
      setDeathLocation('');
    }
  };

  if (!currentRun) return null;

  return (
    <>
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <div className="p-4 rounded-xl border bg-card">
          <CollapsibleTrigger className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Your Team</h3>
              <Badge variant="secondary">{partyPokemon.length}/6</Badge>
              {avgLevel > 0 && (
                <span className="text-xs text-muted-foreground">Avg Lv.{avgLevel}</span>
              )}
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent>
            {partyPokemon.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                <Swords className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Your party is empty</p>
                <p className="text-xs mt-1">Catch some Pokémon to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <AnimatePresence mode="popLayout">
                  {partyPokemon.map((pokemon, index) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      index={index}
                      isSelected={swapSourceId === pokemon.id}
                      swapTargetId={swapSourceId}
                      onSelect={() => handleSwapSelect(pokemon.id)}
                      onClick={() => setSelectedPokemon(pokemon)}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Empty slots */}
                {Array.from({ length: 6 - partyPokemon.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="rounded-xl border border-dashed border-muted-foreground/20 bg-muted/20 flex flex-col items-center justify-center min-h-[200px]"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center mb-2">
                      <span className="text-lg text-muted-foreground/30">+</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50">Empty Slot</span>
                  </div>
                ))}
              </div>
            )}
            
            {partyPokemon.length > 0 && (
              <p className="text-[10px] text-muted-foreground text-center mt-3">
                {swapSourceId ? 'Click another Pokémon to swap positions' : 'Click move icon to swap • Click card for details'}
              </p>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Pokemon Detail Modal */}
      <PokemonDetailModal
        pokemon={selectedPokemon}
        open={!!selectedPokemon && !deathDialogOpen}
        onClose={() => setSelectedPokemon(null)}
        onMoveToBox={handleMoveToBox}
        onMarkDead={handleOpenDeathDialog}
        onLevelChange={(delta) => selectedPokemon && handleLevelChange(selectedPokemon.id, delta)}
        onSave={(updates) => {
          if (selectedPokemon) {
            updatePokemon(selectedPokemon.id, updates);
            setSelectedPokemon({ ...selectedPokemon, ...updates } as Pokemon);
          }
        }}
      />

      {/* Death Confirmation Dialog */}
      <Dialog open={deathDialogOpen} onOpenChange={setDeathDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Skull className="w-5 h-5 text-destructive" />
              Mark {selectedPokemon?.nickname} as Dead?
            </DialogTitle>
            <DialogDescription>
              This will move {selectedPokemon?.nickname} to the graveyard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cause of Death</label>
              <Input
                placeholder="e.g., Critical hit from Starmie"
                value={deathCause}
                onChange={(e) => setDeathCause(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="e.g., Cerulean Gym"
                value={deathLocation}
                onChange={(e) => setDeathLocation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeathDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeath}>
              Confirm Death
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
