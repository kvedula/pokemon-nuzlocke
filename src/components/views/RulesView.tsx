'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { NuzlockeRule } from '@/types';
import { RULE_PRESETS, DEFAULT_RULES } from '@/data/rules';
import { cn } from '@/lib/utils';
import {
  ScrollText,
  Check,
  Info,
  Bookmark,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  core: { label: 'Core Rules', color: 'bg-red-500' },
  catch: { label: 'Catching Rules', color: 'bg-blue-500' },
  death: { label: 'Death Rules', color: 'bg-purple-500' },
  item: { label: 'Item Rules', color: 'bg-green-500' },
  level: { label: 'Level Rules', color: 'bg-yellow-500' },
  battle: { label: 'Battle Rules', color: 'bg-orange-500' },
  custom: { label: 'Custom Rules', color: 'bg-gray-500' },
};

function RuleCard({ rule, onToggle }: { rule: NuzlockeRule; onToggle: () => void }) {
  const category = CATEGORY_LABELS[rule.category] || CATEGORY_LABELS.custom;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl border transition-all',
        rule.enabled ? 'bg-card border-primary/30' : 'bg-muted/30 border-muted'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn('w-2 h-2 rounded-full', category.color)}
            />
            <span className="font-medium">{rule.name}</span>
            {rule.category === 'core' && (
              <Badge variant="destructive" className="text-[10px]">
                Core
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {rule.description}
          </p>
        </div>
        <Switch
          checked={rule.enabled}
          onCheckedChange={onToggle}
        />
      </div>
    </motion.div>
  );
}

export function RulesView() {
  const currentRun = useRunStore((s) => s.currentRun);
  const toggleRule = useRunStore((s) => s.toggleRule);
  const updateRules = useRunStore((s) => s.updateRules);

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No active run
      </div>
    );
  }

  const rulesByCategory = currentRun.rules.reduce((acc, rule) => {
    if (!acc[rule.category]) acc[rule.category] = [];
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, NuzlockeRule[]>);

  const enabledCount = currentRun.rules.filter((r) => r.enabled).length;

  const applyPreset = (presetId: string) => {
    const preset = RULE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const updatedRules = currentRun.rules.map((rule) => ({
      ...rule,
      enabled: preset.rules.includes(rule.id),
    }));
    updateRules(updatedRules);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            Nuzlocke Rules
          </h2>
          <Badge variant="secondary">
            {enabledCount} active
          </Badge>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {RULE_PRESETS.map((preset) => (
            <Tooltip key={preset.id}>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset.id)}
                    className="gap-2"
                  >
                    <Bookmark className="w-3 h-3" />
                    {preset.name}
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-medium">{preset.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {preset.description}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <ScrollArea className="flex-1">
        <div className="p-4 pb-24">
          <Accordion defaultValue={['core', 'catch']} className="space-y-4">
            {Object.entries(rulesByCategory).map(([category, rules]) => {
              const categoryInfo = CATEGORY_LABELS[category] || CATEGORY_LABELS.custom;
              const enabledInCategory = rules.filter((r) => r.enabled).length;

              return (
                <AccordionItem key={category} value={category} className="border rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn('w-3 h-3 rounded-full', categoryInfo.color)}
                      />
                      <span className="font-semibold">{categoryInfo.label}</span>
                      <Badge variant="outline" className="ml-2">
                        {enabledInCategory}/{rules.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pb-4">
                      {rules.map((rule) => (
                        <RuleCard
                          key={rule.id}
                          rule={rule}
                          onToggle={() => toggleRule(rule.id)}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
