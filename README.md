# Nuzlocke Tracker

A premium, offline-capable local app for tracking your Pokémon FireRed/LeafGreen Nuzlocke run with an interactive Kanto map.

![Nuzlocke Tracker](https://img.shields.io/badge/Pokemon-Nuzlocke%20Tracker-red)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

### Run Dashboard
- **Party Management**: View your current team with sprites, levels, HP/status, moves, held items, nature, ability, and notes
- **Box System**: Manage boxed Pokémon with easy access to move them to your party
- **Graveyard**: Honor your fallen companions with a dedicated memorial
- **Badge Tracker**: Visual 8-badge progression with click-to-obtain functionality
- **Run Statistics**: Real-time stats including encounters, deaths, play time, and HM progress

### Interactive Kanto Map
- **Full Kanto Region**: All routes, towns, caves, gyms, and special locations
- **Location Details**: Click any location to see:
  - Wild encounter tables with species, levels, and encounter rates
  - Trainer information including boss battles
  - Required HMs and recommended levels
  - Available items and notes
- **Status Tracking**: Mark locations as current, visited, cleared, or saved
- **Custom Pins**: Drop pins anywhere on the map with custom labels
- **Zoom & Pan**: Smooth navigation with mouse wheel and drag

### Encounter Tracking
- **Per-Location Encounters**: Track your one encounter per route
- **Search & Filter**: Find locations by name or filter by encounter status
- **Quick Catch**: Easy-to-use dialog for recording catches with nature, level, and shiny status

### Rules Engine
- **Preset Rulesets**: Classic, Standard, Hardcore, and Extreme presets
- **Customizable Rules**: Toggle individual rules for your playstyle
- **Categories**: Core, Catching, Death, Item, Level, and Battle rules

### Timeline
- **Event History**: Chronological log of catches, deaths, badges, and milestones
- **Visual Timeline**: Beautiful timeline with event-specific icons and colors

### Additional Features
- **Dark Mode**: Full dark theme support with system preference detection
- **Command Palette**: Quick access to all features with `Cmd/Ctrl + K`
- **Import/Export**: Save and share your runs as JSON files
- **Offline Support**: Works fully offline after initial load
- **Auto-Save**: Automatic persistence to IndexedDB
- **Drag & Drop**: Reorder your party with drag and drop

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Persistence**: IndexedDB (via idb)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone or navigate to the project
cd nuzlocke-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start tracking your Nuzlocke!

### Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Usage

1. **Start a New Run**: Click "New Run" and choose FireRed or LeafGreen
2. **Select Your Starter**: Pick Bulbasaur, Charmander, or Squirtle
3. **Choose Rules**: Select a preset or customize individual rules
4. **Track Your Journey**: 
   - Use the Map to navigate and record encounters
   - Update your party as you catch and train Pokémon
   - Mark badges as you defeat gym leaders
   - Review your timeline to relive key moments

## Data

All Pokémon data, encounter tables, and location information is pre-seeded for FireRed/LeafGreen. The app includes:

- All 151 Gen 1 Pokémon with sprites, types, stats, and abilities
- Complete Kanto map with 50+ locations
- Accurate encounter tables per location
- Gym leader and important trainer data
- Default Nuzlocke rulesets

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Escape` | Close dialogs/panels |

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/
│   ├── dashboard/       # Dashboard panels
│   ├── layout/          # Sidebar, dialogs
│   ├── map/             # Kanto map components
│   ├── providers/       # React providers
│   ├── ui/              # shadcn/ui components
│   └── views/           # Main view components
├── data/                # Pokemon, locations, rules
├── lib/                 # Utilities, IndexedDB
├── store/               # Zustand stores
└── types/               # TypeScript definitions
```

## Contributing

Contributions are welcome! Feel free to:

- Report bugs or request features via issues
- Submit pull requests for improvements
- Add support for other Pokémon games

## License

MIT License - feel free to use this for your own Nuzlocke adventures!

## Acknowledgments

- Pokémon sprites from [PokeAPI Sprites](https://github.com/PokeAPI/sprites)
- Encounter data compiled from various community resources
- Inspired by the Nuzlocke community

---

Good luck on your Nuzlocke! May your journey be filled with clutch crits and minimal deaths. 🔥
