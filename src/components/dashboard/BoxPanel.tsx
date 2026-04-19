'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { Pokemon } from '@/types';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import { Box, ChevronDown, ChevronUp, Users, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BoxedPokemonCardProps {
  pokemon: Pokemon;
  onSelect: () => void;
  onMoveToParty: () => void;
  canMoveToParty: boolean;
}

function BoxedPokemonCard({ pokemon, onSelect, onMoveToParty, canMoveToParty }: BoxedPokemonCardProps) {
  const species = POKEMON_SPECIES[pokemon.speciesId];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="group relative"
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              onClick={onSelect}
              className={cn(
                'relative w-16 h-16 rounded-lg bg-muted/50 border border-muted',
                'flex items-center justify-center overflow-hidden',
                'hover:border-primary/50 hover:bg-muted transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            >
              {species ? (
                <img
                  src={pokemon.isShiny ? species.spriteShinyUrl : species.spriteUrl}
                  alt={pokemon.species}
                  className="w-12 h-12 pixelated"
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 bg-muted-foreground/20 rounded-full" />
              )}
              
              {/* Level indicator */}
              <span className="absolute bottom-0 right-0 px-1 text-[10px] font-bold bg-background/80 rounded-tl">
                {pokemon.level}
              </span>

              {/* Shiny indicator */}
              {pokemon.isShiny && (
                <span className="absolute top-0 right-0 text-xs">✨</span>
              )}

              {/* Type indicator */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                {pokemon.types.map((type) => (
                  <div
                    key={type}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: TYPE_COLORS[type] }}
                  />
                ))}
              </div>
            </button>
          }
        />
        <TooltipContent side="top">
          <div className="text-center">
            <p className="font-semibold">{pokemon.nickname}</p>
            <p className="text-xs text-muted-foreground">{pokemon.species} • Lv.{pokemon.level}</p>
            <p className="text-xs text-muted-foreground">{pokemon.types.join(' / ')}</p>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Move to party button */}
      {canMoveToParty && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onMoveToParty();
          }}
        >
          <ArrowUp className="w-3 h-3" />
        </Button>
      )}
    </motion.div>
  );
}

export function BoxPanel() {
  const currentRun = useRunStore((s) => s.currentRun);
  const movePokemonToParty = useRunStore((s) => s.movePokemonToParty);
  const selectPokemon = useUIStore((s) => s.selectPokemon);
  const [expanded, setExpanded] = React.useState(true);

  const boxedPokemon = React.useMemo(() => {
    if (!currentRun) return [];
    return currentRun.box
      .map((id) => currentRun.pokemon[id])
      .filter(Boolean);
  }, [currentRun]);

  const canAddToParty = currentRun && currentRun.party.length < 6;

  if (!currentRun) return null;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <h3 className="font-semibold flex items-center gap-2">
          <Box className="w-5 h-5 text-purple-500" />
          PC Box
          {boxedPokemon.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {boxedPokemon.length}
            </Badge>
          )}
        </h3>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {boxedPokemon.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Box className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No Pokémon in the box.</p>
                  <p className="text-xs">Boxed Pokémon will appear here.</p>
                </div>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-5 gap-2 p-1">
                    <AnimatePresence mode="popLayout">
                      {boxedPokemon.map((pokemon) => (
                        <BoxedPokemonCard
                          key={pokemon.id}
                          pokemon={pokemon}
                          onSelect={() => selectPokemon(pokemon.id)}
                          onMoveToParty={() => movePokemonToParty(pokemon.id)}
                          canMoveToParty={!!canAddToParty}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
