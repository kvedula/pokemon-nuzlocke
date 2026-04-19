export type LocationType = 
  | 'route' 
  | 'town' 
  | 'city' 
  | 'gym' 
  | 'cave' 
  | 'dungeon' 
  | 'forest' 
  | 'building' 
  | 'water' 
  | 'island'
  | 'victory-road'
  | 'elite-four'
  | 'special';

export type LocationStatus = 
  | 'unvisited' 
  | 'current' 
  | 'visited' 
  | 'cleared' 
  | 'saved-here';

export type EncounterMethod = 
  | 'walking' 
  | 'surfing' 
  | 'fishing-old' 
  | 'fishing-good' 
  | 'fishing-super' 
  | 'rock-smash'
  | 'headbutt'
  | 'gift'
  | 'static'
  | 'trade'
  | 'fossil'
  | 'game-corner';

export interface WildEncounter {
  speciesId: number;
  speciesName: string;
  method: EncounterMethod;
  minLevel: number;
  maxLevel: number;
  rate: number;
  timeOfDay?: 'morning' | 'day' | 'night' | 'all';
  version?: 'firered' | 'leafgreen' | 'both';
}

export interface Trainer {
  id: string;
  name: string;
  class: string;
  pokemon: TrainerPokemon[];
  isRematchable: boolean;
  isBoss: boolean;
  reward: number;
  notes?: string;
}

export interface TrainerPokemon {
  speciesId: number;
  speciesName: string;
  level: number;
  moves?: string[];
  heldItem?: string;
  isAce?: boolean;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  description: string;
  status: LocationStatus;
  requiredHMs: string[];
  recommendedLevel: number;
  encounters: WildEncounter[];
  trainers: Trainer[];
  items: LocationItem[];
  connections: string[];
  notes: string;
  isFlyPoint: boolean;
  hasPokeCenter: boolean;
  hasPokeMart: boolean;
  gym?: GymInfo;
  mapPosition: { x: number; y: number };
  mapSize?: { width: number; height: number };
  encounterUsed: boolean;
  encounteredPokemonId?: string;
  defeatedTrainers: string[];
}

export interface LocationItem {
  name: string;
  type: 'visible' | 'hidden' | 'gift' | 'purchase';
  obtained: boolean;
  notes?: string;
}

export interface GymInfo {
  leader: string;
  badge: string;
  badgeNumber: number;
  specialty: string;
  reward: string;
  puzzle?: string;
}

export interface CustomPin {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  icon?: string;
  notes?: string;
  createdAt: string;
}
