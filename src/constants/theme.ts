/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Bakery brand palette — the warm cream/brown/orange direction already used on the home
 * screen (`src/app/index.tsx`). Lifted here so every recipe/category screen shares one
 * source of truth instead of each file re-declaring its own local COLORS constant.
 */
export const BakeryColors = {
  cream: '#F7F1E8',
  warmWhite: '#FFFDF8',
  card: '#F8F0E6',
  brown: '#2B2118',
  brownMuted: '#5F4A3B',
  textSecondary: '#7A6652',
  orange: '#B85F1D',
  orangeAccent: '#B86B38',
  peach: '#F3D1A5',
  navInactive: '#9B928A',
} as const;

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/** Per-difficulty accent used for the small chip on recipe cards. */
export const DifficultyColors: Record<DifficultyLevel, { bg: string; text: string }> = {
  beginner: { bg: '#DDEBD2', text: '#3F6B2A' },
  intermediate: { bg: BakeryColors.peach, text: '#8A4A1E' },
  advanced: { bg: '#F0CFC4', text: '#93381E' },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/**
 * Bakery typography roles. Reuses the platform-native serif/sans families already
 * declared in `Fonts` above (no new font packages, no risk to native builds) — display
 * copy (recipe titles, screen headings) reads as an editorial serif instead of the
 * default system sans used everywhere before this.
 */
export const BakeryFonts = {
  display: Fonts.serif,
  body: Fonts.sans,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
