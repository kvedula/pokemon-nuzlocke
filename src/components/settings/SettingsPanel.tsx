'use client';

import React from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import {
  Sun,
  Moon,
  Monitor,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Gauge,
  Sparkles,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DEFAULT_SHORTCUTS, formatShortcut } from '@/lib/keyboard-shortcuts';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your Nuzlocke Tracker experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Theme */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Theme
            </Label>
            <Select
              value={settings.theme}
              onValueChange={(v) => updateSettings({ theme: v as 'dark' | 'light' | 'system' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Level Cap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Level Cap Warnings
              </Label>
              <Switch
                checked={settings.levelCapEnabled}
                onCheckedChange={(v) => updateSettings({ levelCapEnabled: v })}
              />
            </div>
            {settings.levelCapEnabled && (
              <div className="pl-6 space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Warn when within {settings.levelCapWarningThreshold} levels of cap
                </Label>
                <input
                  type="range"
                  value={settings.levelCapWarningThreshold}
                  onChange={(e) => updateSettings({ levelCapWarningThreshold: parseInt(e.target.value) })}
                  min={0}
                  max={5}
                  step={1}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}
          </div>
          
          {/* Sounds */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Sound Effects
              </Label>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(v) => updateSettings({ soundEnabled: v })}
              />
            </div>
            {settings.soundEnabled && (
              <div className="pl-6 space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Volume: {settings.soundVolume}%
                </Label>
                <input
                  type="range"
                  value={settings.soundVolume}
                  onChange={(e) => updateSettings({ soundVolume: parseInt(e.target.value) })}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}
          </div>
          
          {/* Milestones */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {settings.milestonesEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              Milestone Celebrations
            </Label>
            <Switch
              checked={settings.milestonesEnabled}
              onCheckedChange={(v) => updateSettings({ milestonesEnabled: v })}
            />
          </div>
          
          {/* Animations */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Animations
            </Label>
            <Switch
              checked={settings.animationsEnabled}
              onCheckedChange={(v) => updateSettings({ animationsEnabled: v })}
            />
          </div>
          
          {/* Type Effectiveness */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Show Type Effectiveness
            </Label>
            <Switch
              checked={settings.showTypeEffectiveness}
              onCheckedChange={(v) => updateSettings({ showTypeEffectiveness: v })}
            />
          </div>
          
          {/* Keyboard Shortcuts */}
          <div className="space-y-3">
            <Label>Keyboard Shortcuts</Label>
            <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5 max-h-[200px] overflow-y-auto">
              {Object.entries(DEFAULT_SHORTCUTS).map(([key, shortcut]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{shortcut.description}</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">
                    {formatShortcut(shortcut as any)}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reset */}
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={resetSettings}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
