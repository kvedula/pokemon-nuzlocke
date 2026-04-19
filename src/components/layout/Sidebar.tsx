'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useRunStore } from '@/store/runStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map,
  Users,
  Target,
  ScrollText,
  Clock,
  Book,
  BookOpen,
  Sparkles,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Save,
  Download,
  Upload,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, nuzlockeOnly: false },
  { id: 'map', label: 'Map', icon: Map, nuzlockeOnly: false },
  { id: 'walkthrough', label: 'Walkthrough', icon: BookOpen, nuzlockeOnly: false },
  { id: 'team', label: 'Team', icon: Users, nuzlockeOnly: false },
  { id: 'encounters', label: 'Encounters', icon: Target, nuzlockeOnly: false },
  { id: 'extras', label: 'Extras', icon: Sparkles, nuzlockeOnly: false },
  { id: 'rules', label: 'Rules', icon: ScrollText, nuzlockeOnly: true },
  { id: 'timeline', label: 'Timeline', icon: Clock, nuzlockeOnly: false },
  { id: 'pokedex', label: 'Pokédex', icon: Book, nuzlockeOnly: false },
] as const;

interface SidebarProps {
  onNewRun: () => void;
  onExport: () => void;
  onImport: () => void;
  onOpenRuns: () => void;
}

export function Sidebar({ onNewRun, onExport, onImport, onOpenRuns }: SidebarProps) {
  const { sidebarOpen, toggleSidebar, activeTab, setActiveTab, theme, setTheme } = useUIStore();
  const currentRun = useRunStore((s) => s.currentRun);

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 72 }}
      className={cn(
        'h-full bg-sidebar border-r flex flex-col overflow-hidden',
        'transition-colors duration-200'
      )}
    >
      {/* Logo - Clickable to open runs */}
      <div className="shrink-0">
        <Tooltip>
          <TooltipTrigger
            render={
              <button 
                onClick={onOpenRuns}
                className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors w-full text-left"
              >
                {/* Pixelated Master Ball */}
                <div className="w-10 h-10 flex-shrink-0 relative">
                  <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                    {/* Top half - purple */}
                    <rect x="5" y="0" width="6" height="1" fill="#9b4dca"/>
                    <rect x="3" y="1" width="2" height="1" fill="#9b4dca"/>
                    <rect x="5" y="1" width="6" height="1" fill="#d896ff"/>
                    <rect x="11" y="1" width="2" height="1" fill="#9b4dca"/>
                    <rect x="2" y="2" width="1" height="1" fill="#9b4dca"/>
                    <rect x="3" y="2" width="2" height="1" fill="#d896ff"/>
                    <rect x="5" y="2" width="6" height="1" fill="#e8c4ff"/>
                    <rect x="11" y="2" width="2" height="1" fill="#d896ff"/>
                    <rect x="13" y="2" width="1" height="1" fill="#9b4dca"/>
                    <rect x="1" y="3" width="1" height="1" fill="#9b4dca"/>
                    <rect x="2" y="3" width="1" height="1" fill="#d896ff"/>
                    <rect x="3" y="3" width="10" height="1" fill="#e8c4ff"/>
                    <rect x="13" y="3" width="1" height="1" fill="#d896ff"/>
                    <rect x="14" y="3" width="1" height="1" fill="#9b4dca"/>
                    <rect x="1" y="4" width="1" height="1" fill="#9b4dca"/>
                    <rect x="2" y="4" width="12" height="1" fill="#d896ff"/>
                    <rect x="14" y="4" width="1" height="1" fill="#9b4dca"/>
                    <rect x="0" y="5" width="1" height="1" fill="#9b4dca"/>
                    <rect x="1" y="5" width="14" height="1" fill="#d896ff"/>
                    <rect x="15" y="5" width="1" height="1" fill="#9b4dca"/>
                    <rect x="0" y="6" width="1" height="1" fill="#9b4dca"/>
                    <rect x="1" y="6" width="14" height="1" fill="#d896ff"/>
                    <rect x="15" y="6" width="1" height="1" fill="#9b4dca"/>
                    {/* Center band - black with white circle */}
                    <rect x="0" y="7" width="5" height="2" fill="#1a1a1a"/>
                    <rect x="5" y="7" width="1" height="1" fill="#333"/>
                    <rect x="6" y="6" width="1" height="1" fill="#333"/>
                    <rect x="6" y="7" width="4" height="2" fill="#fff"/>
                    <rect x="7" y="6" width="2" height="1" fill="#fff"/>
                    <rect x="7" y="9" width="2" height="1" fill="#fff"/>
                    <rect x="10" y="7" width="1" height="1" fill="#333"/>
                    <rect x="9" y="6" width="1" height="1" fill="#333"/>
                    <rect x="11" y="7" width="5" height="2" fill="#1a1a1a"/>
                    {/* Bottom half - white */}
                    <rect x="0" y="9" width="1" height="1" fill="#ccc"/>
                    <rect x="1" y="9" width="14" height="1" fill="#f0f0f0"/>
                    <rect x="15" y="9" width="1" height="1" fill="#ccc"/>
                    <rect x="0" y="10" width="1" height="1" fill="#ccc"/>
                    <rect x="1" y="10" width="14" height="1" fill="#fff"/>
                    <rect x="15" y="10" width="1" height="1" fill="#ccc"/>
                    <rect x="1" y="11" width="1" height="1" fill="#ccc"/>
                    <rect x="2" y="11" width="12" height="1" fill="#fff"/>
                    <rect x="14" y="11" width="1" height="1" fill="#ccc"/>
                    <rect x="1" y="12" width="1" height="1" fill="#ccc"/>
                    <rect x="2" y="12" width="1" height="1" fill="#f0f0f0"/>
                    <rect x="3" y="12" width="10" height="1" fill="#fff"/>
                    <rect x="13" y="12" width="1" height="1" fill="#f0f0f0"/>
                    <rect x="14" y="12" width="1" height="1" fill="#ccc"/>
                    <rect x="2" y="13" width="1" height="1" fill="#ccc"/>
                    <rect x="3" y="13" width="2" height="1" fill="#f0f0f0"/>
                    <rect x="5" y="13" width="6" height="1" fill="#fff"/>
                    <rect x="11" y="13" width="2" height="1" fill="#f0f0f0"/>
                    <rect x="13" y="13" width="1" height="1" fill="#ccc"/>
                    <rect x="3" y="14" width="2" height="1" fill="#ccc"/>
                    <rect x="5" y="14" width="6" height="1" fill="#f0f0f0"/>
                    <rect x="11" y="14" width="2" height="1" fill="#ccc"/>
                    <rect x="5" y="15" width="6" height="1" fill="#ccc"/>
                  </svg>
                </div>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h1 className="font-bold text-lg">Nuzlocke</h1>
                    <p className="text-xs text-muted-foreground">
                      {currentRun ? currentRun.name : 'Click to view runs'}
                    </p>
                  </motion.div>
                )}
              </button>
            }
          />
          {!sidebarOpen && (
            <TooltipContent side="right">View All Runs</TooltipContent>
          )}
        </Tooltip>
      </div>

      <Separator className="shrink-0" />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {/* New Run Button */}
        <div className="p-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={onNewRun}
                  className={cn(
                    'w-full justify-start gap-3',
                    !sidebarOpen && 'justify-center px-0'
                  )}
                >
                  <Plus className="w-4 h-4" />
                  {sidebarOpen && <span>New Run</span>}
                </Button>
              }
            />
            {!sidebarOpen && (
              <TooltipContent side="right">New Run</TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
        {NAV_ITEMS.filter((item) => 
          !item.nuzlockeOnly || currentRun?.gameMode === 'nuzlocke'
        ).map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger
              render={
                <button
                  onClick={() => setActiveTab(item.id)}
                  disabled={!currentRun && item.id !== 'pokedex'}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                    'transition-colors duration-200',
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                    !currentRun && item.id !== 'pokedex' && 'opacity-50 cursor-not-allowed',
                    !sidebarOpen && 'justify-center px-0'
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              }
            />
            {!sidebarOpen && (
              <TooltipContent side="right">{item.label}</TooltipContent>
            )}
          </Tooltip>
        ))}
        </nav>
      </div>

      {/* Bottom section - fixed */}
      <Separator className="shrink-0" />

      {/* Bottom Actions */}
      <div className="shrink-0 p-3 space-y-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={onExport}
                disabled={!currentRun}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                  'hover:bg-muted text-muted-foreground hover:text-foreground',
                  'transition-colors duration-200',
                  !currentRun && 'opacity-50 cursor-not-allowed',
                  !sidebarOpen && 'justify-center px-0'
                )}
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>Export</span>}
              </button>
            }
          />
          {!sidebarOpen && (
            <TooltipContent side="right">Export Run</TooltipContent>
          )}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={onImport}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                  'hover:bg-muted text-muted-foreground hover:text-foreground',
                  'transition-colors duration-200',
                  !sidebarOpen && 'justify-center px-0'
                )}
              >
                <Upload className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>Import</span>}
              </button>
            }
          />
          {!sidebarOpen && (
            <TooltipContent side="right">Import Run</TooltipContent>
          )}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                  'hover:bg-muted text-muted-foreground hover:text-foreground',
                  'transition-colors duration-200',
                  !sidebarOpen && 'justify-center px-0'
                )}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 flex-shrink-0" />
                )}
                {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
            }
          />
          {!sidebarOpen && (
            <TooltipContent side="right">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      <Separator className="shrink-0" />

      {/* Collapse Toggle */}
      <div className="shrink-0 p-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={toggleSidebar}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                  'hover:bg-muted text-muted-foreground hover:text-foreground',
                  'transition-colors duration-200',
                  !sidebarOpen && 'justify-center px-0'
                )}
              >
                {sidebarOpen ? (
                  <>
                    <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                    <span>Collapse</span>
                  </>
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
            }
          />
          {!sidebarOpen && (
            <TooltipContent side="right">Expand Sidebar</TooltipContent>
          )}
        </Tooltip>
      </div>
    </motion.aside>
  );
}
