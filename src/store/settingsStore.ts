'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  // Theme
  theme: 'dark' | 'light' | 'system';
  
  // Level Cap
  levelCapEnabled: boolean;
  levelCapWarningThreshold: number; // Warn when within X levels of cap
  
  // Sounds
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  
  // Notifications
  milestonesEnabled: boolean;
  
  // Display
  showTypeEffectiveness: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  levelCapEnabled: true,
  levelCapWarningThreshold: 2,
  soundEnabled: true,
  soundVolume: 50,
  milestonesEnabled: true,
  showTypeEffectiveness: true,
  compactMode: false,
  animationsEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      resetSettings: () =>
        set({ settings: defaultSettings }),
    }),
    {
      name: 'nuzlocke-settings',
    }
  )
);
