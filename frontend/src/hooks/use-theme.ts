'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  type ThemeId,
  type ColorMode,
  DEFAULT_THEME,
  DEFAULT_MODE,
  STORAGE_KEY_THEME,
  STORAGE_KEY_MODE,
} from '@/src/config/themes';

export type { ThemeId, ColorMode };

export interface UseThemeReturn {
  theme: ThemeId;
  mode: ColorMode;
  setTheme: (t: ThemeId) => void;
  setMode: (m: ColorMode) => void;
  toggleMode: () => void;
}

function readLocal(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mode,  setModeState]  = useState<ColorMode>(DEFAULT_MODE);

  // Hydrate from localStorage on first client render
  useEffect(() => {
    setThemeState(readLocal(STORAGE_KEY_THEME, DEFAULT_THEME) as ThemeId);
    setModeState(readLocal(STORAGE_KEY_MODE,  DEFAULT_MODE)  as ColorMode);
  }, []);

  // Apply to <html> and persist whenever either value changes
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = theme;
    html.dataset.mode  = mode;
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      localStorage.setItem(STORAGE_KEY_MODE,  mode);
    } catch { /* private browsing — ignore */ }
  }, [theme, mode]);

  const setTheme    = useCallback((t: ThemeId)   => setThemeState(t), []);
  const setMode     = useCallback((m: ColorMode) => setModeState(m),  []);
  const toggleMode  = useCallback(() => setModeState(m => m === 'light' ? 'dark' : 'light'), []);

  return { theme, mode, setTheme, setMode, toggleMode };
}
