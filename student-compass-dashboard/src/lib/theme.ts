export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'student-compass-theme';

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return 'system';
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === 'system' ? getSystemTheme() : mode;
}

export function applyTheme(mode: ThemeMode): ResolvedTheme {
  const resolved = resolveTheme(mode);
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  root.dataset.theme = resolved;
  return resolved;
}

export function persistTheme(mode: ThemeMode): void {
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  if (mode === 'light') return 'dark';
  if (mode === 'dark') return 'system';
  return 'light';
}
