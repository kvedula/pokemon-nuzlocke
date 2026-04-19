import { PokemonSpecies, PokemonType } from '@/types';

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

function createSpecies(
  id: number,
  name: string,
  types: [PokemonType] | [PokemonType, PokemonType],
  hp: number,
  attack: number,
  defense: number,
  spAtk: number,
  spDef: number,
  speed: number,
  abilities: string[],
  catchRate: number = 45
): PokemonSpecies {
  return {
    id,
    name,
    types,
    baseStats: { hp, attack, defense, spAtk, spDef, speed },
    abilities,
    spriteUrl: `${SPRITE_BASE}/${id}.png`,
    spriteShinyUrl: `${SPRITE_BASE}/shiny/${id}.png`,
    catchRate,
    baseExp: Math.floor((hp + attack + defense + spAtk + spDef + speed) / 2),
    genderRatio: id === 132 ? null : 50,
  };
}

export const POKEMON_SPECIES: Record<number, PokemonSpecies> = {
  1: createSpecies(1, 'Bulbasaur', ['Grass', 'Poison'], 45, 49, 49, 65, 65, 45, ['Overgrow'], 45),
  2: createSpecies(2, 'Ivysaur', ['Grass', 'Poison'], 60, 62, 63, 80, 80, 60, ['Overgrow'], 45),
  3: createSpecies(3, 'Venusaur', ['Grass', 'Poison'], 80, 82, 83, 100, 100, 80, ['Overgrow'], 45),
  4: createSpecies(4, 'Charmander', ['Fire'], 39, 52, 43, 60, 50, 65, ['Blaze'], 45),
  5: createSpecies(5, 'Charmeleon', ['Fire'], 58, 64, 58, 80, 65, 80, ['Blaze'], 45),
  6: createSpecies(6, 'Charizard', ['Fire', 'Flying'], 78, 84, 78, 109, 85, 100, ['Blaze'], 45),
  7: createSpecies(7, 'Squirtle', ['Water'], 44, 48, 65, 50, 64, 43, ['Torrent'], 45),
  8: createSpecies(8, 'Wartortle', ['Water'], 59, 63, 80, 65, 80, 58, ['Torrent'], 45),
  9: createSpecies(9, 'Blastoise', ['Water'], 79, 83, 100, 85, 105, 78, ['Torrent'], 45),
  10: createSpecies(10, 'Caterpie', ['Bug'], 45, 30, 35, 20, 20, 45, ['Shield Dust'], 255),
  11: createSpecies(11, 'Metapod', ['Bug'], 50, 20, 55, 25, 25, 30, ['Shed Skin'], 120),
  12: createSpecies(12, 'Butterfree', ['Bug', 'Flying'], 60, 45, 50, 90, 80, 70, ['Compound Eyes'], 45),
  13: createSpecies(13, 'Weedle', ['Bug', 'Poison'], 40, 35, 30, 20, 20, 50, ['Shield Dust'], 255),
  14: createSpecies(14, 'Kakuna', ['Bug', 'Poison'], 45, 25, 50, 25, 25, 35, ['Shed Skin'], 120),
  15: createSpecies(15, 'Beedrill', ['Bug', 'Poison'], 65, 90, 40, 45, 80, 75, ['Swarm'], 45),
  16: createSpecies(16, 'Pidgey', ['Normal', 'Flying'], 40, 45, 40, 35, 35, 56, ['Keen Eye', 'Tangled Feet'], 255),
  17: createSpecies(17, 'Pidgeotto', ['Normal', 'Flying'], 63, 60, 55, 50, 50, 71, ['Keen Eye', 'Tangled Feet'], 120),
  18: createSpecies(18, 'Pidgeot', ['Normal', 'Flying'], 83, 80, 75, 70, 70, 101, ['Keen Eye', 'Tangled Feet'], 45),
  19: createSpecies(19, 'Rattata', ['Normal'], 30, 56, 35, 25, 35, 72, ['Run Away', 'Guts'], 255),
  20: createSpecies(20, 'Raticate', ['Normal'], 55, 81, 60, 50, 70, 97, ['Run Away', 'Guts'], 127),
  21: createSpecies(21, 'Spearow', ['Normal', 'Flying'], 40, 60, 30, 31, 31, 70, ['Keen Eye'], 255),
  22: createSpecies(22, 'Fearow', ['Normal', 'Flying'], 65, 90, 65, 61, 61, 100, ['Keen Eye'], 90),
  23: createSpecies(23, 'Ekans', ['Poison'], 35, 60, 44, 40, 54, 55, ['Intimidate', 'Shed Skin'], 255),
  24: createSpecies(24, 'Arbok', ['Poison'], 60, 95, 69, 65, 79, 80, ['Intimidate', 'Shed Skin'], 90),
  25: createSpecies(25, 'Pikachu', ['Electric'], 35, 55, 40, 50, 50, 90, ['Static'], 190),
  26: createSpecies(26, 'Raichu', ['Electric'], 60, 90, 55, 90, 80, 110, ['Static'], 75),
  27: createSpecies(27, 'Sandshrew', ['Ground'], 50, 75, 85, 20, 30, 40, ['Sand Veil'], 255),
  28: createSpecies(28, 'Sandslash', ['Ground'], 75, 100, 110, 45, 55, 65, ['Sand Veil'], 90),
  29: createSpecies(29, 'Nidoran♀', ['Poison'], 55, 47, 52, 40, 40, 41, ['Poison Point', 'Rivalry'], 235),
  30: createSpecies(30, 'Nidorina', ['Poison'], 70, 62, 67, 55, 55, 56, ['Poison Point', 'Rivalry'], 120),
  31: createSpecies(31, 'Nidoqueen', ['Poison', 'Ground'], 90, 92, 87, 75, 85, 76, ['Poison Point', 'Rivalry'], 45),
  32: createSpecies(32, 'Nidoran♂', ['Poison'], 46, 57, 40, 40, 40, 50, ['Poison Point', 'Rivalry'], 235),
  33: createSpecies(33, 'Nidorino', ['Poison'], 61, 72, 57, 55, 55, 65, ['Poison Point', 'Rivalry'], 120),
  34: createSpecies(34, 'Nidoking', ['Poison', 'Ground'], 81, 102, 77, 85, 75, 85, ['Poison Point', 'Rivalry'], 45),
  35: createSpecies(35, 'Clefairy', ['Normal'], 70, 45, 48, 60, 65, 35, ['Cute Charm', 'Magic Guard'], 150),
  36: createSpecies(36, 'Clefable', ['Normal'], 95, 70, 73, 95, 90, 60, ['Cute Charm', 'Magic Guard'], 25),
  37: createSpecies(37, 'Vulpix', ['Fire'], 38, 41, 40, 50, 65, 65, ['Flash Fire'], 190),
  38: createSpecies(38, 'Ninetales', ['Fire'], 73, 76, 75, 81, 100, 100, ['Flash Fire'], 75),
  39: createSpecies(39, 'Jigglypuff', ['Normal'], 115, 45, 20, 45, 25, 20, ['Cute Charm'], 170),
  40: createSpecies(40, 'Wigglytuff', ['Normal'], 140, 70, 45, 85, 50, 45, ['Cute Charm'], 50),
  41: createSpecies(41, 'Zubat', ['Poison', 'Flying'], 40, 45, 35, 30, 40, 55, ['Inner Focus'], 255),
  42: createSpecies(42, 'Golbat', ['Poison', 'Flying'], 75, 80, 70, 65, 75, 90, ['Inner Focus'], 90),
  43: createSpecies(43, 'Oddish', ['Grass', 'Poison'], 45, 50, 55, 75, 65, 30, ['Chlorophyll'], 255),
  44: createSpecies(44, 'Gloom', ['Grass', 'Poison'], 60, 65, 70, 85, 75, 40, ['Chlorophyll'], 120),
  45: createSpecies(45, 'Vileplume', ['Grass', 'Poison'], 75, 80, 85, 110, 90, 50, ['Chlorophyll'], 45),
  46: createSpecies(46, 'Paras', ['Bug', 'Grass'], 35, 70, 55, 45, 55, 25, ['Effect Spore', 'Dry Skin'], 190),
  47: createSpecies(47, 'Parasect', ['Bug', 'Grass'], 60, 95, 80, 60, 80, 30, ['Effect Spore', 'Dry Skin'], 75),
  48: createSpecies(48, 'Venonat', ['Bug', 'Poison'], 60, 55, 50, 40, 55, 45, ['Compound Eyes', 'Tinted Lens'], 190),
  49: createSpecies(49, 'Venomoth', ['Bug', 'Poison'], 70, 65, 60, 90, 75, 90, ['Shield Dust', 'Tinted Lens'], 75),
  50: createSpecies(50, 'Diglett', ['Ground'], 10, 55, 25, 35, 45, 95, ['Sand Veil', 'Arena Trap'], 255),
  51: createSpecies(51, 'Dugtrio', ['Ground'], 35, 100, 50, 50, 70, 120, ['Sand Veil', 'Arena Trap'], 50),
  52: createSpecies(52, 'Meowth', ['Normal'], 40, 45, 35, 40, 40, 90, ['Pickup', 'Technician'], 255),
  53: createSpecies(53, 'Persian', ['Normal'], 65, 70, 60, 65, 65, 115, ['Limber', 'Technician'], 90),
  54: createSpecies(54, 'Psyduck', ['Water'], 50, 52, 48, 65, 50, 55, ['Damp', 'Cloud Nine'], 190),
  55: createSpecies(55, 'Golduck', ['Water'], 80, 82, 78, 95, 80, 85, ['Damp', 'Cloud Nine'], 75),
  56: createSpecies(56, 'Mankey', ['Fighting'], 40, 80, 35, 35, 45, 70, ['Vital Spirit', 'Anger Point'], 190),
  57: createSpecies(57, 'Primeape', ['Fighting'], 65, 105, 60, 60, 70, 95, ['Vital Spirit', 'Anger Point'], 75),
  58: createSpecies(58, 'Growlithe', ['Fire'], 55, 70, 45, 70, 50, 60, ['Intimidate', 'Flash Fire'], 190),
  59: createSpecies(59, 'Arcanine', ['Fire'], 90, 110, 80, 100, 80, 95, ['Intimidate', 'Flash Fire'], 75),
  60: createSpecies(60, 'Poliwag', ['Water'], 40, 50, 40, 40, 40, 90, ['Water Absorb', 'Damp'], 255),
  61: createSpecies(61, 'Poliwhirl', ['Water'], 65, 65, 65, 50, 50, 90, ['Water Absorb', 'Damp'], 120),
  62: createSpecies(62, 'Poliwrath', ['Water', 'Fighting'], 90, 95, 95, 70, 90, 70, ['Water Absorb', 'Damp'], 45),
  63: createSpecies(63, 'Abra', ['Psychic'], 25, 20, 15, 105, 55, 90, ['Synchronize', 'Inner Focus'], 200),
  64: createSpecies(64, 'Kadabra', ['Psychic'], 40, 35, 30, 120, 70, 105, ['Synchronize', 'Inner Focus'], 100),
  65: createSpecies(65, 'Alakazam', ['Psychic'], 55, 50, 45, 135, 95, 120, ['Synchronize', 'Inner Focus'], 50),
  66: createSpecies(66, 'Machop', ['Fighting'], 70, 80, 50, 35, 35, 35, ['Guts', 'No Guard'], 180),
  67: createSpecies(67, 'Machoke', ['Fighting'], 80, 100, 70, 50, 60, 45, ['Guts', 'No Guard'], 90),
  68: createSpecies(68, 'Machamp', ['Fighting'], 90, 130, 80, 65, 85, 55, ['Guts', 'No Guard'], 45),
  69: createSpecies(69, 'Bellsprout', ['Grass', 'Poison'], 50, 75, 35, 70, 30, 40, ['Chlorophyll'], 255),
  70: createSpecies(70, 'Weepinbell', ['Grass', 'Poison'], 65, 90, 50, 85, 45, 55, ['Chlorophyll'], 120),
  71: createSpecies(71, 'Victreebel', ['Grass', 'Poison'], 80, 105, 65, 100, 70, 70, ['Chlorophyll'], 45),
  72: createSpecies(72, 'Tentacool', ['Water', 'Poison'], 40, 40, 35, 50, 100, 70, ['Clear Body', 'Liquid Ooze'], 190),
  73: createSpecies(73, 'Tentacruel', ['Water', 'Poison'], 80, 70, 65, 80, 120, 100, ['Clear Body', 'Liquid Ooze'], 60),
  74: createSpecies(74, 'Geodude', ['Rock', 'Ground'], 40, 80, 100, 30, 30, 20, ['Rock Head', 'Sturdy'], 255),
  75: createSpecies(75, 'Graveler', ['Rock', 'Ground'], 55, 95, 115, 45, 45, 35, ['Rock Head', 'Sturdy'], 120),
  76: createSpecies(76, 'Golem', ['Rock', 'Ground'], 80, 120, 130, 55, 65, 45, ['Rock Head', 'Sturdy'], 45),
  77: createSpecies(77, 'Ponyta', ['Fire'], 50, 85, 55, 65, 65, 90, ['Run Away', 'Flash Fire'], 190),
  78: createSpecies(78, 'Rapidash', ['Fire'], 65, 100, 70, 80, 80, 105, ['Run Away', 'Flash Fire'], 60),
  79: createSpecies(79, 'Slowpoke', ['Water', 'Psychic'], 90, 65, 65, 40, 40, 15, ['Oblivious', 'Own Tempo'], 190),
  80: createSpecies(80, 'Slowbro', ['Water', 'Psychic'], 95, 75, 110, 100, 80, 30, ['Oblivious', 'Own Tempo'], 75),
  81: createSpecies(81, 'Magnemite', ['Electric', 'Steel'], 25, 35, 70, 95, 55, 45, ['Magnet Pull', 'Sturdy'], 190),
  82: createSpecies(82, 'Magneton', ['Electric', 'Steel'], 50, 60, 95, 120, 70, 70, ['Magnet Pull', 'Sturdy'], 60),
  83: createSpecies(83, 'Farfetch\'d', ['Normal', 'Flying'], 52, 90, 55, 58, 62, 60, ['Keen Eye', 'Inner Focus'], 45),
  84: createSpecies(84, 'Doduo', ['Normal', 'Flying'], 35, 85, 45, 35, 35, 75, ['Run Away', 'Early Bird'], 190),
  85: createSpecies(85, 'Dodrio', ['Normal', 'Flying'], 60, 110, 70, 60, 60, 110, ['Run Away', 'Early Bird'], 45),
  86: createSpecies(86, 'Seel', ['Water'], 65, 45, 55, 45, 70, 45, ['Thick Fat', 'Hydration'], 190),
  87: createSpecies(87, 'Dewgong', ['Water', 'Ice'], 90, 70, 80, 70, 95, 70, ['Thick Fat', 'Hydration'], 75),
  88: createSpecies(88, 'Grimer', ['Poison'], 80, 80, 50, 40, 50, 25, ['Stench', 'Sticky Hold'], 190),
  89: createSpecies(89, 'Muk', ['Poison'], 105, 105, 75, 65, 100, 50, ['Stench', 'Sticky Hold'], 75),
  90: createSpecies(90, 'Shellder', ['Water'], 30, 65, 100, 45, 25, 40, ['Shell Armor', 'Skill Link'], 190),
  91: createSpecies(91, 'Cloyster', ['Water', 'Ice'], 50, 95, 180, 85, 45, 70, ['Shell Armor', 'Skill Link'], 60),
  92: createSpecies(92, 'Gastly', ['Ghost', 'Poison'], 30, 35, 30, 100, 35, 80, ['Levitate'], 190),
  93: createSpecies(93, 'Haunter', ['Ghost', 'Poison'], 45, 50, 45, 115, 55, 95, ['Levitate'], 90),
  94: createSpecies(94, 'Gengar', ['Ghost', 'Poison'], 60, 65, 60, 130, 75, 110, ['Levitate'], 45),
  95: createSpecies(95, 'Onix', ['Rock', 'Ground'], 35, 45, 160, 30, 45, 70, ['Rock Head', 'Sturdy'], 45),
  96: createSpecies(96, 'Drowzee', ['Psychic'], 60, 48, 45, 43, 90, 42, ['Insomnia', 'Forewarn'], 190),
  97: createSpecies(97, 'Hypno', ['Psychic'], 85, 73, 70, 73, 115, 67, ['Insomnia', 'Forewarn'], 75),
  98: createSpecies(98, 'Krabby', ['Water'], 30, 105, 90, 25, 25, 50, ['Hyper Cutter', 'Shell Armor'], 225),
  99: createSpecies(99, 'Kingler', ['Water'], 55, 130, 115, 50, 50, 75, ['Hyper Cutter', 'Shell Armor'], 60),
  100: createSpecies(100, 'Voltorb', ['Electric'], 40, 30, 50, 55, 55, 100, ['Soundproof', 'Static'], 190),
  101: createSpecies(101, 'Electrode', ['Electric'], 60, 50, 70, 80, 80, 150, ['Soundproof', 'Static'], 60),
  102: createSpecies(102, 'Exeggcute', ['Grass', 'Psychic'], 60, 40, 80, 60, 45, 40, ['Chlorophyll'], 90),
  103: createSpecies(103, 'Exeggutor', ['Grass', 'Psychic'], 95, 95, 85, 125, 75, 55, ['Chlorophyll'], 45),
  104: createSpecies(104, 'Cubone', ['Ground'], 50, 50, 95, 40, 50, 35, ['Rock Head', 'Lightning Rod'], 190),
  105: createSpecies(105, 'Marowak', ['Ground'], 60, 80, 110, 50, 80, 45, ['Rock Head', 'Lightning Rod'], 75),
  106: createSpecies(106, 'Hitmonlee', ['Fighting'], 50, 120, 53, 35, 110, 87, ['Limber', 'Reckless'], 45),
  107: createSpecies(107, 'Hitmonchan', ['Fighting'], 50, 105, 79, 35, 110, 76, ['Keen Eye', 'Iron Fist'], 45),
  108: createSpecies(108, 'Lickitung', ['Normal'], 90, 55, 75, 60, 75, 30, ['Own Tempo', 'Oblivious'], 45),
  109: createSpecies(109, 'Koffing', ['Poison'], 40, 65, 95, 60, 45, 35, ['Levitate'], 190),
  110: createSpecies(110, 'Weezing', ['Poison'], 65, 90, 120, 85, 70, 60, ['Levitate'], 60),
  111: createSpecies(111, 'Rhyhorn', ['Ground', 'Rock'], 80, 85, 95, 30, 30, 25, ['Lightning Rod', 'Rock Head'], 120),
  112: createSpecies(112, 'Rhydon', ['Ground', 'Rock'], 105, 130, 120, 45, 45, 40, ['Lightning Rod', 'Rock Head'], 60),
  113: createSpecies(113, 'Chansey', ['Normal'], 250, 5, 5, 35, 105, 50, ['Natural Cure', 'Serene Grace'], 30),
  114: createSpecies(114, 'Tangela', ['Grass'], 65, 55, 115, 100, 40, 60, ['Chlorophyll', 'Leaf Guard'], 45),
  115: createSpecies(115, 'Kangaskhan', ['Normal'], 105, 95, 80, 40, 80, 90, ['Early Bird', 'Scrappy'], 45),
  116: createSpecies(116, 'Horsea', ['Water'], 30, 40, 70, 70, 25, 60, ['Swift Swim', 'Sniper'], 225),
  117: createSpecies(117, 'Seadra', ['Water'], 55, 65, 95, 95, 45, 85, ['Poison Point', 'Sniper'], 75),
  118: createSpecies(118, 'Goldeen', ['Water'], 45, 67, 60, 35, 50, 63, ['Swift Swim', 'Water Veil'], 225),
  119: createSpecies(119, 'Seaking', ['Water'], 80, 92, 65, 65, 80, 68, ['Swift Swim', 'Water Veil'], 60),
  120: createSpecies(120, 'Staryu', ['Water'], 30, 45, 55, 70, 55, 85, ['Illuminate', 'Natural Cure'], 225),
  121: createSpecies(121, 'Starmie', ['Water', 'Psychic'], 60, 75, 85, 100, 85, 115, ['Illuminate', 'Natural Cure'], 60),
  122: createSpecies(122, 'Mr. Mime', ['Psychic'], 40, 45, 65, 100, 120, 90, ['Soundproof', 'Filter'], 45),
  123: createSpecies(123, 'Scyther', ['Bug', 'Flying'], 70, 110, 80, 55, 80, 105, ['Swarm', 'Technician'], 45),
  124: createSpecies(124, 'Jynx', ['Ice', 'Psychic'], 65, 50, 35, 115, 95, 95, ['Oblivious', 'Forewarn'], 45),
  125: createSpecies(125, 'Electabuzz', ['Electric'], 65, 83, 57, 95, 85, 105, ['Static'], 45),
  126: createSpecies(126, 'Magmar', ['Fire'], 65, 95, 57, 100, 85, 93, ['Flame Body'], 45),
  127: createSpecies(127, 'Pinsir', ['Bug'], 65, 125, 100, 55, 70, 85, ['Hyper Cutter', 'Mold Breaker'], 45),
  128: createSpecies(128, 'Tauros', ['Normal'], 75, 100, 95, 40, 70, 110, ['Intimidate', 'Anger Point'], 45),
  129: createSpecies(129, 'Magikarp', ['Water'], 20, 10, 55, 15, 20, 80, ['Swift Swim'], 255),
  130: createSpecies(130, 'Gyarados', ['Water', 'Flying'], 95, 125, 79, 60, 100, 81, ['Intimidate'], 45),
  131: createSpecies(131, 'Lapras', ['Water', 'Ice'], 130, 85, 80, 85, 95, 60, ['Water Absorb', 'Shell Armor'], 45),
  132: createSpecies(132, 'Ditto', ['Normal'], 48, 48, 48, 48, 48, 48, ['Limber'], 35),
  133: createSpecies(133, 'Eevee', ['Normal'], 55, 55, 50, 45, 65, 55, ['Run Away', 'Adaptability'], 45),
  134: createSpecies(134, 'Vaporeon', ['Water'], 130, 65, 60, 110, 95, 65, ['Water Absorb'], 45),
  135: createSpecies(135, 'Jolteon', ['Electric'], 65, 65, 60, 110, 95, 130, ['Volt Absorb'], 45),
  136: createSpecies(136, 'Flareon', ['Fire'], 65, 130, 60, 95, 110, 65, ['Flash Fire'], 45),
  137: createSpecies(137, 'Porygon', ['Normal'], 65, 60, 70, 85, 75, 40, ['Trace', 'Download'], 45),
  138: createSpecies(138, 'Omanyte', ['Rock', 'Water'], 35, 40, 100, 90, 55, 35, ['Swift Swim', 'Shell Armor'], 45),
  139: createSpecies(139, 'Omastar', ['Rock', 'Water'], 70, 60, 125, 115, 70, 55, ['Swift Swim', 'Shell Armor'], 45),
  140: createSpecies(140, 'Kabuto', ['Rock', 'Water'], 30, 80, 90, 55, 45, 55, ['Swift Swim', 'Battle Armor'], 45),
  141: createSpecies(141, 'Kabutops', ['Rock', 'Water'], 60, 115, 105, 65, 70, 80, ['Swift Swim', 'Battle Armor'], 45),
  142: createSpecies(142, 'Aerodactyl', ['Rock', 'Flying'], 80, 105, 65, 60, 75, 130, ['Rock Head', 'Pressure'], 45),
  143: createSpecies(143, 'Snorlax', ['Normal'], 160, 110, 65, 65, 110, 30, ['Immunity', 'Thick Fat'], 25),
  144: createSpecies(144, 'Articuno', ['Ice', 'Flying'], 90, 85, 100, 95, 125, 85, ['Pressure'], 3),
  145: createSpecies(145, 'Zapdos', ['Electric', 'Flying'], 90, 90, 85, 125, 90, 100, ['Pressure'], 3),
  146: createSpecies(146, 'Moltres', ['Fire', 'Flying'], 90, 100, 90, 125, 85, 90, ['Pressure'], 3),
  147: createSpecies(147, 'Dratini', ['Dragon'], 41, 64, 45, 50, 50, 50, ['Shed Skin'], 45),
  148: createSpecies(148, 'Dragonair', ['Dragon'], 61, 84, 65, 70, 70, 70, ['Shed Skin'], 45),
  149: createSpecies(149, 'Dragonite', ['Dragon', 'Flying'], 91, 134, 95, 100, 100, 80, ['Inner Focus'], 45),
  150: createSpecies(150, 'Mewtwo', ['Psychic'], 106, 110, 90, 154, 90, 130, ['Pressure'], 3),
  151: createSpecies(151, 'Mew', ['Psychic'], 100, 100, 100, 100, 100, 100, ['Synchronize'], 45),
};

export function getPokemonSpecies(id: number): PokemonSpecies | undefined {
  return POKEMON_SPECIES[id];
}

export function getPokemonByName(name: string): PokemonSpecies | undefined {
  return Object.values(POKEMON_SPECIES).find(
    p => p.name.toLowerCase() === name.toLowerCase()
  );
}

export function getAllPokemonSpecies(): PokemonSpecies[] {
  return Object.values(POKEMON_SPECIES);
}

export function getStarterOptions(): PokemonSpecies[] {
  return [POKEMON_SPECIES[1], POKEMON_SPECIES[4], POKEMON_SPECIES[7]];
}

export const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: '#A8A878',
  Fire: '#F08030',
  Water: '#6890F0',
  Electric: '#F8D030',
  Grass: '#78C850',
  Ice: '#98D8D8',
  Fighting: '#C03028',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Bug: '#A8B820',
  Rock: '#B8A038',
  Ghost: '#705898',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  Fairy: '#EE99AC',
};

// Type weaknesses (what each type is weak to)
export const TYPE_WEAKNESSES: Record<PokemonType, PokemonType[]> = {
  Normal: ['Fighting'],
  Fire: ['Water', 'Ground', 'Rock'],
  Water: ['Electric', 'Grass'],
  Electric: ['Ground'],
  Grass: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'],
  Ice: ['Fire', 'Fighting', 'Rock', 'Steel'],
  Fighting: ['Flying', 'Psychic'],
  Poison: ['Ground', 'Psychic'],
  Ground: ['Water', 'Grass', 'Ice'],
  Flying: ['Electric', 'Ice', 'Rock'],
  Psychic: ['Bug', 'Ghost', 'Dark'],
  Bug: ['Fire', 'Flying', 'Rock'],
  Rock: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'],
  Ghost: ['Ghost', 'Dark'],
  Dragon: ['Ice', 'Dragon'],
  Dark: ['Fighting', 'Bug'],
  Steel: ['Fire', 'Fighting', 'Ground'],
  Fairy: ['Poison', 'Steel'],
};

// Type resistances (what each type resists)
export const TYPE_RESISTANCES: Record<PokemonType, PokemonType[]> = {
  Normal: [],
  Fire: ['Fire', 'Grass', 'Ice', 'Bug', 'Steel'],
  Water: ['Fire', 'Water', 'Ice', 'Steel'],
  Electric: ['Electric', 'Flying', 'Steel'],
  Grass: ['Water', 'Electric', 'Grass', 'Ground'],
  Ice: ['Ice'],
  Fighting: ['Bug', 'Rock', 'Dark'],
  Poison: ['Grass', 'Fighting', 'Poison', 'Bug'],
  Ground: ['Poison', 'Rock'],
  Flying: ['Grass', 'Fighting', 'Bug'],
  Psychic: ['Fighting', 'Psychic'],
  Bug: ['Grass', 'Fighting', 'Ground'],
  Rock: ['Normal', 'Fire', 'Poison', 'Flying'],
  Ghost: ['Poison', 'Bug'],
  Dragon: ['Fire', 'Water', 'Electric', 'Grass'],
  Dark: ['Ghost', 'Dark'],
  Steel: ['Normal', 'Grass', 'Ice', 'Flying', 'Psychic', 'Bug', 'Rock', 'Dragon', 'Steel'],
  Fairy: ['Fighting', 'Bug', 'Dark'],
};

// Type immunities
export const TYPE_IMMUNITIES: Record<PokemonType, PokemonType[]> = {
  Normal: ['Ghost'],
  Fire: [],
  Water: [],
  Electric: [],
  Grass: [],
  Ice: [],
  Fighting: [],
  Poison: [],
  Ground: ['Electric'],
  Flying: ['Ground'],
  Psychic: [],
  Bug: [],
  Rock: [],
  Ghost: ['Normal', 'Fighting'],
  Dragon: [],
  Dark: ['Psychic'],
  Steel: ['Poison'],
  Fairy: ['Dragon'],
};

// Calculate combined weaknesses for a Pokemon with given types
export function getTypeWeaknesses(types: PokemonType[]): PokemonType[] {
  const weaknesses = new Set<PokemonType>();
  const resistances = new Set<PokemonType>();
  const immunities = new Set<PokemonType>();
  
  types.forEach(type => {
    TYPE_WEAKNESSES[type]?.forEach(w => weaknesses.add(w));
    TYPE_RESISTANCES[type]?.forEach(r => resistances.add(r));
    TYPE_IMMUNITIES[type]?.forEach(i => immunities.add(i));
  });
  
  // Remove resistances and immunities from weaknesses
  return Array.from(weaknesses).filter(w => !resistances.has(w) && !immunities.has(w));
}

// Get recommended types to use against a Pokemon
export function getRecommendedTypes(types: PokemonType[]): PokemonType[] {
  return getTypeWeaknesses(types);
}
