# Pokémon Nuzlocke Tracker

A premium, offline-capable local app for tracking your Pokémon FireRed/LeafGreen Nuzlocke run with an interactive Kanto map and AI-powered assistant.

![Nuzlocke Tracker](https://img.shields.io/badge/Pokemon-Nuzlocke%20Tracker-red)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Claude AI](https://img.shields.io/badge/Claude-AI%20Assistant-purple)

## Features

### 🎮 Run Dashboard
- **Party Management**: View your current team with sprites, levels, HP/status, moves, held items, nature, ability, and detailed stats
- **Select & Swap**: Easily reorder your party by selecting two Pokémon to swap positions
- **Moves Editing**: Add and edit up to 4 moves per Pokémon with type indicators
- **Box System**: Manage boxed Pokémon with easy access to move them to your party
- **Graveyard**: Honor your fallen companions with a dedicated memorial
- **Badge Tracker**: Visual 8-badge progression with click-to-obtain functionality
- **Battle Prep**: See upcoming gym leader teams, type matchups, and strategy tips
- **Type Coverage**: Analyze your team's offensive coverage and defensive weaknesses
- **Playtime Timer**: Start/pause timer to automatically track your play time
- **Run Statistics**: Real-time stats including encounters, deaths, play time, and HM progress
- **Bag & Inventory**: Track your items, money, and key items
- **Recent Activity**: Timeline of recent catches, deaths, and badges

### 🗺️ Interactive Kanto Map
- **Full Kanto Region**: All routes, towns, caves, gyms, and special locations (60+ locations)
- **Location Details**: Click any location to see:
  - Wild encounter tables with species, levels, and encounter rates
  - Trainer information with their full teams and strategies
  - Required HMs and recommended levels
  - Available items and notes
- **Trainer Tracking**: Mark trainers as defeated - automatically updates your Pokédex with encountered Pokémon
- **Status Tracking**: Mark locations as current, visited, cleared, or saved
- **Progress Visualization**: See your journey across Kanto at a glance

### 📖 Pokédex
- **Encounter Tracking**: See which Pokémon you've caught vs. only seen in battle
- **Trainer Encounter History**: Track which trainers used each Pokémon against you
- **Full Stats**: View base stats, types, abilities, catch rates, and more
- **Filter & Search**: Filter by caught, seen, or battled Pokémon

### 🤖 AI Chat Assistant (Powered by Claude)
- **Strategic Advice**: Get help with team building, type matchups, and gym strategies
- **Progress Sync**: Tell the AI where you are in the game and it will update your tracker automatically
- **Inventory Management**: Say "I bought 10 Super Potions" and the AI updates your bag
- **Smart Actions**: The AI can:
  - Mark trainers and locations as defeated
  - Add caught Pokémon to your party
  - Update Pokémon stats and levels
  - Track your items and money
  - Set your current location
  - Obtain badges
- **Game Knowledge**: Ask anything about FireRed/LeafGreen mechanics, locations, or strategies

### 📋 Walkthrough
- **Step-by-Step Guide**: Complete walkthrough from Pallet Town to the Elite Four
- **Progress Tracking**: Mark steps as complete as you progress
- **Gym Preparation**: Know exactly what to expect before each gym battle

### 🎯 Encounter Tracking
- **Per-Location Encounters**: Track your one encounter per route (Nuzlocke rules)
- **Search & Filter**: Find locations by name or filter by encounter status
- **Quick Catch**: Easy-to-use dialog for recording catches with nature, level, and location

### ⚙️ Rules Engine
- **Preset Rulesets**: Classic, Standard, Hardcore, and Extreme presets
- **Customizable Rules**: Toggle individual rules for your playstyle
- **Categories**: Core, Catching, Death, Item, Level, and Battle rules

### 📜 Timeline
- **Event History**: Chronological log of catches, deaths, badges, and milestones
- **Visual Timeline**: Beautiful timeline with event-specific icons and colors

### 🧰 Extra Tools (Extras Tab)
- **Type Coverage Analysis**: Deep dive into your team's offensive and defensive coverage
- **Evolution Tracker**: See which Pokémon are ready to evolve and what they need
- **Nickname Generator**: Get creative nickname suggestions by theme (mythology, food, puns, etc.)
- **Encounter Odds**: View catch rates and wild encounter percentages
- **Dupes Clause Helper**: Track which species you've already caught
- **Run Statistics**: Comprehensive stats dashboard with survival rate, averages, and more

### 📤 Export & Share
- **Image Export**: Generate beautiful summary cards of your run with:
  - High-quality 3x resolution
  - Team sprites with type badges
  - Stats overview (badges, alive, fallen, time)
  - Custom gradient design with glowing effects
- **Text Summary**: Copy a formatted text summary for sharing
- **JSON Export**: Full run data backup

### ⚙️ Settings Panel
- **Theme Toggle**: Switch between dark and light modes
- **Level Cap Warnings**: Get alerts when Pokémon approach gym leader caps
- **Sound Effects**: Optional audio feedback (volume adjustable)
- **Milestone Celebrations**: Toast notifications for achievements
- **Keyboard Shortcuts**: View all available shortcuts

### ✨ Additional Features
- **Dark/Light Mode**: Full theme support with system preference detection
- **Command Palette**: Quick access to all features with `Cmd/Ctrl + K`
- **Sidebar Shortcuts**: Quick access to Settings and Share from sidebar
- **Import/Export**: Save and share your runs as JSON files
- **Offline Support**: Works fully offline after initial load (PWA)
- **Auto-Save**: Automatic persistence to IndexedDB
- **Animated UI**: Smooth animations with Framer Motion

---

## Getting Started

### Prerequisites

- **Node.js 18+** (recommended: Node.js 20+)
- **npm**, **yarn**, or **pnpm**
- **Claude API Key** (optional, for AI assistant features)

### Installation

```bash
# Clone the repository
git clone https://github.com/kvedula/pokemon-nuzlocke.git
cd pokemon-nuzlocke

# Install dependencies
npm install
```

### Setting Up the AI Assistant (Optional but Recommended)

The AI Chat Assistant is powered by Claude and requires an API key from Anthropic.

1. **Get an API Key**:
   - Go to [console.anthropic.com](https://console.anthropic.com/)
   - Sign up or log in to your account
   - Navigate to **API Keys** and create a new key
   - Copy your API key

2. **Add the API Key to Your Project**:
   
   Create a file called `.env.local` in the root of the project (same level as `package.json`):

   ```bash
   # Create the environment file
   touch .env.local
   ```

   Add your API key to the file:

   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-api-key-here
   ```

   > ⚠️ **Important**: Never commit your `.env.local` file to git. It's already in `.gitignore` by default.

3. **Verify**: The AI chat bar will appear at the bottom of the app. If the API key is not configured, the AI features will be disabled but the rest of the app will work normally.

### Running the App

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

---

## Usage Guide

### Starting a New Run

1. Click **"New Run"** in the sidebar
2. Enter a name for your run (e.g., "Fire Red Attempt #3")
3. Choose **FireRed** or **LeafGreen**
4. Select your rules preset or customize individual rules
5. Click **Create Run**

### Using the AI Assistant

The AI chat bar is located at the bottom of the screen. Click it to expand and start chatting.

**Example prompts:**

- *"I just caught a Pikachu in Viridian Forest at level 5, nickname Sparky"*
- *"I beat Brock and got the Boulder Badge"*
- *"I'm at Route 25 and defeated all trainers up to this point"*
- *"What's the best strategy for Misty?"*
- *"I bought 10 Super Potions and 5 Poké Balls"*
- *"My Wartortle evolved and is now level 22"*
- *"Reset Cerulean Gym - I haven't beaten it yet"*

The AI will automatically update your tracker based on what you tell it!

### Tracking Your Journey

1. **Map View**: Click locations to see details, mark them as visited/cleared
2. **Team View**: Manage your party, update stats, record deaths
3. **Pokédex**: See all Pokémon you've encountered
4. **Encounters**: Track your one-per-route catches
5. **Dashboard**: Overview of your run with quick stats

### Trainer Tracking

When you click on a location in the map:
1. Go to the **Trainers** tab
2. Click the checkbox next to each trainer you defeat
3. Their Pokémon are automatically added to your Pokédex as "seen"
4. Progress bar shows how many trainers you've beaten in each area

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui |
| State Management | Zustand |
| Persistence | IndexedDB (via idb) |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI | Anthropic Claude API |

---

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/chat/           # Claude AI API route
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── chat/               # AI chat assistant
│   ├── dashboard/          # Dashboard panels (party, box, stats, battle prep)
│   ├── layout/             # Sidebar, dialogs
│   ├── map/                # Kanto map components
│   ├── providers/          # React providers
│   ├── settings/           # Settings panel
│   ├── tools/              # Export/share, nickname generator
│   ├── ui/                 # shadcn/ui components
│   └── views/              # Main view components (dashboard, team, extras, etc.)
├── data/
│   ├── locations.ts        # 60+ Kanto locations with encounters
│   ├── pokemon.ts          # All 151 Gen 1 Pokémon with type effectiveness
│   ├── moves.ts            # Gen 1 moves database
│   ├── gymLeaders.ts       # Gym leaders, Elite Four, Champion data
│   ├── badges.ts           # Gym badges
│   ├── walkthrough.ts      # Step-by-step guide
│   └── rules.ts            # Nuzlocke rule presets
├── lib/
│   ├── db.ts               # IndexedDB utilities
│   ├── sounds.ts           # Sound effects manager
│   └── utils.ts            # Helper functions
├── store/
│   ├── runStore.ts         # Main game state
│   ├── uiStore.ts          # UI state
│   └── settingsStore.ts    # User preferences
└── types/                  # TypeScript definitions
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Escape` | Close dialogs/panels |
| `Enter` | Send chat message |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Claude API key from Anthropic | No (AI features disabled without it) |

---

## Data Included

All Pokémon data, encounter tables, and location information is pre-seeded for FireRed/LeafGreen:

- ✅ All 151 Gen 1 Pokémon with sprites, types, stats, and abilities
- ✅ Complete Gen 1 moves database (~165 moves) with type, power, accuracy, PP
- ✅ Complete Kanto map with 60+ locations
- ✅ Accurate encounter tables per location with catch rates
- ✅ All 8 Gym Leaders with full teams, movesets, and strategies
- ✅ Elite Four and Champion data with level caps
- ✅ Type effectiveness charts for battle planning
- ✅ Item locations and HM requirements
- ✅ Default Nuzlocke rulesets

---

## Troubleshooting

### AI Chat Not Working

1. Make sure you have a `.env.local` file in the project root
2. Verify your API key starts with `sk-ant-`
3. Check that you have credits in your Anthropic account
4. Restart the dev server after adding the API key

### Data Not Saving

- The app uses IndexedDB for storage, which should persist across browser sessions
- Try using a modern browser (Chrome, Firefox, Edge, Safari)
- Check that your browser isn't in private/incognito mode

### Port Already in Use

```bash
# If port 3000 is busy, specify a different port
npm run dev -- -p 3001
```

---

## Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs or request features via [issues](https://github.com/kvedula/pokemon-nuzlocke/issues)
- 🔧 Submit pull requests for improvements
- 🎮 Add support for other Pokémon games
- 📝 Improve documentation

---

## License

MIT License - feel free to use this for your own Nuzlocke adventures!

See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Pokémon sprites from [PokeAPI Sprites](https://github.com/PokeAPI/sprites)
- Encounter data compiled from various community resources
- AI powered by [Anthropic Claude](https://anthropic.com)
- Inspired by the amazing Nuzlocke community

---

## Support

If you find this project helpful, consider:
- ⭐ Starring the repo
- 🐛 Reporting issues you find
- 💡 Suggesting new features

---

**Good luck on your Nuzlocke! May your journey be filled with clutch crits and minimal deaths.** 🔥

*"A Nuzlocke isn't about the destination, it's about the friends we lost along the way."*
