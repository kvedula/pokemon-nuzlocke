'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { POKEMON_SPECIES, TYPE_COLORS, getAllPokemonSpecies } from '@/data/pokemon';
import { Location, Pokemon, Nature, PokemonType } from '@/types';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const NATURES: Nature[] = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky',
];

function EncounterLocationCard({ location, onClick }: { location: Location; onClick: () => void }) {
  const currentRun = useRunStore((s) => s.currentRun);
  const encounteredPokemon = location.encounteredPokemonId 
    ? currentRun?.pokemon[location.encounteredPokemonId]
    : null;
  const species = encounteredPokemon ? POKEMON_SPECIES[encounteredPokemon.speciesId] : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      disabled={location.encounterUsed}
      className={cn(
        'w-full p-4 rounded-xl border text-left transition-all',
        location.encounterUsed
          ? 'bg-muted/30 border-muted opacity-60'
          : 'bg-card hover:border-primary/50 hover:shadow-lg cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{location.name}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 capitalize">
            {location.type}
          </p>
        </div>
        {location.encounterUsed ? (
          encounteredPokemon && species ? (
            <div className="flex items-center gap-2">
              <img
                src={species.spriteUrl}
                alt={species.name}
                className="w-10 h-10 pixelated"
              />
              <div className="text-right">
                <p className="text-sm font-medium">{encounteredPokemon.nickname}</p>
                <p className="text-xs text-muted-foreground">{encounteredPokemon.species}</p>
              </div>
            </div>
          ) : (
            <Badge variant="secondary">
              <X className="w-3 h-3 mr-1" />
              Failed
            </Badge>
          )
        ) : location.encounters.length > 0 ? (
          <Badge variant="outline" className="text-green-500 border-green-500">
            <Plus className="w-3 h-3 mr-1" />
            Available
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            No Encounters
          </Badge>
        )}
      </div>

      {!location.encounterUsed && location.encounters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {location.encounters.slice(0, 5).map((enc) => {
            const encSpecies = POKEMON_SPECIES[enc.speciesId];
            return encSpecies ? (
              <img
                key={`${enc.speciesId}-${enc.method}`}
                src={encSpecies.spriteUrl}
                alt={encSpecies.name}
                className="w-8 h-8 pixelated opacity-70"
                title={`${encSpecies.name} (${enc.rate}%)`}
              />
            ) : null;
          })}
          {location.encounters.length > 5 && (
            <span className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground">
              +{location.encounters.length - 5}
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
}

interface CatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
}

function CatchDialog({ open, onOpenChange, location }: CatchDialogProps) {
  const addPokemon = useRunStore((s) => s.addPokemon);
  const markEncounterUsed = useRunStore((s) => s.markEncounterUsed);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
  const [nickname, setNickname] = useState('');
  const [level, setLevel] = useState('5');
  const [nature, setNature] = useState<Nature>('Hardy');
  const [isShiny, setIsShiny] = useState(false);
  const [caught, setCaught] = useState(true);

  const allSpecies = useMemo(() => getAllPokemonSpecies(), []);
  
  const filteredSpecies = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allSpecies.filter(
      (s) => s.name.toLowerCase().includes(term) || s.id.toString() === term
    );
  }, [allSpecies, searchTerm]);

  const selectedSpecies = selectedSpeciesId ? POKEMON_SPECIES[selectedSpeciesId] : null;

  const handleCatch = () => {
    if (!location) return;

    if (caught && selectedSpecies) {
      const pokemon = addPokemon({
        speciesId: selectedSpecies.id,
        nickname: nickname || selectedSpecies.name,
        species: selectedSpecies.name,
        types: selectedSpecies.types,
        level: parseInt(level) || 5,
        nature,
        ability: selectedSpecies.abilities[0],
        currentHp: selectedSpecies.baseStats.hp + parseInt(level) * 2,
        maxHp: selectedSpecies.baseStats.hp + parseInt(level) * 2,
        stats: {
          hp: selectedSpecies.baseStats.hp + parseInt(level) * 2,
          attack: selectedSpecies.baseStats.attack + parseInt(level),
          defense: selectedSpecies.baseStats.defense + parseInt(level),
          spAtk: selectedSpecies.baseStats.spAtk + parseInt(level),
          spDef: selectedSpecies.baseStats.spDef + parseInt(level),
          speed: selectedSpecies.baseStats.speed + parseInt(level),
        },
        moves: [],
        heldItem: null,
        statusCondition: 'healthy',
        status: 'active',
        encounteredAt: location.id,
        encounteredDate: new Date().toISOString(),
        capturedDate: new Date().toISOString(),
        deathDate: null,
        deathCause: null,
        deathLocation: null,
        notes: '',
        isShiny,
        gender: 'male',
        metLevel: parseInt(level) || 5,
      });
      markEncounterUsed(location.id, pokemon.id);
    } else {
      markEncounterUsed(location.id);
    }

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSearchTerm('');
    setSelectedSpeciesId(null);
    setNickname('');
    setLevel('5');
    setNature('Hardy');
    setIsShiny(false);
    setCaught(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {location?.name} Encounter
          </DialogTitle>
          <DialogDescription>
            Record your encounter at this location.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="caught"
                checked={caught}
                onCheckedChange={(c) => setCaught(c === true)}
              />
              <Label htmlFor="caught">Caught successfully</Label>
            </div>
          </div>

          {caught && (
            <>
              <div className="space-y-2">
                <Label>Search Pokémon</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or Pokédex #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {searchTerm && (
                <ScrollArea className="h-48 border rounded-lg">
                  <div className="p-2 space-y-1">
                    {filteredSpecies.slice(0, 20).map((species) => (
                      <button
                        key={species.id}
                        onClick={() => {
                          setSelectedSpeciesId(species.id);
                          setSearchTerm('');
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 p-2 rounded-lg text-left',
                          'hover:bg-muted transition-colors',
                          selectedSpeciesId === species.id && 'bg-primary/10 border-primary'
                        )}
                      >
                        <img
                          src={species.spriteUrl}
                          alt={species.name}
                          className="w-10 h-10 pixelated"
                        />
                        <div>
                          <p className="font-medium">
                            #{species.id.toString().padStart(3, '0')} {species.name}
                          </p>
                          <div className="flex gap-1">
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
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {selectedSpecies && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-muted/50 border"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={isShiny ? selectedSpecies.spriteShinyUrl : selectedSpecies.spriteUrl}
                      alt={selectedSpecies.name}
                      className="w-16 h-16 pixelated"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{selectedSpecies.name}</p>
                      <div className="flex gap-1 mt-1">
                        {selectedSpecies.types.map((type) => (
                          <Badge
                            key={type}
                            style={{ backgroundColor: TYPE_COLORS[type] }}
                            className="text-white"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSpeciesId(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {selectedSpecies && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder={selectedSpecies.name}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      type="number"
                      min="1"
                      max="100"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nature</Label>
                    <Select value={nature} onValueChange={(v) => setNature(v as Nature)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NATURES.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="shiny"
                        checked={isShiny}
                        onCheckedChange={(c) => setIsShiny(c === true)}
                      />
                      <Label htmlFor="shiny" className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        Shiny
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCatch} disabled={caught && !selectedSpecies}>
            {caught ? 'Record Catch' : 'Mark as Failed'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EncountersView() {
  const currentRun = useRunStore((s) => s.currentRun);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'used'>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [catchDialogOpen, setCatchDialogOpen] = useState(false);

  const locations = useMemo(() => {
    if (!currentRun) return [];
    return Object.values(currentRun.locations)
      .filter((loc) => {
        const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
          filter === 'all' ||
          (filter === 'available' && !loc.encounterUsed && loc.encounters.length > 0) ||
          (filter === 'used' && loc.encounterUsed);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => a.recommendedLevel - b.recommendedLevel);
  }, [currentRun, searchTerm, filter]);

  const stats = useMemo(() => {
    if (!currentRun) return { total: 0, used: 0, available: 0 };
    const locs = Object.values(currentRun.locations);
    const withEncounters = locs.filter((l) => l.encounters.length > 0);
    return {
      total: withEncounters.length,
      used: withEncounters.filter((l) => l.encounterUsed).length,
      available: withEncounters.filter((l) => !l.encounterUsed).length,
    };
  }, [currentRun]);

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No active run
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Encounters</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {stats.available} available
            </Badge>
            <Badge variant="secondary">
              {stats.used}/{stats.total} used
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select 
            value={filter} 
            onValueChange={(value) => value && setFilter(value as 'all' | 'available' | 'used')}
          >
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {locations.map((location) => (
              <EncounterLocationCard
                key={location.id}
                location={location}
                onClick={() => {
                  setSelectedLocation(location);
                  setCatchDialogOpen(true);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {locations.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No locations found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Catch Dialog */}
      <CatchDialog
        open={catchDialogOpen}
        onOpenChange={setCatchDialogOpen}
        location={selectedLocation}
      />
    </div>
  );
}
