import { PokemonType } from '@/types';

export interface WalkthroughStep {
  id: string;
  phase: number;
  title: string;
  description: string;
  location: string;
  isOptional?: boolean;
  isKeyMoment?: boolean;
}

export interface GymGuide {
  gymId: string;
  leader: string;
  badge: string;
  badgeNumber: number;
  specialty: PokemonType;
  recommendedLevel: number;
  recommendedTypes: PokemonType[];
  keyThreats: {
    pokemon: string;
    level: number;
    danger: string;
    counter: string;
  }[];
  strategy: string;
  rewards: string[];
  preparation: string[];
}

export interface PhaseData {
  id: number;
  name: string;
  badge: number;
  description: string;
  keyLocations: string[];
  steps: WalkthroughStep[];
  keyItems: string[];
  bossEncounters: string[];
  nextPhaseRequirements: string[];
}

// Gym preparation guides with detailed counter strategies
export const GYM_GUIDES: GymGuide[] = [
  {
    gymId: 'pewter-gym',
    leader: 'Brock',
    badge: 'Boulder Badge',
    badgeNumber: 1,
    specialty: 'Rock',
    recommendedLevel: 14,
    recommendedTypes: ['Water', 'Grass', 'Fighting'],
    keyThreats: [
      {
        pokemon: 'Onix',
        level: 14,
        danger: 'High Defense, Rock Tomb can lower Speed',
        counter: 'Any Water or Grass move will OHKO. Butterfree with Confusion also works.',
      },
      {
        pokemon: 'Geodude',
        level: 12,
        danger: 'Can use Rock Throw for chip damage',
        counter: 'Same as Onix - Water/Grass moves destroy it.',
      },
    ],
    strategy: 'Brock is easy if you have the right type. Squirtle or Bulbasaur trivialize this fight. Charmander users should catch a Mankey (FireRed) on Route 22 or use Butterfree with Confusion. Nidoran with Double Kick also works.',
    rewards: ['Boulder Badge', 'TM39 Rock Tomb', 'Unlocks Flash HM usage'],
    preparation: [
      'Level your starter to at least 12-14',
      'Charmander users: Get Butterfree (evolves at 10) or Mankey from Route 22',
      'Stock up on Potions from Viridian Mart',
    ],
  },
  {
    gymId: 'cerulean-gym',
    leader: 'Misty',
    badge: 'Cascade Badge',
    badgeNumber: 2,
    specialty: 'Water',
    recommendedLevel: 21,
    recommendedTypes: ['Electric', 'Grass'],
    keyThreats: [
      {
        pokemon: 'Starmie',
        level: 21,
        danger: 'EXTREMELY DANGEROUS. Fast, high Sp.Atk, Water Pulse can confuse.',
        counter: 'Pikachu from Viridian Forest is ideal. Oddish/Bellsprout from Route 24/25. Must outspeed or tank a hit.',
      },
      {
        pokemon: 'Staryu',
        level: 18,
        danger: 'Weaker version of Starmie, still hits hard',
        counter: 'Same counters as Starmie.',
      },
    ],
    strategy: 'Starmie is one of the most dangerous Pokemon in early game Nuzlockes. It has 100 base Speed and 100 Sp.Atk with STAB Water Pulse that can confuse. You NEED an Electric or Grass type. Pikachu from Viridian Forest is your best bet. Oddish/Bellsprout from Routes 24-25 work but are slower. Consider over-leveling.',
    rewards: ['Cascade Badge', 'TM03 Water Pulse', 'Pokemon up to Lv.30 obey', 'Unlocks Cut HM usage'],
    preparation: [
      'CATCH PIKACHU in Viridian Forest (5% encounter rate, worth the grind)',
      'Alternative: Oddish (FireRed) or Bellsprout (LeafGreen) from Route 24/25',
      'Level your counter to at least 18-20',
      'Bring Paralyze Heals for Starmie paralysis chance',
      'Consider grinding to overlevel - Starmie is deadly',
    ],
  },
  {
    gymId: 'vermilion-gym',
    leader: 'Lt. Surge',
    badge: 'Thunder Badge',
    badgeNumber: 3,
    specialty: 'Electric',
    recommendedLevel: 24,
    recommendedTypes: ['Ground'],
    keyThreats: [
      {
        pokemon: 'Raichu',
        level: 24,
        danger: 'Fast, hits hard with Shock Wave (never misses). Double Team spam.',
        counter: 'Diglett/Dugtrio from Diglett Cave is PERFECT. Completely immune to Electric.',
      },
      {
        pokemon: 'Voltorb',
        level: 21,
        danger: 'Can explode with Sonicboom, annoying',
        counter: 'Ground types make this trivial.',
      },
      {
        pokemon: 'Pikachu',
        level: 18,
        danger: 'Weakest member, still has Static ability',
        counter: 'Ground type sweeps.',
      },
    ],
    strategy: 'Go to Diglett Cave (accessible from Vermilion City via Route 11) and catch a Diglett or Dugtrio. Ground types are completely immune to Electric moves, making this gym trivial. Dugtrio has high Speed and can outspeed Raichu. Alternatively, Sandshrew (LeafGreen) or any Ground type works.',
    rewards: ['Thunder Badge', 'TM34 Shock Wave', 'Pokemon up to Lv.40 obey'],
    preparation: [
      'REQUIRED: Get Cut HM from S.S. Anne Captain first',
      'Catch Diglett or Dugtrio in Diglett Cave - Ground immunity wins',
      'Level your Ground type to at least 22-24',
      'The trash can puzzle is random - save before attempting',
    ],
  },
  {
    gymId: 'celadon-gym',
    leader: 'Erika',
    badge: 'Rainbow Badge',
    badgeNumber: 4,
    specialty: 'Grass',
    recommendedLevel: 30,
    recommendedTypes: ['Fire', 'Ice', 'Flying', 'Poison'],
    keyThreats: [
      {
        pokemon: 'Vileplume',
        level: 29,
        danger: 'Stun Spore + Giga Drain combo. Can heal itself.',
        counter: 'Fire types (Growlithe, Charmeleon) or Flying types (Pidgeotto).',
      },
      {
        pokemon: 'Victreebel',
        level: 29,
        danger: 'Sleep Powder + Acid. Can lower Defense.',
        counter: 'Same as Vileplume.',
      },
      {
        pokemon: 'Tangela',
        level: 24,
        danger: 'Bulky with Ingrain, Constrict can be annoying',
        counter: 'Weakest member, any Fire/Flying beats it.',
      },
    ],
    strategy: 'Erika is relatively straightforward. Any Fire type destroys her team. Charizard, Growlithe (FireRed), Vulpix (LeafGreen), or Flareon (free Eevee in Celadon!) all work great. Flying types like Pidgeotto/Fearow also do well. Watch out for Sleep Powder spam - bring Awakenings.',
    rewards: ['Rainbow Badge', 'TM19 Giga Drain', 'Pokemon up to Lv.50 obey'],
    preparation: [
      'Get the free Eevee from Celadon Mansion - evolve to Flareon if needed',
      'Growlithe (FireRed) or Vulpix (LeafGreen) from Route 7/8',
      'Stock up on Awakenings for Sleep Powder',
      'Need Cut HM to access the gym',
    ],
  },
  {
    gymId: 'fuchsia-gym',
    leader: 'Koga',
    badge: 'Soul Badge',
    badgeNumber: 5,
    specialty: 'Poison',
    recommendedLevel: 43,
    recommendedTypes: ['Ground', 'Psychic'],
    keyThreats: [
      {
        pokemon: 'Weezing',
        level: 43,
        danger: 'Toxic + Smokescreen + Sludge. Self-Destruct risk!',
        counter: 'Psychic types (Kadabra, Alakazam) or Ground (Dugtrio). Watch for Explosion!',
      },
      {
        pokemon: 'Muk',
        level: 39,
        danger: 'Minimize spam makes it hard to hit. Sludge hurts.',
        counter: 'Ground types work best as they ignore Minimize if using Earthquake.',
      },
      {
        pokemon: 'Koffing x2',
        level: 37,
        danger: 'Can Explode, Toxic stalling',
        counter: 'Same as Weezing but less threatening.',
      },
    ],
    strategy: 'Koga uses Toxic stalling with Minimize/Smokescreen evasion. Ground types with Earthquake ignore evasion boosts. Psychic types like Kadabra/Alakazam can OHKO everything but beware of Explosion/Self-Destruct. Bring Antidotes and Full Heals for Toxic. The invisible wall maze can be annoying.',
    rewards: ['Soul Badge', 'TM06 Toxic', 'Unlocks Surf HM usage outside battle'],
    preparation: [
      'Get Surf and Strength HMs from Safari Zone FIRST',
      'Dugtrio or other Ground type with Earthquake',
      'Kadabra/Alakazam for quick KOs',
      'Stock up on Antidotes and Full Heals',
      'Level to 40+ recommended',
    ],
  },
  {
    gymId: 'saffron-gym',
    leader: 'Sabrina',
    badge: 'Marsh Badge',
    badgeNumber: 6,
    specialty: 'Psychic',
    recommendedLevel: 43,
    recommendedTypes: ['Bug', 'Ghost', 'Dark'],
    keyThreats: [
      {
        pokemon: 'Alakazam',
        level: 43,
        danger: 'EXTREMELY DANGEROUS. 120 Speed, 135 Sp.Atk. Psychic will devastate.',
        counter: 'Very few options. Dark types dont exist in Gen 3 Kanto. Snorlax can tank. Shadow Ball users.',
      },
      {
        pokemon: 'Mr. Mime',
        level: 37,
        danger: 'Barrier + Psybeam combo. Can wall physical attackers.',
        counter: 'Special attackers preferred.',
      },
      {
        pokemon: 'Kadabra',
        level: 38,
        danger: 'Fast with Psybeam, but frail',
        counter: 'Physical attacks work if you outspeed.',
      },
      {
        pokemon: 'Venomoth',
        level: 38,
        danger: 'Psybeam + Sleep Powder. Bug/Poison typing gives weaknesses.',
        counter: 'Fire, Flying, Rock moves.',
      },
    ],
    strategy: 'Sabrina is terrifying. Alakazam has 120 Speed and 135 Sp.Atk - it will likely outspeed and OHKO most of your team. Your best options: Snorlax (massive HP/Sp.Def), Gyarados (Intimidate + high HP), or Pokemon with Shadow Ball. Jolteon with Shadow Ball is ideal. Consider over-leveling significantly.',
    rewards: ['Marsh Badge', 'TM04 Calm Mind', 'Pokemon up to Lv.70 obey'],
    preparation: [
      'Get Shadow Ball TM (Game Corner or post-game)',
      'Snorlax from Route 12/16 can tank Alakazam hits',
      'Gyarados with Intimidate helps',
      'Level to 45+ strongly recommended',
      'Have a backup plan - Alakazam can sweep',
    ],
  },
  {
    gymId: 'cinnabar-gym',
    leader: 'Blaine',
    badge: 'Volcano Badge',
    badgeNumber: 7,
    specialty: 'Fire',
    recommendedLevel: 47,
    recommendedTypes: ['Water', 'Ground', 'Rock'],
    keyThreats: [
      {
        pokemon: 'Arcanine',
        level: 47,
        danger: 'High stats across the board. Flamethrower + Extremespeed priority.',
        counter: 'Water types (Lapras, Blastoise, Gyarados). Ground resists Extremespeed.',
      },
      {
        pokemon: 'Rapidash',
        level: 42,
        danger: 'Fast with Bounce (Flying type). Fire Blast hurts.',
        counter: 'Water types. Rock resists Bounce.',
      },
      {
        pokemon: 'Ponyta',
        level: 40,
        danger: 'Weaker Rapidash',
        counter: 'Water types.',
      },
      {
        pokemon: 'Growlithe',
        level: 42,
        danger: 'Intimidate can lower Attack',
        counter: 'Water types.',
      },
    ],
    strategy: 'Blaine is straightforward if you have Water types. Lapras (free from Silph Co!) is perfect. Blastoise, Gyarados, or any strong Water type will sweep. Ground types like Dugtrio also work well. Answer the quiz questions correctly to skip gym trainers.',
    rewards: ['Volcano Badge', 'TM35 Flamethrower'],
    preparation: [
      'Get Secret Key from Pokemon Mansion basement',
      'Lapras from Silph Co is ideal',
      'Any Water type with Surf works great',
      'Bring Burn Heals just in case',
    ],
  },
  {
    gymId: 'viridian-gym',
    leader: 'Giovanni',
    badge: 'Earth Badge',
    badgeNumber: 8,
    specialty: 'Ground',
    recommendedLevel: 50,
    recommendedTypes: ['Water', 'Grass', 'Ice'],
    keyThreats: [
      {
        pokemon: 'Rhydon',
        level: 50,
        danger: 'Ace Pokemon. Rock/Ground with Earthquake. Massive physical stats.',
        counter: 'Water or Grass moves deal 4x damage. Ice also works well.',
      },
      {
        pokemon: 'Nidoqueen',
        level: 44,
        danger: 'Poison/Ground. Earthquake + Body Slam.',
        counter: 'Water, Ice, Psychic, Ground moves.',
      },
      {
        pokemon: 'Nidoking',
        level: 45,
        danger: 'Similar to Nidoqueen but more offensive.',
        counter: 'Same counters as Nidoqueen.',
      },
      {
        pokemon: 'Rhyhorn',
        level: 45,
        danger: 'Weaker Rhydon',
        counter: 'Water/Grass 4x effective.',
      },
      {
        pokemon: 'Dugtrio',
        level: 42,
        danger: 'Very fast with Earthquake. Arena Trap prevents switching.',
        counter: 'Flying types immune, Water/Grass/Ice.',
      },
    ],
    strategy: 'Giovanni is Ground type specialist. Water and Grass types deal 4x to his Rock/Ground Pokemon (Rhyhorn, Rhydon). Lapras with Surf/Ice Beam is perfect. The spinning tile puzzle can be annoying - follow the spinners to reach Giovanni.',
    rewards: ['Earth Badge', 'TM26 Earthquake', 'All Pokemon obey'],
    preparation: [
      'Need 7 badges to enter',
      'Lapras is MVP with Water + Ice coverage',
      'Any strong Water type with Surf',
      'Level to 48-50 recommended',
      'Master Ball Giovanni drops Macho Brace after battle',
    ],
  },
];

// Elite Four guides
export interface EliteFourGuide {
  id: string;
  name: string;
  position: number;
  specialty: PokemonType;
  recommendedLevel: number;
  pokemon: {
    name: string;
    level: number;
    types: string[];
    danger: string;
  }[];
  recommendedTypes: PokemonType[];
  strategy: string;
}

export const ELITE_FOUR_GUIDES: EliteFourGuide[] = [
  {
    id: 'lorelei',
    name: 'Lorelei',
    position: 1,
    specialty: 'Ice' as PokemonType,
    recommendedLevel: 55,
    pokemon: [
      { name: 'Dewgong', level: 52, types: ['Water', 'Ice'], danger: 'Surf + Ice Beam' },
      { name: 'Cloyster', level: 51, types: ['Water', 'Ice'], danger: 'Massive Defense, Spike Cannon' },
      { name: 'Slowbro', level: 52, types: ['Water', 'Psychic'], danger: 'Amnesia + Surf combo' },
      { name: 'Jynx', level: 54, types: ['Ice', 'Psychic'], danger: 'Lovely Kiss sleep, Ice Punch' },
      { name: 'Lapras', level: 54, types: ['Water', 'Ice'], danger: 'Confuse Ray + Body Slam' },
    ],
    recommendedTypes: ['Electric', 'Fighting', 'Rock', 'Grass'],
    strategy: 'Electric types are your best friend here. Jolteon or Raichu with Thunderbolt sweeps most of her team. Fighting types work for Lapras and Cloyster. Watch out for Jynx\'s Lovely Kiss - bring Awakenings.',
  },
  {
    id: 'bruno',
    name: 'Bruno',
    position: 2,
    specialty: 'Fighting' as PokemonType,
    recommendedLevel: 55,
    pokemon: [
      { name: 'Onix', level: 51, types: ['Rock', 'Ground'], danger: 'Rock Tomb, Earthquake' },
      { name: 'Hitmonchan', level: 53, types: ['Fighting'], danger: 'Elemental punches' },
      { name: 'Hitmonlee', level: 53, types: ['Fighting'], danger: 'High Jump Kick, Mega Kick' },
      { name: 'Onix', level: 54, types: ['Rock', 'Ground'], danger: 'Same as first Onix' },
      { name: 'Machamp', level: 56, types: ['Fighting'], danger: 'Cross Chop, Scary Face' },
    ],
    recommendedTypes: ['Water', 'Psychic', 'Flying', 'Grass'],
    strategy: 'Psychic types (Alakazam, Hypno) dominate Fighting types. Water types destroy both Onix easily. Flying types resist Fighting and can sweep. Machamp hits hard so don\'t underestimate it.',
  },
  {
    id: 'agatha',
    name: 'Agatha',
    position: 3,
    specialty: 'Ghost' as PokemonType,
    recommendedLevel: 56,
    pokemon: [
      { name: 'Gengar', level: 54, types: ['Ghost', 'Poison'], danger: 'Shadow Ball, Hypnosis' },
      { name: 'Golbat', level: 54, types: ['Poison', 'Flying'], danger: 'Confuse Ray, Air Cutter' },
      { name: 'Haunter', level: 53, types: ['Ghost', 'Poison'], danger: 'Dream Eater combo' },
      { name: 'Arbok', level: 56, types: ['Poison'], danger: 'Iron Tail, Sludge Bomb' },
      { name: 'Gengar', level: 58, types: ['Ghost', 'Poison'], danger: 'Ace. Shadow Ball, Destiny Bond!' },
    ],
    recommendedTypes: ['Ground', 'Psychic', 'Dark'],
    strategy: 'Ground types are immune to most of Agatha\'s moves and hit Poison super-effectively. Psychic types work but watch for Shadow Ball. Her ace Gengar knows Destiny Bond - don\'t KO it with your best Pokemon if it uses this!',
  },
  {
    id: 'lance',
    name: 'Lance',
    position: 4,
    specialty: 'Dragon' as PokemonType,
    recommendedLevel: 58,
    pokemon: [
      { name: 'Gyarados', level: 56, types: ['Water', 'Flying'], danger: 'Hyper Beam, Dragon Rage' },
      { name: 'Dragonair', level: 54, types: ['Dragon'], danger: 'Thunder Wave, Hyper Beam' },
      { name: 'Dragonair', level: 54, types: ['Dragon'], danger: 'Outrage, Safeguard' },
      { name: 'Aerodactyl', level: 58, types: ['Rock', 'Flying'], danger: 'Very fast, Rock Slide, Ancient Power' },
      { name: 'Dragonite', level: 60, types: ['Dragon', 'Flying'], danger: 'ACE. Outrage, Hyper Beam, massive stats' },
    ],
    recommendedTypes: ['Ice', 'Electric', 'Rock'],
    strategy: 'Ice Beam destroys everything except Gyarados. Lapras is MVP here with Ice + Electric coverage. Dragonite has 4x Ice weakness. Aerodactyl is fast - use Electric or Water. Have a fast Pokemon to handle Dragonite\'s Outrage.',
  },
  {
    id: 'champion',
    name: 'Champion (Rival)',
    position: 5,
    specialty: 'Normal' as PokemonType,
    recommendedLevel: 60,
    pokemon: [
      { name: 'Pidgeot', level: 59, types: ['Normal', 'Flying'], danger: 'Aerial Ace, Whirlwind' },
      { name: 'Alakazam', level: 57, types: ['Psychic'], danger: 'Psychic, Future Sight. Very fast!' },
      { name: 'Rhydon', level: 59, types: ['Ground', 'Rock'], danger: 'Earthquake, Rock Blast' },
      { name: 'Exeggutor', level: 59, types: ['Grass', 'Psychic'], danger: 'Sleep Powder, Giga Drain (if not Bulbasaur starter)' },
      { name: 'Gyarados', level: 61, types: ['Water', 'Flying'], danger: 'Hydro Pump, Dragon Rage (if not Squirtle starter)' },
      { name: 'Arcanine', level: 63, types: ['Fire'], danger: 'Extremespeed, Fire Blast (if not Charmander starter)' },
    ],
    recommendedTypes: ['Electric', 'Ice', 'Water', 'Rock'],
    strategy: 'Team varies based on your starter choice. He won\'t have the type that beats your starter. Lapras handles many threats. Electric for Pidgeot/Gyarados, Ice for Exeggutor, Water for Rhydon/Arcanine. Alakazam is dangerous - use a bulky Pokemon.',
  },
];

// Phase-by-phase walkthrough
export const WALKTHROUGH_PHASES: PhaseData[] = [
  {
    id: 1,
    name: 'Starting Your Journey',
    badge: 0,
    description: 'Get your starter, deliver Oak\'s Parcel, and prepare for Brock.',
    keyLocations: ['pallet-town', 'route-1', 'viridian-city', 'route-22', 'route-2', 'viridian-forest'],
    steps: [
      { id: '1-1', phase: 1, title: 'Choose Your Starter', description: 'Pick Bulbasaur, Charmander, or Squirtle from Professor Oak', location: 'pallet-town', isKeyMoment: true },
      { id: '1-2', phase: 1, title: 'First Rival Battle', description: 'Battle your rival - his Pokemon is super effective against yours', location: 'pallet-town' },
      { id: '1-3', phase: 1, title: 'Deliver Oak\'s Parcel', description: 'Go to Viridian Mart, get parcel, return to Oak for Pokedex', location: 'viridian-city' },
      { id: '1-4', phase: 1, title: 'Route 22 Rival (Optional)', description: 'Fight rival again for extra EXP. He has Lv.9 Pidgey + starter', location: 'route-22', isOptional: true },
      { id: '1-5', phase: 1, title: 'Viridian Forest', description: 'Catch Pikachu (5% rate) for Misty later! Fight Bug Catchers for EXP.', location: 'viridian-forest', isKeyMoment: true },
      { id: '1-6', phase: 1, title: 'Prepare for Brock', description: 'Charmander users: Get Butterfree or Mankey. Others: Level to 12-14.', location: 'pewter-city' },
    ],
    keyItems: ['Pokedex', 'Town Map', 'Poke Balls'],
    bossEncounters: ['Rival (Pallet Town)', 'Rival (Route 22)'],
    nextPhaseRequirements: ['Reach Pewter City', 'Have counter for Rock types (Water/Grass/Fighting)'],
  },
  {
    id: 2,
    name: 'Boulder Badge',
    badge: 1,
    description: 'Defeat Brock and travel through Mt. Moon to Cerulean City.',
    keyLocations: ['pewter-city', 'pewter-gym', 'route-3', 'mt-moon', 'route-4'],
    steps: [
      { id: '2-1', phase: 2, title: 'Challenge Brock', description: 'Use Water/Grass/Fighting. Geodude Lv.12, Onix Lv.14.', location: 'pewter-gym', isKeyMoment: true },
      { id: '2-2', phase: 2, title: 'Route 3 Trainer Gauntlet', description: '8 trainers! Stock up on potions. Good EXP.', location: 'route-3' },
      { id: '2-3', phase: 2, title: 'Mt. Moon', description: 'Long cave. Team Rocket. Choose Helix (Omanyte) or Dome (Kabuto) fossil.', location: 'mt-moon', isKeyMoment: true },
      { id: '2-4', phase: 2, title: 'Arrive at Cerulean', description: 'Heal up and prepare for Misty - she\'s dangerous!', location: 'cerulean-city' },
    ],
    keyItems: ['Helix Fossil OR Dome Fossil', 'Moon Stone', 'TM46 Thief'],
    bossEncounters: ['Brock', 'Super Nerd Miguel (Fossil Guardian)'],
    nextPhaseRequirements: ['Boulder Badge', 'Electric or Grass type for Misty'],
  },
  {
    id: 3,
    name: 'Cascade Badge',
    badge: 2,
    description: 'Defeat Misty, get S.S. Ticket from Bill, and head to Vermilion.',
    keyLocations: ['cerulean-city', 'route-24', 'route-25', 'bills-house', 'cerulean-gym'],
    steps: [
      { id: '3-1', phase: 3, title: 'Nugget Bridge', description: 'Rival battle! Then 5 trainers + Team Rocket Grunt. Win Nugget!', location: 'route-24', isKeyMoment: true },
      { id: '3-2', phase: 3, title: 'Help Bill', description: 'Go to Bill\'s House, help him, get S.S. Ticket.', location: 'bills-house' },
      { id: '3-3', phase: 3, title: 'Challenge Misty', description: 'DANGER! Starmie Lv.21 is deadly. Need Electric/Grass.', location: 'cerulean-gym', isKeyMoment: true },
      { id: '3-4', phase: 3, title: 'Head South', description: 'Take Route 5 underground path to Vermilion City.', location: 'route-5' },
    ],
    keyItems: ['S.S. Ticket', 'Nugget', 'TM03 Water Pulse'],
    bossEncounters: ['Rival (Route 24)', 'Misty'],
    nextPhaseRequirements: ['Cascade Badge', 'S.S. Ticket', 'Ground type for Lt. Surge'],
  },
  {
    id: 4,
    name: 'Thunder Badge',
    badge: 3,
    description: 'Board S.S. Anne, get Cut, defeat Lt. Surge.',
    keyLocations: ['vermilion-city', 'ss-anne', 'diglett-cave', 'vermilion-gym'],
    steps: [
      { id: '4-1', phase: 4, title: 'S.S. Anne', description: 'Board ship, fight trainers, beat Rival, get HM01 Cut from Captain.', location: 'ss-anne', isKeyMoment: true },
      { id: '4-2', phase: 4, title: 'Diglett\'s Cave', description: 'Catch Diglett/Dugtrio - ESSENTIAL for Lt. Surge!', location: 'diglett-cave', isKeyMoment: true },
      { id: '4-3', phase: 4, title: 'Challenge Lt. Surge', description: 'Ground types immune to Electric. Trash can puzzle is random!', location: 'vermilion-gym', isKeyMoment: true },
      { id: '4-4', phase: 4, title: 'Backtrack to Cerulean', description: 'Use Cut to access Route 9 east of Cerulean.', location: 'cerulean-city' },
    ],
    keyItems: ['HM01 Cut', 'TM34 Shock Wave'],
    bossEncounters: ['Rival (S.S. Anne)', 'Lt. Surge'],
    nextPhaseRequirements: ['Thunder Badge', 'Cut HM', 'Flash HM recommended for Rock Tunnel'],
  },
  {
    id: 5,
    name: 'Rainbow Badge',
    badge: 4,
    description: 'Navigate Rock Tunnel, reach Celadon, defeat Team Rocket and Erika.',
    keyLocations: ['route-9', 'rock-tunnel', 'route-10', 'lavender-town', 'route-8', 'route-7', 'celadon-city', 'rocket-hideout', 'celadon-gym'],
    steps: [
      { id: '5-1', phase: 5, title: 'Rock Tunnel', description: 'Dark cave - Flash recommended. Exit to Lavender Town.', location: 'rock-tunnel' },
      { id: '5-2', phase: 5, title: 'Pokemon Tower Preview', description: 'Can\'t finish without Silph Scope. Rival battle on 2nd floor.', location: 'lavender-town' },
      { id: '5-3', phase: 5, title: 'To Celadon City', description: 'Take Route 8 → Underground Path → Route 7 → Celadon.', location: 'celadon-city' },
      { id: '5-4', phase: 5, title: 'Get Tea & Free Eevee', description: 'Tea from Celadon Mansion. Free Eevee on roof!', location: 'celadon-city', isKeyMoment: true },
      { id: '5-5', phase: 5, title: 'Rocket Hideout', description: 'Beat Giovanni, get Silph Scope. Spin tile puzzle.', location: 'rocket-hideout', isKeyMoment: true },
      { id: '5-6', phase: 5, title: 'Challenge Erika', description: 'Fire/Flying types win easily. Need Cut to enter gym.', location: 'celadon-gym', isKeyMoment: true },
    ],
    keyItems: ['Silph Scope', 'Tea', 'Eevee', 'Coin Case', 'TM19 Giga Drain'],
    bossEncounters: ['Rival (Pokemon Tower)', 'Giovanni (Rocket Hideout)', 'Erika'],
    nextPhaseRequirements: ['Rainbow Badge', 'Silph Scope'],
  },
  {
    id: 6,
    name: 'Soul Badge',
    badge: 5,
    description: 'Clear Pokemon Tower, wake Snorlax, reach Fuchsia City.',
    keyLocations: ['pokemon-tower', 'route-12', 'route-13', 'route-14', 'route-15', 'fuchsia-city', 'safari-zone', 'fuchsia-gym'],
    steps: [
      { id: '6-1', phase: 6, title: 'Pokemon Tower', description: 'Clear ghosts, defeat Team Rocket, save Mr. Fuji, get Poke Flute.', location: 'pokemon-tower', isKeyMoment: true },
      { id: '6-2', phase: 6, title: 'Wake Snorlax', description: 'Use Poke Flute on Route 12 or 16 Snorlax. Catch it!', location: 'route-12', isKeyMoment: true },
      { id: '6-3', phase: 6, title: 'To Fuchsia City', description: 'Route 12→13→14→15 OR Route 16→17→18 (Cycling Road).', location: 'fuchsia-city' },
      { id: '6-4', phase: 6, title: 'Safari Zone', description: 'Get HM03 Surf and HM04 Strength! Rare Pokemon here.', location: 'safari-zone', isKeyMoment: true },
      { id: '6-5', phase: 6, title: 'Challenge Koga', description: 'Invisible wall maze. Ground/Psychic types win. Watch for Explosion!', location: 'fuchsia-gym', isKeyMoment: true },
    ],
    keyItems: ['Poke Flute', 'HM03 Surf', 'HM04 Strength', 'Gold Teeth', 'TM06 Toxic'],
    bossEncounters: ['Ghost Marowak', 'Team Rocket (Pokemon Tower)', 'Koga'],
    nextPhaseRequirements: ['Soul Badge', 'Surf HM', 'Strength HM'],
  },
  {
    id: 7,
    name: 'Marsh Badge',
    badge: 6,
    description: 'Liberate Silph Co, defeat Giovanni and Sabrina.',
    keyLocations: ['saffron-city', 'silph-co', 'fighting-dojo', 'saffron-gym'],
    steps: [
      { id: '7-1', phase: 7, title: 'Enter Saffron City', description: 'Give Tea to guard. City has 2 gyms!', location: 'saffron-city' },
      { id: '7-2', phase: 7, title: 'Silph Co.', description: 'Huge building. Get Card Key. Free Lapras! Beat Rival and Giovanni.', location: 'silph-co', isKeyMoment: true },
      { id: '7-3', phase: 7, title: 'Fighting Dojo (Optional)', description: 'Beat all trainers for free Hitmonlee or Hitmonchan!', location: 'fighting-dojo', isOptional: true },
      { id: '7-4', phase: 7, title: 'Challenge Sabrina', description: 'DANGER! Alakazam is deadly. Warp tile puzzle.', location: 'saffron-gym', isKeyMoment: true },
    ],
    keyItems: ['Card Key', 'Lapras', 'Master Ball', 'Hitmonlee/Hitmonchan', 'TM04 Calm Mind'],
    bossEncounters: ['Rival (Silph Co)', 'Giovanni (Silph Co)', 'Sabrina'],
    nextPhaseRequirements: ['Marsh Badge', 'Master Ball (save for legendary!)'],
  },
  {
    id: 8,
    name: 'Volcano Badge',
    badge: 7,
    description: 'Travel to Cinnabar Island, explore Pokemon Mansion, defeat Blaine.',
    keyLocations: ['route-19', 'route-20', 'seafoam-islands', 'cinnabar-island', 'pokemon-mansion', 'cinnabar-gym'],
    steps: [
      { id: '8-1', phase: 8, title: 'Surf to Cinnabar', description: 'From Pallet Town or Fuchsia City, surf to Cinnabar Island.', location: 'cinnabar-island' },
      { id: '8-2', phase: 8, title: 'Seafoam Islands (Optional)', description: 'Boulder puzzle leads to Articuno (Lv.50)!', location: 'seafoam-islands', isOptional: true, isKeyMoment: true },
      { id: '8-3', phase: 8, title: 'Pokemon Mansion', description: 'Get Secret Key to unlock gym. Mewtwo lore. Switch puzzle.', location: 'pokemon-mansion', isKeyMoment: true },
      { id: '8-4', phase: 8, title: 'Challenge Blaine', description: 'Water types dominate. Answer quiz to skip trainers.', location: 'cinnabar-gym', isKeyMoment: true },
    ],
    keyItems: ['Secret Key', 'TM35 Flamethrower', 'TM14 Blizzard', 'TM22 Solar Beam', 'TM38 Fire Blast'],
    bossEncounters: ['Articuno', 'Blaine'],
    nextPhaseRequirements: ['Volcano Badge', '7 total badges'],
  },
  {
    id: 9,
    name: 'Earth Badge',
    badge: 8,
    description: 'Return to Viridian, challenge Giovanni for the final badge.',
    keyLocations: ['viridian-gym', 'power-plant'],
    steps: [
      { id: '9-1', phase: 9, title: 'Power Plant (Optional)', description: 'Surf from Route 10. Catch Zapdos (Lv.50)!', location: 'power-plant', isOptional: true, isKeyMoment: true },
      { id: '9-2', phase: 9, title: 'Viridian Gym Opens', description: 'With 7 badges, the mysterious gym leader returns!', location: 'viridian-gym' },
      { id: '9-3', phase: 9, title: 'Challenge Giovanni', description: 'Ground specialist. Water/Grass 4x effective on Rock/Ground.', location: 'viridian-gym', isKeyMoment: true },
    ],
    keyItems: ['TM26 Earthquake', 'Macho Brace (hidden)'],
    bossEncounters: ['Zapdos', 'Giovanni'],
    nextPhaseRequirements: ['Earth Badge (all 8 badges)', 'Team level 50+'],
  },
  {
    id: 10,
    name: 'Victory Road & Pokemon League',
    badge: 8,
    description: 'Conquer Victory Road and defeat the Elite Four to become Champion!',
    keyLocations: ['route-22', 'route-23', 'victory-road', 'indigo-plateau'],
    steps: [
      { id: '10-1', phase: 10, title: 'Route 22 Rival', description: 'Final rival battle before Victory Road. His team is Lv.47-53.', location: 'route-22', isKeyMoment: true },
      { id: '10-2', phase: 10, title: 'Badge Gates', description: 'Pass through all 8 badge checkpoints on Route 23.', location: 'route-23' },
      { id: '10-3', phase: 10, title: 'Victory Road', description: 'Boulder puzzles, strong trainers. Moltres is here (Lv.50)!', location: 'victory-road', isKeyMoment: true },
      { id: '10-4', phase: 10, title: 'Elite Four Prep', description: 'Stock up at Indigo Plateau. No leaving once you start!', location: 'indigo-plateau' },
      { id: '10-5', phase: 10, title: 'Lorelei (Ice/Water)', description: 'Electric types sweep. Level ~55 recommended.', location: 'indigo-plateau' },
      { id: '10-6', phase: 10, title: 'Bruno (Fighting/Rock)', description: 'Psychic/Water types. His Onix are weak.', location: 'indigo-plateau' },
      { id: '10-7', phase: 10, title: 'Agatha (Ghost/Poison)', description: 'Ground/Psychic. Watch for Destiny Bond!', location: 'indigo-plateau' },
      { id: '10-8', phase: 10, title: 'Lance (Dragon)', description: 'Ice Beam destroys dragons. Lapras is MVP.', location: 'indigo-plateau' },
      { id: '10-9', phase: 10, title: 'Champion', description: 'Your Rival! Balanced team. Lv.59-63. Become Champion!', location: 'indigo-plateau', isKeyMoment: true },
    ],
    keyItems: ['TM02 Dragon Claw', 'TM37 Sandstorm', 'TM07 Hail', 'TM50 Overheat'],
    bossEncounters: ['Rival (Route 22)', 'Moltres', 'Lorelei', 'Bruno', 'Agatha', 'Lance', 'Champion'],
    nextPhaseRequirements: ['Become Champion!'],
  },
];

// Function to get current phase based on badges
export function getCurrentPhase(badges: number): PhaseData {
  if (badges >= 8) return WALKTHROUGH_PHASES[9];
  return WALKTHROUGH_PHASES[badges] || WALKTHROUGH_PHASES[0];
}

// Function to get gym guide by badge number
export function getGymGuide(badgeNumber: number): GymGuide | undefined {
  return GYM_GUIDES.find(g => g.badgeNumber === badgeNumber);
}

// Function to check team readiness for a gym
export interface TeamReadinessResult {
  ready: boolean;
  score: number;
  maxScore: number;
  recommendations: string[];
  warnings: string[];
  teamStrengths: string[];
}

export function checkTeamReadiness(
  teamTypes: PokemonType[],
  teamLevels: number[],
  targetGym: GymGuide
): TeamReadinessResult {
  const recommendations: string[] = [];
  const warnings: string[] = [];
  const teamStrengths: string[] = [];
  let score = 0;
  const maxScore = 100;
  
  // Check if team has recommended types
  const hasRecommendedType = targetGym.recommendedTypes.some(t => teamTypes.includes(t));
  if (hasRecommendedType) {
    score += 40;
    const matchingTypes = targetGym.recommendedTypes.filter(t => teamTypes.includes(t));
    teamStrengths.push(`Has ${matchingTypes.join(', ')} type coverage`);
  } else {
    warnings.push(`No ${targetGym.recommendedTypes.join('/')} types! Consider catching one.`);
  }
  
  // Check average level
  const avgLevel = teamLevels.reduce((a, b) => a + b, 0) / teamLevels.length;
  const maxLevel = Math.max(...teamLevels);
  
  if (maxLevel >= targetGym.recommendedLevel) {
    score += 30;
    teamStrengths.push(`Ace Pokemon at Lv.${maxLevel} (recommended: ${targetGym.recommendedLevel})`);
  } else if (maxLevel >= targetGym.recommendedLevel - 3) {
    score += 20;
    recommendations.push(`Level up to ${targetGym.recommendedLevel} for best chance`);
  } else {
    score += 10;
    warnings.push(`Under-leveled! Max is Lv.${maxLevel}, need Lv.${targetGym.recommendedLevel}`);
  }
  
  // Check team size
  if (teamLevels.length >= 4) {
    score += 15;
    teamStrengths.push(`Full team of ${teamLevels.length} Pokemon`);
  } else {
    recommendations.push(`Consider having at least 4 Pokemon`);
  }
  
  // Bonus for multiple recommended types
  const typeCount = targetGym.recommendedTypes.filter(t => teamTypes.includes(t)).length;
  if (typeCount >= 2) {
    score += 15;
    teamStrengths.push(`Multiple counter types for redundancy`);
  }
  
  return {
    ready: score >= 60,
    score,
    maxScore,
    recommendations,
    warnings,
    teamStrengths,
  };
}
