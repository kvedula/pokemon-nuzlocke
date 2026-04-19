// Map coordinates for the FullKanto.png image (7700 x 6400 pixels)
// Based on FRLGIronmonMap coordinate system

export const MAP_WIDTH = 7700;
export const MAP_HEIGHT = 6400;

export interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type: 'city' | 'town' | 'route' | 'cave' | 'building' | 'gym' | 'other';
}

// Location coordinates mapped to the FullKanto.png image
export const FRLG_LOCATIONS: MapLocation[] = [
  // Towns & Cities
  { id: 'pallet-town', name: 'Pallet Town', x: 1050, y: 5200, width: 300, height: 280, type: 'town' },
  { id: 'viridian-city', name: 'Viridian City', x: 1050, y: 4300, width: 400, height: 380, type: 'city' },
  { id: 'pewter-city', name: 'Pewter City', x: 1050, y: 1550, width: 400, height: 380, type: 'city' },
  { id: 'cerulean-city', name: 'Cerulean City', x: 3750, y: 1100, width: 400, height: 380, type: 'city' },
  { id: 'vermilion-city', name: 'Vermilion City', x: 4300, y: 3600, width: 450, height: 400, type: 'city' },
  { id: 'lavender-town', name: 'Lavender Town', x: 5700, y: 2600, width: 300, height: 280, type: 'town' },
  { id: 'celadon-city', name: 'Celadon City', x: 3000, y: 2600, width: 500, height: 400, type: 'city' },
  { id: 'saffron-city', name: 'Saffron City', x: 4300, y: 2400, width: 500, height: 480, type: 'city' },
  { id: 'fuchsia-city', name: 'Fuchsia City', x: 3700, y: 5100, width: 450, height: 400, type: 'city' },
  { id: 'cinnabar-island', name: 'Cinnabar Island', x: 1050, y: 5950, width: 350, height: 320, type: 'town' },
  { id: 'indigo-plateau', name: 'Indigo Plateau', x: 200, y: 600, width: 400, height: 350, type: 'city' },
  
  // Routes
  { id: 'route-1', name: 'Route 1', x: 1150, y: 4750, width: 150, height: 400, type: 'route' },
  { id: 'route-2', name: 'Route 2', x: 1050, y: 2100, width: 200, height: 700, type: 'route' },
  { id: 'route-3', name: 'Route 3', x: 1500, y: 1200, width: 1000, height: 200, type: 'route' },
  { id: 'route-4', name: 'Route 4', x: 3200, y: 1100, width: 500, height: 150, type: 'route' },
  { id: 'route-5', name: 'Route 5', x: 3900, y: 1550, width: 200, height: 500, type: 'route' },
  { id: 'route-6', name: 'Route 6', x: 4400, y: 3100, width: 200, height: 450, type: 'route' },
  { id: 'route-7', name: 'Route 7', x: 3550, y: 2650, width: 400, height: 150, type: 'route' },
  { id: 'route-8', name: 'Route 8', x: 4900, y: 2650, width: 700, height: 150, type: 'route' },
  { id: 'route-9', name: 'Route 9', x: 4200, y: 1100, width: 800, height: 200, type: 'route' },
  { id: 'route-10', name: 'Route 10', x: 5600, y: 1400, width: 200, height: 800, type: 'route' },
  { id: 'route-11', name: 'Route 11', x: 4800, y: 3700, width: 700, height: 200, type: 'route' },
  { id: 'route-12', name: 'Route 12', x: 5800, y: 2900, width: 200, height: 1400, type: 'route' },
  { id: 'route-13', name: 'Route 13', x: 5200, y: 4300, width: 600, height: 200, type: 'route' },
  { id: 'route-14', name: 'Route 14', x: 5050, y: 4500, width: 200, height: 500, type: 'route' },
  { id: 'route-15', name: 'Route 15', x: 4200, y: 4900, width: 850, height: 200, type: 'route' },
  { id: 'route-16', name: 'Route 16', x: 2200, y: 2600, width: 700, height: 200, type: 'route' },
  { id: 'route-17', name: 'Route 17', x: 1800, y: 2850, width: 300, height: 1800, type: 'route' },
  { id: 'route-18', name: 'Route 18', x: 2100, y: 4700, width: 600, height: 200, type: 'route' },
  { id: 'route-19', name: 'Route 19', x: 3800, y: 5550, width: 200, height: 400, type: 'route' },
  { id: 'route-20', name: 'Route 20', x: 1600, y: 5950, width: 2000, height: 200, type: 'route' },
  { id: 'route-21', name: 'Route 21', x: 1150, y: 5500, width: 200, height: 400, type: 'route' },
  { id: 'route-22', name: 'Route 22', x: 500, y: 4400, width: 500, height: 200, type: 'route' },
  { id: 'route-23', name: 'Route 23', x: 400, y: 1200, width: 250, height: 3000, type: 'route' },
  { id: 'route-24', name: 'Route 24', x: 3900, y: 450, width: 200, height: 600, type: 'route' },
  { id: 'route-25', name: 'Route 25', x: 4150, y: 350, width: 800, height: 200, type: 'route' },
  
  // Caves & Dungeons
  { id: 'viridian-forest', name: 'Viridian Forest', x: 350, y: 3600, width: 600, height: 800, type: 'cave' },
  { id: 'mt-moon', name: 'Mt. Moon', x: 2500, y: 200, width: 700, height: 700, type: 'cave' },
  { id: 'rock-tunnel', name: 'Rock Tunnel', x: 5200, y: 1400, width: 350, height: 600, type: 'cave' },
  { id: 'pokemon-tower', name: 'Pokémon Tower', x: 5750, y: 2500, width: 150, height: 250, type: 'building' },
  { id: 'safari-zone', name: 'Safari Zone', x: 3200, y: 4500, width: 500, height: 500, type: 'other' },
  { id: 'seafoam-islands', name: 'Seafoam Islands', x: 2400, y: 5850, width: 400, height: 350, type: 'cave' },
  { id: 'victory-road', name: 'Victory Road', x: 300, y: 950, width: 400, height: 350, type: 'cave' },
  { id: 'cerulean-cave', name: 'Cerulean Cave', x: 3650, y: 650, width: 300, height: 300, type: 'cave' },
  { id: 'power-plant', name: 'Power Plant', x: 5900, y: 1100, width: 300, height: 250, type: 'building' },
  { id: 'diglett-cave', name: "Diglett's Cave", x: 1000, y: 2850, width: 200, height: 200, type: 'cave' },
  { id: 'pokemon-mansion', name: 'Pokémon Mansion', x: 1000, y: 5850, width: 200, height: 200, type: 'building' },
  
  // Gyms
  { id: 'pewter-gym', name: 'Pewter Gym', x: 1200, y: 1650, width: 100, height: 100, type: 'gym' },
  { id: 'cerulean-gym', name: 'Cerulean Gym', x: 3900, y: 1200, width: 100, height: 100, type: 'gym' },
  { id: 'vermilion-gym', name: 'Vermilion Gym', x: 4450, y: 3750, width: 100, height: 100, type: 'gym' },
  { id: 'celadon-gym', name: 'Celadon Gym', x: 3100, y: 2750, width: 100, height: 100, type: 'gym' },
  { id: 'saffron-gym', name: 'Saffron Gym', x: 4450, y: 2550, width: 100, height: 100, type: 'gym' },
  { id: 'fuchsia-gym', name: 'Fuchsia Gym', x: 3850, y: 5250, width: 100, height: 100, type: 'gym' },
  { id: 'cinnabar-gym', name: 'Cinnabar Gym', x: 1150, y: 6050, width: 100, height: 100, type: 'gym' },
  { id: 'viridian-gym', name: 'Viridian Gym', x: 1200, y: 4450, width: 100, height: 100, type: 'gym' },
  
  // Buildings
  { id: 'silph-co', name: 'Silph Co.', x: 4500, y: 2500, width: 120, height: 150, type: 'building' },
  { id: 'fighting-dojo', name: 'Fighting Dojo', x: 4350, y: 2550, width: 100, height: 100, type: 'building' },
  { id: 'rocket-hideout', name: 'Rocket Hideout', x: 3200, y: 2700, width: 100, height: 100, type: 'building' },
  { id: 'ss-anne', name: 'S.S. Anne', x: 4700, y: 3900, width: 250, height: 150, type: 'building' },
  { id: 'bills-house', name: "Bill's House", x: 4950, y: 350, width: 100, height: 100, type: 'building' },
];

// Get location by ID
export function getFRLGLocation(id: string): MapLocation | undefined {
  return FRLG_LOCATIONS.find(loc => loc.id === id);
}

// Get all locations of a type
export function getFRLGLocationsByType(type: MapLocation['type']): MapLocation[] {
  return FRLG_LOCATIONS.filter(loc => loc.type === type);
}
