'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { POKEMON_SPECIES, getPokemonByName } from '@/data/pokemon';
import { Pokemon, PokemonStats } from '@/types';
import { cn } from '@/lib/utils';
import {
  X,
  Send,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  User,
  CheckCircle2,
  MapPin,
  Award,
  Swords,
  Navigation,
  Circle,
  BarChart3,
  Package,
  Coins,
  RefreshCw,
  Undo2,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  executedActions?: ExecutedAction[];
}

interface RunContext {
  runName: string;
  game: string;
  badges: number;
  currentLocation: string;
  saveLocation: string;
  party: Array<{
    name: string;
    species: string;
    level: number;
    types: string[];
  }>;
  boxCount: number;
  graveyardCount: number;
  pokedexSeen: number;
  pokedexCaught: number;
}

type ActiveTab = 'dashboard' | 'map' | 'walkthrough' | 'team' | 'encounters' | 'rules' | 'timeline' | 'pokedex' | 'extras';

const VALID_TABS: ActiveTab[] = ['dashboard', 'map', 'walkthrough', 'team', 'encounters', 'rules', 'timeline', 'pokedex', 'extras'];

const BADGE_MAP: Record<string, string> = {
  'boulder': 'boulder-badge',
  'cascade': 'cascade-badge',
  'thunder': 'thunder-badge',
  'rainbow': 'rainbow-badge',
  'soul': 'soul-badge',
  'marsh': 'marsh-badge',
  'volcano': 'volcano-badge',
  'earth': 'earth-badge',
};

// Game progression excluding gyms - gyms should only be marked when player beats the gym leader
const GAME_PROGRESSION: string[] = [
  'pallet-town', 'route-1', 'viridian-city', 'route-22', 'route-2', 'viridian-forest',
  'pewter-city', 'route-3', 'mt-moon', 'route-4', 'cerulean-city',
  'route-24', 'route-25', 'route-5', 'route-6', 'vermilion-city',
  'ss-anne', 'route-11', 'digletts-cave', 'route-9', 'route-10',
  'rock-tunnel', 'lavender-town', 'pokemon-tower', 'route-8', 'route-7', 'celadon-city',
  'rocket-hideout', 'route-16', 'route-17', 'route-18', 'fuchsia-city',
  'safari-zone', 'route-12', 'route-13', 'route-14', 'route-15',
  'power-plant', 'route-19', 'route-20', 'seafoam-islands', 'cinnabar-island',
  'pokemon-mansion', 'route-21', 'route-23', 'victory-road', 'indigo-plateau'
];

const GYM_LOCATIONS = [
  'pewter-gym', 'cerulean-gym', 'vermilion-gym', 'celadon-gym',
  'fuchsia-gym', 'saffron-gym', 'cinnabar-gym', 'viridian-gym'
];

interface ActionHandlers {
  setActiveTab: (tab: ActiveTab) => void;
  obtainBadge: (badgeId: string) => void;
  defeatAllTrainers: (locationId: string) => void;
  setCurrentLocation: (locationId: string) => void;
  getLocations: () => Record<string, { id: string; name: string; trainers: { id: string }[] }> | null;
  catchPokemon: (speciesName: string, nickname: string, level: number, locationId: string) => string | null;
  updatePokemon: (nickname: string, field: string, value: string) => boolean;
  updatePokemonStats: (nickname: string, stats: PokemonStats) => boolean;
  evolvePokemon: (nickname: string, newSpeciesName: string) => boolean;
  getPokemonByNickname: (nickname: string) => Pokemon | null;
  updateInventory: (itemName: string, quantity: number, category: string) => void;
  updateMoney: (amount: number) => void;
  updatePlayTime: (totalMinutes: number) => void;
  syncProgressTo: (locationId: string) => { locationsVisited: number; trainersDefeated: number };
  unclearLocation: (locationId: string) => boolean;
  undefeatTrainers: (locationId: string) => number;
  markVisited: (locationId: string) => boolean;
}

interface ExecutedAction {
  type: string;
  description: string;
}

function parseActions(content: string, handlers: ActionHandlers): { cleanedContent: string; executedActions: ExecutedAction[] } {
  const executedActions: ExecutedAction[] = [];
  let cleanedContent = content;
  
  // Navigate actions
  const navRegex = /\[ACTION:navigate:(\w+)\]/g;
  let match;
  while ((match = navRegex.exec(content)) !== null) {
    const tab = match[1] as ActiveTab;
    if (VALID_TABS.includes(tab)) {
      setTimeout(() => handlers.setActiveTab(tab), 100);
      executedActions.push({ type: 'navigate', description: `Navigated to ${tab}` });
    }
  }
  cleanedContent = cleanedContent.replace(navRegex, '');
  
  // Badge actions
  const badgeRegex = /\[ACTION:obtainBadge:(\w+)\]/g;
  while ((match = badgeRegex.exec(content)) !== null) {
    const badgeName = match[1].toLowerCase();
    const badgeId = BADGE_MAP[badgeName];
    if (badgeId) {
      setTimeout(() => handlers.obtainBadge(badgeId), 100);
      executedActions.push({ type: 'badge', description: `Obtained ${badgeName.charAt(0).toUpperCase() + badgeName.slice(1)} Badge` });
    }
  }
  cleanedContent = cleanedContent.replace(badgeRegex, '');
  
  // Defeat all trainers actions
  const defeatRegex = /\[ACTION:defeatAllTrainers:([\w-]+)\]/g;
  while ((match = defeatRegex.exec(content)) !== null) {
    const locationId = match[1];
    setTimeout(() => handlers.defeatAllTrainers(locationId), 100);
    const locations = handlers.getLocations();
    const locationName = locations?.[locationId]?.name || locationId;
    executedActions.push({ type: 'trainers', description: `Defeated all trainers at ${locationName}` });
  }
  cleanedContent = cleanedContent.replace(defeatRegex, '');
  
  // Set location actions
  const locationRegex = /\[ACTION:setLocation:([\w-]+)\]/g;
  while ((match = locationRegex.exec(content)) !== null) {
    const locationId = match[1];
    setTimeout(() => handlers.setCurrentLocation(locationId), 100);
    const locations = handlers.getLocations();
    const locationName = locations?.[locationId]?.name || locationId;
    executedActions.push({ type: 'location', description: `Set location to ${locationName}` });
  }
  cleanedContent = cleanedContent.replace(locationRegex, '');
  
  // Mark visited actions
  const visitedRegex = /\[ACTION:markVisited:([\w-]+)\]/g;
  while ((match = visitedRegex.exec(content)) !== null) {
    const locationId = match[1];
    const locations = handlers.getLocations();
    const locationName = locations?.[locationId]?.name || locationId;
    const success = handlers.markVisited(locationId);
    if (success) {
      executedActions.push({ type: 'location', description: `Marked ${locationName} as visited` });
    }
  }
  cleanedContent = cleanedContent.replace(visitedRegex, '');
  
  // Catch Pokemon actions
  const catchRegex = /\[ACTION:catchPokemon:([^|]+)\|([^|]+)\|(\d+)\|([\w-]+)\]/g;
  while ((match = catchRegex.exec(content)) !== null) {
    const [, speciesName, nickname, levelStr, locationId] = match;
    const level = parseInt(levelStr, 10);
    setTimeout(() => {
      const result = handlers.catchPokemon(speciesName, nickname, level, locationId);
      if (result) {
        console.log('Pokemon caught:', result);
      }
    }, 100);
    const locations = handlers.getLocations();
    const locationName = locations?.[locationId]?.name || locationId;
    executedActions.push({ 
      type: 'catch', 
      description: `Caught ${nickname} the ${speciesName} (Lv.${level}) at ${locationName}` 
    });
  }
  cleanedContent = cleanedContent.replace(catchRegex, '');
  
  // Update Pokemon field actions
  const updateFieldRegex = /\[ACTION:updatePokemon:([^|]+)\|([^|]+)\|([^\]]+)\]/g;
  while ((match = updateFieldRegex.exec(content)) !== null) {
    const [, nickname, field, value] = match;
    setTimeout(() => handlers.updatePokemon(nickname, field, value), 100);
    executedActions.push({ 
      type: 'update', 
      description: `Updated ${nickname}'s ${field} to ${value}` 
    });
  }
  cleanedContent = cleanedContent.replace(updateFieldRegex, '');
  
  // Update Pokemon stats actions
  const updateStatsRegex = /\[ACTION:updatePokemonStats:([^|]+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\]/g;
  while ((match = updateStatsRegex.exec(content)) !== null) {
    const [, nickname, hp, atk, def, spAtk, spDef, speed] = match;
    const stats: PokemonStats = {
      hp: parseInt(hp, 10),
      attack: parseInt(atk, 10),
      defense: parseInt(def, 10),
      spAtk: parseInt(spAtk, 10),
      spDef: parseInt(spDef, 10),
      speed: parseInt(speed, 10),
    };
    setTimeout(() => handlers.updatePokemonStats(nickname, stats), 100);
    executedActions.push({ 
      type: 'update', 
      description: `Updated ${nickname}'s stats (HP:${hp} ATK:${atk} DEF:${def} SpA:${spAtk} SpD:${spDef} SPE:${speed})` 
    });
  }
  cleanedContent = cleanedContent.replace(updateStatsRegex, '');
  
  // Evolve Pokemon actions
  const evolveRegex = /\[ACTION:evolvePokemon:([^|]+)\|([^\]]+)\]/g;
  while ((match = evolveRegex.exec(content)) !== null) {
    const [, nickname, newSpeciesName] = match;
    setTimeout(() => handlers.evolvePokemon(nickname, newSpeciesName), 100);
    executedActions.push({ 
      type: 'evolve', 
      description: `Evolved ${nickname} to ${newSpeciesName}` 
    });
  }
  cleanedContent = cleanedContent.replace(evolveRegex, '');
  
  // Inventory actions
  const itemRegex = /\[ACTION:setItem:([^|]+)\|(\d+)\|(\w+)\]/g;
  while ((match = itemRegex.exec(content)) !== null) {
    const [, itemName, quantityStr, category] = match;
    const quantity = parseInt(quantityStr, 10);
    setTimeout(() => handlers.updateInventory(itemName, quantity, category), 100);
    executedActions.push({ 
      type: 'inventory', 
      description: `Set ${itemName} x${quantity}` 
    });
  }
  cleanedContent = cleanedContent.replace(itemRegex, '');
  
  // Money actions
  const moneyRegex = /\[ACTION:setMoney:(\d+)\]/g;
  while ((match = moneyRegex.exec(content)) !== null) {
    const amount = parseInt(match[1], 10);
    setTimeout(() => handlers.updateMoney(amount), 100);
    executedActions.push({ 
      type: 'money', 
      description: `Set money to ₽${amount.toLocaleString()}` 
    });
  }
  cleanedContent = cleanedContent.replace(moneyRegex, '');
  
  // Play time actions
  const playTimeRegex = /\[ACTION:setPlayTime:(\d+)\|(\d+)\]/g;
  while ((match = playTimeRegex.exec(content)) !== null) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const totalMinutes = (hours * 60) + minutes;
    setTimeout(() => handlers.updatePlayTime(totalMinutes), 100);
    executedActions.push({ 
      type: 'playtime', 
      description: `Set play time to ${hours}h ${minutes}m` 
    });
  }
  cleanedContent = cleanedContent.replace(playTimeRegex, '');
  
  // Progress sync actions
  const syncRegex = /\[ACTION:syncProgressTo:([\w-]+)\]/g;
  while ((match = syncRegex.exec(content)) !== null) {
    const locationId = match[1];
    const result = handlers.syncProgressTo(locationId);
    const locations = handlers.getLocations();
    const locationName = locations?.[locationId]?.name || locationId;
    executedActions.push({ 
      type: 'sync', 
      description: `Synced progress to ${locationName} (${result.locationsVisited} locations, ${result.trainersDefeated} trainers)` 
    });
  }
  cleanedContent = cleanedContent.replace(syncRegex, '');
  
  // Unclear location actions
  const unclearRegex = /\[ACTION:unclearLocation:([\w-]+)\]/g;
  while ((match = unclearRegex.exec(content)) !== null) {
    const locationId = match[1];
    const locations = handlers.getLocations();
    const locationName = locations?.[locationId]?.name || locationId;
    const success = handlers.unclearLocation(locationId);
    if (success) {
      executedActions.push({ 
        type: 'unclear', 
        description: `Reset ${locationName} to unvisited` 
      });
    }
  }
  cleanedContent = cleanedContent.replace(unclearRegex, '');
  
  // Undefeat trainers actions
  const undefeatRegex = /\[ACTION:undefeatTrainers:([\w-]+)\]/g;
  while ((match = undefeatRegex.exec(content)) !== null) {
    const locationId = match[1];
    const locations = handlers.getLocations();
    const locationName = locations?.[locationId]?.name || locationId;
    const count = handlers.undefeatTrainers(locationId);
    if (count > 0) {
      executedActions.push({ 
        type: 'unclear', 
        description: `Unmarked ${count} trainers at ${locationName}` 
      });
    }
  }
  cleanedContent = cleanedContent.replace(undefeatRegex, '');
  
  return { cleanedContent, executedActions };
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="space-y-1 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-purple-400 shrink-0">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
        }
        parts.push(<strong key={key++} className="font-semibold text-foreground">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }

    return parts;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h-${index}`} className="font-semibold text-purple-400 mt-3 mb-1.5 text-sm">
          {trimmed.slice(3)}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h-${index}`} className="font-bold text-purple-300 mt-3 mb-2">
          {trimmed.slice(2)}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={`p-${index}`} className="text-sm my-1.5">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return <div className="space-y-0.5">{elements}</div>;
}

export function ChatBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentRun = useRunStore((s) => s.currentRun);
  const obtainBadge = useRunStore((s) => s.obtainBadge);
  const defeatTrainer = useRunStore((s) => s.defeatTrainer);
  const setCurrentLocation = useRunStore((s) => s.setCurrentLocation);
  const updateLocation = useRunStore((s) => s.updateLocation);
  const addPokemon = useRunStore((s) => s.addPokemon);
  const updatePokemonStore = useRunStore((s) => s.updatePokemon);
  const updateInventory = useRunStore((s) => s.updateInventory);
  const updateMoney = useRunStore((s) => s.updateMoney);
  const updatePlayTime = useRunStore((s) => s.updatePlayTime);
  const markPokemonCaught = useRunStore((s) => s.markPokemonCaught);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const defeatAllTrainersInLocation = useCallback((locationId: string) => {
    if (!currentRun) return;
    const location = currentRun.locations[locationId];
    if (!location) return;
    location.trainers.forEach(trainer => {
      defeatTrainer(locationId, trainer.id);
    });
  }, [currentRun, defeatTrainer]);

  const getLocations = useCallback(() => {
    if (!currentRun) return null;
    return currentRun.locations;
  }, [currentRun]);

  const catchPokemon = useCallback((speciesName: string, nickname: string, level: number, locationId: string): string | null => {
    if (!currentRun) return null;
    
    const species = getPokemonByName(speciesName);
    if (!species) {
      console.error('Species not found:', speciesName);
      return null;
    }
    
    const location = currentRun.locations[locationId];
    const locationName = location?.name || locationId;
    
    const now = new Date().toISOString();
    const pokemon = addPokemon({
      speciesId: species.id,
      nickname,
      species: species.name,
      types: species.types,
      level,
      nature: 'Hardy',
      ability: species.abilities[0] || 'Unknown',
      currentHp: species.baseStats.hp,
      maxHp: species.baseStats.hp,
      stats: { ...species.baseStats },
      moves: [],
      heldItem: null,
      statusCondition: 'healthy',
      status: 'active',
      encounteredAt: locationName,
      encounteredDate: now,
      capturedDate: now,
      deathDate: null,
      deathCause: null,
      deathLocation: null,
      notes: '',
      isShiny: false,
      gender: 'male',
      metLevel: level,
    });
    
    return pokemon.id;
  }, [currentRun, addPokemon]);

  const getPokemonByNickname = useCallback((nickname: string): Pokemon | null => {
    if (!currentRun) return null;
    const normalizedNickname = nickname.toLowerCase();
    for (const id of [...currentRun.party, ...currentRun.box]) {
      const pokemon = currentRun.pokemon[id];
      if (pokemon && pokemon.nickname.toLowerCase() === normalizedNickname) {
        return pokemon;
      }
    }
    return null;
  }, [currentRun]);

  const updatePokemon = useCallback((nickname: string, field: string, value: string): boolean => {
    const pokemon = getPokemonByNickname(nickname);
    if (!pokemon) return false;
    
    const updates: Partial<Pokemon> = {};
    
    switch (field.toLowerCase()) {
      case 'level':
        updates.level = parseInt(value, 10);
        break;
      case 'nature':
        updates.nature = value as Pokemon['nature'];
        break;
      case 'ability':
        updates.ability = value;
        break;
      default:
        return false;
    }
    
    updatePokemonStore(pokemon.id, updates);
    return true;
  }, [getPokemonByNickname, updatePokemonStore]);

  const updatePokemonStats = useCallback((nickname: string, stats: PokemonStats): boolean => {
    const pokemon = getPokemonByNickname(nickname);
    if (!pokemon) return false;
    
    updatePokemonStore(pokemon.id, { 
      stats,
      maxHp: stats.hp,
      currentHp: stats.hp,
    });
    return true;
  }, [getPokemonByNickname, updatePokemonStore]);

  const evolvePokemon = useCallback((nickname: string, newSpeciesName: string): boolean => {
    const pokemon = getPokemonByNickname(nickname);
    if (!pokemon) return false;
    
    // Find the new species by name (case-insensitive)
    const normalizedName = newSpeciesName.toLowerCase().trim();
    const newSpecies = Object.values(POKEMON_SPECIES).find(
      s => s.name.toLowerCase() === normalizedName
    );
    
    if (!newSpecies) return false;
    
    // Update the Pokemon's speciesId, species name, and types
    updatePokemonStore(pokemon.id, { 
      speciesId: newSpecies.id,
      species: newSpecies.name,
      types: newSpecies.types,
    });
    
    // Also mark the new species as caught in Pokedex
    markPokemonCaught(newSpecies.id, pokemon.encounteredAt);
    
    return true;
  }, [getPokemonByNickname, updatePokemonStore, markPokemonCaught]);

  const syncProgressTo = useCallback((targetLocationId: string): { locationsVisited: number; trainersDefeated: number } => {
    if (!currentRun) return { locationsVisited: 0, trainersDefeated: 0 };
    
    const targetIndex = GAME_PROGRESSION.indexOf(targetLocationId);
    if (targetIndex === -1) return { locationsVisited: 0, trainersDefeated: 0 };
    
    let locationsVisited = 0;
    let trainersDefeated = 0;
    
    // Mark all locations up to (but not including) target as cleared
    for (let i = 0; i <= targetIndex; i++) {
      const locId = GAME_PROGRESSION[i];
      const location = currentRun.locations[locId];
      if (location) {
        // Mark location as visited/cleared (not the current one)
        if (i < targetIndex) {
          if (location.status !== 'cleared') {
            updateLocation(locId, { status: 'cleared' });
            locationsVisited++;
          }
          
          // Defeat all trainers in this location
          const undefeatedTrainers = location.trainers.filter(
            t => !(location.defeatedTrainers || []).includes(t.id)
          );
          undefeatedTrainers.forEach(trainer => {
            defeatTrainer(locId, trainer.id);
            trainersDefeated++;
          });
        } else {
          // Target location - mark as current/in-progress
          if (location.status !== 'current' && location.status !== 'cleared') {
            updateLocation(locId, { status: 'current' });
            locationsVisited++;
          }
        }
      }
    }
    
    // Set current location
    setCurrentLocation(targetLocationId);
    
    return { locationsVisited, trainersDefeated };
  }, [currentRun, defeatTrainer, setCurrentLocation, updateLocation]);

  const unclearLocation = useCallback((locationId: string): boolean => {
    if (!currentRun) return false;
    const location = currentRun.locations[locationId];
    if (!location) return false;
    
    // Reset location status to unvisited and clear all defeated trainers
    updateLocation(locationId, { 
      status: 'unvisited',
      defeatedTrainers: [],
    });
    return true;
  }, [currentRun, updateLocation]);

  const undefeatAllTrainers = useCallback((locationId: string): number => {
    if (!currentRun) return 0;
    const location = currentRun.locations[locationId];
    if (!location) return 0;
    
    const count = (location.defeatedTrainers || []).length;
    if (count > 0) {
      updateLocation(locationId, { defeatedTrainers: [] });
    }
    return count;
  }, [currentRun, updateLocation]);

  const markVisited = useCallback((locationId: string): boolean => {
    if (!currentRun) return false;
    const location = currentRun.locations[locationId];
    if (!location) return false;
    
    if (location.status === 'unvisited') {
      updateLocation(locationId, { status: 'cleared' });
    }
    return true;
  }, [currentRun, updateLocation]);

  const actionHandlers: ActionHandlers = {
    setActiveTab,
    obtainBadge,
    defeatAllTrainers: defeatAllTrainersInLocation,
    setCurrentLocation,
    getLocations,
    catchPokemon,
    updatePokemon,
    updatePokemonStats,
    evolvePokemon,
    getPokemonByNickname,
    updateInventory,
    updateMoney,
    updatePlayTime,
    syncProgressTo,
    unclearLocation,
    undefeatTrainers: undefeatAllTrainers,
    markVisited,
  };

  const getRunContext = useCallback((): RunContext | null => {
    if (!currentRun) return null;
    
    const party = currentRun.party.map(id => {
      const pokemon = currentRun.pokemon[id];
      const speciesData = POKEMON_SPECIES[pokemon?.speciesId];
      return {
        name: pokemon?.nickname || pokemon?.species || 'Unknown',
        species: speciesData?.name || pokemon?.species || 'Unknown',
        level: pokemon?.level || 1,
        types: speciesData?.types || pokemon?.types || [],
      };
    });

    const badges = currentRun.badges.filter(b => b.obtained).length;
    const currentLoc = currentRun.locations[currentRun.currentLocation];
    const saveLoc = currentRun.locations[currentRun.saveLocation];

    return {
      runName: currentRun.name,
      game: currentRun.game === 'firered' ? 'FireRed' : 'LeafGreen',
      badges,
      currentLocation: currentLoc?.name || 'Unknown',
      saveLocation: saveLoc?.name || 'Unknown',
      party,
      boxCount: currentRun.box.length,
      graveyardCount: currentRun.graveyard.length,
      pokedexSeen: currentRun.pokedex.filter(e => e.seen).length,
      pokedexCaught: currentRun.pokedex.filter(e => e.caught).length,
    };
  }, [currentRun]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsExpanded(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          runContext: getRunContext(),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const { cleanedContent, executedActions } = parseActions(data.message, actionHandlers);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: cleanedContent,
        timestamp: new Date(),
        executedActions: executedActions.length > 0 ? executedActions : undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setIsExpanded(false);
  };

  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-4 px-4">
      <div className="pointer-events-auto w-full max-w-2xl">
        {/* Expanded Response Panel */}
        <AnimatePresence>
          {isExpanded && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-2 bg-background/95 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Response Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">Nuzlocke Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="h-7 w-7"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="max-h-[400px] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.role === 'user' ? (
                        <div className="flex items-start gap-2 justify-end">
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%]">
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="max-w-[85%] space-y-2">
                            <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3">
                              <MarkdownRenderer content={message.content} />
                            </div>
                            {message.executedActions && message.executedActions.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {message.executedActions.map((action, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs"
                                  >
                                    {action.type === 'badge' && <Award className="w-3 h-3" />}
                                    {action.type === 'trainers' && <Swords className="w-3 h-3" />}
                                    {action.type === 'location' && <MapPin className="w-3 h-3" />}
                                    {action.type === 'navigate' && <Navigation className="w-3 h-3" />}
                                    {action.type === 'catch' && <Circle className="w-3 h-3" />}
                                    {action.type === 'update' && <BarChart3 className="w-3 h-3" />}
                                    {action.type === 'evolve' && <TrendingUp className="w-3 h-3" />}
                                    {action.type === 'inventory' && <Package className="w-3 h-3" />}
                                    {action.type === 'money' && <Coins className="w-3 h-3" />}
                                    {action.type === 'playtime' && <Clock className="w-3 h-3" />}
                                    {action.type === 'sync' && <RefreshCw className="w-3 h-3" />}
                                    {action.type === 'unclear' && <Undo2 className="w-3 h-3" />}
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{action.description}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Response Preview */}
        <AnimatePresence>
          {!isExpanded && lastAssistantMessage && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => setIsExpanded(true)}
              className="w-full mb-2 p-3 bg-background/95 backdrop-blur-xl border rounded-xl shadow-lg text-left hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {lastAssistantMessage.content.replace(/[#*\-]/g, '').slice(0, 150)}...
                  </p>
                </div>
                <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Search Bar Input */}
        <div className="relative">
          <div className={cn(
            "flex items-center gap-2 bg-background/95 backdrop-blur-xl border rounded-full shadow-lg px-4 py-2 transition-all",
            isExpanded && "ring-2 ring-purple-500/50"
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => messages.length > 0 && setIsExpanded(true)}
              placeholder={currentRun ? "Ask about your run, strategy, or navigate..." : "Start a run for personalized advice..."}
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                input.trim() 
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Keyboard hint */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Press Enter to send, Esc to minimize
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
