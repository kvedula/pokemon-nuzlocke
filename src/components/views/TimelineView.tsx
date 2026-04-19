'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { RunEvent } from '@/types';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import {
  Clock,
  Trophy,
  Skull,
  Target,
  Star,
  Sparkles,
  MapPin,
  Scroll,
  Milestone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, formatDistanceToNow } from 'date-fns';

const EVENT_ICONS: Record<string, React.ElementType> = {
  catch: Target,
  death: Skull,
  badge: Trophy,
  boss: Star,
  evolution: Sparkles,
  hm: Scroll,
  note: MapPin,
  milestone: Milestone,
};

const EVENT_COLORS: Record<string, string> = {
  catch: 'bg-blue-500',
  death: 'bg-red-500',
  badge: 'bg-yellow-500',
  boss: 'bg-purple-500',
  evolution: 'bg-green-500',
  hm: 'bg-orange-500',
  note: 'bg-gray-500',
  milestone: 'bg-pink-500',
};

function TimelineEvent({ event, isFirst, isLast }: { 
  event: RunEvent; 
  isFirst: boolean; 
  isLast: boolean;
}) {
  const currentRun = useRunStore((s) => s.currentRun);
  const Icon = EVENT_ICONS[event.type] || Clock;
  const color = EVENT_COLORS[event.type] || 'bg-gray-500';
  
  const pokemon = event.pokemonId && currentRun?.pokemon[event.pokemonId];
  const species = pokemon ? POKEMON_SPECIES[pokemon.speciesId] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex gap-4"
    >
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center z-10',
            color
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-muted min-h-[40px]" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 pb-8', isLast && 'pb-0')}>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {event.description}
              </p>
            </div>
            {pokemon && species && (
              <div className="flex items-center gap-2">
                <img
                  src={species.spriteUrl}
                  alt={species.name}
                  className={cn(
                    'w-12 h-12 pixelated',
                    event.type === 'death' && 'grayscale opacity-60'
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TimelineView() {
  const currentRun = useRunStore((s) => s.currentRun);

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No active run
      </div>
    );
  }

  const events = [...currentRun.events].reverse();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline
          </h2>
          <Badge variant="secondary">
            {events.length} events
          </Badge>
        </div>
      </div>

      {/* Timeline */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-24">
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No events recorded yet.</p>
              <p className="text-sm">Your journey will be documented here.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {events.map((event, index) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  isFirst={index === 0}
                  isLast={index === events.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
