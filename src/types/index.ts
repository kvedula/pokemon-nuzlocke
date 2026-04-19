export * from './pokemon';
export * from './location';
export * from './run';

export interface AppState {
  currentRunId: string | null;
  runs: Record<string, import('./run').NuzlockeRun>;
  settings: AppSettings;
  ui: UIState;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  autoSaveInterval: number;
  showLevelCaps: boolean;
  showTypeMatchups: boolean;
  confirmDeaths: boolean;
  soundEnabled: boolean;
  animations: boolean;
}

export interface UIState {
  sidebarOpen: boolean;
  selectedLocationId: string | null;
  selectedPokemonId: string | null;
  mapZoom: number;
  mapPosition: { x: number; y: number };
  commandPaletteOpen: boolean;
  activeTab: 'dashboard' | 'map' | 'team' | 'encounters' | 'rules' | 'timeline' | 'pokedex';
}

export interface UndoAction {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  previousState: unknown;
  currentState: unknown;
}
