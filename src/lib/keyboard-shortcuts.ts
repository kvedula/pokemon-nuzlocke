'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

// Check if an input element is focused
function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  
  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    return true;
  }
  
  return activeElement.getAttribute('contenteditable') === 'true';
}

// Format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.meta) parts.push('⌘');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join('+');
}

// Hook to register keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (isInputFocused()) return;
    
    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrl === (event.ctrlKey || event.metaKey);
      const shiftMatch = !!shortcut.shift === event.shiftKey;
      const altMatch = !!shortcut.alt === event.altKey;
      
      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Default app shortcuts
export const DEFAULT_SHORTCUTS = {
  // Navigation
  DASHBOARD: { key: '1', description: 'Go to Dashboard' },
  TEAM: { key: '2', description: 'Go to Team' },
  ENCOUNTERS: { key: '3', description: 'Go to Encounters' },
  MAP: { key: '4', description: 'Go to Map' },
  POKEDEX: { key: '5', description: 'Go to Pokédex' },
  
  // Actions
  COMMAND_PALETTE: { key: 'k', ctrl: true, description: 'Open Command Palette' },
  QUICK_SAVE: { key: 's', ctrl: true, description: 'Quick Save' },
  UNDO: { key: 'z', ctrl: true, description: 'Undo' },
  
  // Shortcuts
  NEW_CATCH: { key: 'n', description: 'New Catch (via AI)' },
  LEVEL_UP: { key: 'l', description: 'Level Up (via AI)' },
  FOCUS_CHAT: { key: '/', description: 'Focus Chat Input' },
  
  // Help
  SHOW_SHORTCUTS: { key: '?', shift: true, description: 'Show Shortcuts' },
};
