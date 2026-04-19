'use client';

import React from 'react';
import { motion, Reorder } from 'framer-motion';
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
  Package,
  MoreHorizontal,
  Box,
  Skull,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Textarea } from '@/components/ui/textarea';

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
  onSelect: () => void;
  onMoveToBox: () => void;
  onMarkDead: (cause: string, location: string) => void;
}

function PokemonCard({ pokemon, index, onSelect, onMoveToBox, onMarkDead }: PokemonCardProps) {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        className={cn(
          'group relative p-4 rounded-xl border bg-card cursor-grab active:cursor-grabbing',
          'hover:border-primary/50 transition-all duration-200',
          'hover:shadow-lg hover:shadow-primary/5'
        )}
        onClick={onSelect}
      >
        {/* Slot Number */}
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {index + 1}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMoveToBox(); }}>
              <Box className="w-4 h-4 mr-2" />
              Move to Box
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => { e.stopPropagation(); setDeathDialogOpen(true); }}
            >
              <Skull className="w-4 h-4 mr-2" />
              Mark as Dead
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-4">
          {/* Sprite */}
          <div className="relative">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
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
              <div className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400">✨</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">{pokemon.nickname}</span>
              <span className="text-xs text-muted-foreground">Lv.{pokemon.level}</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">{pokemon.species}</div>
            
            {/* Types */}
            <div className="flex gap-1 mb-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                  style={{ backgroundColor: TYPE_COLORS[type] }}
                >
                  {type}
                </span>
              ))}
            </div>

            {/* HP Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  HP
                </span>
                <span>{pokemon.currentHp}/{pokemon.maxHp}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-300', hpColor)}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Swords className="w-3 h-3" />
              {pokemon.stats.attack}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {pokemon.stats.defense}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {pokemon.stats.speed}
            </span>
          </div>
          {pokemon.heldItem && (
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {pokemon.heldItem}
            </span>
          )}
        </div>

        {/* Ability & Nature */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <Badge variant="outline" className="text-[10px]">
            {pokemon.ability}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {pokemon.nature}
          </Badge>
        </div>
      </motion.div>

      {/* Death Confirmation Dialog */}
      <Dialog open={deathDialogOpen} onOpenChange={setDeathDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Skull className="w-5 h-5 text-destructive" />
              Mark {pokemon.nickname} as Dead?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone easily. {pokemon.nickname} will be moved to the graveyard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cause of Death</label>
              <Input
                placeholder="e.g., Critical hit from Starmie's Water Pulse"
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

export function PartyPanel() {
  const currentRun = useRunStore((s) => s.currentRun);
  const reorderParty = useRunStore((s) => s.reorderParty);
  const movePokemonToBox = useRunStore((s) => s.movePokemonToBox);
  const markPokemonDead = useRunStore((s) => s.markPokemonDead);
  const selectPokemon = useUIStore((s) => s.selectPokemon);

  const partyPokemon = React.useMemo(() => {
    if (!currentRun) return [];
    return currentRun.party
      .map((id) => currentRun.pokemon[id])
      .filter(Boolean);
  }, [currentRun]);

  const handleReorder = (newOrder: Pokemon[]) => {
    reorderParty(newOrder.map((p) => p.id));
  };

  if (!currentRun) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No active run
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Swords className="w-5 h-5" />
          Party
          <Badge variant="secondary">{partyPokemon.length}/6</Badge>
        </h2>
      </div>

      {partyPokemon.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Your party is empty.</p>
          <p className="text-sm">Catch some Pokémon to get started!</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={partyPokemon}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {partyPokemon.map((pokemon, index) => (
            <Reorder.Item key={pokemon.id} value={pokemon}>
              <PokemonCard
                pokemon={pokemon}
                index={index}
                onSelect={() => selectPokemon(pokemon.id)}
                onMoveToBox={() => movePokemonToBox(pokemon.id)}
                onMarkDead={(cause, location) => markPokemonDead(pokemon.id, cause, location)}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {partyPokemon.length > 0 && partyPokemon.length < 6 && (
        <div className="mt-3 p-4 border-2 border-dashed rounded-xl text-center text-muted-foreground">
          <p className="text-sm">{6 - partyPokemon.length} slot(s) available</p>
        </div>
      )}
    </div>
  );
}
