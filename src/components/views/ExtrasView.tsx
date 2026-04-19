'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { TypeCoverage } from '@/components/dashboard/TypeCoverage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  Swords,
  Shield,
  Zap,
  BarChart3,
  ListChecks,
  ArrowRight,
} from 'lucide-react';

// Evolution data for Gen 1 Pokemon
const EVOLUTIONS: Record<number, { evolves_to: number; level?: number; item?: string }[]> = {
  1: [{ evolves_to: 2, level: 16 }], // Bulbasaur -> Ivysaur
  2: [{ evolves_to: 3, level: 32 }], // Ivysaur -> Venusaur
  4: [{ evolves_to: 5, level: 16 }], // Charmander -> Charmeleon
  5: [{ evolves_to: 6, level: 36 }], // Charmeleon -> Charizard
  7: [{ evolves_to: 8, level: 16 }], // Squirtle -> Wartortle
  8: [{ evolves_to: 9, level: 36 }], // Wartortle -> Blastoise
  10: [{ evolves_to: 11, level: 7 }], // Caterpie -> Metapod
  11: [{ evolves_to: 12, level: 10 }], // Metapod -> Butterfree
  13: [{ evolves_to: 14, level: 7 }], // Weedle -> Kakuna
  14: [{ evolves_to: 15, level: 10 }], // Kakuna -> Beedrill
  16: [{ evolves_to: 17, level: 18 }], // Pidgey -> Pidgeotto
  17: [{ evolves_to: 18, level: 36 }], // Pidgeotto -> Pidgeot
  19: [{ evolves_to: 20, level: 20 }], // Rattata -> Raticate
  21: [{ evolves_to: 22, level: 20 }], // Spearow -> Fearow
  23: [{ evolves_to: 24, level: 22 }], // Ekans -> Arbok
  25: [{ evolves_to: 26, item: 'Thunder Stone' }], // Pikachu -> Raichu
  27: [{ evolves_to: 28, level: 22 }], // Sandshrew -> Sandslash
  29: [{ evolves_to: 30, level: 16 }], // Nidoran♀ -> Nidorina
  30: [{ evolves_to: 31, item: 'Moon Stone' }], // Nidorina -> Nidoqueen
  32: [{ evolves_to: 33, level: 16 }], // Nidoran♂ -> Nidorino
  33: [{ evolves_to: 34, item: 'Moon Stone' }], // Nidorino -> Nidoking
  35: [{ evolves_to: 36, item: 'Moon Stone' }], // Clefairy -> Clefable
  37: [{ evolves_to: 38, item: 'Fire Stone' }], // Vulpix -> Ninetales
  39: [{ evolves_to: 40, item: 'Moon Stone' }], // Jigglypuff -> Wigglytuff
  41: [{ evolves_to: 42, level: 22 }], // Zubat -> Golbat
  43: [{ evolves_to: 44, level: 21 }], // Oddish -> Gloom
  44: [{ evolves_to: 45, item: 'Leaf Stone' }], // Gloom -> Vileplume
  46: [{ evolves_to: 47, level: 24 }], // Paras -> Parasect
  48: [{ evolves_to: 49, level: 31 }], // Venonat -> Venomoth
  50: [{ evolves_to: 51, level: 26 }], // Diglett -> Dugtrio
  52: [{ evolves_to: 53, level: 28 }], // Meowth -> Persian
  54: [{ evolves_to: 55, level: 33 }], // Psyduck -> Golduck
  56: [{ evolves_to: 57, level: 28 }], // Mankey -> Primeape
  58: [{ evolves_to: 59, item: 'Fire Stone' }], // Growlithe -> Arcanine
  60: [{ evolves_to: 61, level: 25 }], // Poliwag -> Poliwhirl
  61: [{ evolves_to: 62, item: 'Water Stone' }], // Poliwhirl -> Poliwrath
  63: [{ evolves_to: 64, level: 16 }], // Abra -> Kadabra
  64: [{ evolves_to: 65 }], // Kadabra -> Alakazam (trade)
  66: [{ evolves_to: 67, level: 28 }], // Machop -> Machoke
  67: [{ evolves_to: 68 }], // Machoke -> Machamp (trade)
  69: [{ evolves_to: 70, level: 21 }], // Bellsprout -> Weepinbell
  70: [{ evolves_to: 71, item: 'Leaf Stone' }], // Weepinbell -> Victreebel
  72: [{ evolves_to: 73, level: 30 }], // Tentacool -> Tentacruel
  74: [{ evolves_to: 75, level: 25 }], // Geodude -> Graveler
  75: [{ evolves_to: 76 }], // Graveler -> Golem (trade)
  77: [{ evolves_to: 78, level: 40 }], // Ponyta -> Rapidash
  79: [{ evolves_to: 80, level: 37 }], // Slowpoke -> Slowbro
  81: [{ evolves_to: 82, level: 30 }], // Magnemite -> Magneton
  84: [{ evolves_to: 85, level: 31 }], // Doduo -> Dodrio
  86: [{ evolves_to: 87, level: 34 }], // Seel -> Dewgong
  88: [{ evolves_to: 89, level: 38 }], // Grimer -> Muk
  90: [{ evolves_to: 91, item: 'Water Stone' }], // Shellder -> Cloyster
  92: [{ evolves_to: 93, level: 25 }], // Gastly -> Haunter
  93: [{ evolves_to: 94 }], // Haunter -> Gengar (trade)
  96: [{ evolves_to: 97, level: 26 }], // Drowzee -> Hypno
  98: [{ evolves_to: 99, level: 28 }], // Krabby -> Kingler
  100: [{ evolves_to: 101, level: 30 }], // Voltorb -> Electrode
  102: [{ evolves_to: 103, item: 'Leaf Stone' }], // Exeggcute -> Exeggutor
  104: [{ evolves_to: 105, level: 28 }], // Cubone -> Marowak
  109: [{ evolves_to: 110, level: 35 }], // Koffing -> Weezing
  111: [{ evolves_to: 112, level: 42 }], // Rhyhorn -> Rhydon
  116: [{ evolves_to: 117, level: 32 }], // Horsea -> Seadra
  118: [{ evolves_to: 119, level: 33 }], // Goldeen -> Seaking
  120: [{ evolves_to: 121, item: 'Water Stone' }], // Staryu -> Starmie
  129: [{ evolves_to: 130, level: 20 }], // Magikarp -> Gyarados
  133: [
    { evolves_to: 134, item: 'Water Stone' }, // Eevee -> Vaporeon
    { evolves_to: 135, item: 'Thunder Stone' }, // Eevee -> Jolteon
    { evolves_to: 136, item: 'Fire Stone' }, // Eevee -> Flareon
  ],
  138: [{ evolves_to: 139, level: 40 }], // Omanyte -> Omastar
  140: [{ evolves_to: 141, level: 40 }], // Kabuto -> Kabutops
  147: [{ evolves_to: 148, level: 30 }], // Dratini -> Dragonair
  148: [{ evolves_to: 149, level: 55 }], // Dragonair -> Dragonite
};

export function ExtrasView() {
  const currentRun = useRunStore((s) => s.currentRun);

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Start a run to see extra trackers</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-24 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Extra Trackers</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Type Coverage Detailed */}
          <TypeCoverage />

          {/* Evolution Tracker */}
          <EvolutionTracker />

          {/* Encounter Progress */}
          <EncounterProgress />

          {/* Dupes Clause Helper */}
          <DupesClauseHelper />

          {/* Run Statistics */}
          <RunStatistics />
        </div>
      </div>
    </ScrollArea>
  );
}

function EvolutionTracker() {
  const currentRun = useRunStore((s) => s.currentRun);

  const evolutions = useMemo(() => {
    if (!currentRun) return [];

    const allPokemon = [
      ...currentRun.party.map(id => currentRun.pokemon[id]),
      ...currentRun.box.map(id => currentRun.pokemon[id]),
    ].filter(p => p && p.status === 'active');

    const pending: Array<{
      pokemon: typeof allPokemon[0];
      species: ReturnType<typeof POKEMON_SPECIES[number]>;
      evolvesTo: ReturnType<typeof POKEMON_SPECIES[number]>;
      method: string;
      levelsNeeded?: number;
    }> = [];

    allPokemon.forEach(pokemon => {
      const evoData = EVOLUTIONS[pokemon.speciesId];
      if (!evoData) return;

      evoData.forEach(evo => {
        const evolvesTo = POKEMON_SPECIES[evo.evolves_to];
        const species = POKEMON_SPECIES[pokemon.speciesId];
        if (!evolvesTo || !species) return;

        if (evo.level && pokemon.level < evo.level) {
          pending.push({
            pokemon,
            species,
            evolvesTo,
            method: `Level ${evo.level}`,
            levelsNeeded: evo.level - pokemon.level,
          });
        } else if (evo.item) {
          pending.push({
            pokemon,
            species,
            evolvesTo,
            method: evo.item,
          });
        } else if (!evo.level && !evo.item) {
          pending.push({
            pokemon,
            species,
            evolvesTo,
            method: 'Trade',
          });
        }
      });
    });

    // Sort by levels needed (closest first)
    return pending.sort((a, b) => (a.levelsNeeded || 999) - (b.levelsNeeded || 999));
  }, [currentRun]);

  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Evolution Tracker</h3>
        <Badge variant="secondary">{evolutions.length}</Badge>
      </div>

      {evolutions.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No pending evolutions</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {evolutions.map((evo, idx) => (
            <div
              key={`${evo.pokemon.id}-${idx}`}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg',
                evo.levelsNeeded && evo.levelsNeeded <= 5
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-muted/50'
              )}
            >
              <div className="flex items-center gap-2">
                <img
                  src={evo.species.spriteUrl}
                  alt={evo.species.name}
                  className="w-8 h-8 pixelated"
                />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <img
                  src={evo.evolvesTo.spriteUrl}
                  alt={evo.evolvesTo.name}
                  className="w-8 h-8 pixelated"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {evo.pokemon.nickname}
                </p>
                <p className="text-xs text-muted-foreground">
                  {evo.species.name} → {evo.evolvesTo.name}
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant={evo.levelsNeeded && evo.levelsNeeded <= 5 ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {evo.method}
                </Badge>
                {evo.levelsNeeded && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {evo.levelsNeeded} lvl{evo.levelsNeeded > 1 ? 's' : ''} away
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EncounterProgress() {
  const currentRun = useRunStore((s) => s.currentRun);

  const stats = useMemo(() => {
    if (!currentRun) return null;

    const locations = Object.values(currentRun.locations);
    const encounterLocations = locations.filter(l => l.encounters.length > 0);
    const usedLocations = encounterLocations.filter(l => l.encounterUsed);
    const availableLocations = encounterLocations.filter(l => !l.encounterUsed);

    return {
      total: encounterLocations.length,
      used: usedLocations.length,
      available: availableLocations.length,
      percent: Math.round((usedLocations.length / encounterLocations.length) * 100),
      locations: availableLocations.slice(0, 5),
    };
  }, [currentRun]);

  if (!stats) return null;

  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Encounter Progress</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Routes Used</span>
          <span className="font-medium">{stats.used}/{stats.total}</span>
        </div>
        <Progress value={stats.percent} className="h-3" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-green-500/10 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.used}</p>
          <p className="text-xs text-muted-foreground">Caught</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-500/10 text-center">
          <p className="text-2xl font-bold text-blue-500">{stats.available}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
      </div>

      {stats.locations.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Available Encounters:</p>
          <div className="space-y-1">
            {stats.locations.map(loc => (
              <div key={loc.id} className="flex items-center justify-between text-sm p-1.5 rounded bg-muted/50">
                <span className="truncate">{loc.name}</span>
                <span className="text-xs text-muted-foreground">
                  {loc.encounters.length} species
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DupesClauseHelper() {
  const currentRun = useRunStore((s) => s.currentRun);

  const caughtSpecies = useMemo(() => {
    if (!currentRun) return [];

    const speciesIds = new Set<number>();
    Object.values(currentRun.pokemon).forEach(p => {
      if (p) speciesIds.add(p.speciesId);
    });

    return Array.from(speciesIds)
      .map(id => POKEMON_SPECIES[id])
      .filter(Boolean)
      .sort((a, b) => a.id - b.id);
  }, [currentRun]);

  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Dupes Clause</h3>
        <Badge variant="secondary">{caughtSpecies.length} species</Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Species you've already caught (can skip in new encounters):
      </p>

      {caughtSpecies.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">No Pokémon caught yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[150px]">
          <div className="flex flex-wrap gap-1">
            {caughtSpecies.map(species => (
              <div
                key={species.id}
                className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-xs"
              >
                <img
                  src={species.spriteUrl}
                  alt={species.name}
                  className="w-4 h-4 pixelated"
                />
                <span>{species.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function RunStatistics() {
  const currentRun = useRunStore((s) => s.currentRun);

  const stats = useMemo(() => {
    if (!currentRun) return null;

    const allPokemon = Object.values(currentRun.pokemon).filter(Boolean);
    const activePokemon = allPokemon.filter(p => p.status === 'active');
    const deadPokemon = allPokemon.filter(p => p.status === 'dead');

    const totalLevels = activePokemon.reduce((sum, p) => sum + p.level, 0);
    const avgLevel = activePokemon.length > 0 ? Math.round(totalLevels / activePokemon.length) : 0;

    const locations = Object.values(currentRun.locations);
    const visitedLocations = locations.filter(l => l.status !== 'unvisited');
    const clearedLocations = locations.filter(l => l.status === 'cleared');

    const totalTrainers = locations.reduce((sum, l) => sum + l.trainers.length, 0);
    const defeatedTrainers = locations.reduce((sum, l) => sum + (l.defeatedTrainers?.length || 0), 0);

    return {
      totalCaught: allPokemon.length,
      active: activePokemon.length,
      deaths: deadPokemon.length,
      avgLevel,
      badges: currentRun.badges.filter(b => b.obtained).length,
      locationsVisited: visitedLocations.length,
      locationsCleared: clearedLocations.length,
      totalLocations: locations.length,
      trainersDefeated: defeatedTrainers,
      totalTrainers,
      money: currentRun.money || 0,
      playTime: currentRun.playTime || 0,
    };
  }, [currentRun]);

  if (!stats) return null;

  const playHours = Math.floor(stats.playTime / 60);
  const playMinutes = stats.playTime % 60;

  return (
    <div className="p-4 rounded-xl border bg-card lg:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Run Statistics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Pokémon Caught"
          value={stats.totalCaught}
          color="text-green-500"
        />
        <StatCard
          icon={<Swords className="w-4 h-4" />}
          label="Active Team"
          value={`${stats.active} (Avg Lv.${stats.avgLevel})`}
          color="text-blue-500"
        />
        <StatCard
          icon={<Shield className="w-4 h-4" />}
          label="Deaths"
          value={stats.deaths}
          color="text-red-500"
        />
        <StatCard
          icon={<CheckCircle className="w-4 h-4" />}
          label="Badges"
          value={`${stats.badges}/8`}
          color="text-yellow-500"
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Locations Visited"
          value={`${stats.locationsVisited}/${stats.totalLocations}`}
          color="text-purple-500"
        />
        <StatCard
          icon={<Swords className="w-4 h-4" />}
          label="Trainers Defeated"
          value={`${stats.trainersDefeated}/${stats.totalTrainers}`}
          color="text-orange-500"
        />
        <StatCard
          icon={<Zap className="w-4 h-4" />}
          label="Money"
          value={`₽${stats.money.toLocaleString()}`}
          color="text-yellow-600"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Play Time"
          value={playHours > 0 ? `${playHours}h ${playMinutes}m` : `${playMinutes}m`}
          color="text-gray-500"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <div className={cn('flex items-center gap-2 mb-1', color)}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
