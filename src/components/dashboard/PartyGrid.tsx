'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { Pokemon } from '@/types';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import {
  Heart,
  Swords,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Box,
  Skull,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface CompactPokemonCardProps {
  pokemon: Pokemon;
  index: number;
  onMoveToBox: () => void;
  onMarkDead: (cause: string, location: string) => void;
}

function CompactPokemonCard({ pokemon, index, onMoveToBox, onMarkDead }: CompactPokemonCardProps) {
  const [deathDialogOpen, setDeathDialogOpen] = React.useState(false);
  const [deathCause, setDeathCause] = React.useState('');
  const [deathLocation, setDeathLocation] = React.useState('');
  
  const species = POKEMON_SPECIES[pokemon.speciesId];
  const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500';

  const handleConfirmDeath = () => {
    onMarkDead(deathCause || 'Unknown cause', deathLocation || 'Unknown location');
    setDeathDialogOpen(false);
    setDeathCause('');
    setDeathLocation('');
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          'group relative p-3 rounded-xl border bg-card',
          'hover:border-primary/50 transition-all duration-200',
          'hover:shadow-lg hover:shadow-primary/5'
        )}
      >
        {/* Slot badge */}
        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
          {index + 1}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onMoveToBox}>
              <Box className="w-4 h-4 mr-2" />
              Move to Box
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeathDialogOpen(true)}
            >
              <Skull className="w-4 h-4 mr-2" />
              Mark as Dead
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sprite */}
        <div className="relative w-12 h-12 mx-auto mb-2">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {species ? (
              <img
                src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
                alt={pokemon.species}
                className="w-10 h-10 pixelated"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
            )}
          </div>
          {pokemon.isShiny && (
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
          )}
        </div>

        {/* Name & Level */}
        <div className="text-center mb-2">
          <p className="font-semibold text-sm truncate">{pokemon.nickname}</p>
          <p className="text-[10px] text-muted-foreground">Lv.{pokemon.level}</p>
        </div>

        {/* Types */}
        <div className="flex justify-center gap-1 mb-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* HP Bar */}
        <div className="space-y-0.5">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-300', hpColor)}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <p className="text-[9px] text-center text-muted-foreground">
            {pokemon.currentHp}/{pokemon.maxHp}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-2 mt-2 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Swords className="w-2.5 h-2.5" />
            {pokemon.stats.attack}
          </span>
          <span className="flex items-center gap-0.5">
            <Shield className="w-2.5 h-2.5" />
            {pokemon.stats.defense}
          </span>
          <span className="flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5" />
            {pokemon.stats.speed}
          </span>
        </div>
      </motion.div>

      {/* Death Dialog */}
      <Dialog open={deathDialogOpen} onOpenChange={setDeathDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Skull className="w-5 h-5 text-destructive" />
              Mark {pokemon.nickname} as Dead?
            </DialogTitle>
            <DialogDescription>
              This will move {pokemon.nickname} to the graveyard.
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

export function PartyGrid() {
  const currentRun = useRunStore((s) => s.currentRun);
  const movePokemonToBox = useRunStore((s) => s.movePokemonToBox);
  const markPokemonDead = useRunStore((s) => s.markPokemonDead);
  const [expanded, setExpanded] = React.useState(true);

  const partyPokemon = React.useMemo(() => {
    if (!currentRun) return [];
    return currentRun.party
      .map((id) => currentRun.pokemon[id])
      .filter(Boolean);
  }, [currentRun]);

  const avgLevel = partyPokemon.length > 0
    ? Math.round(partyPokemon.reduce((sum, p) => sum + p.level, 0) / partyPokemon.length)
    : 0;

  if (!currentRun) return null;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="p-4 rounded-xl border bg-card">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity">
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
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {partyPokemon.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
              <Swords className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Your party is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <AnimatePresence mode="popLayout">
                {partyPokemon.map((pokemon, index) => (
                  <CompactPokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    index={index}
                    onMoveToBox={() => movePokemonToBox(pokemon.id)}
                    onMarkDead={(cause, location) => markPokemonDead(pokemon.id, cause, location)}
                  />
                ))}
              </AnimatePresence>
              
              {/* Empty slots */}
              {Array.from({ length: 6 - partyPokemon.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="p-3 rounded-xl border-2 border-dashed border-muted flex items-center justify-center min-h-[140px]"
                >
                  <span className="text-xs text-muted-foreground">Empty</span>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
