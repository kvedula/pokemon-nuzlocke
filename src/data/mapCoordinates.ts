// Unified Kanto map coordinates for both Classic and Visual map views
// Based on the official Kanto region layout from FireRed/LeafGreen
// Grid-based system: each unit represents roughly one "tile" on the game map

export interface MapCoord {
  x: number;
  y: number;
  width?: number;
  height?: number;
  labelOffset?: { x: number; y: number };
}

// Normalized coordinates (0-100 scale for easier mapping)
// Origin (0,0) is top-left, (100, 100) is bottom-right
export const KANTO_COORDS: Record<string, MapCoord> = {
  // Indigo Plateau area (top-left)
  'indigo-plateau': { x: 8, y: 5, width: 6, height: 6 },
  'victory-road': { x: 8, y: 12, width: 5, height: 8 },
  'route-23': { x: 8, y: 20, width: 3, height: 15 },
  'route-22': { x: 12, y: 38, width: 8, height: 3 },
  
  // Northwest - Pewter, Viridian Forest
  'pewter-city': { x: 18, y: 18, width: 6, height: 5 },
  'pewter-gym': { x: 19, y: 19, width: 2, height: 2 },
  'pewter-museum': { x: 21, y: 18, width: 2, height: 2 },
  'viridian-forest': { x: 16, y: 26, width: 8, height: 8 },
  'route-2': { x: 20, y: 34, width: 3, height: 8 },
  
  // West side - Viridian, Pallet
  'viridian-city': { x: 20, y: 42, width: 6, height: 5 },
  'viridian-gym': { x: 21, y: 43, width: 2, height: 2 },
  'route-1': { x: 21, y: 48, width: 3, height: 8 },
  'pallet-town': { x: 20, y: 58, width: 5, height: 4 },
  'route-21': { x: 20, y: 64, width: 3, height: 10 },
  
  // Routes 3 & 4, Mt. Moon
  'route-3': { x: 24, y: 18, width: 12, height: 3 },
  'mt-moon': { x: 36, y: 15, width: 6, height: 6 },
  'route-4': { x: 42, y: 18, width: 8, height: 3 },
  
  // Cerulean area
  'cerulean-city': { x: 50, y: 15, width: 6, height: 5 },
  'cerulean-gym': { x: 51, y: 16, width: 2, height: 2 },
  'cerulean-cave': { x: 50, y: 10, width: 4, height: 4 },
  'route-24': { x: 52, y: 6, width: 3, height: 8 },
  'route-25': { x: 55, y: 6, width: 10, height: 3 },
  'bills-house': { x: 66, y: 6, width: 2, height: 2 },
  
  // Central routes
  'route-5': { x: 52, y: 21, width: 3, height: 8 },
  'underground-path-5-6': { x: 50, y: 27, width: 2, height: 2 },
  
  // Saffron City (central)
  'saffron-city': { x: 48, y: 30, width: 7, height: 6 },
  'saffron-gym': { x: 50, y: 32, width: 2, height: 2 },
  'silph-co': { x: 52, y: 31, width: 2, height: 3 },
  'fighting-dojo': { x: 49, y: 32, width: 2, height: 2 },
  
  // South of Saffron
  'route-6': { x: 52, y: 37, width: 3, height: 8 },
  
  // Vermilion area
  'vermilion-city': { x: 48, y: 46, width: 7, height: 5 },
  'vermilion-gym': { x: 50, y: 48, width: 2, height: 2 },
  'ss-anne': { x: 56, y: 48, width: 4, height: 3 },
  'diglett-cave': { x: 22, y: 36, width: 3, height: 3 },
  'route-11': { x: 56, y: 46, width: 12, height: 3 },
  
  // East side - Rock Tunnel, Power Plant
  'route-9': { x: 56, y: 15, width: 12, height: 3 },
  'rock-tunnel': { x: 68, y: 18, width: 4, height: 8 },
  'power-plant': { x: 70, y: 12, width: 4, height: 4 },
  'route-10': { x: 68, y: 26, width: 3, height: 8 },
  
  // Lavender area
  'lavender-town': { x: 66, y: 34, width: 5, height: 4 },
  'pokemon-tower': { x: 68, y: 34, width: 2, height: 3 },
  
  // Routes 7 & 8
  'route-8': { x: 56, y: 34, width: 10, height: 3 },
  'underground-path-7-8': { x: 54, y: 34, width: 2, height: 2 },
  'route-7': { x: 42, y: 34, width: 6, height: 3 },
  
  // Celadon area
  'celadon-city': { x: 34, y: 30, width: 8, height: 6 },
  'celadon-gym': { x: 36, y: 32, width: 2, height: 2 },
  'rocket-hideout': { x: 38, y: 33, width: 2, height: 2 },
  'game-corner': { x: 38, y: 31, width: 2, height: 2 },
  
  // Cycling Road
  'route-16': { x: 26, y: 30, width: 8, height: 3 },
  'route-17': { x: 24, y: 33, width: 3, height: 20 },
  'route-18': { x: 24, y: 53, width: 8, height: 3 },
  
  // South Routes
  'route-12': { x: 68, y: 38, width: 3, height: 18 },
  'route-13': { x: 58, y: 56, width: 10, height: 3 },
  'route-14': { x: 56, y: 56, width: 3, height: 8 },
  'route-15': { x: 44, y: 62, width: 12, height: 3 },
  
  // Fuchsia area
  'fuchsia-city': { x: 36, y: 58, width: 7, height: 5 },
  'fuchsia-gym': { x: 38, y: 60, width: 2, height: 2 },
  'safari-zone': { x: 35, y: 52, width: 8, height: 5 },
  
  // Water routes to Cinnabar
  'route-19': { x: 38, y: 64, width: 3, height: 8 },
  'route-20': { x: 20, y: 74, width: 18, height: 3 },
  'seafoam-islands': { x: 28, y: 72, width: 4, height: 4 },
  
  // Cinnabar Island
  'cinnabar-island': { x: 14, y: 74, width: 6, height: 5 },
  'cinnabar-gym': { x: 15, y: 76, width: 2, height: 2 },
  'pokemon-mansion': { x: 14, y: 74, width: 3, height: 3 },
};

// Scale factor to convert from 0-100 to actual map dimensions
export function scaleCoords(coord: MapCoord, mapWidth: number, mapHeight: number): MapCoord {
  return {
    x: (coord.x / 100) * mapWidth,
    y: (coord.y / 100) * mapHeight,
    width: coord.width ? (coord.width / 100) * mapWidth : undefined,
    height: coord.height ? (coord.height / 100) * mapHeight : undefined,
    labelOffset: coord.labelOffset,
  };
}

// Get scaled coordinates for the classic map (800x900)
export function getClassicMapCoords(): Record<string, { x: number; y: number }> {
  const result: Record<string, { x: number; y: number }> = {};
  for (const [id, coord] of Object.entries(KANTO_COORDS)) {
    const scaled = scaleCoords(coord, 800, 900);
    result[id] = { 
      x: scaled.x + (scaled.width ? scaled.width / 2 : 0), 
      y: scaled.y + (scaled.height ? scaled.height / 2 : 0) 
    };
  }
  return result;
}

// Get scaled bounds for the visual map
export function getVisualMapBounds(mapWidth: number, mapHeight: number): Record<string, { x: number; y: number; width: number; height: number }> {
  const result: Record<string, { x: number; y: number; width: number; height: number }> = {};
  for (const [id, coord] of Object.entries(KANTO_COORDS)) {
    const scaled = scaleCoords(coord, mapWidth, mapHeight);
    result[id] = {
      x: scaled.x,
      y: scaled.y,
      width: scaled.width || (mapWidth * 0.03),
      height: scaled.height || (mapHeight * 0.03),
    };
  }
  return result;
}
