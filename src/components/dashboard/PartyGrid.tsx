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
          'group relative p-4 pt-5 rounded-xl border bg-gradient-to-b from-card to-card/80',
          'hover:border-primary/50 transition-all duration-200',
          'hover:shadow-lg hover:shadow-primary/10'
        )}
      >
        {/* Slot badge - positioned inside the card */}
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
          {index + 1}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
              >
                <MoreHorizontal className="h-4 w-4" />
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
        <div className="relative w-16 h-16 mx-auto mb-3">
          <div className="w-16 h-16 bg-muted/50 rounded-xl flex items-center justify-center overflow-hidden">
            {species ? (
              <img
                src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
                alt={pokemon.species}
                className="w-14 h-14 pixelated"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 bg-muted-foreground/20 rounded-full" />
            )}
          </div>
          {pokemon.isShiny && (
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
          )}
        </div>

        {/* Name & Level */}
        <div className="text-center mb-3">
          <p className="font-bold text-sm truncate">{pokemon.nickname}</p>
          <p className="text-xs text-muted-foreground">Lv.{pokemon.level}</p>
        </div>

        {/* Types */}
        <div className="flex justify-center gap-1.5 mb-3">
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
        <div className="mb-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-300', hpColor)}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-1">
            {pokemon.currentHp}/{pokemon.maxHp}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground border-t pt-2">
          <span className="flex items-center gap-1">
            <Swords className="w-3 h-3 text-red-400" />
            {pokemon.stats.attack}
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" />
            {pokemon.stats.defense}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
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
                  <CompactPokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    index={index}
                    onMoveToBox={() => movePokemonToBox(pokemon.id)}
                    onMarkDead={(cause, location) => markPokemonDead(pokemon.id, cause, location)}
                  />
                ))}
              </AnimatePresence>
              
              {/* Empty slots - more subtle */}
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
