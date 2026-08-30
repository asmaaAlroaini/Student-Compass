import { useEffect, useLayoutEffect } from 'react';
import { applyTheme } from '@/lib/theme';
import { useThemeStore } from '@/app/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  useLayoutEffect(() => {
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [mode]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'student-compass-theme') return;
      if (event.newValue === 'light' || event.newValue === 'dark' || event.newValue === 'system') {
        setMode(event.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [setMode]);

  return children;
}
