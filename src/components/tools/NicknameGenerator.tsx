'use client';

import React, { useState, useMemo } from 'react';
import { POKEMON_SPECIES } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import { RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type NicknameTheme = 'classic' | 'funny' | 'mythology' | 'food' | 'puns' | 'cute' | 'fierce' | 'random';

const THEMES: { id: NicknameTheme; label: string; description: string }[] = [
  { id: 'classic', label: 'Classic', description: 'Traditional nicknames' },
  { id: 'funny', label: 'Funny', description: 'Humorous and silly names' },
  { id: 'mythology', label: 'Mythology', description: 'Gods, heroes, legends' },
  { id: 'food', label: 'Food', description: 'Tasty-sounding names' },
  { id: 'puns', label: 'Puns', description: 'Wordplay and puns' },
  { id: 'cute', label: 'Cute', description: 'Adorable nicknames' },
  { id: 'fierce', label: 'Fierce', description: 'Intimidating names' },
  { id: 'random', label: 'Random', description: 'Anything goes!' },
];

// Name pools by theme
const NICKNAME_POOLS: Record<NicknameTheme, string[]> = {
  classic: [
    'Ace', 'Blaze', 'Shadow', 'Storm', 'Thunder', 'Flash', 'Spike', 'Fang',
    'Claw', 'Wing', 'Flame', 'Frost', 'Bolt', 'Rex', 'Max', 'Luna', 'Nova',
    'Star', 'Comet', 'Titan', 'Atlas', 'Zeus', 'Apollo', 'Echo', 'Dash',
    'Rocky', 'Dusty', 'Misty', 'Sunny', 'Sandy', 'Ember', 'Aqua', 'Terra',
  ],
  funny: [
    'Mr. Noodles', 'Sir Chomps', 'Fluffernutter', 'Wigglebutt', 'Chonk', 
    'Thicc Boi', 'Spaghetti', 'Waffles', 'Pickles', 'Biscuit', 'Nugget',
    'Derpface', 'Potato', 'Tater Tot', 'Meatball', 'Chungus', 'Beefcake',
    'Chonkasaurus', 'Sir Quacks', 'Lord Fluff', 'Duke Derp', 'Captain Chaos',
    'General Goof', 'Professor Plop', 'Dr. Wobble', 'Baron Von Flop',
  ],
  mythology: [
    'Zeus', 'Athena', 'Apollo', 'Artemis', 'Hermes', 'Ares', 'Poseidon',
    'Hades', 'Hera', 'Demeter', 'Odin', 'Thor', 'Freya', 'Loki', 'Fenrir',
    'Ra', 'Anubis', 'Isis', 'Osiris', 'Amun', 'Thoth', 'Bastet', 'Sekhmet',
    'Typhon', 'Kronos', 'Gaia', 'Helios', 'Selene', 'Eos', 'Nike', 'Nemesis',
  ],
  food: [
    'Mochi', 'Tofu', 'Tempura', 'Sushi', 'Ramen', 'Udon', 'Wasabi', 'Miso',
    'Cookie', 'Brownie', 'Cupcake', 'Muffin', 'Donut', 'Pretzel', 'Churro',
    'Taco', 'Nacho', 'Burrito', 'Salsa', 'Queso', 'Peaches', 'Mango',
    'Papaya', 'Coconut', 'Lemon', 'Lime', 'Berry', 'Cherry', 'Plum',
  ],
  puns: [
    'Char-mander', 'Squirt-le', 'Pik-achoo', 'Bulba-sore', 'Jigglypuff Daddy',
    'Gary Oaks', 'Ash Ketchup', 'Mr. Mime Jr', 'Slow-bro', 'Meta-pod',
    'Butter-free', 'Bee-drill', 'Rat-icate', 'Pidge-otto', 'Fear-ow',
    'Sand-slash', 'Nido-queen B', 'Wiggly-puff', 'Gol-bat Signal', 'Oddish One',
  ],
  cute: [
    'Bubbles', 'Sparkle', 'Twinkle', 'Pudding', 'Jellybean', 'Buttercup',
    'Daisy', 'Rosie', 'Honey', 'Sugar', 'Sweetie', 'Angel', 'Bambi',
    'Pixie', 'Tinker', 'Pebbles', 'Buttons', 'Dimples', 'Giggles', 'Snuggles',
    'Cuddles', 'Fluffy', 'Fuzzy', 'Puffy', 'Marshmallow', 'Cotton', 'Cloud',
  ],
  fierce: [
    'Destroyer', 'Havoc', 'Chaos', 'Doom', 'Reaper', 'Slayer', 'Crusher',
    'Venom', 'Razor', 'Blade', 'Fang', 'Savage', 'Brutal', 'Wraith', 'Specter',
    'Nightmare', 'Terror', 'Dread', 'Malice', 'Fury', 'Rage', 'Wrath',
    'Scorcher', 'Inferno', 'Blitz', 'Rampage', 'Carnage', 'Onslaught',
  ],
  random: [], // Will combine all
};

// Combine all for random
NICKNAME_POOLS.random = Object.values(NICKNAME_POOLS).flat();

// Type-based suggestions
const TYPE_NAMES: Record<string, string[]> = {
  Fire: ['Ember', 'Blaze', 'Inferno', 'Scorch', 'Phoenix', 'Cinder', 'Ash'],
  Water: ['Splash', 'Wave', 'Tide', 'Marina', 'Aqua', 'Neptune', 'Poseidon'],
  Grass: ['Leaf', 'Fern', 'Ivy', 'Bloom', 'Flora', 'Sage', 'Willow'],
  Electric: ['Volt', 'Spark', 'Bolt', 'Thunder', 'Storm', 'Zeus', 'Flash'],
  Psychic: ['Mind', 'Mystic', 'Oracle', 'Vision', 'Dream', 'Luna', 'Cosmic'],
  Fighting: ['Champ', 'Brawler', 'Rocky', 'Titan', 'Kong', 'Bruno', 'Hulk'],
  Poison: ['Toxic', 'Venom', 'Bane', 'Plague', 'Viper', 'Cobra', 'Fang'],
  Ground: ['Terra', 'Rocky', 'Boulder', 'Quake', 'Dust', 'Clay', 'Stone'],
  Flying: ['Sky', 'Cloud', 'Zephyr', 'Breeze', 'Wing', 'Talon', 'Swift'],
  Bug: ['Buzz', 'Stinger', 'Web', 'Swarm', 'Cricket', 'Beetle', 'Moth'],
  Rock: ['Stone', 'Pebble', 'Boulder', 'Granite', 'Slate', 'Onyx', 'Obsidian'],
  Ghost: ['Shadow', 'Specter', 'Phantom', 'Wraith', 'Spirit', 'Shade', 'Haunt'],
  Ice: ['Frost', 'Blizzard', 'Crystal', 'Glacier', 'Winter', 'Chill', 'Snow'],
  Dragon: ['Drake', 'Wyrm', 'Fafnir', 'Smaug', 'Draco', 'Naga', 'Serpent'],
  Dark: ['Shade', 'Dusk', 'Noir', 'Umbra', 'Shadow', 'Midnight', 'Eclipse'],
  Steel: ['Chrome', 'Titanium', 'Iron', 'Steel', 'Forge', 'Anvil', 'Alloy'],
  Normal: ['Ace', 'Max', 'Buddy', 'Pal', 'Chief', 'Boss', 'Scout'],
};

interface NicknameGeneratorProps {
  speciesId?: number;
  onSelect?: (nickname: string) => void;
}

export function NicknameGenerator({ speciesId, onSelect }: NicknameGeneratorProps) {
  const [theme, setTheme] = useState<NicknameTheme>('classic');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const species = speciesId ? POKEMON_SPECIES[speciesId] : null;
  
  const generateNames = () => {
    const pool = [...NICKNAME_POOLS[theme]];
    
    // Add type-based names if we have a species
    if (species) {
      for (const type of species.types) {
        pool.push(...(TYPE_NAMES[type] || []));
      }
    }
    
    // Shuffle and pick 6
    const shuffled = pool.sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 6));
  };
  
  const copyName = async (name: string, index: number) => {
    await navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    
    if (onSelect) {
      onSelect(name);
    }
  };
  
  // Generate initial suggestions
  React.useEffect(() => {
    generateNames();
  }, [theme, speciesId]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold text-sm">Nickname Generator</span>
        </div>
        <Select value={theme} onValueChange={(v) => setTheme(v as NicknameTheme)}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                <div>
                  <span>{t.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {species && (
        <p className="text-xs text-muted-foreground">
          Suggestions for {species.name} ({species.types.join('/')})
        </p>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((name, i) => (
          <button
            key={`${name}-${i}`}
            onClick={() => copyName(name, i)}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg border text-sm",
              "hover:bg-muted/50 transition-colors",
              copiedIndex === i && "border-green-500 bg-green-500/10"
            )}
          >
            <span>{name}</span>
            {copiedIndex === i ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full gap-2"
        onClick={generateNames}
      >
        <RefreshCw className="w-3 h-3" />
        Generate More
      </Button>
    </div>
  );
}
