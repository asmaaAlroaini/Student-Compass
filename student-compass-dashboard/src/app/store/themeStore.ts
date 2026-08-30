import { create } from 'zustand';
import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  type ResolvedTheme,
  type ThemeMode,
} from '@/lib/theme';

interface ThemeState {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const initialMode = readStoredTheme();

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  resolved: resolveTheme(initialMode),
  setMode: (mode) => {
    persistTheme(mode);
    const resolved = applyTheme(mode);
    set({ mode, resolved });
  },
}));
