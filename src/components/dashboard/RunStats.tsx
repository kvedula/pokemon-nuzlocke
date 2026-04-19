'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { cn } from '@/lib/utils';
import {
  Trophy,
  Skull,
  MapPin,
  Clock,
  Target,
  Users,
  Box,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

function StatCard({ icon, label, value, subtext, color = 'text-primary' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border bg-card"
    >
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg bg-muted', color)}>
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground/70">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
}

export function RunStats() {
  const currentRun = useRunStore((s) => s.currentRun);

  if (!currentRun) return null;

  const badgeCount = currentRun.badges.filter((b) => b.obtained).length;
  const totalEncounters = currentRun.encounterCount;
  const totalDeaths = currentRun.deathCount;
  const partyCount = currentRun.party.length;
  const boxCount = currentRun.box.length;
  const totalPokemon = Object.keys(currentRun.pokemon).length;
  
  const hmCount = Object.values(currentRun.hmProgress).filter(Boolean).length;
  const totalHMs = Object.keys(currentRun.hmProgress).length;
  
  const completionPercent = (badgeCount / 8) * 100;
  
  const currentLoc = currentRun.locations[currentRun.currentLocation];

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Run Header */}
      <div className="p-4 rounded-xl border bg-gradient-to-br from-card to-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentRun.name}</h2>
            <p className="text-sm text-muted-foreground">
              {currentRun.game === 'firered' ? 'FireRed' : 'LeafGreen'} Nuzlocke
            </p>
          </div>
          <Badge 
            variant={currentRun.status === 'active' ? 'default' : currentRun.status === 'completed' ? 'secondary' : 'destructive'}
            className="capitalize"
          >
            {currentRun.status}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{badgeCount}/8 Badges</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
        </div>

        {/* Current Location */}
        {currentLoc && (
          <div className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              Currently at <span className="font-medium">{currentLoc.name}</span>
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Trophy className="w-4 h-4" />}
          label="Badges"
          value={`${badgeCount}/8`}
          color="text-yellow-500"
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Encounters"
          value={totalEncounters}
          color="text-blue-500"
        />
        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="Party"
          value={`${partyCount}/6`}
          color="text-green-500"
        />
        <StatCard
          icon={<Box className="w-4 h-4" />}
          label="Boxed"
          value={boxCount}
          color="text-purple-500"
        />
        <StatCard
          icon={<Skull className="w-4 h-4" />}
          label="Deaths"
          value={totalDeaths}
          color="text-red-500"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Play Time"
          value={formatPlayTime(currentRun.playTime)}
          color="text-orange-500"
        />
      </div>

      {/* HM Progress */}
      <div className="p-4 rounded-xl border bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">HM Progress</h3>
          <Badge variant="outline">{hmCount}/{totalHMs}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(currentRun.hmProgress).map(([hm, obtained]) => (
            <Badge
              key={hm}
              variant={obtained ? 'default' : 'outline'}
              className={cn(
                'capitalize transition-all',
                obtained ? 'bg-primary' : 'opacity-50'
              )}
            >
              {hm.replace(/([A-Z])/g, ' $1').trim()}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Rules Summary */}
      <div className="p-4 rounded-xl border bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Active Rules</h3>
          <Badge variant="outline">
            {currentRun.rules.filter((r) => r.enabled).length}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1">
          {currentRun.rules
            .filter((r) => r.enabled)
            .slice(0, 5)
            .map((rule) => (
              <Badge key={rule.id} variant="secondary" className="text-xs">
                {rule.name}
              </Badge>
            ))}
          {currentRun.rules.filter((r) => r.enabled).length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{currentRun.rules.filter((r) => r.enabled).length - 5} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
