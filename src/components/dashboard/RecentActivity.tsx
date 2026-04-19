'use client';

import React, { useMemo } from 'react';
import { useRunStore } from '@/store/runStore';
import { cn } from '@/lib/utils';
import {
  Activity,
  Trophy,
  Skull,
  MapPin,
  CircleDot,
  Swords,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'catch' | 'death' | 'badge' | 'location' | 'battle';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  color: string;
}

export function RecentActivity() {
  const currentRun = useRunStore((s) => s.currentRun);

  const activities = useMemo(() => {
    if (!currentRun) return [];

    const items: ActivityItem[] = [];

    // Get Pokemon events
    Object.values(currentRun.pokemon).forEach(pokemon => {
      if (pokemon.caughtAt) {
        items.push({
          id: `catch-${pokemon.id}`,
          type: 'catch',
          title: `Caught ${pokemon.nickname}`,
          description: `Lv.${pokemon.level} ${pokemon.species} at ${pokemon.metLocation || 'Unknown'}`,
          timestamp: pokemon.caughtAt,
          icon: CircleDot,
          color: 'text-green-500',
        });
      }
      if (pokemon.status === 'dead' && pokemon.deathCause) {
        items.push({
          id: `death-${pokemon.id}`,
          type: 'death',
          title: `Lost ${pokemon.nickname}`,
          description: pokemon.deathCause,
          timestamp: pokemon.caughtAt || new Date().toISOString(),
          icon: Skull,
          color: 'text-red-500',
        });
      }
    });

    // Get badge events
    currentRun.badges.filter(b => b.obtained && b.obtainedAt).forEach(badge => {
      items.push({
        id: `badge-${badge.id}`,
        type: 'badge',
        title: `Obtained ${badge.name}`,
        description: `Defeated ${badge.leader}`,
        timestamp: badge.obtainedAt!,
        icon: Trophy,
        color: 'text-yellow-500',
      });
    });

    // Sort by timestamp (newest first)
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return items.slice(0, 5);
  }, [currentRun]);

  if (!currentRun) return null;

  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Recent Activity</h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className={cn(
                  'flex items-start gap-3 p-2 rounded-lg transition-colors',
                  'hover:bg-muted/50'
                )}
              >
                <div className={cn('p-1.5 rounded-lg bg-muted', activity.color)}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
