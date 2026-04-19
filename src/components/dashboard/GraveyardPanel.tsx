'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { Pokemon } from '@/types';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import { Skull, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface FallenPokemonCardProps {
  pokemon: Pokemon;
}

function FallenPokemonCard({ pokemon }: FallenPokemonCardProps) {
  const species = POKEMON_SPECIES[pokemon.speciesId];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-muted"
    >
      <div className="relative">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden grayscale">
          {species ? (
            <img
              src={species.spriteUrl}
              alt={pokemon.species}
              className="w-10 h-10 pixelated opacity-70"
              loading="lazy"
            />
          ) : (
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-900 rounded-full flex items-center justify-center">
          <Skull className="w-3 h-3 text-red-400" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-muted-foreground line-through">
            {pokemon.nickname}
          </span>
          <span className="text-xs text-muted-foreground">Lv.{pokemon.level}</span>
        </div>
        <div className="text-xs text-muted-foreground">{pokemon.species}</div>
        
        {pokemon.deathCause && (
          <p className="text-xs text-red-400/80 mt-1 italic line-clamp-1">
            "{pokemon.deathCause}"
          </p>
        )}

        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
          {pokemon.deathLocation && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {pokemon.deathLocation}
            </span>
          )}
          {pokemon.deathDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(pokemon.deathDate), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="px-1 py-0.5 rounded text-[8px] font-medium text-white opacity-60"
            style={{ backgroundColor: TYPE_COLORS[type] }}
          >
            {type}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function GraveyardPanel() {
  const currentRun = useRunStore((s) => s.currentRun);
  const [expanded, setExpanded] = React.useState(true);

  const fallenPokemon = React.useMemo(() => {
    if (!currentRun) return [];
    return currentRun.graveyard
      .map((id) => currentRun.pokemon[id])
      .filter(Boolean)
      .reverse();
  }, [currentRun]);

  if (!currentRun) return null;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <h3 className="font-semibold flex items-center gap-2">
          <Skull className="w-5 h-5 text-red-500" />
          Graveyard
          {fallenPokemon.length > 0 && (
            <Badge variant="destructive" className="ml-1">
              {fallenPokemon.length}
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
              {fallenPokemon.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Skull className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No fallen Pokémon yet.</p>
                  <p className="text-xs">May it stay this way!</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {fallenPokemon.map((pokemon) => (
                      <FallenPokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
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
