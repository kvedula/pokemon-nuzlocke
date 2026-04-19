'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { Location, LocationStatus, LocationType } from '@/types';
import { getVisualMapBounds, KANTO_COORDS } from '@/data/mapCoordinates';
import { cn } from '@/lib/utils';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Save,
  Layers,
  X,
  Crosshair,
  Home,
  Swords,
  Mountain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LocationDrawer } from './LocationDrawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 900;

const VISUAL_BOUNDS = getVisualMapBounds(MAP_WIDTH, MAP_HEIGHT);

const TYPE_COLORS: Record<LocationType, string> = {
  route: '#d4a574',
  town: '#90EE90',
  city: '#87CEEB',
  gym: '#FF6B6B',
  cave: '#8B8B8B',
  dungeon: '#6B5B95',
  forest: '#228B22',
  building: '#DEB887',
  water: '#4A90D9',
  island: '#F4A460',
  'victory-road': '#8B4513',
  'elite-four': '#FFD700',
  special: '#FF69B4',
};

const STATUS_STYLES: Record<LocationStatus, { fill: string; stroke: string; glow?: string }> = {
  unvisited: { fill: 'rgba(100, 100, 100, 0.3)', stroke: '#666' },
  current: { fill: 'rgba(16, 185, 129, 0.4)', stroke: '#10B981', glow: '#10B981' },
  visited: { fill: 'rgba(59, 130, 246, 0.3)', stroke: '#3B82F6' },
  cleared: { fill: 'rgba(139, 92, 246, 0.35)', stroke: '#8B5CF6' },
  'saved-here': { fill: 'rgba(245, 158, 11, 0.4)', stroke: '#F59E0B', glow: '#F59E0B' },
};

interface MapLocationProps {
  location: Location;
  bounds: { x: number; y: number; width: number; height: number };
  isSelected: boolean;
  onClick: () => void;
  showLabels: boolean;
  showStatus: boolean;
}

function MapLocation({ location, bounds, isSelected, onClick, showLabels, showStatus }: MapLocationProps) {
  const style = STATUS_STYLES[location.status];
  const typeColor = TYPE_COLORS[location.type];
  const isInteractive = ['town', 'city', 'gym', 'cave', 'forest', 'building', 'elite-four', 'island'].includes(location.type);
  
  return (
    <g 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className="transition-all duration-200"
    >
      {/* Base shape */}
      <rect
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
        fill={showStatus ? style.fill : 'transparent'}
        stroke={isSelected ? '#fff' : showStatus ? style.stroke : 'transparent'}
        strokeWidth={isSelected ? 3 : 2}
        rx={4}
        className="transition-all duration-200"
      />
      
      {/* Type indicator dot for important locations */}
      {isInteractive && (
        <circle
          cx={bounds.x + bounds.width / 2}
          cy={bounds.y + bounds.height / 2}
          r={Math.min(bounds.width, bounds.height) / 4}
          fill={typeColor}
          stroke="#333"
          strokeWidth={1}
        />
      )}
      
      {/* Current location pulse */}
      {location.status === 'current' && (
        <motion.rect
          x={bounds.x - 3}
          y={bounds.y - 3}
          width={bounds.width + 6}
          height={bounds.height + 6}
          fill="none"
          stroke="#10B981"
          strokeWidth={2}
          rx={6}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {/* Save indicator */}
      {location.status === 'saved-here' && (
        <g transform={`translate(${bounds.x + bounds.width - 12}, ${bounds.y - 6})`}>
          <circle cx={8} cy={8} r={10} fill="#F59E0B" stroke="#fff" strokeWidth={1} />
          <Save className="w-3 h-3" style={{ transform: 'translate(4px, 4px)', color: 'white' }} />
        </g>
      )}
      
      {/* Encounter used indicator */}
      {location.encounterUsed && (
        <g transform={`translate(${bounds.x - 6}, ${bounds.y - 6})`}>
          <circle cx={8} cy={8} r={10} fill="#EF4444" stroke="#fff" strokeWidth={1} />
          <X className="w-3 h-3" style={{ transform: 'translate(4px, 4px)', color: 'white' }} />
        </g>
      )}
      
      {/* Label */}
      {showLabels && isInteractive && (
        <text
          x={bounds.x + bounds.width / 2}
          y={bounds.y + bounds.height + 12}
          textAnchor="middle"
          fill="white"
          fontSize={10}
          fontWeight={600}
          style={{ 
            textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7)',
            pointerEvents: 'none',
          }}
        >
          {location.name}
        </text>
      )}
    </g>
  );
}

export function KantoMapImage() {
  const currentRun = useRunStore((s) => s.currentRun);
  const setCurrentLocation = useRunStore((s) => s.setCurrentLocation);
  const setSaveLocation = useRunStore((s) => s.setSaveLocation);
  
  const { 
    selectedLocationId, 
    selectLocation, 
    mapZoom, 
    setMapZoom,
    mapPosition,
    setMapPosition,
  } = useUIStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [showStatus, setShowStatus] = useState(true);

  const locations = currentRun?.locations ? Object.values(currentRun.locations) : [];
  const selectedLocation = selectedLocationId && currentRun?.locations[selectedLocationId];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  }, [mapPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart, setMapPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setMapZoom(mapZoom + delta);
  }, [mapZoom, setMapZoom]);

  const resetView = useCallback(() => {
    setMapZoom(0.9);
    setMapPosition({ x: 50, y: 20 });
  }, [setMapZoom, setMapPosition]);

  const centerOnLocation = useCallback((locationId: string) => {
    const bounds = VISUAL_BOUNDS[locationId];
    if (!bounds || !containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const newX = container.width / 2 - (bounds.x + bounds.width / 2) * mapZoom;
    const newY = container.height / 2 - (bounds.y + bounds.height / 2) * mapZoom;
    
    setMapPosition({ x: newX, y: newY });
  }, [mapZoom, setMapPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectLocation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectLocation]);

  useEffect(() => {
    resetView();
  }, []);

  if (!currentRun) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <p className="text-muted-foreground">No active run. Start a new run to see the map.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a1929]">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setMapZoom(mapZoom + 0.15)}
          className="bg-background/80 backdrop-blur"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setMapZoom(mapZoom - 0.15)}
          className="bg-background/80 backdrop-blur"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={resetView}
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
        
        {/* Layer controls */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 backdrop-blur"
              >
                <Layers className="h-4 w-4" />
              </Button>
            }
          />
          <PopoverContent side="left" className="w-56">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Map Layers</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-labels" className="text-sm">Location Names</Label>
                <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-status" className="text-sm">Status Overlay</Label>
                <Switch id="show-status" checked={showStatus} onCheckedChange={setShowStatus} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur rounded-lg p-3 text-xs space-y-2">
        <div className="font-semibold mb-2">Status</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2" style={{ borderColor: '#10B981', background: 'rgba(16,185,129,0.3)' }} />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2" style={{ borderColor: '#3B82F6', background: 'rgba(59,130,246,0.3)' }} />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2" style={{ borderColor: '#8B5CF6', background: 'rgba(139,92,246,0.3)' }} />
          <span>Cleared</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2" style={{ borderColor: '#F59E0B', background: 'rgba(245,158,11,0.3)' }} />
          <span>Saved Here</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <X className="w-2 h-2 text-white" />
          </div>
          <span>Encounter Used</span>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur rounded-lg px-3 py-1.5 text-xs">
        {Math.round(mapZoom * 100)}%
      </div>

      {/* Map Container */}
      <div
        ref={containerRef}
        className={cn(
          'w-full h-full select-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full"
          style={{
            transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapZoom})`,
            transformOrigin: '0 0',
          }}
        >
          <defs>
            {/* Ocean gradient */}
            <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c4a6e" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
            
            {/* Land gradient */}
            <linearGradient id="land" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            
            {/* Forest pattern */}
            <pattern id="forest" patternUnits="userSpaceOnUse" width="12" height="12">
              <rect width="12" height="12" fill="#15803d"/>
              <circle cx="6" cy="6" r="4" fill="#166534"/>
            </pattern>
            
            {/* Mountain/Cave pattern */}
            <pattern id="mountain" patternUnits="userSpaceOnUse" width="16" height="16">
              <rect width="16" height="16" fill="#6b7280"/>
              <polygon points="8,2 14,14 2,14" fill="#4b5563"/>
            </pattern>
            
            {/* Route texture */}
            <pattern id="route" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="#d97706"/>
              <rect x="2" y="2" width="4" height="4" fill="#b45309"/>
            </pattern>
          </defs>

          {/* Ocean background */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ocean)" />
          
          {/* Main Kanto landmass */}
          <path
            d="M 50 30 
               L 750 30 
               L 750 250
               L 700 250
               L 700 350
               L 720 350
               L 720 550
               L 680 550
               L 680 650
               L 580 650
               L 580 720
               L 420 720
               L 420 820
               L 100 820
               L 100 720
               L 150 720
               L 150 620
               L 180 620
               L 180 520
               L 150 520
               L 150 420
               L 100 420
               L 100 300
               L 50 300
               Z"
            fill="url(#land)"
            stroke="#14532d"
            strokeWidth={3}
          />
          
          {/* Viridian Forest */}
          <rect x={130} y={220} width={90} height={80} fill="url(#forest)" rx={8} />
          
          {/* Mt. Moon */}
          <ellipse cx={380} cy={140} rx={50} ry={40} fill="url(#mountain)" />
          
          {/* Rock Tunnel */}
          <rect x={680} y={170} width={35} height={80} fill="url(#mountain)" rx={4} />
          
          {/* Victory Road */}
          <ellipse cx={85} cy={120} rx={45} ry={60} fill="url(#mountain)" />
          
          {/* Seafoam Islands */}
          <ellipse cx={290} cy={700} rx={40} ry={30} fill="url(#mountain)" />
          
          {/* Cinnabar Island */}
          <ellipse cx={155} cy={720} rx={50} ry={40} fill="#dc2626" opacity="0.7" />
          
          {/* Route paths */}
          <g fill="none" stroke="#a16207" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
            {/* Route 1 */}
            <path d="M 205 530 L 205 440" />
            {/* Route 2 */}
            <path d="M 205 375 L 205 300" />
            {/* Route 3 */}
            <path d="M 230 165 L 340 165" />
            {/* Route 4 */}
            <path d="M 420 165 L 480 165" />
            {/* Route 5 */}
            <path d="M 525 200 L 525 270" />
            {/* Route 6 */}
            <path d="M 505 365 L 505 415" />
            {/* More routes... */}
          </g>
          
          {/* City/Town markers as colored rectangles */}
          {[
            { id: 'pallet-town', color: '#fde68a', label: 'Pallet' },
            { id: 'viridian-city', color: '#86efac', label: 'Viridian' },
            { id: 'pewter-city', color: '#d1d5db', label: 'Pewter' },
            { id: 'cerulean-city', color: '#7dd3fc', label: 'Cerulean' },
            { id: 'vermilion-city', color: '#fdba74', label: 'Vermilion' },
            { id: 'lavender-town', color: '#d8b4fe', label: 'Lavender' },
            { id: 'celadon-city', color: '#86efac', label: 'Celadon' },
            { id: 'saffron-city', color: '#fde047', label: 'Saffron' },
            { id: 'fuchsia-city', color: '#f9a8d4', label: 'Fuchsia' },
            { id: 'cinnabar-island', color: '#fca5a5', label: 'Cinnabar' },
          ].map(city => {
            const bounds = VISUAL_BOUNDS[city.id];
            if (!bounds) return null;
            return (
              <g key={city.id}>
                <rect
                  x={bounds.x}
                  y={bounds.y}
                  width={bounds.width}
                  height={bounds.height}
                  fill={city.color}
                  stroke="#374151"
                  strokeWidth={2}
                  rx={4}
                />
              </g>
            );
          })}

          {/* Location markers with status overlays */}
          {locations.map((location) => {
            const bounds = VISUAL_BOUNDS[location.id];
            if (!bounds) return null;
            
            return (
              <MapLocation
                key={location.id}
                location={location}
                bounds={bounds}
                isSelected={selectedLocationId === location.id}
                onClick={() => selectLocation(location.id)}
                showLabels={showLabels}
                showStatus={showStatus}
              />
            );
          })}
        </svg>
      </div>

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
