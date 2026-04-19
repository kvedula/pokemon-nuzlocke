import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ActiveTab = 'dashboard' | 'map' | 'walkthrough' | 'team' | 'encounters' | 'extras' | 'rules' | 'timeline' | 'pokedex';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  selectedLocationId: string | null;
  selectedPokemonId: string | null;
  mapZoom: number;
  mapPosition: { x: number; y: number };
  commandPaletteOpen: boolean;
  activeTab: ActiveTab;
  detailPanelOpen: boolean;
  animations: boolean;
  soundEnabled: boolean;
  
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  selectLocation: (id: string | null) => void;
  selectPokemon: (id: string | null) => void;
  setMapZoom: (zoom: number) => void;
  setMapPosition: (position: { x: number; y: number }) => void;
  toggleCommandPalette: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  setDetailPanelOpen: (open: boolean) => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      selectedLocationId: null,
      selectedPokemonId: null,
      mapZoom: 1,
      mapPosition: { x: 0, y: 0 },
      commandPaletteOpen: false,
      activeTab: 'dashboard',
      detailPanelOpen: false,
      animations: true,
      soundEnabled: false,

      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      selectLocation: (id) => set({ selectedLocationId: id, detailPanelOpen: id !== null }),
      
      selectPokemon: (id) => set({ selectedPokemonId: id, detailPanelOpen: id !== null }),
      
      setMapZoom: (zoom) => set({ mapZoom: Math.max(0.5, Math.min(3, zoom)) }),
      
      setMapPosition: (position) => set({ mapPosition: position }),
      
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
      
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'nuzlocke-ui-settings',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        animations: state.animations,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
