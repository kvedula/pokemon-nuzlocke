'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Sparkles, 
  Skull, 
  Target, 
  Star, 
  Zap,
  PartyPopper,
  Medal,
  X,
} from 'lucide-react';

type MilestoneType = 
  | 'badge'
  | 'catch'
  | 'death'
  | 'evolution'
  | 'firstCatch'
  | 'teamFull'
  | 'levelMilestone'
  | 'encounterMilestone'
  | 'achievement';

interface Milestone {
  id: string;
  type: MilestoneType;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const MILESTONE_CONFIG: Record<MilestoneType, { icon: React.ReactNode; color: string }> = {
  badge: { icon: <Trophy className="w-6 h-6" />, color: 'from-yellow-500 to-amber-600' },
  catch: { icon: <Target className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
  death: { icon: <Skull className="w-6 h-6" />, color: 'from-red-500 to-rose-600' },
  evolution: { icon: <Sparkles className="w-6 h-6" />, color: 'from-purple-500 to-violet-600' },
  firstCatch: { icon: <Star className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
  teamFull: { icon: <PartyPopper className="w-6 h-6" />, color: 'from-pink-500 to-rose-600' },
  levelMilestone: { icon: <Zap className="w-6 h-6" />, color: 'from-orange-500 to-amber-600' },
  encounterMilestone: { icon: <Target className="w-6 h-6" />, color: 'from-cyan-500 to-teal-600' },
  achievement: { icon: <Medal className="w-6 h-6" />, color: 'from-yellow-400 to-yellow-600' },
};

interface MilestoneContextType {
  showMilestone: (type: MilestoneType, title: string, description: string) => void;
}

const MilestoneContext = createContext<MilestoneContextType | null>(null);

export function useMilestones() {
  const context = useContext(MilestoneContext);
  if (!context) {
    throw new Error('useMilestones must be used within MilestoneProvider');
  }
  return context;
}

interface MilestoneProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function MilestoneProvider({ children, enabled = true }: MilestoneProviderProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  
  const showMilestone = useCallback((type: MilestoneType, title: string, description: string) => {
    if (!enabled) return;
    
    const id = `${Date.now()}-${Math.random()}`;
    const milestone: Milestone = { id, type, title, description };
    
    setMilestones((prev) => [...prev, milestone]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    }, 5000);
  }, [enabled]);
  
  const dismissMilestone = useCallback((id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  }, []);
  
  return (
    <MilestoneContext.Provider value={{ showMilestone }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {milestones.map((milestone) => {
            const config = MILESTONE_CONFIG[milestone.type];
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="pointer-events-auto"
              >
                <div 
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl shadow-2xl border",
                    "bg-gradient-to-r text-white min-w-[280px]",
                    config.color
                  )}
                >
                  <div className="shrink-0 p-2 bg-white/20 rounded-lg">
                    {milestone.icon || config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm">{milestone.title}</h4>
                    <p className="text-xs text-white/80 truncate">{milestone.description}</p>
                  </div>
                  <button
                    onClick={() => dismissMilestone(milestone.id)}
                    className="shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </MilestoneContext.Provider>
  );
}

// Pre-built milestone helpers
export const MILESTONES = {
  firstBadge: () => ({ type: 'badge' as const, title: 'First Badge!', description: 'You earned your first gym badge!' }),
  badge: (name: string, count: number) => ({ type: 'badge' as const, title: `${name} Obtained!`, description: `Badge ${count}/8 collected` }),
  firstCatch: (name: string) => ({ type: 'firstCatch' as const, title: 'First Catch!', description: `${name} is your first partner!` }),
  catch: (name: string, count: number) => ({ type: 'catch' as const, title: 'New Team Member!', description: `Caught ${name}! (${count} total)` }),
  tenthCatch: () => ({ type: 'encounterMilestone' as const, title: '10 Catches!', description: 'Your Nuzlocke is going strong!' }),
  firstDeath: (name: string) => ({ type: 'death' as const, title: 'First Loss...', description: `${name} has fallen. Never forget.` }),
  death: (name: string) => ({ type: 'death' as const, title: 'Fallen Ally', description: `${name} will be remembered.` }),
  evolution: (from: string, to: string) => ({ type: 'evolution' as const, title: 'Evolution!', description: `${from} evolved into ${to}!` }),
  teamFull: () => ({ type: 'teamFull' as const, title: 'Full Team!', description: 'Your party is now complete!' }),
  level50: (name: string) => ({ type: 'levelMilestone' as const, title: 'Level 50!', description: `${name} reached level 50!` }),
  level100: (name: string) => ({ type: 'levelMilestone' as const, title: 'MAX LEVEL!', description: `${name} reached level 100!` }),
};
