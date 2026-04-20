'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useRunStore } from '@/store/runStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { NewRunDialog } from '@/components/layout/NewRunDialog';
import { RunsDialog } from '@/components/layout/RunsDialog';
import { DashboardView } from '@/components/views/DashboardView';
import { MapView } from '@/components/views/MapView';
import { TeamView } from '@/components/views/TeamView';
import { EncountersView } from '@/components/views/EncountersView';
import { RulesView } from '@/components/views/RulesView';
import { TimelineView } from '@/components/views/TimelineView';
import { PokedexView } from '@/components/views/PokedexView';
import { WalkthroughView } from '@/components/views/WalkthroughView';
import { ExtrasView } from '@/components/views/ExtrasView';
import { ChatBar } from '@/components/chat/ChatBar';
import { MilestoneProvider } from '@/components/ui/milestone-toast';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { ExportShare } from '@/components/tools/ExportShare';
import { exportRunToJSON, importRunFromJSON, exportAllData } from '@/lib/db';
import { toast } from 'sonner';
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Map,
  Users,
  Target,
  ScrollText,
  Clock,
  Book,
  Download,
  Upload,
  Moon,
  Sun,
  Plus,
  PanelLeftOpen,
  Sparkles,
  Settings,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const VIEWS: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  map: MapView,
  team: TeamView,
  encounters: EncountersView,
  extras: ExtrasView,
  rules: RulesView,
  timeline: TimelineView,
  pokedex: PokedexView,
  walkthrough: WalkthroughView,
};

export function App() {
  const { activeTab, setActiveTab, commandPaletteOpen, toggleCommandPalette, theme, setTheme, sidebarOpen, setSidebarOpen } = useUIStore();
  const currentRun = useRunStore((s) => s.currentRun);
  const loadRun = useRunStore((s) => s.loadRun);
  const { settings } = useSettingsStore();
  
  const [newRunDialogOpen, setNewRunDialogOpen] = useState(false);
  const [runsDialogOpen, setRunsDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleExport = useCallback(async () => {
    if (!currentRun) {
      toast.error('No active run to export');
      return;
    }

    try {
      const json = await exportRunToJSON(currentRun.id);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nuzlocke-${currentRun.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Run exported successfully');
    } catch (error) {
      toast.error('Failed to export run');
    }
  }, [currentRun]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const run = await importRunFromJSON(text);
        loadRun(run);
        toast.success(`Imported "${run.name}" successfully`);
      } catch (error) {
        toast.error('Failed to import run. Make sure the file is valid.');
      }
    };
    input.click();
  }, [loadRun]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  const ActiveView = VIEWS[activeTab] || DashboardView;

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        onNewRun={() => setNewRunDialogOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
        onOpenRuns={() => setRunsDialogOpen(true)}
      />

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <ActiveView />
          </motion.div>
        </AnimatePresence>

        {/* Floating button to reopen sidebar when collapsed */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-4 left-4 z-50"
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="bg-background/90 backdrop-blur shadow-lg border"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <NewRunDialog
        open={newRunDialogOpen}
        onOpenChange={setNewRunDialogOpen}
        onRunCreated={() => setActiveTab('dashboard')}
      />

      <RunsDialog
        open={runsDialogOpen}
        onOpenChange={setRunsDialogOpen}
        onNewRun={() => {
          setRunsDialogOpen(false);
          setNewRunDialogOpen(true);
        }}
      />

      <CommandDialog open={commandPaletteOpen} onOpenChange={toggleCommandPalette}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { setActiveTab('dashboard'); toggleCommandPalette(); }}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('map'); toggleCommandPalette(); }}>
              <Map className="mr-2 h-4 w-4" />
              Map
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('team'); toggleCommandPalette(); }}>
              <Users className="mr-2 h-4 w-4" />
              Team
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('encounters'); toggleCommandPalette(); }}>
              <Target className="mr-2 h-4 w-4" />
              Encounters
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('rules'); toggleCommandPalette(); }}>
              <ScrollText className="mr-2 h-4 w-4" />
              Rules
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('timeline'); toggleCommandPalette(); }}>
              <Clock className="mr-2 h-4 w-4" />
              Timeline
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('pokedex'); toggleCommandPalette(); }}>
              <Book className="mr-2 h-4 w-4" />
              Pokédex
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('walkthrough'); toggleCommandPalette(); }}>
              <ScrollText className="mr-2 h-4 w-4" />
              Walkthrough Guide
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab('extras'); toggleCommandPalette(); }}>
              <Sparkles className="mr-2 h-4 w-4" />
              Extra Trackers
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { setNewRunDialogOpen(true); toggleCommandPalette(); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Run
            </CommandItem>
            <CommandItem onSelect={() => { handleExport(); toggleCommandPalette(); }}>
              <Download className="mr-2 h-4 w-4" />
              Export Run
            </CommandItem>
            <CommandItem onSelect={() => { handleImport(); toggleCommandPalette(); }}>
              <Upload className="mr-2 h-4 w-4" />
              Import Run
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tools">
            <CommandItem onSelect={() => { setShareOpen(true); toggleCommandPalette(); }}>
              <Share2 className="mr-2 h-4 w-4" />
              Export & Share
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => { setSettingsOpen(true); toggleCommandPalette(); }}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
            <CommandItem onSelect={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); toggleCommandPalette(); }}>
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Switch to Dark Mode
                </>
              )}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
      
      {/* Export & Share */}
      <ExportShare open={shareOpen} onOpenChange={setShareOpen} />

      {/* AI Chat Assistant */}
      <ChatBar />
    </div>
  );
}

// Wrap App with providers
export function AppWithProviders() {
  const { settings } = useSettingsStore();
  
  return (
    <MilestoneProvider enabled={settings.milestonesEnabled}>
      <App />
    </MilestoneProvider>
  );
}
