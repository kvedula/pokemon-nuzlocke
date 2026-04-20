'use client';

import React, { useMemo } from 'react';
import { useRunStore } from '@/store/runStore';
import { POKEMON_SPECIES, TYPE_COLORS, ALL_TYPES } from '@/data/pokemon';
import { PokemonType } from '@/types/pokemon';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Swords,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

const TYPE_WEAKNESSES: Record<string, string[]> = {
  Normal: ['Fighting'],
  Fire: ['Water', 'Ground', 'Rock'],
  Water: ['Electric', 'Grass'],
  Electric: ['Ground'],
  Grass: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'],
  Ice: ['Fire', 'Fighting', 'Rock', 'Steel'],
  Fighting: ['Flying', 'Psychic', 'Fairy'],
  Poison: ['Ground', 'Psychic'],
  Ground: ['Water', 'Grass', 'Ice'],
  Flying: ['Electric', 'Ice', 'Rock'],
  Psychic: ['Bug', 'Ghost', 'Dark'],
  Bug: ['Fire', 'Flying', 'Rock'],
  Rock: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'],
  Ghost: ['Ghost', 'Dark'],
  Dragon: ['Ice', 'Dragon', 'Fairy'],
  Dark: ['Fighting', 'Bug', 'Fairy'],
  Steel: ['Fire', 'Fighting', 'Ground'],
  Fairy: ['Poison', 'Steel'],
};

// Gen 1 types only (for FRLG)
const GEN1_TYPES: PokemonType[] = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon'];

interface TypeCoverageProps {
  compact?: boolean;
}

export function TypeCoverage({ compact = false }: TypeCoverageProps) {
  const currentRun = useRunStore((s) => s.currentRun);

  const analysis = useMemo(() => {
    if (!currentRun) return null;

    const partyPokemon = currentRun.party
      .map(id => currentRun.pokemon[id])
      .filter(p => p && p.status === 'active');

    if (partyPokemon.length === 0) return null;

    // Get all types in the party
    const partyTypes = new Set<string>();
    partyPokemon.forEach(p => {
      p.types.forEach(t => partyTypes.add(t));
    });

    // Calculate offensive coverage (what types can we hit super effectively?)
    const offensiveCoverage = new Set<string>();
    partyTypes.forEach(attackType => {
      const effectiveness = TYPE_EFFECTIVENESS[attackType] || {};
      Object.entries(effectiveness).forEach(([defType, mult]) => {
        if (mult >= 2) offensiveCoverage.add(defType);
      });
    });

    // Calculate defensive weaknesses
    const weaknessCount: Record<string, number> = {};
    partyPokemon.forEach(pokemon => {
      const pokemonWeaknesses = new Set<string>();
      pokemon.types.forEach(type => {
        (TYPE_WEAKNESSES[type] || []).forEach(w => pokemonWeaknesses.add(w));
      });
      pokemonWeaknesses.forEach(w => {
        weaknessCount[w] = (weaknessCount[w] || 0) + 1;
      });
    });

    // Find shared weaknesses (2+ Pokemon weak to same type)
    const sharedWeaknesses = Object.entries(weaknessCount)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);

    // Find missing coverage
    const missingCoverage = GEN1_TYPES.filter(t => !offensiveCoverage.has(t));

    // Calculate coverage percentage
    const coveragePercent = Math.round((offensiveCoverage.size / GEN1_TYPES.length) * 100);

    return {
      partyTypes: Array.from(partyTypes),
      offensiveCoverage: Array.from(offensiveCoverage),
      missingCoverage,
      sharedWeaknesses,
      coveragePercent,
      partyCount: partyPokemon.length,
    };
  }, [currentRun]);

  if (!analysis) {
    return (
      <div className="p-4 rounded-xl border bg-card text-center text-muted-foreground">
        <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Add Pokémon to see coverage</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="p-3 rounded-xl border bg-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Coverage</span>
          </div>
          <Badge variant={analysis.coveragePercent >= 70 ? 'default' : 'secondary'}>
            {analysis.coveragePercent}%
          </Badge>
        </div>
        
        <Progress value={analysis.coveragePercent} className="h-2 mb-2" />
        
        {analysis.sharedWeaknesses.length > 0 && (
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>Weak to: {analysis.sharedWeaknesses.slice(0, 2).map(([t]) => t).join(', ')}</span>
          </div>
        )}
        
        {analysis.missingCoverage.length > 0 && analysis.missingCoverage.length <= 3 && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
            <span>Missing: {analysis.missingCoverage.join(', ')}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Type Coverage</h3>
        </div>
        <Badge 
          variant={analysis.coveragePercent >= 70 ? 'default' : 'secondary'}
          className={cn(
            analysis.coveragePercent >= 70 && 'bg-green-500/20 text-green-400 border-green-500/30'
          )}
        >
          {analysis.offensiveCoverage.length}/{GEN1_TYPES.length} Types
        </Badge>
      </div>

      {/* Coverage Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Offensive Coverage</span>
          <span className="font-medium">{analysis.coveragePercent}%</span>
        </div>
        <Progress value={analysis.coveragePercent} className="h-2" />
      </div>

      {/* Type Grid */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {GEN1_TYPES.map(type => {
          const hasCoverage = analysis.offensiveCoverage.includes(type);
          return (
            <Tooltip key={type}>
              <TooltipTrigger>
                <div
                  className={cn(
                    'px-1.5 py-1 rounded text-[10px] font-medium text-center transition-all',
                    hasCoverage
                      ? 'text-white opacity-100'
                      : 'opacity-30 bg-muted text-muted-foreground'
                  )}
                  style={hasCoverage ? { backgroundColor: TYPE_COLORS[type] } : undefined}
                >
                  {type.slice(0, 3)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hasCoverage ? `Can hit ${type} super effectively` : `No coverage for ${type}`}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Warnings */}
      {analysis.sharedWeaknesses.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-3">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-sm">Team Weaknesses</span>
          </div>
          <div className="space-y-1">
            {analysis.sharedWeaknesses.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="px-1.5 py-0.5 rounded text-white text-[10px]"
                    style={{ backgroundColor: TYPE_COLORS[type as PokemonType] }}
                  >
                    {type}
                  </span>
                  <span className="text-muted-foreground">
                    {count}/{analysis.partyCount} Pokémon weak
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Coverage */}
      {analysis.missingCoverage.length > 0 && (
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-2">Missing coverage for:</p>
          <div className="flex flex-wrap gap-1">
            {analysis.missingCoverage.map(type => (
              <span
                key={type}
                className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* All Good */}
      {analysis.sharedWeaknesses.length === 0 && analysis.missingCoverage.length <= 2 && (
        <div className="flex items-center gap-2 text-green-500 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Great type coverage!</span>
        </div>
      )}
    </div>
  );
}
