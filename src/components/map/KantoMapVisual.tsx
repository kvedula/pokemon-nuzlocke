'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { Location } from '@/types';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationDrawer } from './LocationDrawer';

// Map dimensions match the FullKanto.png image
const MAP_WIDTH = 7700;
const MAP_HEIGHT = 6400;

// Location coordinates mapped to FullKanto.png (7700x6400)
// Recalibrated based on visual inspection of the actual map
const LOCATION_COORDS: Record<string, { x: number; y: number; width: number; height: number }> = {
  // Towns & Cities
  'pallet-town': { x: 1000, y: 4680, width: 200, height: 200 },
  'viridian-city': { x: 920, y: 3950, width: 280, height: 320 },
  'pewter-city': { x: 920, y: 1400, width: 280, height: 280 },
  'cerulean-city': { x: 3680, y: 880, width: 320, height: 300 },
  'vermilion-city': { x: 4150, y: 3180, width: 380, height: 350 },
  'lavender-town': { x: 5600, y: 2180, width: 240, height: 240 },
  'celadon-city': { x: 2880, y: 2180, width: 420, height: 320 },
  'saffron-city': { x: 4080, y: 1980, width: 420, height: 380 },
  'fuchsia-city': { x: 3550, y: 4580, width: 380, height: 350 },
  'cinnabar-island': { x: 920, y: 5380, width: 300, height: 280 },
  'indigo-plateau': { x: 80, y: 280, width: 320, height: 300 },

  // Routes
  'route-1': { x: 1020, y: 4380, width: 140, height: 280 },
  'route-2': { x: 980, y: 1750, width: 160, height: 500 },
  'route-3': { x: 1350, y: 980, width: 1100, height: 180 },
  'route-4': { x: 3100, y: 850, width: 520, height: 160 },
  'route-5': { x: 3820, y: 1280, width: 160, height: 580 },
  'route-6': { x: 4280, y: 2700, width: 160, height: 420 },
  'route-7': { x: 3400, y: 2300, width: 480, height: 140 },
  'route-8': { x: 4720, y: 2300, width: 820, height: 140 },
  'route-9': { x: 4100, y: 850, width: 920, height: 160 },
  'route-10': { x: 5450, y: 1080, width: 160, height: 920 },
  'route-11': { x: 4650, y: 3350, width: 850, height: 160 },
  'route-12': { x: 5700, y: 2500, width: 160, height: 1600 },
  'route-13': { x: 5050, y: 3950, width: 720, height: 160 },
  'route-14': { x: 4900, y: 4100, width: 160, height: 580 },
  'route-15': { x: 4050, y: 4480, width: 920, height: 160 },
  'route-16': { x: 2050, y: 2280, width: 780, height: 160 },
  'route-17': { x: 1700, y: 2500, width: 280, height: 1850 },
  'route-18': { x: 2000, y: 4350, width: 720, height: 160 },
  'route-19': { x: 3700, y: 5050, width: 160, height: 480 },
  'route-20': { x: 1450, y: 5450, width: 2150, height: 160 },
  'route-21': { x: 1080, y: 4950, width: 160, height: 420 },
  'route-22': { x: 420, y: 4000, width: 480, height: 160 },
  'route-23': { x: 320, y: 750, width: 220, height: 3100 },
  'route-24': { x: 3820, y: 280, width: 160, height: 550 },
  'route-25': { x: 4050, y: 120, width: 920, height: 160 },

  // Caves & Dungeons
  'viridian-forest': { x: 220, y: 3250, width: 680, height: 650 },
  'mt-moon': { x: 2550, y: 80, width: 600, height: 550 },
  'rock-tunnel': { x: 5080, y: 1080, width: 420, height: 720 },
  'pokemon-tower': { x: 5650, y: 2080, width: 180, height: 280 },
  'safari-zone': { x: 3050, y: 4150, width: 580, height: 520 },
  'seafoam-islands': { x: 2300, y: 5350, width: 480, height: 420 },
  'victory-road': { x: 180, y: 580, width: 420, height: 420 },
  'cerulean-cave': { x: 3550, y: 380, width: 320, height: 380 },
  'power-plant': { x: 5750, y: 780, width: 320, height: 300 },
  'diglett-cave': { x: 880, y: 2550, width: 200, height: 200 },
  'pokemon-mansion': { x: 880, y: 5280, width: 200, height: 200 },

  // Gyms (offset from cities to avoid overlap)
  'pewter-gym': { x: 1050, y: 1520, width: 120, height: 120 },
  'cerulean-gym': { x: 3850, y: 980, width: 120, height: 120 },
  'vermilion-gym': { x: 4350, y: 3300, width: 120, height: 120 },
  'celadon-gym': { x: 3050, y: 2300, width: 120, height: 120 },
  'saffron-gym': { x: 4350, y: 2100, width: 120, height: 120 },
  'fuchsia-gym': { x: 3750, y: 4700, width: 120, height: 120 },
  'cinnabar-gym': { x: 1080, y: 5500, width: 120, height: 120 },
  'viridian-gym': { x: 1080, y: 4080, width: 120, height: 120 },

  // Buildings
  'silph-co': { x: 4380, y: 2080, width: 140, height: 180 },
  'fighting-dojo': { x: 4220, y: 2100, width: 120, height: 120 },
  'rocket-hideout': { x: 3100, y: 2280, width: 120, height: 120 },
  'ss-anne': { x: 4600, y: 3500, width: 280, height: 180 },
  'bills-house': { x: 4920, y: 120, width: 120, height: 120 },
  'underground-path-5-6': { x: 3920, y: 1780, width: 100, height: 100 },
  'underground-path-7-8': { x: 4650, y: 2300, width: 100, height: 100 },
  'pewter-museum': { x: 1020, y: 1450, width: 120, height: 120 },
};

interface LocationMarkerProps {
  location: Location;
  coords: { x: number; y: number; width: number; height: number };
  isSelected: boolean;
  onClick: () => void;
  scale: number;
}

function LocationMarker({
  location,
  coords,
  isSelected,
  onClick,
  scale,
}: LocationMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isImportant = ['town', 'city', 'gym', 'cave', 'elite-four', 'island', 'dungeon', 'forest'].includes(location.type);
  const labelSize = Math.max(12, 14 / scale);

  return (
    <g 
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Clickable area - subtle highlight on hover */}
      <rect
        x={coords.x}
        y={coords.y}
        width={coords.width}
        height={coords.height}
        fill={isHovered ? 'rgba(255,255,255,0.15)' : 'transparent'}
        stroke={isSelected ? '#fff' : (isHovered ? 'rgba(255,255,255,0.4)' : 'transparent')}
        strokeWidth={isSelected ? 4 : 2}
        rx={6}
        style={{ transition: 'all 0.2s ease' }}
      />

      {/* Location name label - show on hover or selection */}
      {(isHovered || isSelected) && isImportant && (
        <text
          x={coords.x + coords.width / 2}
          y={coords.y + coords.height + 20}
          textAnchor="middle"
          fill="white"
          fontSize={labelSize}
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
          }}
        >
          {location.name}
        </text>
      )}
    </g>
  );
}

export function KantoMapVisual() {
  const currentRun = useRunStore((s) => s.currentRun);
  const setCurrentLocation = useRunStore((s) => s.setCurrentLocation);
  const setSaveLocation = useRunStore((s) => s.setSaveLocation);
  const { selectedLocationId, selectLocation } = useUIStore();

  const [showPaths, setShowPaths] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);
  const transformRef = useRef<any>(null);

  const locations = currentRun?.locations ? Object.values(currentRun.locations) : [];
  const selectedLocation = selectedLocationId && currentRun?.locations[selectedLocationId];

  const centerOnLocation = useCallback((locationId: string) => {
    const coords = LOCATION_COORDS[locationId];
    if (!coords || !transformRef.current) return;

    const centerX = coords.x + coords.width / 2;
    const centerY = coords.y + coords.height / 2;

    transformRef.current.setTransform(
      -centerX * currentScale + window.innerWidth / 2,
      -centerY * currentScale + window.innerHeight / 2,
      currentScale
    );
  }, [currentScale]);

  const handleTransform = useCallback((ref: any) => {
    setCurrentScale(ref.state.scale);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectLocation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectLocation]);

  if (!currentRun) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <p className="text-muted-foreground">No active run. Start a new run to see the map.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a2634]">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => transformRef.current?.zoomIn()}
          className="bg-background/80 backdrop-blur"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => transformRef.current?.zoomOut()}
          className="bg-background/80 backdrop-blur"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => transformRef.current?.resetTransform()}
          className="bg-background/80 backdrop-blur"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => centerOnLocation(currentRun.currentLocation)}
          className="bg-background/80 backdrop-blur"
        >
          <Crosshair className="h-4 w-4" />
        </Button>

        </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-20 bg-background/80 backdrop-blur rounded-lg px-3 py-1.5 text-xs">
        {Math.round(currentScale * 100)}%
      </div>

      {/* Map */}
      <TransformWrapper
        ref={transformRef}
        initialScale={0.15}
        minScale={0.05}
        maxScale={2}
        centerOnInit
        onTransform={handleTransform}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
        >
          {/* Base map image */}
          <img
            src="/FullKanto.png"
            alt="Kanto Region"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            style={{
              imageRendering: 'pixelated',
              display: 'block',
            }}
            draggable={false}
          />

          {/* Route paths overlay */}
          {showPaths && (
            <img
              src="/FullKantoPaths.png"
              alt="Routes"
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                imageRendering: 'pixelated',
                opacity: 0.7,
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          )}

          {/* SVG overlay for location markers */}
          <svg
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          >
            <g style={{ pointerEvents: 'auto' }}>
              {locations.map((location) => {
                const coords = LOCATION_COORDS[location.id];
                if (!coords) return null;

                return (
                  <LocationMarker
                    key={location.id}
                    location={location}
                    coords={coords}
                    isSelected={selectedLocationId === location.id}
                    onClick={() => selectLocation(location.id)}
                    scale={currentScale}
                  />
                );
              })}
            </g>
          </svg>
        </TransformComponent>
      </TransformWrapper>

      {/* Location Drawer */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationDrawer
            location={selectedLocation}
            onClose={() => selectLocation(null)}
            onSetCurrent={() => setCurrentLocation(selectedLocation.id)}
            onSetSave={() => setSaveLocation(selectedLocation.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
