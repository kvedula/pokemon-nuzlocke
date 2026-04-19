'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { Badge as BadgeType } from '@/types';
import { cn } from '@/lib/utils';
import { Trophy, Check, Lock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';

const BADGE_ICONS: Record<string, string> = {
  'Boulder Badge': '🪨',
  'Cascade Badge': '💧',
  'Thunder Badge': '⚡',
  'Rainbow Badge': '🌈',
  'Soul Badge': '💜',
  'Marsh Badge': '🔮',
  'Volcano Badge': '🌋',
  'Earth Badge': '🌍',
};

const BADGE_COLORS: Record<string, { bg: string; border: string }> = {
  'Boulder Badge': { bg: 'bg-stone-600', border: 'border-stone-400' },
  'Cascade Badge': { bg: 'bg-blue-500', border: 'border-blue-300' },
  'Thunder Badge': { bg: 'bg-yellow-500', border: 'border-yellow-300' },
  'Rainbow Badge': { bg: 'bg-gradient-to-br from-red-500 via-green-500 to-blue-500', border: 'border-green-400' },
  'Soul Badge': { bg: 'bg-purple-600', border: 'border-purple-400' },
  'Marsh Badge': { bg: 'bg-pink-500', border: 'border-pink-300' },
  'Volcano Badge': { bg: 'bg-orange-600', border: 'border-orange-400' },
  'Earth Badge': { bg: 'bg-green-700', border: 'border-green-500' },
};

interface BadgeItemProps {
  badge: BadgeType;
  onObtain: () => void;
}

function BadgeItem({ badge, onObtain }: BadgeItemProps) {
  const colors = BADGE_COLORS[badge.name] || { bg: 'bg-gray-500', border: 'border-gray-400' };
  const icon = BADGE_ICONS[badge.name] || '🏅';

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <motion.button
            whileHover={{ scale: badge.obtained ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !badge.obtained && onObtain()}
            className={cn(
              'relative w-16 h-16 rounded-full flex items-center justify-center text-2xl',
              'border-4 transition-all duration-300',
              badge.obtained
                ? cn(colors.bg, colors.border, 'shadow-lg shadow-black/20')
                : 'bg-muted/50 border-muted-foreground/20 grayscale opacity-50 cursor-pointer hover:opacity-80'
            )}
          >
            <span>{icon}</span>
            {badge.obtained && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            {!badge.obtained && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
            )}
          </motion.button>
        }
      />
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{badge.name}</p>
          <p className="text-sm text-muted-foreground">
            {badge.gymLeader} - {badge.gymLocation.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </p>
          {badge.obtained && badge.obtainedDate && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Obtained {format(new Date(badge.obtainedDate), 'MMM d, yyyy')}
            </p>
          )}
          {!badge.obtained && (
            <p className="text-xs text-primary">Click to mark as obtained</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function BadgeTracker() {
  const currentRun = useRunStore((s) => s.currentRun);
  const obtainBadge = useRunStore((s) => s.obtainBadge);

  if (!currentRun) return null;

  const obtainedCount = currentRun.badges.filter((b) => b.obtained).length;

  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Gym Badges
        </h3>
        <Badge variant="secondary">
          {obtainedCount}/8
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-3 justify-items-center">
        {currentRun.badges.map((badge) => (
          <BadgeItem
            key={badge.id}
            badge={badge}
            onObtain={() => obtainBadge(badge.id)}
          />
        ))}
      </div>

      {obtainedCount === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg text-center"
        >
          <p className="text-sm font-semibold text-yellow-500">
            🎉 All badges collected! Ready for the Elite Four!
          </p>
        </motion.div>
      )}
    </div>
  );
}
