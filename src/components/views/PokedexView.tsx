'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { POKEMON_SPECIES, TYPE_COLORS, getAllPokemonSpecies } from '@/data/pokemon';
import { PokemonType, PokemonSpecies, PokedexEntry } from '@/types';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Heart,
  Swords,
  Shield,
  Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const ALL_TYPES: PokemonType[] = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel',
];

interface PokemonCardProps {
  species: PokemonSpecies;
  entry?: PokedexEntry;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

function PokemonCard({ species, entry, onClick, viewMode }: PokemonCardProps) {
  const isSeen = entry?.seen ?? false;
  const isCaught = entry?.caught ?? false;
  const isTrainerEncounter = entry?.seenSource === 'trainer' && !isCaught;

  if (viewMode === 'grid') {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          'relative p-2 rounded-xl border transition-all',
          isCaught 
            ? 'bg-card border-green-500/30 hover:border-green-500/50' 
            : isTrainerEncounter
            ? 'bg-card/50 border-orange-500/30 hover:border-orange-500/50'
            : isSeen 
            ? 'bg-card/50 border-blue-500/30 hover:border-blue-500/50'
            : 'bg-muted/30 border-muted hover:border-muted-foreground/30'
        )}
      >
        <div className="relative">
          <img
            src={species.spriteUrl}
            alt={species.name}
            className={cn(
              'w-16 h-16 mx-auto pixelated',
              !isSeen && 'brightness-0 opacity-30'
            )}
            loading="lazy"
          />
          
          {/* Status indicators */}
          {isCaught && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          {isTrainerEncounter && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <Swords className="w-3 h-3 text-white" />
            </div>
          )}
          {isSeen && !isCaught && !isTrainerEncounter && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Eye className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <p className={cn(
          'text-xs font-medium mt-1 truncate',
          !isSeen && 'text-muted-foreground'
        )}>
          #{species.id.toString().padStart(3, '0')}
        </p>
        <p className={cn(
          'text-xs truncate',
          isSeen ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {isSeen ? species.name : '???'}
        </p>
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left',
        isCaught 
          ? 'bg-card border-green-500/30 hover:border-green-500/50' 
          : isTrainerEncounter
          ? 'bg-card/50 border-orange-500/30 hover:border-orange-500/50'
          : isSeen 
          ? 'bg-card/50 border-blue-500/30 hover:border-blue-500/50'
          : 'bg-muted/30 border-muted hover:border-muted-foreground/30'
      )}
    >
      <div className="relative">
        <img
          src={species.spriteUrl}
          alt={species.name}
          className={cn(
            'w-12 h-12 pixelated',
            !isSeen && 'brightness-0 opacity-30'
          )}
          loading="lazy"
        />
        {isCaught && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        {isTrainerEncounter && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <Swords className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            #{species.id.toString().padStart(3, '0')}
          </span>
          <span className={cn('font-medium', !isSeen && 'text-muted-foreground')}>
            {isSeen ? species.name : '???'}
          </span>
          {isTrainerEncounter && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-orange-500/20 border-orange-500/50 text-orange-500">
              Trainer
            </Badge>
          )}
        </div>
        {isSeen && (
          <div className="flex gap-1 mt-1">
            {species.types.map((type) => (
              <span
                key={type}
                className="px-1.5 py-0.5 rounded text-[10px] text-white"
                style={{ backgroundColor: TYPE_COLORS[type] }}
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </motion.button>
  );
}

interface PokemonDetailSheetProps {
  species: PokemonSpecies | null;
  entry?: PokedexEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PokemonDetailSheet({ species, entry, open, onOpenChange }: PokemonDetailSheetProps) {
  if (!species) return null;
  
  const isSeen = entry?.seen ?? false;
  const isCaught = entry?.caught ?? false;
  const isTrainerEncounter = entry?.seenSource === 'trainer';
  const trainerEncounters = entry?.trainerEncounters || [];
  
  const totalStats = Object.values(species.baseStats).reduce((a, b) => a + b, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[450px] sm:w-[600px] p-6">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className={cn(
                'w-28 h-28 rounded-2xl flex items-center justify-center',
                isCaught ? 'bg-green-500/20' : isSeen ? 'bg-blue-500/20' : 'bg-muted'
              )}>
                <img
                  src={species.spriteUrl}
                  alt={species.name}
                  className={cn(
                    'w-24 h-24 pixelated',
                    !isSeen && 'brightness-0 opacity-30'
                  )}
                />
              </div>
              {isCaught && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <SheetTitle className="text-left text-2xl">
                {isSeen ? species.name : '???'}
              </SheetTitle>
              <SheetDescription className="text-left text-base">
                #{species.id.toString().padStart(3, '0')} • National Pokédex
              </SheetDescription>
              {isSeen && (
                <div className="flex gap-2 mt-3">
                  {species.types.map((type) => (
                    <Badge
                      key={type}
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                      className="text-white px-3 py-1"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetHeader>

        {isSeen ? (
          <ScrollArea className="h-[calc(100vh-220px)] mt-4 pr-4">
            <div className="space-y-8 pb-4">
              {/* Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full',
                    isCaught ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                  )}>
                    {isCaught ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span className="text-sm font-medium">{isCaught ? 'Caught' : 'Not Caught'}</span>
                  </div>
                  {isTrainerEncounter && !isCaught && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-500">
                      <Swords className="w-4 h-4" />
                      <span className="text-sm font-medium">Seen in Battle</span>
                    </div>
                  )}
                </div>
                {entry?.caughtLocation && (
                  <p className="text-sm text-muted-foreground">
                    Caught at {entry.caughtLocation}
                  </p>
                )}
                
                {/* Trainer Encounters */}
                {trainerEncounters.length > 0 && (
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <h5 className="text-sm font-medium text-orange-400 mb-2 flex items-center gap-2">
                      <Swords className="w-4 h-4" />
                      Battled Against ({trainerEncounters.length})
                    </h5>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {trainerEncounters.map((encounter, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">
                          {encounter}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Base Stats */}
              <div>
                <h4 className="font-semibold mb-5 flex items-center gap-2 text-base">
                  <Sparkles className="w-5 h-5" />
                  Base Stats
                  <Badge variant="secondary" className="ml-auto text-sm px-3">
                    Total: {totalStats}
                  </Badge>
                </h4>
                <div className="space-y-4">
                  {[
                    { key: 'hp', label: 'HP', icon: Heart, color: 'bg-red-500' },
                    { key: 'attack', label: 'Attack', icon: Swords, color: 'bg-orange-500' },
                    { key: 'defense', label: 'Defense', icon: Shield, color: 'bg-yellow-500' },
                    { key: 'spAtk', label: 'Sp. Atk', icon: Sparkles, color: 'bg-blue-500' },
                    { key: 'spDef', label: 'Sp. Def', icon: Shield, color: 'bg-green-500' },
                    { key: 'speed', label: 'Speed', icon: Zap, color: 'bg-pink-500' },
                  ].map(({ key, label, icon: Icon, color }) => {
                    const value = species.baseStats[key as keyof typeof species.baseStats];
                    const percent = (value / 255) * 100;
                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Icon className="w-4 h-4" />
                            {label}
                          </span>
                          <span className="font-semibold text-sm">{value}</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={cn('h-full rounded-full', color)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Abilities */}
              <div>
                <h4 className="font-semibold mb-4 text-base">Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {species.abilities.map((ability) => (
                    <Badge key={ability} variant="outline" className="px-3 py-1.5 text-sm">
                      {ability}
                    </Badge>
                  ))}
                  {species.hiddenAbility && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      {species.hiddenAbility} (Hidden)
                    </Badge>
                  )}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Other Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Catch Rate</p>
                  <p className="font-semibold text-lg">{species.catchRate}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Base Exp</p>
                  <p className="font-semibold text-lg">{species.baseExp}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <X className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">Not Yet Seen</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Encounter this Pokémon to reveal its data
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function PokedexView() {
  const currentRun = useRunStore((s) => s.currentRun);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'seen' | 'caught' | 'encountered' | 'unseen'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);

  const allSpecies = useMemo(() => getAllPokemonSpecies(), []);

  const pokedexMap = useMemo(() => {
    if (!currentRun?.pokedex) return new Map<number, PokedexEntry>();
    return new Map(currentRun.pokedex.map((e) => [e.speciesId, e]));
  }, [currentRun?.pokedex]);

  const filteredSpecies = useMemo(() => {
    return allSpecies.filter((species) => {
      const entry = pokedexMap.get(species.id);
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = species.name.toLowerCase().includes(term);
        const matchesId = species.id.toString().includes(term);
        if (!matchesName && !matchesId) return false;
      }

      if (typeFilter !== 'all') {
        if (!species.types.includes(typeFilter as PokemonType)) return false;
      }

      if (statusFilter === 'caught' && !entry?.caught) return false;
      if (statusFilter === 'encountered' && !(entry?.seen && !entry?.caught && entry?.seenSource === 'trainer')) return false;
      if (statusFilter === 'seen' && !entry?.seen) return false;
      if (statusFilter === 'unseen' && entry?.seen) return false;

      return true;
    });
  }, [allSpecies, searchTerm, typeFilter, statusFilter, pokedexMap]);

  const stats = useMemo(() => {
    if (!currentRun?.pokedex) return { seen: 0, caught: 0, encountered: 0, total: 151 };
    const seen = currentRun.pokedex.filter((e) => e.seen).length;
    const caught = currentRun.pokedex.filter((e) => e.caught).length;
    const encountered = currentRun.pokedex.filter((e) => e.seen && !e.caught && e.seenSource === 'trainer').length;
    return { seen, caught, encountered, total: 151 };
  }, [currentRun?.pokedex]);

  const selectedSpecies = selectedSpeciesId ? POKEMON_SPECIES[selectedSpeciesId] : null;
  const selectedEntry = selectedSpeciesId ? pokedexMap.get(selectedSpeciesId) : undefined;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Pokédex</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Badge variant="default" className="gap-1 bg-green-600">
                  <Check className="w-3 h-3" />
                  {stats.caught} caught
                </Badge>
                {stats.encountered > 0 && (
                  <Badge variant="outline" className="gap-1 bg-orange-500/20 border-orange-500/50 text-orange-500">
                    <Swords className="w-3 h-3" />
                    {stats.encountered} battled
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Eye className="w-3 h-3" />
                  {stats.seen} total seen
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{stats.caught}/{stats.total}</span>
          </div>
          <Progress value={(stats.caught / stats.total) * 100} className="h-2" />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {ALL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                    />
                    {type}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="caught">Caught</SelectItem>
              <SelectItem value="encountered">Battled Only</SelectItem>
              <SelectItem value="seen">All Seen</SelectItem>
              <SelectItem value="unseen">Unseen</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pokemon Grid/List */}
      <div className="flex-1 overflow-auto">
        <div className={cn(
          'p-4',
          viewMode === 'grid' 
            ? 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2'
            : 'space-y-2'
        )}>
          <AnimatePresence mode="popLayout">
            {filteredSpecies.map((species) => (
              <PokemonCard
                key={species.id}
                species={species}
                entry={pokedexMap.get(species.id)}
                onClick={() => setSelectedSpeciesId(species.id)}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {filteredSpecies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No Pokémon found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <PokemonDetailSheet
        species={selectedSpecies}
        entry={selectedEntry}
        open={!!selectedSpecies}
        onOpenChange={(open) => !open && setSelectedSpeciesId(null)}
      />
    </div>
  );
}
