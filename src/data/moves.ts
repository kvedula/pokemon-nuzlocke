import { PokemonType } from '@/types/pokemon';

export interface MoveData {
  name: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  power: number | null;
  accuracy: number | null;
  pp: number;
  description: string;
  priority?: number;
  contact?: boolean;
  effect?: string;
}

// Gen 1 moves database (Fire Red/Leaf Green versions)
export const MOVES: Record<string, MoveData> = {
  // Normal moves
  'Tackle': { name: 'Tackle', type: 'Normal', category: 'Physical', power: 35, accuracy: 95, pp: 35, description: 'A physical attack with no additional effect.' },
  'Scratch': { name: 'Scratch', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 35, description: 'Scratches the foe with sharp claws.' },
  'Pound': { name: 'Pound', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 35, description: 'Pounds the foe with forelegs or tail.' },
  'Quick Attack': { name: 'Quick Attack', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 30, description: 'Always strikes first.', priority: 1 },
  'Slam': { name: 'Slam', type: 'Normal', category: 'Physical', power: 80, accuracy: 75, pp: 20, description: 'Slams the foe with a tail, vine, etc.' },
  'Body Slam': { name: 'Body Slam', type: 'Normal', category: 'Physical', power: 85, accuracy: 100, pp: 15, description: 'May cause paralysis.', effect: 'paralyze' },
  'Take Down': { name: 'Take Down', type: 'Normal', category: 'Physical', power: 90, accuracy: 85, pp: 20, description: 'A reckless charge. Also hurts the user.' },
  'Double-Edge': { name: 'Double-Edge', type: 'Normal', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'A life-risking tackle. Also hurts the user.' },
  'Hyper Beam': { name: 'Hyper Beam', type: 'Normal', category: 'Special', power: 150, accuracy: 90, pp: 5, description: 'Powerful but needs recharging.' },
  'Explosion': { name: 'Explosion', type: 'Normal', category: 'Physical', power: 250, accuracy: 100, pp: 5, description: 'Inflicts severe damage but user faints.' },
  'Self-Destruct': { name: 'Self-Destruct', type: 'Normal', category: 'Physical', power: 200, accuracy: 100, pp: 5, description: 'Inflicts damage but user faints.' },
  'Strength': { name: 'Strength', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'A powerful physical attack.' },
  'Cut': { name: 'Cut', type: 'Normal', category: 'Physical', power: 50, accuracy: 95, pp: 30, description: 'Cuts the foe with sharp claws.' },
  'Mega Punch': { name: 'Mega Punch', type: 'Normal', category: 'Physical', power: 80, accuracy: 85, pp: 20, description: 'A powerful punch.' },
  'Mega Kick': { name: 'Mega Kick', type: 'Normal', category: 'Physical', power: 120, accuracy: 75, pp: 5, description: 'An extremely powerful kick.' },
  'Headbutt': { name: 'Headbutt', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'May cause flinching.' },
  'Horn Attack': { name: 'Horn Attack', type: 'Normal', category: 'Physical', power: 65, accuracy: 100, pp: 25, description: 'Jabs the foe with sharp horns.' },
  'Fury Attack': { name: 'Fury Attack', type: 'Normal', category: 'Physical', power: 15, accuracy: 85, pp: 20, description: 'Hits 2-5 times.' },
  'Horn Drill': { name: 'Horn Drill', type: 'Normal', category: 'Physical', power: null, accuracy: 30, pp: 5, description: 'A one-hit KO attack.' },
  'Razor Wind': { name: 'Razor Wind', type: 'Normal', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'A 2-turn move with high critical ratio.' },
  'Wrap': { name: 'Wrap', type: 'Normal', category: 'Physical', power: 15, accuracy: 85, pp: 20, description: 'Traps and squeezes the foe.' },
  'Bind': { name: 'Bind', type: 'Normal', category: 'Physical', power: 15, accuracy: 75, pp: 20, description: 'Binds the foe for 2-5 turns.' },
  'Comet Punch': { name: 'Comet Punch', type: 'Normal', category: 'Physical', power: 18, accuracy: 85, pp: 15, description: 'Hits 2-5 times.' },
  'Pay Day': { name: 'Pay Day', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 20, description: 'Earns money after battle.' },
  'Stomp': { name: 'Stomp', type: 'Normal', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'May cause flinching.' },
  'Thrash': { name: 'Thrash', type: 'Normal', category: 'Physical', power: 90, accuracy: 100, pp: 20, description: 'Attacks 2-3 turns then confuses user.' },
  'Skull Bash': { name: 'Skull Bash', type: 'Normal', category: 'Physical', power: 100, accuracy: 100, pp: 15, description: 'Charges first turn, attacks second.' },
  'Rage': { name: 'Rage', type: 'Normal', category: 'Physical', power: 20, accuracy: 100, pp: 20, description: 'Attack rises when hit.' },
  'Fury Swipes': { name: 'Fury Swipes', type: 'Normal', category: 'Physical', power: 18, accuracy: 80, pp: 15, description: 'Hits 2-5 times.' },
  'Slash': { name: 'Slash', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'High critical-hit ratio.' },
  'Swift': { name: 'Swift', type: 'Normal', category: 'Special', power: 60, accuracy: null, pp: 20, description: 'Never misses.' },
  'Tri Attack': { name: 'Tri Attack', type: 'Normal', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'May paralyze, burn, or freeze.' },
  'Super Fang': { name: 'Super Fang', type: 'Normal', category: 'Physical', power: null, accuracy: 90, pp: 10, description: 'Cuts the foe\'s HP by half.' },
  'Hyper Fang': { name: 'Hyper Fang', type: 'Normal', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'May cause flinching.' },
  'Facade': { name: 'Facade', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Power doubles if user has status.' },
  'Return': { name: 'Return', type: 'Normal', category: 'Physical', power: null, accuracy: 100, pp: 20, description: 'Power increases with friendship.' },
  'Frustration': { name: 'Frustration', type: 'Normal', category: 'Physical', power: null, accuracy: 100, pp: 20, description: 'Power increases with low friendship.' },
  'Secret Power': { name: 'Secret Power', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Effect varies by terrain.' },
  
  // Status Normal moves
  'Growl': { name: 'Growl', type: 'Normal', category: 'Status', power: null, accuracy: 100, pp: 40, description: 'Lowers foe\'s Attack.' },
  'Tail Whip': { name: 'Tail Whip', type: 'Normal', category: 'Status', power: null, accuracy: 100, pp: 30, description: 'Lowers foe\'s Defense.' },
  'Leer': { name: 'Leer', type: 'Normal', category: 'Status', power: null, accuracy: 100, pp: 30, description: 'Lowers foe\'s Defense.' },
  'Screech': { name: 'Screech', type: 'Normal', category: 'Status', power: null, accuracy: 85, pp: 40, description: 'Sharply lowers foe\'s Defense.' },
  'Defense Curl': { name: 'Defense Curl', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 40, description: 'Raises user\'s Defense.' },
  'Harden': { name: 'Harden', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 30, description: 'Raises user\'s Defense.' },
  'Swords Dance': { name: 'Swords Dance', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 30, description: 'Sharply raises Attack.' },
  'Double Team': { name: 'Double Team', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 15, description: 'Raises evasion.' },
  'Minimize': { name: 'Minimize', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Sharply raises evasion.' },
  'Focus Energy': { name: 'Focus Energy', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 30, description: 'Raises critical-hit ratio.' },
  'Recover': { name: 'Recover', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Restores half max HP.' },
  'Soft-Boiled': { name: 'Soft-Boiled', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Restores half max HP.' },
  'Rest': { name: 'Rest', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Fully heals HP but sleeps.' },
  'Substitute': { name: 'Substitute', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Creates a decoy using HP.' },
  'Bide': { name: 'Bide', type: 'Normal', category: 'Physical', power: null, accuracy: 100, pp: 10, description: 'Waits 2 turns, returns double damage.' },
  'Mimic': { name: 'Mimic', type: 'Normal', category: 'Status', power: null, accuracy: 100, pp: 10, description: 'Copies a foe\'s move.' },
  'Metronome': { name: 'Metronome', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Uses a random move.' },
  'Transform': { name: 'Transform', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Transforms into the foe.' },
  'Disable': { name: 'Disable', type: 'Normal', category: 'Status', power: null, accuracy: 80, pp: 20, description: 'Disables foe\'s last move.' },
  'Protect': { name: 'Protect', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Evades all attacks that turn.', priority: 3 },
  'Endure': { name: 'Endure', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Always leaves at least 1 HP.', priority: 3 },
  
  // Fire moves
  'Ember': { name: 'Ember', type: 'Fire', category: 'Special', power: 40, accuracy: 100, pp: 25, description: 'May cause burn.' },
  'Fire Spin': { name: 'Fire Spin', type: 'Fire', category: 'Special', power: 15, accuracy: 70, pp: 15, description: 'Traps foe in fire for 2-5 turns.' },
  'Flame Wheel': { name: 'Flame Wheel', type: 'Fire', category: 'Physical', power: 60, accuracy: 100, pp: 25, description: 'May cause burn.' },
  'Flamethrower': { name: 'Flamethrower', type: 'Fire', category: 'Special', power: 95, accuracy: 100, pp: 15, description: 'May cause burn.' },
  'Fire Blast': { name: 'Fire Blast', type: 'Fire', category: 'Special', power: 120, accuracy: 85, pp: 5, description: 'May cause burn.' },
  'Fire Punch': { name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'May cause burn.' },
  'Overheat': { name: 'Overheat', type: 'Fire', category: 'Special', power: 140, accuracy: 90, pp: 5, description: 'Sharply lowers user\'s Sp. Atk.' },
  'Heat Wave': { name: 'Heat Wave', type: 'Fire', category: 'Special', power: 100, accuracy: 90, pp: 10, description: 'May cause burn. Hits both foes.' },
  'Blaze Kick': { name: 'Blaze Kick', type: 'Fire', category: 'Physical', power: 85, accuracy: 90, pp: 10, description: 'High crit. May burn.' },
  'Will-O-Wisp': { name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: null, accuracy: 75, pp: 15, description: 'Burns the foe.' },
  'Sunny Day': { name: 'Sunny Day', type: 'Fire', category: 'Status', power: null, accuracy: null, pp: 5, description: 'Boosts Fire moves for 5 turns.' },
  
  // Water moves
  'Bubble': { name: 'Bubble', type: 'Water', category: 'Special', power: 20, accuracy: 100, pp: 30, description: 'May lower Speed.' },
  'Water Gun': { name: 'Water Gun', type: 'Water', category: 'Special', power: 40, accuracy: 100, pp: 25, description: 'Squirts water at the foe.' },
  'Bubble Beam': { name: 'Bubble Beam', type: 'Water', category: 'Special', power: 65, accuracy: 100, pp: 20, description: 'May lower Speed.' },
  'Water Pulse': { name: 'Water Pulse', type: 'Water', category: 'Special', power: 60, accuracy: 100, pp: 20, description: 'May confuse.' },
  'Surf': { name: 'Surf', type: 'Water', category: 'Special', power: 95, accuracy: 100, pp: 15, description: 'Hits all adjacent Pokémon.' },
  'Hydro Pump': { name: 'Hydro Pump', type: 'Water', category: 'Special', power: 120, accuracy: 80, pp: 5, description: 'A powerful water attack.' },
  'Waterfall': { name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'May cause flinching.' },
  'Dive': { name: 'Dive', type: 'Water', category: 'Physical', power: 60, accuracy: 100, pp: 10, description: 'Dives underwater, attacks next turn.' },
  'Crabhammer': { name: 'Crabhammer', type: 'Water', category: 'Physical', power: 90, accuracy: 85, pp: 10, description: 'High critical-hit ratio.' },
  'Aqua Tail': { name: 'Aqua Tail', type: 'Water', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'A powerful tail attack.' },
  'Rain Dance': { name: 'Rain Dance', type: 'Water', category: 'Status', power: null, accuracy: null, pp: 5, description: 'Boosts Water moves for 5 turns.' },
  'Withdraw': { name: 'Withdraw', type: 'Water', category: 'Status', power: null, accuracy: null, pp: 40, description: 'Raises Defense.' },
  
  // Electric moves
  'Thunder Shock': { name: 'Thunder Shock', type: 'Electric', category: 'Special', power: 40, accuracy: 100, pp: 30, description: 'May cause paralysis.' },
  'Thunder Wave': { name: 'Thunder Wave', type: 'Electric', category: 'Status', power: null, accuracy: 100, pp: 20, description: 'Paralyzes the foe.' },
  'Thunderbolt': { name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 95, accuracy: 100, pp: 15, description: 'May cause paralysis.' },
  'Thunder': { name: 'Thunder', type: 'Electric', category: 'Special', power: 120, accuracy: 70, pp: 10, description: 'May cause paralysis.' },
  'Thunder Punch': { name: 'Thunder Punch', type: 'Electric', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'May cause paralysis.' },
  'Spark': { name: 'Spark', type: 'Electric', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'May cause paralysis.' },
  'Volt Tackle': { name: 'Volt Tackle', type: 'Electric', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'User takes recoil damage.' },
  'Zap Cannon': { name: 'Zap Cannon', type: 'Electric', category: 'Special', power: 100, accuracy: 50, pp: 5, description: 'Always paralyzes.' },
  
  // Grass moves
  'Vine Whip': { name: 'Vine Whip', type: 'Grass', category: 'Physical', power: 35, accuracy: 100, pp: 15, description: 'Whips the foe with vines.' },
  'Absorb': { name: 'Absorb', type: 'Grass', category: 'Special', power: 20, accuracy: 100, pp: 25, description: 'Steals HP from the foe.' },
  'Mega Drain': { name: 'Mega Drain', type: 'Grass', category: 'Special', power: 40, accuracy: 100, pp: 15, description: 'Steals HP from the foe.' },
  'Giga Drain': { name: 'Giga Drain', type: 'Grass', category: 'Special', power: 60, accuracy: 100, pp: 10, description: 'Steals HP from the foe.' },
  'Razor Leaf': { name: 'Razor Leaf', type: 'Grass', category: 'Physical', power: 55, accuracy: 95, pp: 25, description: 'High critical-hit ratio.' },
  'Petal Dance': { name: 'Petal Dance', type: 'Grass', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Attacks 2-3 turns, then confuses.' },
  'Solar Beam': { name: 'Solar Beam', type: 'Grass', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Charges first turn, attacks second.' },
  'Leaf Blade': { name: 'Leaf Blade', type: 'Grass', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'High critical-hit ratio.' },
  'Bullet Seed': { name: 'Bullet Seed', type: 'Grass', category: 'Physical', power: 10, accuracy: 100, pp: 30, description: 'Hits 2-5 times.' },
  'Leech Seed': { name: 'Leech Seed', type: 'Grass', category: 'Status', power: null, accuracy: 90, pp: 10, description: 'Drains HP each turn.' },
  'Sleep Powder': { name: 'Sleep Powder', type: 'Grass', category: 'Status', power: null, accuracy: 75, pp: 15, description: 'Puts the foe to sleep.' },
  'Stun Spore': { name: 'Stun Spore', type: 'Grass', category: 'Status', power: null, accuracy: 75, pp: 30, description: 'Paralyzes the foe.' },
  'Poison Powder': { name: 'Poison Powder', type: 'Grass', category: 'Status', power: null, accuracy: 75, pp: 35, description: 'Poisons the foe.' },
  'Synthesis': { name: 'Synthesis', type: 'Grass', category: 'Status', power: null, accuracy: null, pp: 5, description: 'Restores HP. More in sun.' },
  'Growth': { name: 'Growth', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 40, description: 'Raises Sp. Atk.' },
  
  // Ice moves
  'Ice Beam': { name: 'Ice Beam', type: 'Ice', category: 'Special', power: 95, accuracy: 100, pp: 10, description: 'May freeze the foe.' },
  'Blizzard': { name: 'Blizzard', type: 'Ice', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'May freeze. Hits all foes.' },
  'Ice Punch': { name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'May freeze.' },
  'Powder Snow': { name: 'Powder Snow', type: 'Ice', category: 'Special', power: 40, accuracy: 100, pp: 25, description: 'May freeze.' },
  'Aurora Beam': { name: 'Aurora Beam', type: 'Ice', category: 'Special', power: 65, accuracy: 100, pp: 20, description: 'May lower Attack.' },
  'Icy Wind': { name: 'Icy Wind', type: 'Ice', category: 'Special', power: 55, accuracy: 95, pp: 15, description: 'Lowers foe\'s Speed.' },
  'Sheer Cold': { name: 'Sheer Cold', type: 'Ice', category: 'Special', power: null, accuracy: 30, pp: 5, description: 'A one-hit KO attack.' },
  'Hail': { name: 'Hail', type: 'Ice', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Summons a hailstorm.' },
  'Mist': { name: 'Mist', type: 'Ice', category: 'Status', power: null, accuracy: null, pp: 30, description: 'Prevents stat reduction.' },
  
  // Fighting moves
  'Karate Chop': { name: 'Karate Chop', type: 'Fighting', category: 'Physical', power: 50, accuracy: 100, pp: 25, description: 'High critical-hit ratio.' },
  'Low Kick': { name: 'Low Kick', type: 'Fighting', category: 'Physical', power: null, accuracy: 100, pp: 20, description: 'Power depends on foe\'s weight.' },
  'Double Kick': { name: 'Double Kick', type: 'Fighting', category: 'Physical', power: 30, accuracy: 100, pp: 30, description: 'Hits twice.' },
  'Jump Kick': { name: 'Jump Kick', type: 'Fighting', category: 'Physical', power: 70, accuracy: 95, pp: 25, description: 'User is hurt if it misses.' },
  'High Jump Kick': { name: 'High Jump Kick', type: 'Fighting', category: 'Physical', power: 85, accuracy: 90, pp: 20, description: 'User is hurt if it misses.' },
  'Rolling Kick': { name: 'Rolling Kick', type: 'Fighting', category: 'Physical', power: 60, accuracy: 85, pp: 15, description: 'May cause flinching.' },
  'Submission': { name: 'Submission', type: 'Fighting', category: 'Physical', power: 80, accuracy: 80, pp: 25, description: 'Also hurts the user.' },
  'Seismic Toss': { name: 'Seismic Toss', type: 'Fighting', category: 'Physical', power: null, accuracy: 100, pp: 20, description: 'Damage equals user\'s level.' },
  'Cross Chop': { name: 'Cross Chop', type: 'Fighting', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'High critical-hit ratio.' },
  'Brick Break': { name: 'Brick Break', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Breaks Light Screen and Reflect.' },
  'Focus Punch': { name: 'Focus Punch', type: 'Fighting', category: 'Physical', power: 150, accuracy: 100, pp: 20, description: 'Fails if user is hit first.', priority: -3 },
  'Superpower': { name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Lowers user\'s Attack and Defense.' },
  'Revenge': { name: 'Revenge', type: 'Fighting', category: 'Physical', power: 60, accuracy: 100, pp: 10, description: 'Power doubles if hit first.', priority: -4 },
  'Counter': { name: 'Counter', type: 'Fighting', category: 'Physical', power: null, accuracy: 100, pp: 20, description: 'Returns double physical damage.', priority: -5 },
  'Detect': { name: 'Detect', type: 'Fighting', category: 'Status', power: null, accuracy: null, pp: 5, description: 'Evades all attacks.', priority: 3 },
  'Bulk Up': { name: 'Bulk Up', type: 'Fighting', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Raises Attack and Defense.' },
  
  // Poison moves
  'Poison Sting': { name: 'Poison Sting', type: 'Poison', category: 'Physical', power: 15, accuracy: 100, pp: 35, description: 'May poison the foe.' },
  'Sludge': { name: 'Sludge', type: 'Poison', category: 'Special', power: 65, accuracy: 100, pp: 20, description: 'May poison the foe.' },
  'Sludge Bomb': { name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'May poison the foe.' },
  'Acid': { name: 'Acid', type: 'Poison', category: 'Special', power: 40, accuracy: 100, pp: 30, description: 'May lower Sp. Def.' },
  'Smog': { name: 'Smog', type: 'Poison', category: 'Special', power: 20, accuracy: 70, pp: 20, description: 'May poison the foe.' },
  'Toxic': { name: 'Toxic', type: 'Poison', category: 'Status', power: null, accuracy: 85, pp: 10, description: 'Badly poisons the foe.' },
  'Poison Gas': { name: 'Poison Gas', type: 'Poison', category: 'Status', power: null, accuracy: 55, pp: 40, description: 'Poisons the foe.' },
  
  // Ground moves
  'Mud-Slap': { name: 'Mud-Slap', type: 'Ground', category: 'Special', power: 20, accuracy: 100, pp: 10, description: 'Lowers accuracy.' },
  'Bone Club': { name: 'Bone Club', type: 'Ground', category: 'Physical', power: 65, accuracy: 85, pp: 20, description: 'May cause flinching.' },
  'Bonemerang': { name: 'Bonemerang', type: 'Ground', category: 'Physical', power: 50, accuracy: 90, pp: 10, description: 'Hits twice.' },
  'Bone Rush': { name: 'Bone Rush', type: 'Ground', category: 'Physical', power: 25, accuracy: 80, pp: 10, description: 'Hits 2-5 times.' },
  'Dig': { name: 'Dig', type: 'Ground', category: 'Physical', power: 60, accuracy: 100, pp: 10, description: 'Digs underground, attacks next turn.' },
  'Earthquake': { name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Hits all adjacent Pokémon.' },
  'Fissure': { name: 'Fissure', type: 'Ground', category: 'Physical', power: null, accuracy: 30, pp: 5, description: 'A one-hit KO attack.' },
  'Magnitude': { name: 'Magnitude', type: 'Ground', category: 'Physical', power: null, accuracy: 100, pp: 30, description: 'Power varies randomly.' },
  'Sand-Attack': { name: 'Sand-Attack', type: 'Ground', category: 'Status', power: null, accuracy: 100, pp: 15, description: 'Lowers accuracy.' },
  'Sandstorm': { name: 'Sandstorm', type: 'Rock', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Summons a sandstorm.' },
  'Spikes': { name: 'Spikes', type: 'Ground', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Damages foes switching in.' },
  
  // Flying moves
  'Gust': { name: 'Gust', type: 'Flying', category: 'Special', power: 40, accuracy: 100, pp: 35, description: 'Whips up a strong wind.' },
  'Wing Attack': { name: 'Wing Attack', type: 'Flying', category: 'Physical', power: 60, accuracy: 100, pp: 35, description: 'Strikes with wings.' },
  'Peck': { name: 'Peck', type: 'Flying', category: 'Physical', power: 35, accuracy: 100, pp: 35, description: 'Pecks the foe.' },
  'Drill Peck': { name: 'Drill Peck', type: 'Flying', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'A spinning peck attack.' },
  'Fly': { name: 'Fly', type: 'Flying', category: 'Physical', power: 70, accuracy: 95, pp: 15, description: 'Flies up, attacks next turn.' },
  'Aerial Ace': { name: 'Aerial Ace', type: 'Flying', category: 'Physical', power: 60, accuracy: null, pp: 20, description: 'Never misses.' },
  'Sky Attack': { name: 'Sky Attack', type: 'Flying', category: 'Physical', power: 140, accuracy: 90, pp: 5, description: 'Charges first, may flinch.' },
  'Mirror Move': { name: 'Mirror Move', type: 'Flying', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Uses foe\'s last move.' },
  'Feather Dance': { name: 'Feather Dance', type: 'Flying', category: 'Status', power: null, accuracy: 100, pp: 15, description: 'Sharply lowers Attack.' },
  
  // Psychic moves
  'Confusion': { name: 'Confusion', type: 'Psychic', category: 'Special', power: 50, accuracy: 100, pp: 25, description: 'May confuse.' },
  'Psybeam': { name: 'Psybeam', type: 'Psychic', category: 'Special', power: 65, accuracy: 100, pp: 20, description: 'May confuse.' },
  'Psychic': { name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'May lower Sp. Def.' },
  'Psywave': { name: 'Psywave', type: 'Psychic', category: 'Special', power: null, accuracy: 80, pp: 15, description: 'Random damage based on level.' },
  'Dream Eater': { name: 'Dream Eater', type: 'Psychic', category: 'Special', power: 100, accuracy: 100, pp: 15, description: 'Only works on sleeping foe.' },
  'Future Sight': { name: 'Future Sight', type: 'Psychic', category: 'Special', power: 80, accuracy: 90, pp: 15, description: 'Hits 2 turns later.' },
  'Extrasensory': { name: 'Extrasensory', type: 'Psychic', category: 'Special', power: 80, accuracy: 100, pp: 30, description: 'May cause flinching.' },
  'Hypnosis': { name: 'Hypnosis', type: 'Psychic', category: 'Status', power: null, accuracy: 60, pp: 20, description: 'Puts the foe to sleep.' },
  'Agility': { name: 'Agility', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 30, description: 'Sharply raises Speed.' },
  'Barrier': { name: 'Barrier', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 30, description: 'Sharply raises Defense.' },
  'Amnesia': { name: 'Amnesia', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Sharply raises Sp. Def.' },
  'Light Screen': { name: 'Light Screen', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 30, description: 'Halves Sp. Atk damage for 5 turns.' },
  'Reflect': { name: 'Reflect', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Halves physical damage for 5 turns.' },
  'Calm Mind': { name: 'Calm Mind', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Raises Sp. Atk and Sp. Def.' },
  'Teleport': { name: 'Teleport', type: 'Psychic', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Flee from wild battles.' },
  'Kinesis': { name: 'Kinesis', type: 'Psychic', category: 'Status', power: null, accuracy: 80, pp: 15, description: 'Lowers accuracy.' },
  'Trick': { name: 'Trick', type: 'Psychic', category: 'Status', power: null, accuracy: 100, pp: 10, description: 'Swaps held items.' },
  
  // Bug moves
  'String Shot': { name: 'String Shot', type: 'Bug', category: 'Status', power: null, accuracy: 95, pp: 40, description: 'Lowers Speed.' },
  'Leech Life': { name: 'Leech Life', type: 'Bug', category: 'Physical', power: 20, accuracy: 100, pp: 15, description: 'Drains HP.' },
  'Pin Missile': { name: 'Pin Missile', type: 'Bug', category: 'Physical', power: 14, accuracy: 85, pp: 20, description: 'Hits 2-5 times.' },
  'Twineedle': { name: 'Twineedle', type: 'Bug', category: 'Physical', power: 25, accuracy: 100, pp: 20, description: 'Hits twice. May poison.' },
  'Fury Cutter': { name: 'Fury Cutter', type: 'Bug', category: 'Physical', power: 10, accuracy: 95, pp: 20, description: 'Power doubles each hit.' },
  'Megahorn': { name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'A powerful horn attack.' },
  'Signal Beam': { name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'May confuse.' },
  'Silver Wind': { name: 'Silver Wind', type: 'Bug', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'May raise all stats.' },
  'Spider Web': { name: 'Spider Web', type: 'Bug', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Prevents foe from fleeing.' },
  
  // Rock moves
  'Rock Throw': { name: 'Rock Throw', type: 'Rock', category: 'Physical', power: 50, accuracy: 90, pp: 15, description: 'Throws a rock.' },
  'Rock Slide': { name: 'Rock Slide', type: 'Rock', category: 'Physical', power: 75, accuracy: 90, pp: 10, description: 'May cause flinching.' },
  'Rock Tomb': { name: 'Rock Tomb', type: 'Rock', category: 'Physical', power: 50, accuracy: 80, pp: 10, description: 'Lowers Speed.' },
  'Rollout': { name: 'Rollout', type: 'Rock', category: 'Physical', power: 30, accuracy: 90, pp: 20, description: 'Power doubles each turn.' },
  'Ancient Power': { name: 'Ancient Power', type: 'Rock', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'May raise all stats.' },
  'Stealth Rock': { name: 'Stealth Rock', type: 'Rock', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Damages foes switching in.' },
  
  // Ghost moves
  'Lick': { name: 'Lick', type: 'Ghost', category: 'Physical', power: 20, accuracy: 100, pp: 30, description: 'May paralyze.' },
  'Night Shade': { name: 'Night Shade', type: 'Ghost', category: 'Special', power: null, accuracy: 100, pp: 15, description: 'Damage equals user\'s level.' },
  'Confuse Ray': { name: 'Confuse Ray', type: 'Ghost', category: 'Status', power: null, accuracy: 100, pp: 10, description: 'Confuses the foe.' },
  'Shadow Ball': { name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'May lower Sp. Def.' },
  'Shadow Punch': { name: 'Shadow Punch', type: 'Ghost', category: 'Physical', power: 60, accuracy: null, pp: 20, description: 'Never misses.' },
  'Curse': { name: 'Curse', type: 'Ghost', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Ghosts: curse foe. Others: raise stats.' },
  'Destiny Bond': { name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: null, accuracy: null, pp: 5, description: 'If user faints, foe faints too.' },
  'Grudge': { name: 'Grudge', type: 'Ghost', category: 'Status', power: null, accuracy: null, pp: 5, description: 'If KO\'d, foe loses all PP of that move.' },
  'Nightmare': { name: 'Nightmare', type: 'Ghost', category: 'Status', power: null, accuracy: 100, pp: 15, description: 'Sleeping foe loses 1/4 HP each turn.' },
  'Mean Look': { name: 'Mean Look', type: 'Normal', category: 'Status', power: null, accuracy: null, pp: 5, description: 'Prevents foe from fleeing.' },
  
  // Dragon moves
  'Dragon Rage': { name: 'Dragon Rage', type: 'Dragon', category: 'Special', power: null, accuracy: 100, pp: 10, description: 'Always does 40 HP damage.' },
  'Dragon Breath': { name: 'Dragon Breath', type: 'Dragon', category: 'Special', power: 60, accuracy: 100, pp: 20, description: 'May paralyze.' },
  'Dragon Claw': { name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Slashes with sharp claws.' },
  'Outrage': { name: 'Outrage', type: 'Dragon', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Attacks 2-3 turns, then confuses.' },
  'Twister': { name: 'Twister', type: 'Dragon', category: 'Special', power: 40, accuracy: 100, pp: 20, description: 'May cause flinching.' },
  'Dragon Dance': { name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: null, accuracy: null, pp: 20, description: 'Raises Attack and Speed.' },
  
  // Dark moves
  'Bite': { name: 'Bite', type: 'Dark', category: 'Physical', power: 60, accuracy: 100, pp: 25, description: 'May cause flinching.' },
  'Crunch': { name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'May lower Defense.' },
  'Pursuit': { name: 'Pursuit', type: 'Dark', category: 'Physical', power: 40, accuracy: 100, pp: 20, description: 'Power doubles if foe switches.' },
  'Faint Attack': { name: 'Faint Attack', type: 'Dark', category: 'Physical', power: 60, accuracy: null, pp: 20, description: 'Never misses.' },
  'Thief': { name: 'Thief', type: 'Dark', category: 'Physical', power: 40, accuracy: 100, pp: 10, description: 'Steals foe\'s held item.' },
  'Beat Up': { name: 'Beat Up', type: 'Dark', category: 'Physical', power: null, accuracy: 100, pp: 10, description: 'Each party member attacks.' },
  'Torment': { name: 'Torment', type: 'Dark', category: 'Status', power: null, accuracy: 100, pp: 15, description: 'Foe can\'t use same move twice.' },
  'Taunt': { name: 'Taunt', type: 'Dark', category: 'Status', power: null, accuracy: 100, pp: 20, description: 'Foe can only use attack moves.' },
  'Snatch': { name: 'Snatch', type: 'Dark', category: 'Status', power: null, accuracy: null, pp: 10, description: 'Steals foe\'s stat move.', priority: 4 },
  'Memento': { name: 'Memento', type: 'Dark', category: 'Status', power: null, accuracy: 100, pp: 10, description: 'User faints, sharply lowers foe\'s stats.' },
  
  // Steel moves
  'Metal Claw': { name: 'Metal Claw', type: 'Steel', category: 'Physical', power: 50, accuracy: 95, pp: 35, description: 'May raise Attack.' },
  'Iron Tail': { name: 'Iron Tail', type: 'Steel', category: 'Physical', power: 100, accuracy: 75, pp: 15, description: 'May lower Defense.' },
  'Steel Wing': { name: 'Steel Wing', type: 'Steel', category: 'Physical', power: 70, accuracy: 90, pp: 25, description: 'May raise Defense.' },
  'Meteor Mash': { name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 100, accuracy: 85, pp: 10, description: 'May raise Attack.' },
  'Iron Defense': { name: 'Iron Defense', type: 'Steel', category: 'Status', power: null, accuracy: null, pp: 15, description: 'Sharply raises Defense.' },
  'Metal Sound': { name: 'Metal Sound', type: 'Steel', category: 'Status', power: null, accuracy: 85, pp: 40, description: 'Sharply lowers Sp. Def.' },
};

// Get all move names for autocomplete
export const MOVE_NAMES = Object.keys(MOVES).sort();

// Get moves by type
export function getMovesByType(type: PokemonType): MoveData[] {
  return Object.values(MOVES).filter(m => m.type === type);
}

// Get moves by category
export function getMovesByCategory(category: 'Physical' | 'Special' | 'Status'): MoveData[] {
  return Object.values(MOVES).filter(m => m.category === category);
}

// Search moves
export function searchMoves(query: string): MoveData[] {
  const lower = query.toLowerCase();
  return Object.values(MOVES).filter(m => 
    m.name.toLowerCase().includes(lower) ||
    m.type.toLowerCase().includes(lower) ||
    m.description.toLowerCase().includes(lower)
  );
}
