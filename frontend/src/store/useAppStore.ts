import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  language: 'tr' | 'en';
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  setLanguage: (language: 'tr' | 'en') => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'tr',
      sidebarOpen: true,
      theme: 'light',
      setLanguage: (language) => set({ language }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
    }
  )
);
