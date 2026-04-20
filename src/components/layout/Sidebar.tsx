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
  Share2,
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
  onSettings?: () => void;
  onShare?: () => void;
}

export function Sidebar({ onNewRun, onExport, onImport, onOpenRuns, onSettings, onShare }: SidebarProps) {
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
                className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-all w-full text-left group"
              >
                {/* Animated Pokeball */}
                <motion.div 
                  className="w-11 h-11 flex-shrink-0 relative"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-lg group-hover:blur-xl transition-all opacity-60 group-hover:opacity-100" />
                  
                  {/* Pokeball SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-lg">
                    <defs>
                      <linearGradient id="topGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                      <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f5f5f5" />
                        <stop offset="100%" stopColor="#e5e5e5" />
                      </linearGradient>
                      <filter id="innerShadow">
                        <feOffset dx="0" dy="2"/>
                        <feGaussianBlur stdDeviation="2" result="offset-blur"/>
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                        <feFlood floodColor="black" floodOpacity="0.2" result="color"/>
                        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                      </filter>
                    </defs>
                    
                    {/* Ball outline */}
                    <circle cx="50" cy="50" r="47" fill="none" stroke="#1f1f1f" strokeWidth="3"/>
                    
                    {/* Top half - purple gradient */}
                    <path d="M 50 3 A 47 47 0 0 1 97 50 L 3 50 A 47 47 0 0 1 50 3" fill="url(#topGradient)" filter="url(#innerShadow)"/>
                    
                    {/* Shine on top */}
                    <ellipse cx="35" cy="25" rx="15" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-30 35 25)"/>
                    
                    {/* Bottom half - white gradient */}
                    <path d="M 50 97 A 47 47 0 0 1 3 50 L 97 50 A 47 47 0 0 1 50 97" fill="url(#bottomGradient)" filter="url(#innerShadow)"/>
                    
                    {/* Center band */}
                    <rect x="3" y="45" width="94" height="10" fill="#1f1f1f"/>
                    
                    {/* Center button outer */}
                    <circle cx="50" cy="50" r="16" fill="#1f1f1f"/>
                    <circle cx="50" cy="50" r="12" fill="#f5f5f5"/>
                    
                    {/* Center button inner with pulse */}
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="7" 
                      fill="#f5f5f5"
                      stroke="#1f1f1f"
                      strokeWidth="2"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0)', '0 0 0 4px rgba(168, 85, 247, 0.4)', '0 0 0 0 rgba(168, 85, 247, 0)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Button highlight */}
                    <circle cx="47" cy="47" r="3" fill="rgba(255,255,255,0.6)"/>
                  </svg>
                </motion.div>
                
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="overflow-hidden"
                  >
                    <h1 className="font-extrabold text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                      Nuzlocke
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentRun ? (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {currentRun.name}
                        </span>
                      ) : (
                        'Click to view runs'
                      )}
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

        {onShare && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={onShare}
                  disabled={!currentRun}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                    'hover:bg-muted text-muted-foreground hover:text-foreground',
                    'transition-colors duration-200',
                    !currentRun && 'opacity-50 cursor-not-allowed',
                    !sidebarOpen && 'justify-center px-0'
                  )}
                >
                  <Share2 className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span>Share</span>}
                </button>
              }
            />
            {!sidebarOpen && (
              <TooltipContent side="right">Export & Share</TooltipContent>
            )}
          </Tooltip>
        )}

        {onSettings && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={onSettings}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                    'hover:bg-muted text-muted-foreground hover:text-foreground',
                    'transition-colors duration-200',
                    !sidebarOpen && 'justify-center px-0'
                  )}
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span>Settings</span>}
                </button>
              }
            />
            {!sidebarOpen && (
              <TooltipContent side="right">Settings</TooltipContent>
            )}
          </Tooltip>
        )}

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
