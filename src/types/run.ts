import { Pokemon } from './pokemon';
import { Location, CustomPin } from './location';

export type RunStatus = 'active' | 'completed' | 'failed';
export type GameMode = 'nuzlocke' | 'normal';

export interface NuzlockeRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'core' | 'catch' | 'death' | 'item' | 'level' | 'battle' | 'custom';
}

export interface RulePreset {
  id: string;
  name: string;
  description: string;
  rules: string[];
}

export interface Badge {
  id: string;
  name: string;
  gymLeader: string;
  gymLocation: string;
  obtained: boolean;
  obtainedDate?: string;
  teamSnapshot?: string[];
}

export interface BossEncounter {
  id: string;
  name: string;
  type: 'gym' | 'rival' | 'elite-four' | 'champion' | 'legendary' | 'team-rocket' | 'other';
  location: string;
  defeated: boolean;
  defeatedDate?: string;
  teamUsed?: string[];
  pokemonLost?: string[];
  attempts: number;
  notes: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
}

export interface RunEvent {
  id: string;
  type: 'catch' | 'death' | 'badge' | 'boss' | 'evolution' | 'hm' | 'note' | 'milestone';
  timestamp: string;
  title: string;
  description: string;
  pokemonId?: string;
  locationId?: string;
  metadata?: Record<string, unknown>;
}

export interface RunSnapshot {
  id: string;
  name: string;
  timestamp: string;
  badgeCount: number;
  party: string[];
  box: string[];
  graveyard: string[];
  currentLocation: string;
  playTime?: number;
  notes?: string;
}

export interface HMProgress {
  cut: boolean;
  fly: boolean;
  surf: boolean;
  strength: boolean;
  flash: boolean;
  rockSmash: boolean;
  waterfall: boolean;
  dive?: boolean;
}

export type ItemCategory = 'pokeball' | 'medicine' | 'battle' | 'berry' | 'tm' | 'key' | 'other';

export interface InventoryItem {
  name: string;
  quantity: number;
  category: ItemCategory;
}

export interface NuzlockeRun {
  id: string;
  name: string;
  game: 'firered' | 'leafgreen';
  gameMode: GameMode;
  startedAt: string;
  completedAt?: string;
  status: RunStatus;
  
  party: string[];
  box: string[];
  graveyard: string[];
  pokemon: Record<string, Pokemon>;
  
  locations: Record<string, Location>;
  currentLocation: string;
  saveLocation: string;
  customPins: CustomPin[];
  
  badges: Badge[];
  bossEncounters: BossEncounter[];
  events: RunEvent[];
  snapshots: RunSnapshot[];
  
  rules: NuzlockeRule[];
  hmProgress: HMProgress;
  inventory: InventoryItem[];
  
  pokedex: PokedexEntry[];
  
  notes: string;
  playTime: number;
  encounterCount: number;
  deathCount: number;
  money: number;
  
  lastModified: string;
  version: number;
}

export interface PokedexEntry {
  speciesId: number;
  seen: boolean;
  caught: boolean;
  seenAt?: string;
  caughtAt?: string;
  caughtLocation?: string;
  seenSource?: 'wild' | 'trainer' | 'caught';
  trainerEncounters?: string[];
}

export interface RunSummary {
  id: string;
  name: string;
  game: string;
  gameMode: GameMode;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  badgeCount: number;
  partyCount: number;
  deathCount: number;
  lastModified: string;
}
