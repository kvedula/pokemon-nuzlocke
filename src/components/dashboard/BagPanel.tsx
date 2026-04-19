'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { ItemCategory } from '@/types';
import { cn } from '@/lib/utils';
import {
  Package,
  ChevronDown,
  ChevronUp,
  Circle,
  Heart,
  Swords,
  Cherry,
  Disc,
  Key,
  MoreHorizontal,
  Coins,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CATEGORY_CONFIG: Record<ItemCategory, { label: string; icon: React.ReactNode; color: string }> = {
  pokeball: { label: 'Poké Balls', icon: <Circle className="w-3 h-3" />, color: 'text-red-400' },
  medicine: { label: 'Medicine', icon: <Heart className="w-3 h-3" />, color: 'text-pink-400' },
  battle: { label: 'Battle Items', icon: <Swords className="w-3 h-3" />, color: 'text-orange-400' },
  berry: { label: 'Berries', icon: <Cherry className="w-3 h-3" />, color: 'text-green-400' },
  tm: { label: 'TMs & HMs', icon: <Disc className="w-3 h-3" />, color: 'text-purple-400' },
  key: { label: 'Key Items', icon: <Key className="w-3 h-3" />, color: 'text-yellow-400' },
  other: { label: 'Other', icon: <MoreHorizontal className="w-3 h-3" />, color: 'text-gray-400' },
};

const CATEGORY_ORDER: ItemCategory[] = ['pokeball', 'medicine', 'battle', 'berry', 'tm', 'key', 'other'];

export function BagPanel() {
  const currentRun = useRunStore((s) => s.currentRun);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<ItemCategory>>(new Set(['pokeball', 'medicine']));

  const inventory = currentRun?.inventory || [];
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const money = currentRun?.money ?? 0;

  const groupedItems = CATEGORY_ORDER.map(category => ({
    category,
    items: inventory.filter(item => item.category === category),
    ...CATEGORY_CONFIG[category],
  })).filter(group => group.items.length > 0);

  const toggleCategory = (category: ItemCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold">Bag</h3>
          {totalItems > 0 && (
            <Badge variant="secondary" className="text-xs">
              {totalItems} items
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Money Display */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Money</span>
                </div>
                <span className="font-bold text-yellow-500">
                  ₽{money.toLocaleString()}
                </span>
              </div>

              {inventory.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Package className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No items yet</p>
                  <p className="text-xs mt-1">Tell the AI when you buy items!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groupedItems.map(({ category, items, label, icon, color }) => (
                    <div key={category} className="rounded-lg border bg-muted/30 overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={color}>{icon}</span>
                          <span className="text-sm font-medium">{label}</span>
                          <Badge variant="outline" className="text-xs h-5">
                            {items.length}
                          </Badge>
                        </div>
                        {expandedCategories.has(category) ? (
                          <ChevronUp className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedCategories.has(category) && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-2 space-y-1">
                              {items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-1.5 px-2 rounded bg-background/50 text-sm"
                                >
                                  <span>{item.name}</span>
                                  <span className="font-medium text-muted-foreground">
                                    x{item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
