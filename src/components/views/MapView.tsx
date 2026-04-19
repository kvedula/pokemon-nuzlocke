'use client';

import React, { useState } from 'react';
import { KantoMapSimple } from '@/components/map/KantoMapSimple';
import { KantoMapVisual } from '@/components/map/KantoMapVisual';
import { Button } from '@/components/ui/button';
import { MapIcon, List } from 'lucide-react';

type MapStyle = 'list' | 'visual';

export function MapView() {
  const [mapStyle, setMapStyle] = useState<MapStyle>('list');

  const toggleButton = (
    <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
      <Button
        variant={mapStyle === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMapStyle('list')}
        className="gap-2 h-8"
      >
        <List className="h-4 w-4" />
        List
      </Button>
      <Button
        variant={mapStyle === 'visual' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMapStyle('visual')}
        className="gap-2 h-8"
      >
        <MapIcon className="h-4 w-4" />
        Visual
      </Button>
    </div>
  );

  return (
    <div className="h-full w-full relative">
      {mapStyle === 'list' ? (
        <KantoMapSimple toggleButton={toggleButton} />
      ) : (
        <>
          <KantoMapVisual />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-background/90 backdrop-blur border rounded-lg p-1">
              {toggleButton}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
