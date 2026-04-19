export type PokemonType =
  | 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice'
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug'
  | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy';

export type Nature =
  | 'Hardy' | 'Lonely' | 'Brave' | 'Adamant' | 'Naughty'
  | 'Bold' | 'Docile' | 'Relaxed' | 'Impish' | 'Lax'
  | 'Timid' | 'Hasty' | 'Serious' | 'Jolly' | 'Naive'
  | 'Modest' | 'Mild' | 'Quiet' | 'Bashful' | 'Rash'
  | 'Calm' | 'Gentle' | 'Sassy' | 'Careful' | 'Quirky';

export type StatusCondition = 'healthy' | 'poisoned' | 'burned' | 'paralyzed' | 'frozen' | 'asleep' | 'fainted';

export type PokemonStatus = 'active' | 'boxed' | 'dead';

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface PokemonMove {
  name: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  power: number | null;
  accuracy: number | null;
  pp: number;
  currentPp?: number;
}

export interface Pokemon {
  id: string;
  speciesId: number;
  nickname: string;
  species: string;
  types: [PokemonType] | [PokemonType, PokemonType];
  level: number;
  nature: Nature;
  ability: string;
  currentHp: number;
  maxHp: number;
  stats: PokemonStats;
  moves: PokemonMove[];
  heldItem: string | null;
  statusCondition: StatusCondition;
  status: PokemonStatus;
  encounteredAt: string;
  encounteredDate: string;
  capturedDate: string | null;
  deathDate: string | null;
  deathCause: string | null;
  deathLocation: string | null;
  notes: string;
  isShiny: boolean;
  gender: 'male' | 'female' | 'genderless';
  metLevel: number;
  currentExp?: number;
  friendship?: number;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  types: [PokemonType] | [PokemonType, PokemonType];
  baseStats: PokemonStats;
  abilities: string[];
  hiddenAbility?: string;
  evolutions?: number[];
  preEvolution?: number;
  spriteUrl: string;
  spriteShinyUrl?: string;
  catchRate: number;
  baseExp: number;
  genderRatio: number | null;
}
