// Single source of truth for all theme definitions.
// CSS variables are applied via [data-theme][data-mode] selectors in globals.css.
// This file provides JS access to those values for programmatic use.

export type ThemeId = 'sage' | 'blush' | 'dusk' | 'honey';
export type ColorMode = 'light' | 'dark';

export const DEFAULT_THEME: ThemeId = 'sage';
export const DEFAULT_MODE: ColorMode = 'light';

export const STORAGE_KEY_THEME = 'solace-theme';
export const STORAGE_KEY_MODE  = 'solace-mode';

export interface ThemeTokens {
  bg: string;
  surface: string;
  surface2: string;
  accent: string;
  accentSoft: string;
  accentWash: string;
  ink: string;
  inkSoft: string;
  inkMuted: string;
  inkFaint: string;
  inkBorder: string;
  paper: string;
  paperRule: string;
  warmHl: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  swatch: [string, string]; // [accent, surface] — for picker preview circles
  light: ThemeTokens;
  dark: ThemeTokens;
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: 'sage',
    label: 'Sage',
    swatch: ['#7a9e7e', '#eee8d8'],
    light: {
      bg: '#f5f0e8', surface: '#eee8d8', surface2: '#e6dec8',
      accent: '#7a9e7e', accentSoft: '#b8cdb8', accentWash: 'rgba(122,158,126,0.16)',
      ink: '#3a3a32',
      inkSoft: 'rgba(58,58,50,0.72)', inkMuted: 'rgba(58,58,50,0.55)',
      inkFaint: 'rgba(58,58,50,0.28)', inkBorder: 'rgba(58,58,50,0.14)',
      paper: '#fdf8f0', paperRule: 'rgba(58,58,50,0.07)', warmHl: 'rgba(255,240,200,0.4)',
    },
    dark: {
      bg: '#1e2420', surface: '#252e27', surface2: '#2d362f',
      accent: '#9dbc9f', accentSoft: '#5d7561', accentWash: 'rgba(157,188,159,0.18)',
      ink: '#ebe6dc',
      inkSoft: 'rgba(235,230,220,0.78)', inkMuted: 'rgba(235,230,220,0.58)',
      inkFaint: 'rgba(235,230,220,0.28)', inkBorder: 'rgba(235,230,220,0.14)',
      paper: '#1e1a14', paperRule: 'rgba(235,230,220,0.06)', warmHl: 'rgba(120,100,60,0.18)',
    },
  },
  {
    id: 'blush',
    label: 'Blush',
    swatch: ['#c4848a', '#f7e4e4'],
    light: {
      bg: '#fdf0f0', surface: '#f7e4e4', surface2: '#f0d7d7',
      accent: '#c4848a', accentSoft: '#e0b8bc', accentWash: 'rgba(196,132,138,0.16)',
      ink: '#3a2e2e',
      inkSoft: 'rgba(58,46,46,0.72)', inkMuted: 'rgba(58,46,46,0.55)',
      inkFaint: 'rgba(58,46,46,0.28)', inkBorder: 'rgba(58,46,46,0.14)',
      paper: '#fef4f2', paperRule: 'rgba(58,46,46,0.07)', warmHl: 'rgba(255,220,220,0.4)',
    },
    dark: {
      bg: '#221e1e', surface: '#2d2323', surface2: '#382929',
      accent: '#d4a0a4', accentSoft: '#6e4c50', accentWash: 'rgba(212,160,164,0.18)',
      ink: '#f0e6e2',
      inkSoft: 'rgba(240,230,226,0.78)', inkMuted: 'rgba(240,230,226,0.55)',
      inkFaint: 'rgba(240,230,226,0.28)', inkBorder: 'rgba(240,230,226,0.14)',
      paper: '#221816', paperRule: 'rgba(240,230,226,0.06)', warmHl: 'rgba(150,80,80,0.18)',
    },
  },
  {
    id: 'dusk',
    label: 'Dusk',
    swatch: ['#7a9abf', '#e3e9f3'],
    light: {
      bg: '#f0f3f8', surface: '#e3e9f3', surface2: '#d6deeb',
      accent: '#7a9abf', accentSoft: '#b9c9de', accentWash: 'rgba(122,154,191,0.16)',
      ink: '#2e3640',
      inkSoft: 'rgba(46,54,64,0.72)', inkMuted: 'rgba(46,54,64,0.55)',
      inkFaint: 'rgba(46,54,64,0.28)', inkBorder: 'rgba(46,54,64,0.14)',
      paper: '#f6f8fc', paperRule: 'rgba(46,54,64,0.07)', warmHl: 'rgba(200,215,240,0.4)',
    },
    dark: {
      bg: '#1a1e26', surface: '#222735', surface2: '#2b3142',
      accent: '#9ab4d4', accentSoft: '#5a6d8a', accentWash: 'rgba(154,180,212,0.18)',
      ink: '#e6ebf2',
      inkSoft: 'rgba(230,235,242,0.78)', inkMuted: 'rgba(230,235,242,0.55)',
      inkFaint: 'rgba(230,235,242,0.28)', inkBorder: 'rgba(230,235,242,0.14)',
      paper: '#1a1d24', paperRule: 'rgba(230,235,242,0.06)', warmHl: 'rgba(80,100,140,0.18)',
    },
  },
  {
    id: 'honey',
    label: 'Honey',
    swatch: ['#c49a3c', '#f7edcc'],
    light: {
      bg: '#fdf6e3', surface: '#f7edcc', surface2: '#f0e2b3',
      accent: '#c49a3c', accentSoft: '#e1c479', accentWash: 'rgba(196,154,60,0.16)',
      ink: '#3a3220',
      inkSoft: 'rgba(58,50,32,0.72)', inkMuted: 'rgba(58,50,32,0.55)',
      inkFaint: 'rgba(58,50,32,0.28)', inkBorder: 'rgba(58,50,32,0.14)',
      paper: '#fdf8e8', paperRule: 'rgba(58,50,32,0.08)', warmHl: 'rgba(255,235,180,0.4)',
    },
    dark: {
      bg: '#221e14', surface: '#2d2818', surface2: '#3a3220',
      accent: '#d4b06a', accentSoft: '#7a6438', accentWash: 'rgba(212,176,106,0.18)',
      ink: '#f0e9d4',
      inkSoft: 'rgba(240,233,212,0.78)', inkMuted: 'rgba(240,233,212,0.55)',
      inkFaint: 'rgba(240,233,212,0.28)', inkBorder: 'rgba(240,233,212,0.14)',
      paper: '#221c10', paperRule: 'rgba(240,233,212,0.06)', warmHl: 'rgba(150,120,60,0.18)',
    },
  },
];

export function getThemeDefinition(id: ThemeId): ThemeDefinition {
  return THEME_DEFINITIONS.find(d => d.id === id) ?? THEME_DEFINITIONS[0];
}

export function getTokens(id: ThemeId, mode: ColorMode): ThemeTokens {
  return getThemeDefinition(id)[mode];
}
