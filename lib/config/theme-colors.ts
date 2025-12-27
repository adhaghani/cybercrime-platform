export type ThemeColor = 'blue' | 'green' | 'orange' | 'red' | 'violet';
export type TextSize = 'small' | 'medium' | 'large';

export interface ThemeColorConfig {
  name: string;
  light: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    sidebarPrimary: string;
    sidebarAccent: string;
    ring: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    sidebarPrimary: string;
    sidebarAccent: string;
    ring: string;
  };
}

export const THEME_COLORS: Record<ThemeColor, ThemeColorConfig> = {
  blue: {
    name: 'Blue',
    light: {
      primary: 'oklch(0.55 0.22 251.04)', // blue-600
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.96 0.01 251.04)',
      secondaryForeground: 'oklch(0.31 0.18 251.04)',
      accent: 'oklch(0.88 0.05 251.04)',
      accentForeground: 'oklch(0.31 0.18 251.04)',
      sidebarPrimary: 'oklch(0.55 0.22 251.04)',
      sidebarAccent: 'oklch(0.88 0.05 251.04)',
      ring: 'oklch(0.55 0.22 251.04)',
    },
    dark: {
      primary: 'oklch(0.63 0.25 251.84)', // blue-500
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.30 0.03 252.00)',
      secondaryForeground: 'oklch(0.93 0 0)',
      accent: 'oklch(0.33 0.07 252.00)',
      accentForeground: 'oklch(0.93 0 0)',
      sidebarPrimary: 'oklch(0.63 0.25 251.84)',
      sidebarAccent: 'oklch(0.33 0.07 252.00)',
      ring: 'oklch(0.63 0.25 251.84)',
    },
  },
  green: {
    name: 'Green',
    light: {
      primary: 'oklch(0.55 0.15 155.41)', // green-600
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.96 0.01 155.41)',
      secondaryForeground: 'oklch(0.31 0.12 155.41)',
      accent: 'oklch(0.88 0.03 155.41)',
      accentForeground: 'oklch(0.31 0.12 155.41)',
      sidebarPrimary: 'oklch(0.55 0.15 155.41)',
      sidebarAccent: 'oklch(0.88 0.03 155.41)',
      ring: 'oklch(0.55 0.15 155.41)',
    },
    dark: {
      primary: 'oklch(0.70 0.17 156.57)', // green-500
      primaryForeground: 'oklch(0.10 0 0)',
      secondary: 'oklch(0.30 0.03 155.00)',
      secondaryForeground: 'oklch(0.93 0 0)',
      accent: 'oklch(0.33 0.06 155.00)',
      accentForeground: 'oklch(0.93 0 0)',
      sidebarPrimary: 'oklch(0.70 0.17 156.57)',
      sidebarAccent: 'oklch(0.33 0.06 155.00)',
      ring: 'oklch(0.70 0.17 156.57)',
    },
  },
  orange: {
    name: 'Orange',
    light: {
      primary: 'oklch(0.64 0.18 48.48)', // orange-600
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.96 0.01 48.48)',
      secondaryForeground: 'oklch(0.40 0.15 48.48)',
      accent: 'oklch(0.88 0.04 48.48)',
      accentForeground: 'oklch(0.40 0.15 48.48)',
      sidebarPrimary: 'oklch(0.64 0.18 48.48)',
      sidebarAccent: 'oklch(0.88 0.04 48.48)',
      ring: 'oklch(0.64 0.18 48.48)',
    },
    dark: {
      primary: 'oklch(0.75 0.20 56.35)', // orange-500
      primaryForeground: 'oklch(0.10 0 0)',
      secondary: 'oklch(0.30 0.03 48.00)',
      secondaryForeground: 'oklch(0.93 0 0)',
      accent: 'oklch(0.33 0.06 48.00)',
      accentForeground: 'oklch(0.93 0 0)',
      sidebarPrimary: 'oklch(0.75 0.20 56.35)',
      sidebarAccent: 'oklch(0.33 0.06 48.00)',
      ring: 'oklch(0.75 0.20 56.35)',
    },
  },
  red: {
    name: 'Red',
    light: {
      primary: 'oklch(0.55 0.22 22.18)', // red-600
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.96 0.01 22.18)',
      secondaryForeground: 'oklch(0.40 0.18 22.18)',
      accent: 'oklch(0.88 0.04 22.18)',
      accentForeground: 'oklch(0.40 0.18 22.18)',
      sidebarPrimary: 'oklch(0.55 0.22 22.18)',
      sidebarAccent: 'oklch(0.88 0.04 22.18)',
      ring: 'oklch(0.55 0.22 22.18)',
    },
    dark: {
      primary: 'oklch(0.68 0.25 27.32)', // red-500
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.30 0.03 22.00)',
      secondaryForeground: 'oklch(0.93 0 0)',
      accent: 'oklch(0.33 0.06 22.00)',
      accentForeground: 'oklch(0.93 0 0)',
      sidebarPrimary: 'oklch(0.68 0.25 27.32)',
      sidebarAccent: 'oklch(0.33 0.06 22.00)',
      ring: 'oklch(0.68 0.25 27.32)',
    },
  },
  violet: {
    name: 'Violet',
    light: {
      primary: 'oklch(0.51 0.21 293.22)', // violet-600
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.96 0.01 293.22)',
      secondaryForeground: 'oklch(0.35 0.17 293.22)',
      accent: 'oklch(0.88 0.04 293.22)',
      accentForeground: 'oklch(0.35 0.17 293.22)',
      sidebarPrimary: 'oklch(0.51 0.21 293.22)',
      sidebarAccent: 'oklch(0.88 0.04 293.22)',
      ring: 'oklch(0.51 0.21 293.22)',
    },
    dark: {
      primary: 'oklch(0.62 0.24 296.06)', // violet-500
      primaryForeground: 'oklch(1.00 0 0)',
      secondary: 'oklch(0.30 0.03 293.00)',
      secondaryForeground: 'oklch(0.93 0 0)',
      accent: 'oklch(0.33 0.06 293.00)',
      accentForeground: 'oklch(0.93 0 0)',
      sidebarPrimary: 'oklch(0.62 0.24 296.06)',
      sidebarAccent: 'oklch(0.33 0.06 293.00)',
      ring: 'oklch(0.62 0.24 296.06)',
    },
  },
};

export const TEXT_SIZE_CONFIG = {
  small: {
    base: '14px',
    scale: '0.875',
  },
  medium: {
    base: '16px',
    scale: '1',
  },
  large: {
    base: '18px',
    scale: '1.125',
  },
};

export const DEFAULT_THEME_COLOR: ThemeColor = 'blue';
export const DEFAULT_TEXT_SIZE: TextSize = 'medium';
