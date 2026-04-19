import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  NuzlockeRun,
  Pokemon,
  Location,
  Badge,
  BossEncounter,
  RunEvent,
  RunSnapshot,
  CustomPin,
  HMProgress,
  NuzlockeRule,
  RunStatus,
  PokemonStatus,
  GameMode,
  PokedexEntry,
  InventoryItem,
  ItemCategory,
} from '@/types';
import { DEFAULT_RULES } from '@/data/rules';
import { createDefaultLocations } from '@/data/locations';
import { createDefaultBadges, createDefaultBossEncounters } from '@/data/badges';

function generateId(): string {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface RunState {
  currentRun: NuzlockeRun | null;
  undoStack: Array<{ action: string; state: Partial<NuzlockeRun> }>;
  redoStack: Array<{ action: string; state: Partial<NuzlockeRun> }>;
  
  createRun: (name: string, game: 'firered' | 'leafgreen', gameMode?: GameMode) => NuzlockeRun;
  loadRun: (run: NuzlockeRun) => void;
  deleteRun: () => void;
  refreshLocationData: () => void;
  
  addPokemon: (pokemon: Omit<Pokemon, 'id'>) => Pokemon;
  updatePokemon: (id: string, updates: Partial<Pokemon>) => void;
  removePokemon: (id: string) => void;
  movePokemonToParty: (id: string) => void;
  movePokemonToBox: (id: string) => void;
  markPokemonDead: (id: string, cause: string, location: string) => void;
  reorderParty: (newOrder: string[]) => void;
  
  updateLocation: (id: string, updates: Partial<Location>) => void;
  setCurrentLocation: (id: string) => void;
  setSaveLocation: (id: string) => void;
  markEncounterUsed: (locationId: string, pokemonId?: string) => void;
  defeatTrainer: (locationId: string, trainerId: string) => void;
  undefeatTrainer: (locationId: string, trainerId: string) => void;
  
  addCustomPin: (pin: Omit<CustomPin, 'id' | 'createdAt'>) => void;
  updateCustomPin: (id: string, updates: Partial<CustomPin>) => void;
  removeCustomPin: (id: string) => void;
  
  obtainBadge: (badgeId: string) => void;
  defeatBoss: (bossId: string, teamUsed: string[], pokemonLost: string[]) => void;
  
  addEvent: (event: Omit<RunEvent, 'id' | 'timestamp'>) => void;
  createSnapshot: (name: string) => void;
  
  updateRules: (rules: NuzlockeRule[]) => void;
  toggleRule: (ruleId: string) => void;
  updateHMProgress: (hm: keyof HMProgress, obtained: boolean) => void;
  
  updateInventory: (itemName: string, quantity: number, category?: string) => void;
  updateMoney: (amount: number) => void;
  
  updateNotes: (notes: string) => void;
  updatePlayTime: (minutes: number) => void;
  
  markPokemonSeen: (speciesId: number, locationId?: string) => void;
  markPokemonCaught: (speciesId: number, locationId?: string) => void;
  
  undo: () => void;
  redo: () => void;
  
  exportRun: () => string;
  getRunSummary: () => { badgeCount: number; partyCount: number; deathCount: number } | null;
}

export const useRunStore = create<RunState>()(
  subscribeWithSelector((set, get) => ({
    currentRun: null,
    undoStack: [],
    redoStack: [],

    createRun: (name, game, gameMode = 'nuzlocke') => {
      const run: NuzlockeRun = {
        id: generateId(),
        name,
        game,
        gameMode,
        startedAt: new Date().toISOString(),
        status: 'active',
        party: [],
        box: [],
        graveyard: [],
        pokemon: {},
        locations: createDefaultLocations(),
        currentLocation: 'pallet-town',
        saveLocation: 'pallet-town',
        customPins: [],
        badges: createDefaultBadges(),
        bossEncounters: createDefaultBossEncounters(),
        events: [{
          id: generateId(),
          type: 'milestone',
          timestamp: new Date().toISOString(),
          title: 'Run Started',
          description: `Started ${name} - ${game === 'firered' ? 'FireRed' : 'LeafGreen'} Nuzlocke`,
        }],
        snapshots: [],
        rules: gameMode === 'nuzlocke' ? DEFAULT_RULES.map(r => ({ ...r })) : [],
        pokedex: Array.from({ length: 151 }, (_, i) => ({
          speciesId: i + 1,
          seen: false,
          caught: false,
        })),
        hmProgress: {
          cut: false,
          fly: false,
          surf: false,
          strength: false,
          flash: false,
          rockSmash: false,
          waterfall: false,
        },
        inventory: [],
        notes: '',
        playTime: 0,
        encounterCount: 0,
        deathCount: 0,
        money: 3000,
        lastModified: new Date().toISOString(),
        version: 1,
      };
      
      set({ currentRun: run, undoStack: [], redoStack: [] });
      return run;
    },

    loadRun: (run) => {
      set({ currentRun: run, undoStack: [], redoStack: [] });
      get().refreshLocationData();
    },

    deleteRun: () => {
      set({ currentRun: null, undoStack: [], redoStack: [] });
    },

    refreshLocationData: () => {
      const state = get();
      if (!state.currentRun) return;
      
      const freshLocations = createDefaultLocations();
      const updatedLocations: Record<string, Location> = {};
      
      for (const [locId, freshLoc] of Object.entries(freshLocations)) {
        const existingLoc = state.currentRun.locations[locId];
        if (existingLoc) {
          updatedLocations[locId] = {
            ...freshLoc,
            status: existingLoc.status,
            encounterUsed: existingLoc.encounterUsed,
            encounteredPokemonId: existingLoc.encounteredPokemonId,
            defeatedTrainers: existingLoc.defeatedTrainers || [],
            items: freshLoc.items.map((freshItem, idx) => {
              const existingItem = existingLoc.items.find(i => i.name === freshItem.name);
              return existingItem ? { ...freshItem, obtained: existingItem.obtained } : freshItem;
            }),
          };
        } else {
          updatedLocations[locId] = { ...freshLoc, defeatedTrainers: [] };
        }
      }
      
      set({
        currentRun: {
          ...state.currentRun,
          locations: updatedLocations,
          lastModified: new Date().toISOString(),
        },
      });
    },

    addPokemon: (pokemonData) => {
      const state = get();
      if (!state.currentRun) throw new Error('No active run');
      
      const pokemon: Pokemon = {
        ...pokemonData,
        id: generateId(),
      };
      
      const updatedPokemon = { ...state.currentRun.pokemon, [pokemon.id]: pokemon };
      const updatedParty = pokemon.status === 'active' 
        ? [...state.currentRun.party, pokemon.id]
        : state.currentRun.party;
      const updatedBox = pokemon.status === 'boxed'
        ? [...state.currentRun.box, pokemon.id]
        : state.currentRun.box;
      
      const pokedex = [...(state.currentRun.pokedex || [])];
      const speciesId = pokemon.speciesId;
      const entryIndex = pokedex.findIndex((e) => e.speciesId === speciesId);
      const now = new Date().toISOString();
      
      if (entryIndex >= 0) {
        pokedex[entryIndex] = {
          ...pokedex[entryIndex],
          seen: true,
          caught: true,
          seenAt: pokedex[entryIndex].seenAt || now,
          caughtAt: now,
          caughtLocation: pokemon.encounteredAt,
        };
      } else {
        pokedex.push({
          speciesId,
          seen: true,
          caught: true,
          seenAt: now,
          caughtAt: now,
          caughtLocation: pokemon.encounteredAt,
        });
      }
      
      set({
        currentRun: {
          ...state.currentRun,
          pokemon: updatedPokemon,
          party: updatedParty,
          box: updatedBox,
          pokedex,
          encounterCount: state.currentRun.encounterCount + 1,
          lastModified: new Date().toISOString(),
        },
        undoStack: [...state.undoStack, { action: 'addPokemon', state: { pokemon: state.currentRun.pokemon } }],
        redoStack: [],
      });
      
      return pokemon;
    },

    updatePokemon: (id, updates) => {
      const state = get();
      if (!state.currentRun || !state.currentRun.pokemon[id]) return;
      
      const oldPokemon = state.currentRun.pokemon[id];
      const updatedPokemon = {
        ...state.currentRun.pokemon,
        [id]: { ...oldPokemon, ...updates },
      };
      
      set({
        currentRun: {
          ...state.currentRun,
          pokemon: updatedPokemon,
          lastModified: new Date().toISOString(),
        },
      });
    },

    removePokemon: (id) => {
      const state = get();
      if (!state.currentRun) return;
      
      const { [id]: removed, ...remainingPokemon } = state.currentRun.pokemon;
      
      set({
        currentRun: {
          ...state.currentRun,
          pokemon: remainingPokemon,
          party: state.currentRun.party.filter(pid => pid !== id),
          box: state.currentRun.box.filter(pid => pid !== id),
          graveyard: state.currentRun.graveyard.filter(pid => pid !== id),
          lastModified: new Date().toISOString(),
        },
      });
    },

    movePokemonToParty: (id) => {
      const state = get();
      if (!state.currentRun || !state.currentRun.pokemon[id]) return;
      if (state.currentRun.party.length >= 6) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          party: [...state.currentRun.party.filter(pid => pid !== id), id],
          box: state.currentRun.box.filter(pid => pid !== id),
          pokemon: {
            ...state.currentRun.pokemon,
            [id]: { ...state.currentRun.pokemon[id], status: 'active' },
          },
          lastModified: new Date().toISOString(),
        },
      });
    },

    movePokemonToBox: (id) => {
      const state = get();
      if (!state.currentRun || !state.currentRun.pokemon[id]) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          party: state.currentRun.party.filter(pid => pid !== id),
          box: [...state.currentRun.box.filter(pid => pid !== id), id],
          pokemon: {
            ...state.currentRun.pokemon,
            [id]: { ...state.currentRun.pokemon[id], status: 'boxed' },
          },
          lastModified: new Date().toISOString(),
        },
      });
    },

    markPokemonDead: (id, cause, location) => {
      const state = get();
      if (!state.currentRun || !state.currentRun.pokemon[id]) return;
      
      const pokemon = state.currentRun.pokemon[id];
      const updatedPokemon: Pokemon = {
        ...pokemon,
        status: 'dead',
        statusCondition: 'fainted',
        deathDate: new Date().toISOString(),
        deathCause: cause,
        deathLocation: location,
      };
      
      set({
        currentRun: {
          ...state.currentRun,
          party: state.currentRun.party.filter(pid => pid !== id),
          box: state.currentRun.box.filter(pid => pid !== id),
          graveyard: [...state.currentRun.graveyard, id],
          pokemon: { ...state.currentRun.pokemon, [id]: updatedPokemon },
          deathCount: state.currentRun.deathCount + 1,
          events: [...state.currentRun.events, {
            id: generateId(),
            type: 'death',
            timestamp: new Date().toISOString(),
            title: `${pokemon.nickname} Fell`,
            description: `${pokemon.nickname} the ${pokemon.species} was lost at ${location}. ${cause}`,
            pokemonId: id,
            locationId: location,
          }],
          lastModified: new Date().toISOString(),
        },
        undoStack: [...state.undoStack, { 
          action: 'markPokemonDead', 
          state: { 
            pokemon: state.currentRun.pokemon,
            party: state.currentRun.party,
            box: state.currentRun.box,
            graveyard: state.currentRun.graveyard,
          } 
        }],
        redoStack: [],
      });
    },

    reorderParty: (newOrder) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          party: newOrder,
          lastModified: new Date().toISOString(),
        },
      });
    },

    updateLocation: (id, updates) => {
      const state = get();
      if (!state.currentRun || !state.currentRun.locations[id]) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          locations: {
            ...state.currentRun.locations,
            [id]: { ...state.currentRun.locations[id], ...updates },
          },
          lastModified: new Date().toISOString(),
        },
      });
    },

    setCurrentLocation: (id) => {
      const state = get();
      if (!state.currentRun) return;
      
      const prevLocation = state.currentRun.currentLocation;
      
      set({
        currentRun: {
          ...state.currentRun,
          currentLocation: id,
          locations: {
            ...state.currentRun.locations,
            [prevLocation]: { 
              ...state.currentRun.locations[prevLocation], 
              status: state.currentRun.locations[prevLocation]?.status === 'current' 
                ? 'visited' 
                : state.currentRun.locations[prevLocation]?.status 
            },
            [id]: { ...state.currentRun.locations[id], status: 'current' },
          },
          lastModified: new Date().toISOString(),
        },
      });
    },

    setSaveLocation: (id) => {
      const state = get();
      if (!state.currentRun) return;
      
      const prevSaveLocation = state.currentRun.saveLocation;
      
      set({
        currentRun: {
          ...state.currentRun,
          saveLocation: id,
          locations: {
            ...state.currentRun.locations,
            ...(prevSaveLocation !== id && state.currentRun.locations[prevSaveLocation]?.status === 'saved-here' 
              ? { [prevSaveLocation]: { ...state.currentRun.locations[prevSaveLocation], status: 'visited' } }
              : {}),
            [id]: { ...state.currentRun.locations[id], status: 'saved-here' },
          },
          lastModified: new Date().toISOString(),
        },
      });
    },

    markEncounterUsed: (locationId, pokemonId) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          locations: {
            ...state.currentRun.locations,
            [locationId]: { 
              ...state.currentRun.locations[locationId], 
              encounterUsed: true,
              encounteredPokemonId: pokemonId,
            },
          },
          lastModified: new Date().toISOString(),
        },
      });
    },

    defeatTrainer: (locationId, trainerId) => {
      const state = get();
      if (!state.currentRun) return;
      
      const location = state.currentRun.locations[locationId];
      if (!location) return;
      
      const trainer = location.trainers.find(t => t.id === trainerId);
      if (!trainer) return;
      
      const defeatedTrainers = location.defeatedTrainers || [];
      if (defeatedTrainers.includes(trainerId)) return;
      
      const pokedex = [...(state.currentRun.pokedex || [])];
      const now = new Date().toISOString();
      const trainerLabel = `${trainer.name} (${trainer.class}) at ${location.name}`;
      
      trainer.pokemon.forEach(poke => {
        const entryIndex = pokedex.findIndex(e => e.speciesId === poke.speciesId);
        if (entryIndex >= 0) {
          const entry = pokedex[entryIndex];
          if (!entry.seen) {
            pokedex[entryIndex] = {
              ...entry,
              seen: true,
              seenAt: now,
              seenSource: 'trainer',
              trainerEncounters: [...(entry.trainerEncounters || []), trainerLabel],
            };
          } else {
            pokedex[entryIndex] = {
              ...entry,
              trainerEncounters: [...(entry.trainerEncounters || []), trainerLabel],
            };
          }
        } else {
          pokedex.push({
            speciesId: poke.speciesId,
            seen: true,
            caught: false,
            seenAt: now,
            seenSource: 'trainer',
            trainerEncounters: [trainerLabel],
          });
        }
      });
      
      set({
        currentRun: {
          ...state.currentRun,
          locations: {
            ...state.currentRun.locations,
            [locationId]: {
              ...location,
              defeatedTrainers: [...defeatedTrainers, trainerId],
            },
          },
          pokedex,
          lastModified: new Date().toISOString(),
        },
      });
    },

    undefeatTrainer: (locationId, trainerId) => {
      const state = get();
      if (!state.currentRun) return;
      
      const location = state.currentRun.locations[locationId];
      if (!location) return;
      
      const defeatedTrainers = location.defeatedTrainers || [];
      
      set({
        currentRun: {
          ...state.currentRun,
          locations: {
            ...state.currentRun.locations,
            [locationId]: {
              ...location,
              defeatedTrainers: defeatedTrainers.filter(id => id !== trainerId),
            },
          },
          lastModified: new Date().toISOString(),
        },
      });
    },

    addCustomPin: (pinData) => {
      const state = get();
      if (!state.currentRun) return;
      
      const pin: CustomPin = {
        ...pinData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      
      set({
        currentRun: {
          ...state.currentRun,
          customPins: [...state.currentRun.customPins, pin],
          lastModified: new Date().toISOString(),
        },
      });
    },

    updateCustomPin: (id, updates) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          customPins: state.currentRun.customPins.map(pin =>
            pin.id === id ? { ...pin, ...updates } : pin
          ),
          lastModified: new Date().toISOString(),
        },
      });
    },

    removeCustomPin: (id) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          customPins: state.currentRun.customPins.filter(pin => pin.id !== id),
          lastModified: new Date().toISOString(),
        },
      });
    },

    obtainBadge: (badgeId) => {
      const state = get();
      if (!state.currentRun) return;
      
      const badge = state.currentRun.badges.find(b => b.id === badgeId);
      if (!badge || badge.obtained) return;
      
      const teamSnapshot = state.currentRun.party.slice();
      
      set({
        currentRun: {
          ...state.currentRun,
          badges: state.currentRun.badges.map(b =>
            b.id === badgeId ? { ...b, obtained: true, obtainedDate: new Date().toISOString(), teamSnapshot } : b
          ),
          events: [...state.currentRun.events, {
            id: generateId(),
            type: 'badge',
            timestamp: new Date().toISOString(),
            title: `${badge.name} Obtained!`,
            description: `Defeated ${badge.gymLeader} and obtained the ${badge.name}!`,
            locationId: badge.gymLocation,
          }],
          lastModified: new Date().toISOString(),
        },
      });
    },

    defeatBoss: (bossId, teamUsed, pokemonLost) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          bossEncounters: state.currentRun.bossEncounters.map(boss =>
            boss.id === bossId ? { 
              ...boss, 
              defeated: true, 
              defeatedDate: new Date().toISOString(),
              teamUsed,
              pokemonLost,
              attempts: boss.attempts + 1,
            } : boss
          ),
          events: [...state.currentRun.events, {
            id: generateId(),
            type: 'boss',
            timestamp: new Date().toISOString(),
            title: `Defeated ${state.currentRun.bossEncounters.find(b => b.id === bossId)?.name}!`,
            description: `Successfully defeated the boss encounter.`,
          }],
          lastModified: new Date().toISOString(),
        },
      });
    },

    addEvent: (eventData) => {
      const state = get();
      if (!state.currentRun) return;
      
      const event: RunEvent = {
        ...eventData,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };
      
      set({
        currentRun: {
          ...state.currentRun,
          events: [...state.currentRun.events, event],
          lastModified: new Date().toISOString(),
        },
      });
    },

    createSnapshot: (name) => {
      const state = get();
      if (!state.currentRun) return;
      
      const snapshot: RunSnapshot = {
        id: generateId(),
        name,
        timestamp: new Date().toISOString(),
        badgeCount: state.currentRun.badges.filter(b => b.obtained).length,
        party: [...state.currentRun.party],
        box: [...state.currentRun.box],
        graveyard: [...state.currentRun.graveyard],
        currentLocation: state.currentRun.currentLocation,
        playTime: state.currentRun.playTime,
      };
      
      set({
        currentRun: {
          ...state.currentRun,
          snapshots: [...state.currentRun.snapshots, snapshot],
          lastModified: new Date().toISOString(),
        },
      });
    },

    updateRules: (rules) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          rules,
          lastModified: new Date().toISOString(),
        },
      });
    },

    toggleRule: (ruleId) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          rules: state.currentRun.rules.map(rule =>
            rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
          ),
          lastModified: new Date().toISOString(),
        },
      });
    },

    updateHMProgress: (hm, obtained) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          hmProgress: { ...state.currentRun.hmProgress, [hm]: obtained },
          events: [...state.currentRun.events, {
            id: generateId(),
            type: 'hm',
            timestamp: new Date().toISOString(),
            title: `${hm.toUpperCase()} ${obtained ? 'Obtained' : 'Lost'}`,
            description: `HM ${hm} is now ${obtained ? 'available' : 'unavailable'}.`,
          }],
          lastModified: new Date().toISOString(),
        },
      });
    },

    updateInventory: (itemName, quantity, category = 'other') => {
      const state = get();
      if (!state.currentRun) return;
      
      const inventory = [...(state.currentRun.inventory || [])];
      const existingIndex = inventory.findIndex(
        item => item.name.toLowerCase() === itemName.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        if (quantity <= 0) {
          inventory.splice(existingIndex, 1);
        } else {
          inventory[existingIndex] = {
            ...inventory[existingIndex],
            quantity,
          };
        }
      } else if (quantity > 0) {
        inventory.push({
          name: itemName,
          quantity,
          category: category as ItemCategory,
        });
      }
      
      set({
        currentRun: {
          ...state.currentRun,
          inventory,
          lastModified: new Date().toISOString(),
        },
      });
    },

    updateMoney: (amount) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          money: Math.max(0, amount),
          lastModified: new Date().toISOString(),
        },
      });
    },

    updateNotes: (notes) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          notes,
          lastModified: new Date().toISOString(),
        },
      });
    },

    updatePlayTime: (minutes) => {
      const state = get();
      if (!state.currentRun) return;
      
      set({
        currentRun: {
          ...state.currentRun,
          playTime: minutes,
          lastModified: new Date().toISOString(),
        },
      });
    },

    markPokemonSeen: (speciesId, locationId) => {
      const state = get();
      if (!state.currentRun) return;
      
      const pokedex = [...(state.currentRun.pokedex || [])];
      const entryIndex = pokedex.findIndex((e) => e.speciesId === speciesId);
      
      if (entryIndex >= 0) {
        if (pokedex[entryIndex].seen) return;
        pokedex[entryIndex] = {
          ...pokedex[entryIndex],
          seen: true,
          seenAt: new Date().toISOString(),
        };
      } else {
        pokedex.push({
          speciesId,
          seen: true,
          caught: false,
          seenAt: new Date().toISOString(),
        });
      }
      
      set({
        currentRun: {
          ...state.currentRun,
          pokedex,
          lastModified: new Date().toISOString(),
        },
      });
    },

    markPokemonCaught: (speciesId, locationId) => {
      const state = get();
      if (!state.currentRun) return;
      
      const pokedex = [...(state.currentRun.pokedex || [])];
      const entryIndex = pokedex.findIndex((e) => e.speciesId === speciesId);
      const now = new Date().toISOString();
      
      if (entryIndex >= 0) {
        pokedex[entryIndex] = {
          ...pokedex[entryIndex],
          seen: true,
          caught: true,
          seenAt: pokedex[entryIndex].seenAt || now,
          caughtAt: now,
          caughtLocation: locationId,
        };
      } else {
        pokedex.push({
          speciesId,
          seen: true,
          caught: true,
          seenAt: now,
          caughtAt: now,
          caughtLocation: locationId,
        });
      }
      
      set({
        currentRun: {
          ...state.currentRun,
          pokedex,
          lastModified: new Date().toISOString(),
        },
      });
    },

    undo: () => {
      const state = get();
      if (!state.currentRun || state.undoStack.length === 0) return;
      
      const lastAction = state.undoStack[state.undoStack.length - 1];
      const newUndoStack = state.undoStack.slice(0, -1);
      
      set({
        currentRun: {
          ...state.currentRun,
          ...lastAction.state,
          lastModified: new Date().toISOString(),
        },
        undoStack: newUndoStack,
        redoStack: [...state.redoStack, { 
          action: lastAction.action, 
          state: { ...state.currentRun } 
        }],
      });
    },

    redo: () => {
      const state = get();
      if (!state.currentRun || state.redoStack.length === 0) return;
      
      const lastRedo = state.redoStack[state.redoStack.length - 1];
      const newRedoStack = state.redoStack.slice(0, -1);
      
      set({
        currentRun: {
          ...state.currentRun,
          ...lastRedo.state,
          lastModified: new Date().toISOString(),
        },
        undoStack: [...state.undoStack, { 
          action: lastRedo.action, 
          state: { ...state.currentRun } 
        }],
        redoStack: newRedoStack,
      });
    },

    exportRun: () => {
      const state = get();
      if (!state.currentRun) return '{}';
      return JSON.stringify(state.currentRun, null, 2);
    },

    getRunSummary: () => {
      const state = get();
      if (!state.currentRun) return null;
      return {
        badgeCount: state.currentRun.badges.filter(b => b.obtained).length,
        partyCount: state.currentRun.party.length,
        deathCount: state.currentRun.deathCount,
      };
    },
  }))
);
