'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { Location, LocationStatus, LocationType } from '@/types';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Home,
  Swords,
  Mountain,
  Trees,
  Waves,
  Building2,
  Star,
  ChevronRight,
  Save,
  X,
  Navigation,
  Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LocationDrawer } from './LocationDrawer';

const LOCATION_TYPE_ICONS: Record<LocationType, React.ElementType> = {
  route: MapPin,
  town: Home,
  city: Home,
  gym: Swords,
  cave: Mountain,
  dungeon: Mountain,
  forest: Trees,
  building: Building2,
  water: Waves,
  island: Waves,
  'victory-road': Mountain,
  'elite-four': Star,
  special: Star,
};

const STATUS_STYLES: Record<LocationStatus, { bg: string; border: string; text: string }> = {
  unvisited: { bg: 'bg-muted/30', border: 'border-border', text: 'text-muted-foreground' },
  current: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-500' },
  visited: { bg: 'bg-blue-500/15', border: 'border-blue-500/50', text: 'text-blue-400' },
  cleared: { bg: 'bg-purple-500/15', border: 'border-purple-500/50', text: 'text-purple-400' },
  'saved-here': { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-500' },
};

const REGION_ORDER = [
  { 
    name: '1. Starting Area', 
    locations: ['pallet-town', 'route-1', 'viridian-city', 'route-22'],
    notes: 'Get starter, deliver Oak\'s Parcel, optional early rival fight on Route 22'
  },
  { 
    name: '2. Viridian Forest & Pewter', 
    locations: ['route-2', 'viridian-forest', 'pewter-city', 'pewter-gym', 'pewter-museum'],
    notes: 'Badge 1: Brock (Rock). Catch Pikachu in forest for Misty!'
  },
  { 
    name: '3. Mt. Moon & Cerulean', 
    locations: ['route-3', 'mt-moon', 'route-4', 'cerulean-city', 'route-24', 'route-25', 'bills-house', 'cerulean-gym'],
    notes: 'Badge 2: Misty (Water). Get S.S. Ticket from Bill. Choose a fossil!'
  },
  { 
    name: '4. Vermilion City', 
    locations: ['route-5', 'underground-path-5-6', 'route-6', 'vermilion-city', 'ss-anne', 'diglett-cave', 'vermilion-gym'],
    notes: 'Badge 3: Lt. Surge (Electric). Get HM01 Cut from S.S. Anne Captain'
  },
  { 
    name: '5. Rock Tunnel & Lavender', 
    locations: ['route-9', 'rock-tunnel', 'route-10', 'lavender-town'],
    notes: 'Need Flash (from Oak\'s Aide on Route 2). Can\'t finish Pokemon Tower yet!'
  },
  { 
    name: '6. Celadon City', 
    locations: ['route-8', 'underground-path-7-8', 'route-7', 'celadon-city', 'rocket-hideout', 'celadon-gym'],
    notes: 'Badge 4: Erika (Grass). Get Silph Scope from Rocket Hideout. Free Eevee!'
  },
  { 
    name: '7. Pokemon Tower', 
    locations: ['pokemon-tower'],
    notes: 'Now with Silph Scope! Rival fight. Get Poke Flute from Mr. Fuji'
  },
  { 
    name: '8. Saffron City', 
    locations: ['saffron-city', 'silph-co', 'fighting-dojo', 'saffron-gym'],
    notes: 'Badge 5/6: Sabrina (Psychic). Need Tea from Celadon. Free Lapras at Silph Co!'
  },
  { 
    name: '9. Cycling Road', 
    locations: ['route-16', 'route-17', 'route-18'],
    notes: 'Wake Snorlax with Poke Flute. Get HM02 Fly behind the cut tree!'
  },
  { 
    name: '10. Fuchsia City', 
    locations: ['route-12', 'route-13', 'route-14', 'route-15', 'fuchsia-city', 'safari-zone', 'fuchsia-gym'],
    notes: 'Badge 5/6: Koga (Poison). Get HM03 Surf and HM04 Strength from Safari Zone'
  },
  { 
    name: '11. Seafoam & Cinnabar', 
    locations: ['route-19', 'route-20', 'seafoam-islands', 'cinnabar-island', 'pokemon-mansion', 'cinnabar-gym', 'route-21'],
    notes: 'Badge 7: Blaine (Fire). Get Secret Key from Pokemon Mansion. Articuno in Seafoam!'
  },
  { 
    name: '12. Viridian Gym', 
    locations: ['viridian-gym'],
    notes: 'Badge 8: Giovanni (Ground). Final gym - requires 7 badges to enter!'
  },
  { 
    name: '13. Victory Road & Elite Four', 
    locations: ['route-23', 'victory-road', 'indigo-plateau'],
    notes: 'Final stretch! Moltres in Victory Road. No healing between E4 battles!'
  },
  { 
    name: '14. Post-Game', 
    locations: ['cerulean-cave', 'power-plant'],
    notes: 'Mewtwo (Lv.70) in Cerulean Cave. Zapdos (Lv.50) at Power Plant'
  },
];

interface LocationRowProps {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
}

function LocationRow({ location, isSelected, onClick }: LocationRowProps) {
  const Icon = LOCATION_TYPE_ICONS[location.type] || MapPin;
  const style = STATUS_STYLES[location.status];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left',
        style.bg,
        style.border,
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      <div className={cn('p-1.5 rounded-md bg-background/50', style.text)}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium text-sm truncate', style.text)}>
            {location.name}
          </span>
          {location.status === 'current' && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500/20 border-emerald-500/50 text-emerald-400">
              Current
            </Badge>
          )}
          {location.status === 'saved-here' && (
            <Save className="w-3 h-3 text-amber-500" />
          )}
        </div>
        {location.gym && (
          <span className="text-xs text-muted-foreground">
            {location.gym.leader} • {location.gym.specialty}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {location.encounterUsed && (
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <X className="w-3 h-3 text-red-500" />
          </div>
        )}
        {location.status === 'cleared' && (
          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-purple-400" />
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.button>
  );
}

interface RegionSectionProps {
  name: string;
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  defaultOpen?: boolean;
  notes?: string;
}

function RegionSection({ name, locations, selectedId, onSelect, defaultOpen = false, notes }: RegionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const clearedCount = locations.filter(l => l.status === 'cleared').length;
  const visitedCount = locations.filter(l => ['visited', 'cleared', 'current', 'saved-here'].includes(l.status)).length;
  const progress = locations.length > 0 ? (visitedCount / locations.length) * 100 : 0;

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </motion.div>
        
        <span className="font-semibold flex-1 text-left">{name}</span>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {visitedCount}/{locations.length}
          </span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {notes && (
              <div className="mx-3 mb-2 px-3 py-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                {notes}
              </div>
            )}
            <div className="px-3 pb-3 space-y-1.5">
              {locations.map((location) => (
                <LocationRow
                  key={location.id}
                  location={location}
                  isSelected={selectedId === location.id}
                  onClick={() => onSelect(location.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface KantoMapSimpleProps {
  toggleButton?: React.ReactNode;
}

export function KantoMapSimple({ toggleButton }: KantoMapSimpleProps) {
  const currentRun = useRunStore((s) => s.currentRun);
  const setCurrentLocation = useRunStore((s) => s.setCurrentLocation);
  const setSaveLocation = useRunStore((s) => s.setSaveLocation);
  const { selectedLocationId, selectLocation } = useUIStore();

  const locations = currentRun?.locations || {};
  const selectedLocation = selectedLocationId ? locations[selectedLocationId] : null;

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No active run
      </div>
    );
  }

  const currentLocationRegion = REGION_ORDER.findIndex(r => 
    r.locations.includes(currentRun.currentLocation)
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 border-b bg-card/50">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Kanto Region
          </h2>
          <div className="flex items-center gap-4">
            {toggleButton}
            <div className="text-sm text-muted-foreground">
              {Object.values(locations).filter(l => l.status !== 'unvisited').length} / {Object.keys(locations).length} explored
            </div>
          </div>
        </div>
        
        {currentRun.currentLocation && locations[currentRun.currentLocation] && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-muted-foreground">Current:</span>
            <span className="font-medium text-emerald-500">
              {locations[currentRun.currentLocation].name}
            </span>
          </div>
        )}
      </div>

      {/* Location List - scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-3">
          {REGION_ORDER.map((region, index) => {
            const regionLocations = region.locations
              .map(id => locations[id])
              .filter(Boolean);
            
            if (regionLocations.length === 0) return null;

            return (
              <RegionSection
                key={region.name}
                name={region.name}
                locations={regionLocations}
                selectedId={selectedLocationId}
                onSelect={selectLocation}
                defaultOpen={index === currentLocationRegion || index === 0}
                notes={region.notes}
              />
            );
          })}
        </div>
      </div>

      {/* Location Drawer */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationDrawer
            location={selectedLocation}
            onClose={() => selectLocation(null)}
            onSetCurrent={() => setCurrentLocation(selectedLocation.id)}
            onSetSave={() => setSaveLocation(selectedLocation.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
