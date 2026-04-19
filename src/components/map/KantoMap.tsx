'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { useUIStore } from '@/store/uiStore';
import { Location, LocationStatus, LocationType, CustomPin } from '@/types';
import { getClassicMapCoords } from '@/data/mapCoordinates';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Home,
  Swords,
  Mountain,
  Trees,
  Waves,
  Building2,
  Star,
  Bookmark,
  Navigation,
  Save,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationDrawer } from './LocationDrawer';

const MAP_WIDTH = 800;
const MAP_HEIGHT = 900;

const CLASSIC_COORDS = getClassicMapCoords();

const LOCATION_TYPE_COLORS: Record<LocationType, string> = {
  route: '#92400e',
  town: '#16a34a',
  city: '#2563eb',
  gym: '#dc2626',
  cave: '#525252',
  dungeon: '#6b21a8',
  forest: '#15803d',
  building: '#ca8a04',
  water: '#0284c7',
  island: '#0d9488',
  'victory-road': '#991b1b',
  'elite-four': '#ca8a04',
  special: '#db2777',
};

const STATUS_COLORS: Record<LocationStatus, string> = {
  unvisited: '#6B7280',
  current: '#10B981',
  visited: '#3B82F6',
  cleared: '#8B5CF6',
  'saved-here': '#F59E0B',
};

function getLocationIcon(type: LocationType) {
  switch (type) {
    case 'town':
    case 'city':
      return Home;
    case 'gym':
      return Swords;
    case 'cave':
    case 'dungeon':
    case 'victory-road':
      return Mountain;
    case 'forest':
      return Trees;
    case 'water':
    case 'island':
      return Waves;
    case 'building':
      return Building2;
    case 'elite-four':
      return Star;
    case 'special':
      return Star;
    default:
      return MapPin;
  }
}

interface MapLocationProps {
  location: Location;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick: () => void;
}

function MapLocation({ location, position, isSelected, onClick }: MapLocationProps) {
  const Icon = getLocationIcon(location.type);
  const statusColor = STATUS_COLORS[location.status];
  const typeColor = LOCATION_TYPE_COLORS[location.type];
  
  const size = location.type === 'city' || location.type === 'gym' || location.type === 'elite-four' 
    ? 32 
    : location.type === 'town' 
    ? 28 
    : 22;

  const showLabel = ['city', 'town', 'gym', 'elite-four'].includes(location.type);

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Outer ring (status) */}
      <circle
        cx={position.x}
        cy={position.y}
        r={size / 2 + 5}
        fill="none"
        stroke={statusColor}
        strokeWidth={3}
        opacity={isSelected ? 1 : 0.8}
      />
      
      {/* Selection highlight */}
      {isSelected && (
        <circle
          cx={position.x}
          cy={position.y}
          r={size / 2 + 8}
          fill="none"
          stroke="#fff"
          strokeWidth={2}
        />
      )}
      
      {/* Inner circle (type) */}
      <circle
        cx={position.x}
        cy={position.y}
        r={size / 2}
        fill={typeColor}
        stroke="#1f2937"
        strokeWidth={1}
      />
      
      {/* Icon */}
      <foreignObject
        x={position.x - size / 2 + 4}
        y={position.y - size / 2 + 4}
        width={size - 8}
        height={size - 8}
      >
        <Icon 
          className="text-white drop-shadow-md" 
          style={{ width: '100%', height: '100%' }} 
        />
      </foreignObject>
      
      {/* Current location pulse */}
      {location.status === 'current' && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={size / 2 + 12}
          fill="none"
          stroke="#10B981"
          strokeWidth={2}
          initial={{ scale: 0.9, opacity: 1 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {/* Save indicator */}
      {location.status === 'saved-here' && (
        <g transform={`translate(${position.x + size / 2 - 2}, ${position.y - size / 2 - 6})`}>
          <circle cx={8} cy={8} r={10} fill="#F59E0B" stroke="#fff" strokeWidth={1} />
          <Save className="w-3 h-3 text-white" style={{ transform: 'translate(4px, 4px)' }} />
        </g>
      )}
      
      {/* Encounter used indicator */}
      {location.encounterUsed && (
        <g transform={`translate(${position.x - size / 2 - 10}, ${position.y - size / 2 - 6})`}>
          <circle cx={8} cy={8} r={10} fill="#EF4444" stroke="#fff" strokeWidth={1} />
          <X className="w-3 h-3 text-white" style={{ transform: 'translate(4px, 4px)' }} />
        </g>
      )}

      {/* Label */}
      {showLabel && (
        <text
          x={position.x}
          y={position.y + size / 2 + 14}
          textAnchor="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="600"
          className="pointer-events-none"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          {location.name}
        </text>
      )}
    </motion.g>
  );
}

interface CustomPinMarkerProps {
  pin: CustomPin;
  onClick: () => void;
  onRemove: () => void;
}

function CustomPinMarker({ pin, onClick, onRemove }: CustomPinMarkerProps) {
  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <circle
        cx={pin.x}
        cy={pin.y}
        r={14}
        fill={pin.color}
        stroke="#FFF"
        strokeWidth={2}
      />
      <Bookmark className="w-4 h-4 text-white" style={{ transform: `translate(${pin.x - 8}px, ${pin.y - 8}px)` }} />
    </motion.g>
  );
}

export function KantoMap() {
  const currentRun = useRunStore((s) => s.currentRun);
  const setCurrentLocation = useRunStore((s) => s.setCurrentLocation);
  const setSaveLocation = useRunStore((s) => s.setSaveLocation);
  const addCustomPin = useRunStore((s) => s.addCustomPin);
  const removeCustomPin = useRunStore((s) => s.removeCustomPin);
  
  const { 
    selectedLocationId, 
    selectLocation, 
    mapZoom, 
    setMapZoom,
    mapPosition,
    setMapPosition,
  } = useUIStore();
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAddingPin, setIsAddingPin] = useState(false);

  const locations = currentRun?.locations ? Object.values(currentRun.locations) : [];
  const customPins = currentRun?.customPins || [];
  const selectedLocation = selectedLocationId && currentRun?.locations[selectedLocationId];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isAddingPin) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  }, [isAddingPin, mapPosition]);

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

  const handleMapClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isAddingPin || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - mapPosition.x) / mapZoom;
    const y = (e.clientY - rect.top - mapPosition.y) / mapZoom;
    
    addCustomPin({
      x,
      y,
      label: 'Note',
      color: '#EF4444',
    });
    setIsAddingPin(false);
  }, [isAddingPin, mapPosition, mapZoom, addCustomPin]);

  const resetView = useCallback(() => {
    setMapZoom(1);
    setMapPosition({ x: 0, y: 0 });
  }, [setMapZoom, setMapPosition]);

  const centerOnCurrent = useCallback(() => {
    if (!currentRun?.currentLocation || !containerRef.current) return;
    const pos = CLASSIC_COORDS[currentRun.currentLocation];
    if (!pos) return;
    
    const container = containerRef.current.getBoundingClientRect();
    setMapPosition({
      x: container.width / 2 - pos.x * mapZoom,
      y: container.height / 2 - pos.y * mapZoom,
    });
  }, [currentRun?.currentLocation, mapZoom, setMapPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectLocation(null);
        setIsAddingPin(false);
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
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setMapZoom(mapZoom + 0.2)}
          className="bg-background/80 backdrop-blur"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setMapZoom(mapZoom - 0.2)}
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
          onClick={centerOnCurrent}
          className="bg-background/80 backdrop-blur"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
        <Button
          variant={isAddingPin ? 'default' : 'secondary'}
          size="icon"
          onClick={() => setIsAddingPin(!isAddingPin)}
          className={cn(
            'bg-background/80 backdrop-blur',
            isAddingPin && 'bg-primary text-primary-foreground'
          )}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur rounded-lg p-3 text-xs space-y-1.5">
        <div className="font-semibold mb-2">Location Status</div>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
            <span className="capitalize">{status.replace('-', ' ')}</span>
          </div>
        ))}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur rounded px-2 py-1 text-xs">
        {Math.round(mapZoom * 100)}%
      </div>

      {/* Map Container */}
      <div
        ref={containerRef}
        className={cn(
          'w-full h-full select-none',
          isAddingPin ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full"
          style={{
            transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapZoom})`,
            transformOrigin: 'center center',
          }}
          onClick={handleMapClick}
        >
          {/* Background */}
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#164e63" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>
          
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanGrad)" />
          
          {/* Simplified Kanto landmass */}
          <path
            d="M 50 40 
               L 720 40 
               L 720 280
               L 580 280
               L 580 500
               L 560 500
               L 560 600
               L 480 600
               L 480 700
               L 340 700
               L 340 800
               L 100 800
               L 100 700
               L 140 700
               L 140 500
               L 120 500
               L 120 380
               L 50 380
               Z"
            fill="url(#landGrad)"
            stroke="#0f3d22"
            strokeWidth={3}
          />
          
          {/* Water routes */}
          <ellipse cx="180" cy="720" rx="80" ry="50" fill="#0284c7" opacity="0.3" />
          <ellipse cx="320" cy="750" rx="100" ry="40" fill="#0284c7" opacity="0.3" />
          <rect x="340" y="580" width="40" height="120" fill="#0284c7" opacity="0.2" rx="10" />

          {/* Route connections */}
          <g stroke="#4b5563" strokeWidth={6} strokeLinecap="round" opacity="0.4">
            {locations.map((loc) => 
              loc.connections.map((connId) => {
                const pos1 = CLASSIC_COORDS[loc.id];
                const pos2 = CLASSIC_COORDS[connId];
                if (!pos1 || !pos2) return null;
                return (
                  <line
                    key={`${loc.id}-${connId}`}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                  />
                );
              })
            )}
          </g>

          {/* Locations */}
          {locations.map((location) => {
            const pos = CLASSIC_COORDS[location.id];
            if (!pos) return null;
            
            return (
              <MapLocation
                key={location.id}
                location={location}
                position={pos}
                isSelected={selectedLocationId === location.id}
                onClick={() => selectLocation(location.id)}
              />
            );
          })}

          {/* Custom Pins */}
          <AnimatePresence>
            {customPins.map((pin) => (
              <CustomPinMarker
                key={pin.id}
                pin={pin}
                onClick={() => {}}
                onRemove={() => removeCustomPin(pin.id)}
              />
            ))}
          </AnimatePresence>
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

      {/* Add Pin Instructions */}
      {isAddingPin && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm shadow-lg"
        >
          Click anywhere to add a pin. Press Escape to cancel.
        </motion.div>
      )}
    </div>
  );
}
