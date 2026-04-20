import { PokemonType } from '@/types/pokemon';

export interface GymLeaderPokemon {
  species: string;
  speciesId: number;
  level: number;
  types: PokemonType[];
  moves: string[];
  ability?: string;
  item?: string;
}

export interface GymLeader {
  id: string;
  name: string;
  title: string;
  gym: string;
  location: string;
  badge: string;
  specialty: PokemonType;
  levelCap: number;
  team: GymLeaderPokemon[];
  strategy: string;
  tips: string[];
  rewards: string[];
}

export interface EliteFourMember {
  id: string;
  name: string;
  title: string;
  specialty: PokemonType;
  levelCap: number;
  team: GymLeaderPokemon[];
  strategy: string;
  tips: string[];
}

// Fire Red / Leaf Green Gym Leaders
export const GYM_LEADERS: GymLeader[] = [
  {
    id: 'brock',
    name: 'Brock',
    title: 'The Rock-Solid Pokémon Trainer!',
    gym: 'Pewter Gym',
    location: 'pewter-city',
    badge: 'Boulder Badge',
    specialty: 'Rock',
    levelCap: 14,
    team: [
      {
        species: 'Geodude',
        speciesId: 74,
        level: 12,
        types: ['Rock', 'Ground'],
        moves: ['Tackle', 'Defense Curl', 'Rock Throw'],
      },
      {
        species: 'Onix',
        speciesId: 95,
        level: 14,
        types: ['Rock', 'Ground'],
        moves: ['Tackle', 'Bind', 'Rock Tomb', 'Screech'],
      },
    ],
    strategy: 'Brock uses Rock-type Pokémon with high Defense. His Onix can trap you with Bind.',
    tips: [
      'Water and Grass types are 4x super effective',
      'Fighting types also work well',
      'Butterfree with Confusion can handle both easily',
      'Mankey with Low Kick destroys this gym',
    ],
    rewards: ['TM39 Rock Tomb', 'Can use Flash outside battle'],
  },
  {
    id: 'misty',
    name: 'Misty',
    title: 'The Tomboyish Mermaid!',
    gym: 'Cerulean Gym',
    location: 'cerulean-city',
    badge: 'Cascade Badge',
    specialty: 'Water',
    levelCap: 21,
    team: [
      {
        species: 'Staryu',
        speciesId: 120,
        level: 18,
        types: ['Water'],
        moves: ['Tackle', 'Harden', 'Water Pulse', 'Recover'],
      },
      {
        species: 'Starmie',
        speciesId: 121,
        level: 21,
        types: ['Water', 'Psychic'],
        moves: ['Water Pulse', 'Rapid Spin', 'Recover', 'Swift'],
      },
    ],
    strategy: 'Starmie is fast and hits hard. Water Pulse can confuse. Recover makes it durable.',
    tips: [
      'Grass types are your best bet',
      'Electric types work well but watch out for Water Pulse damage',
      'Starmie\'s Recover can stall you out',
      'Oddish/Bellsprout from Route 24/25 are great counters',
      'Pikachu from Viridian Forest works too',
    ],
    rewards: ['TM03 Water Pulse', 'Pokémon up to Lv30 obey you'],
  },
  {
    id: 'surge',
    name: 'Lt. Surge',
    title: 'The Lightning American!',
    gym: 'Vermilion Gym',
    location: 'vermilion-city',
    badge: 'Thunder Badge',
    specialty: 'Electric',
    levelCap: 24,
    team: [
      {
        species: 'Voltorb',
        speciesId: 100,
        level: 21,
        types: ['Electric'],
        moves: ['Sonic Boom', 'Spark', 'Screech', 'Self-Destruct'],
      },
      {
        species: 'Pikachu',
        speciesId: 25,
        level: 18,
        types: ['Electric'],
        moves: ['Quick Attack', 'Thunder Wave', 'Double Team', 'Shock Wave'],
      },
      {
        species: 'Raichu',
        speciesId: 26,
        level: 24,
        types: ['Electric'],
        moves: ['Quick Attack', 'Thunder Wave', 'Double Team', 'Shock Wave'],
      },
    ],
    strategy: 'Surge relies on paralysis with Thunder Wave and evasion with Double Team.',
    tips: [
      'Ground types are immune to Electric moves',
      'Diglett/Dugtrio from Diglett\'s Cave are perfect',
      'Watch out for Voltorb\'s Self-Destruct!',
      'Shock Wave never misses, so don\'t rely on evasion',
    ],
    rewards: ['TM34 Shock Wave', 'Pokémon up to Lv50 obey you'],
  },
  {
    id: 'erika',
    name: 'Erika',
    title: 'The Nature-Loving Princess!',
    gym: 'Celadon Gym',
    location: 'celadon-city',
    badge: 'Rainbow Badge',
    specialty: 'Grass',
    levelCap: 29,
    team: [
      {
        species: 'Victreebel',
        speciesId: 71,
        level: 29,
        types: ['Grass', 'Poison'],
        moves: ['Stun Spore', 'Acid', 'Giga Drain', 'Sleep Powder'],
      },
      {
        species: 'Tangela',
        speciesId: 114,
        level: 24,
        types: ['Grass'],
        moves: ['Bind', 'Ingrain', 'Giga Drain', 'Sleep Powder'],
      },
      {
        species: 'Vileplume',
        speciesId: 45,
        level: 29,
        types: ['Grass', 'Poison'],
        moves: ['Stun Spore', 'Acid', 'Giga Drain', 'Sleep Powder'],
      },
    ],
    strategy: 'Erika loves status moves. Sleep Powder and Stun Spore will cripple your team.',
    tips: [
      'Fire and Flying types are excellent choices',
      'Bring Awakenings or Chesto Berries for Sleep Powder',
      'Poison types resist Grass moves',
      'Charizard or any Fire type sweeps this gym',
    ],
    rewards: ['TM19 Giga Drain', 'Pokémon up to Lv50 obey you'],
  },
  {
    id: 'koga',
    name: 'Koga',
    title: 'The Poisonous Ninja Master!',
    gym: 'Fuchsia Gym',
    location: 'fuchsia-city',
    badge: 'Soul Badge',
    specialty: 'Poison',
    levelCap: 43,
    team: [
      {
        species: 'Koffing',
        speciesId: 109,
        level: 37,
        types: ['Poison'],
        moves: ['Self-Destruct', 'Sludge', 'Smokescreen', 'Toxic'],
      },
      {
        species: 'Muk',
        speciesId: 89,
        level: 39,
        types: ['Poison'],
        moves: ['Minimize', 'Sludge', 'Acid Armor', 'Toxic'],
      },
      {
        species: 'Koffing',
        speciesId: 109,
        level: 37,
        types: ['Poison'],
        moves: ['Self-Destruct', 'Sludge', 'Smokescreen', 'Toxic'],
      },
      {
        species: 'Weezing',
        speciesId: 110,
        level: 43,
        types: ['Poison'],
        moves: ['Self-Destruct', 'Sludge', 'Smokescreen', 'Toxic'],
      },
    ],
    strategy: 'Koga uses Toxic stall and Self-Destruct. Minimize on Muk makes it hard to hit.',
    tips: [
      'Ground and Psychic types are super effective',
      'Watch out for Self-Destruct on Koffing and Weezing!',
      'Steel types are immune to Poison',
      'Alakazam or Kadabra can sweep with Psychic',
    ],
    rewards: ['TM06 Toxic', 'Can use Surf outside battle'],
  },
  {
    id: 'sabrina',
    name: 'Sabrina',
    title: 'The Master of Psychic Pokémon!',
    gym: 'Saffron Gym',
    location: 'saffron-city',
    badge: 'Marsh Badge',
    specialty: 'Psychic',
    levelCap: 43,
    team: [
      {
        species: 'Kadabra',
        speciesId: 64,
        level: 38,
        types: ['Psychic'],
        moves: ['Psybeam', 'Future Sight', 'Calm Mind', 'Reflect'],
      },
      {
        species: 'Mr. Mime',
        speciesId: 122,
        level: 37,
        types: ['Psychic'],
        moves: ['Barrier', 'Psybeam', 'Baton Pass', 'Calm Mind'],
      },
      {
        species: 'Venomoth',
        speciesId: 49,
        level: 38,
        types: ['Bug', 'Poison'],
        moves: ['Psybeam', 'Sleep Powder', 'Gust', 'Leech Life'],
      },
      {
        species: 'Alakazam',
        speciesId: 65,
        level: 43,
        types: ['Psychic'],
        moves: ['Psychic', 'Future Sight', 'Calm Mind', 'Reflect'],
      },
    ],
    strategy: 'Sabrina\'s team is fast and hits hard. Alakazam can OHKO most Pokémon.',
    tips: [
      'Bug, Ghost, and Dark types are super effective',
      'Alakazam has low Defense - physical attackers work',
      'Snorlax can tank hits and deal damage',
      'Jolteon with Shadow Ball is excellent',
    ],
    rewards: ['TM04 Calm Mind', 'Pokémon up to Lv70 obey you'],
  },
  {
    id: 'blaine',
    name: 'Blaine',
    title: 'The Hotheaded Quiz Master!',
    gym: 'Cinnabar Gym',
    location: 'cinnabar-island',
    badge: 'Volcano Badge',
    specialty: 'Fire',
    levelCap: 47,
    team: [
      {
        species: 'Growlithe',
        speciesId: 58,
        level: 42,
        types: ['Fire'],
        moves: ['Fire Blast', 'Take Down', 'Agility', 'Roar'],
      },
      {
        species: 'Ponyta',
        speciesId: 77,
        level: 40,
        types: ['Fire'],
        moves: ['Fire Blast', 'Stomp', 'Bounce', 'Fire Spin'],
      },
      {
        species: 'Rapidash',
        speciesId: 78,
        level: 42,
        types: ['Fire'],
        moves: ['Fire Blast', 'Stomp', 'Bounce', 'Fire Spin'],
      },
      {
        species: 'Arcanine',
        speciesId: 59,
        level: 47,
        types: ['Fire'],
        moves: ['Fire Blast', 'Take Down', 'Extreme Speed', 'Roar'],
      },
    ],
    strategy: 'Blaine uses Fire Blast heavily. Arcanine is fast and powerful with Extreme Speed.',
    tips: [
      'Water, Ground, and Rock types are super effective',
      'Bring a bulky Water type like Blastoise or Gyarados',
      'Arcanine has Extreme Speed - it will move first',
      'Golem or Rhydon can tank Fire moves easily',
    ],
    rewards: ['TM38 Fire Blast', 'Pokémon up to Lv70 obey you'],
  },
  {
    id: 'giovanni',
    name: 'Giovanni',
    title: 'The Self-Proclaimed Strongest Trainer!',
    gym: 'Viridian Gym',
    location: 'viridian-city',
    badge: 'Earth Badge',
    specialty: 'Ground',
    levelCap: 50,
    team: [
      {
        species: 'Rhyhorn',
        speciesId: 111,
        level: 45,
        types: ['Ground', 'Rock'],
        moves: ['Earthquake', 'Rock Blast', 'Scary Face', 'Take Down'],
      },
      {
        species: 'Dugtrio',
        speciesId: 51,
        level: 42,
        types: ['Ground'],
        moves: ['Earthquake', 'Mud-Slap', 'Slash', 'Sand-Attack'],
      },
      {
        species: 'Nidoqueen',
        speciesId: 31,
        level: 44,
        types: ['Poison', 'Ground'],
        moves: ['Earthquake', 'Poison Sting', 'Double Kick', 'Body Slam'],
      },
      {
        species: 'Nidoking',
        speciesId: 34,
        level: 45,
        types: ['Poison', 'Ground'],
        moves: ['Earthquake', 'Poison Sting', 'Thrash', 'Horn Attack'],
      },
      {
        species: 'Rhyhorn',
        speciesId: 112,
        level: 50,
        types: ['Ground', 'Rock'],
        moves: ['Earthquake', 'Rock Blast', 'Scary Face', 'Megahorn'],
      },
    ],
    strategy: 'Giovanni\'s team is weak to Water and Grass. Watch out for Earthquake spam.',
    tips: [
      'Water and Grass types are 4x effective on Rhyhorn line',
      'Ice types work well against Ground',
      'Flying types are immune to Earthquake',
      'Lapras or Blastoise with Surf will sweep',
    ],
    rewards: ['TM26 Earthquake', 'All Pokémon obey you'],
  },
];

// Elite Four
export const ELITE_FOUR: EliteFourMember[] = [
  {
    id: 'lorelei',
    name: 'Lorelei',
    title: 'Elite Four - Ice Master',
    specialty: 'Ice',
    levelCap: 56,
    team: [
      { species: 'Dewgong', speciesId: 87, level: 52, types: ['Water', 'Ice'], moves: ['Ice Beam', 'Surf', 'Hail', 'Safeguard'] },
      { species: 'Cloyster', speciesId: 91, level: 51, types: ['Water', 'Ice'], moves: ['Spikes', 'Protect', 'Ice Beam', 'Surf'] },
      { species: 'Slowbro', speciesId: 80, level: 52, types: ['Water', 'Psychic'], moves: ['Surf', 'Ice Beam', 'Yawn', 'Psychic'] },
      { species: 'Jynx', speciesId: 124, level: 54, types: ['Ice', 'Psychic'], moves: ['Ice Beam', 'Lovely Kiss', 'Attract', 'Psychic'] },
      { species: 'Lapras', speciesId: 131, level: 56, types: ['Water', 'Ice'], moves: ['Surf', 'Ice Beam', 'Body Slam', 'Confuse Ray'] },
    ],
    strategy: 'Lorelei uses bulky Water/Ice types. Jynx can put you to sleep.',
    tips: [
      'Electric types are excellent (Jolteon, Raichu)',
      'Fighting types work against Ice',
      'Grass types hit 4x but are weak to Ice',
      'Watch out for Lovely Kiss on Jynx',
    ],
  },
  {
    id: 'bruno',
    name: 'Bruno',
    title: 'Elite Four - Fighting Master',
    specialty: 'Fighting',
    levelCap: 58,
    team: [
      { species: 'Onix', speciesId: 95, level: 51, types: ['Rock', 'Ground'], moves: ['Earthquake', 'Rock Tomb', 'Iron Tail', 'Sandstorm'] },
      { species: 'Hitmonchan', speciesId: 107, level: 53, types: ['Fighting'], moves: ['Sky Uppercut', 'Fire Punch', 'Ice Punch', 'Thunder Punch'] },
      { species: 'Hitmonlee', speciesId: 106, level: 53, types: ['Fighting'], moves: ['Mega Kick', 'Focus Energy', 'Foresight', 'Hi Jump Kick'] },
      { species: 'Onix', speciesId: 95, level: 54, types: ['Rock', 'Ground'], moves: ['Earthquake', 'Rock Tomb', 'Iron Tail', 'Sandstorm'] },
      { species: 'Machamp', speciesId: 68, level: 58, types: ['Fighting'], moves: ['Cross Chop', 'Scary Face', 'Bulk Up', 'Rock Tomb'] },
    ],
    strategy: 'Bruno hits hard with Fighting moves. Machamp is especially dangerous.',
    tips: [
      'Flying and Psychic types are super effective',
      'Alakazam can sweep his whole team',
      'Watch out for elemental punches on Hitmonchan',
      'Onix is weak to Water and Grass (4x)',
    ],
  },
  {
    id: 'agatha',
    name: 'Agatha',
    title: 'Elite Four - Ghost Master',
    specialty: 'Ghost',
    levelCap: 60,
    team: [
      { species: 'Gengar', speciesId: 94, level: 54, types: ['Ghost', 'Poison'], moves: ['Shadow Ball', 'Toxic', 'Double Team', 'Hypnosis'] },
      { species: 'Golbat', speciesId: 42, level: 54, types: ['Poison', 'Flying'], moves: ['Air Cutter', 'Confuse Ray', 'Bite', 'Poison Fang'] },
      { species: 'Haunter', speciesId: 93, level: 53, types: ['Ghost', 'Poison'], moves: ['Shadow Ball', 'Hypnosis', 'Dream Eater', 'Curse'] },
      { species: 'Arbok', speciesId: 24, level: 56, types: ['Poison'], moves: ['Sludge Bomb', 'Screech', 'Iron Tail', 'Bite'] },
      { species: 'Gengar', speciesId: 94, level: 60, types: ['Ghost', 'Poison'], moves: ['Shadow Ball', 'Sludge Bomb', 'Hypnosis', 'Nightmare'] },
    ],
    strategy: 'Agatha loves Hypnosis. Her Gengars are fast and can sweep.',
    tips: [
      'Ground types are immune to Poison',
      'Psychic is super effective on Poison',
      'Snorlax can tank hits and use Rest',
      'Bring Full Heals or Awakenings',
    ],
  },
  {
    id: 'lance',
    name: 'Lance',
    title: 'Elite Four - Dragon Master',
    specialty: 'Dragon',
    levelCap: 62,
    team: [
      { species: 'Gyarados', speciesId: 130, level: 56, types: ['Water', 'Flying'], moves: ['Hyper Beam', 'Dragon Rage', 'Bite', 'Twister'] },
      { species: 'Dragonair', speciesId: 148, level: 54, types: ['Dragon'], moves: ['Outrage', 'Thunder Wave', 'Hyper Beam', 'Safeguard'] },
      { species: 'Dragonair', speciesId: 148, level: 54, types: ['Dragon'], moves: ['Outrage', 'Thunder Wave', 'Hyper Beam', 'Safeguard'] },
      { species: 'Aerodactyl', speciesId: 142, level: 58, types: ['Rock', 'Flying'], moves: ['Hyper Beam', 'Ancient Power', 'Scary Face', 'Wing Attack'] },
      { species: 'Dragonite', speciesId: 149, level: 62, types: ['Dragon', 'Flying'], moves: ['Outrage', 'Hyper Beam', 'Wing Attack', 'Safeguard'] },
    ],
    strategy: 'Lance\'s team has no true Dragons except the Dragonite line. Ice is key.',
    tips: [
      'Ice moves are 4x effective on Dragonite',
      'Electric for Gyarados',
      'Ice Beam Lapras is perfect for this fight',
      'Watch out for Hyper Beam - it hits hard',
    ],
  },
];

// Champion
export const CHAMPION = {
  id: 'champion',
  name: 'Blue',
  title: 'Pokémon League Champion',
  levelCap: 65,
  team: [
    { species: 'Pidgeot', speciesId: 18, level: 59, types: ['Normal', 'Flying'] as PokemonType[], moves: ['Aerial Ace', 'Feather Dance', 'Sand-Attack', 'Wing Attack'] },
    { species: 'Alakazam', speciesId: 65, level: 57, types: ['Psychic'] as PokemonType[], moves: ['Psychic', 'Future Sight', 'Reflect', 'Recover'] },
    { species: 'Rhydon', speciesId: 112, level: 59, types: ['Ground', 'Rock'] as PokemonType[], moves: ['Earthquake', 'Take Down', 'Rock Tomb', 'Scary Face'] },
    { species: 'Gyarados', speciesId: 130, level: 61, types: ['Water', 'Flying'] as PokemonType[], moves: ['Hydro Pump', 'Dragon Rage', 'Bite', 'Hyper Beam'] },
    { species: 'Arcanine', speciesId: 59, level: 61, types: ['Fire'] as PokemonType[], moves: ['Fire Blast', 'Extreme Speed', 'Bite', 'Roar'] },
    // Starter varies
    { species: 'Blastoise', speciesId: 9, level: 65, types: ['Water'] as PokemonType[], moves: ['Hydro Pump', 'Rain Dance', 'Bite', 'Skull Bash'] },
  ],
  strategy: 'Blue has a diverse, well-balanced team. No single type counters him.',
  tips: [
    'Bring a varied team to handle his coverage',
    'Ice for Rhydon and potential Venusaur/Exeggutor',
    'Electric for Gyarados, Pidgeot, Blastoise',
    'Ground for Arcanine and Alakazam',
    'His starter depends on your choice',
  ],
};

// Get level cap for current badge count
export function getLevelCap(badgeCount: number): number {
  if (badgeCount === 0) return 14; // Before Brock
  if (badgeCount >= 8) return 100; // After all badges
  return GYM_LEADERS[badgeCount]?.levelCap || 100;
}

// Get next gym leader based on badge count
export function getNextGymLeader(badgeCount: number): GymLeader | null {
  if (badgeCount >= 8) return null;
  return GYM_LEADERS[badgeCount];
}

// Get all bosses in order
export function getAllBosses() {
  return [
    ...GYM_LEADERS.map(g => ({ ...g, type: 'gym' as const })),
    ...ELITE_FOUR.map(e => ({ ...e, type: 'elite-four' as const })),
    { ...CHAMPION, type: 'champion' as const },
  ];
}
