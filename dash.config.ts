import { createStyles } from '@dash-ui/react-native';
import type { RNStyles } from '@dash-ui/react-native';
import * as RN from 'react-native';

export const colorSystem = {
  current: 'currentColor',

  black: '#000',
  white: '#fff',

  rose50: '#fff1f2',
  rose100: '#ffe4e6',
  rose200: '#fecdd3',
  rose300: '#fda4af',
  rose400: '#fb7185',
  rose500: '#f43f5e',
  rose600: '#e11d48',
  rose700: '#be123c',
  rose800: '#9f1239',
  rose900: '#881337',

  pink50: '#fdf2f8',
  pink100: '#fce7f3',
  pink200: '#fbcfe8',
  pink300: '#f9a8d4',
  pink400: '#f472b6',
  pink500: '#ec4899',
  pink600: '#db2777',
  pink700: '#be185d',
  pink800: '#9d174d',
  pink900: '#831843',

  fuchsia50: '#fdf4ff',
  fuchsia100: '#fae8ff',
  fuchsia200: '#f5d0fe',
  fuchsia300: '#f0abfc',
  fuchsia400: '#e879f9',
  fuchsia500: '#d946ef',
  fuchsia600: '#c026d3',
  fuchsia700: '#a21caf',
  fuchsia800: '#86198f',
  fuchsia900: '#701a75',

  purple50: '#faf5ff',
  purple100: '#f3e8ff',
  purple200: '#e9d5ff',
  purple300: '#d8b4fe',
  purple400: '#c084fc',
  purple500: '#a855f7',
  purple600: '#9333ea',
  purple700: '#7e22ce',
  purple800: '#6b21a8',
  purple900: '#581c87',

  violet50: '#f5f3ff',
  violet100: '#ede9fe',
  violet200: '#ddd6fe',
  violet300: '#c4b5fd',
  violet400: '#a78bfa',
  violet500: '#8b5cf6',
  violet600: '#7c3aed',
  violet700: '#6d28d9',
  violet800: '#5b21b6',
  violet900: '#4c1d95',

  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo300: '#a5b4fc',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',
  indigo700: '#4338ca',
  indigo800: '#3730a3',
  indigo900: '#312e81',

  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',
  blue900: '#1e3a8a',

  lightBlue50: '#f0f9ff',
  lightBlue100: '#e0f2fe',
  lightBlue200: '#bae6fd',
  lightBlue300: '#7dd3fc',
  lightBlue400: '#38bdf8',
  lightBlue500: '#0ea5e9',
  lightBlue600: '#0284c7',
  lightBlue700: '#0369a1',
  lightBlue800: '#075985',
  lightBlue900: '#0c4a6e',

  cyan50: '#ecfeff',
  cyan100: '#cffafe',
  cyan200: '#a5f3fc',
  cyan300: '#67e8f9',
  cyan400: '#22d3ee',
  cyan500: '#06b6d4',
  cyan600: '#0891b2',
  cyan700: '#0e7490',
  cyan800: '#155e75',
  cyan900: '#164e63',

  teal50: '#f0fdfa',
  teal100: '#ccfbf1',
  teal200: '#99f6e4',
  teal300: '#5eead4',
  teal400: '#2dd4bf',
  teal500: '#14b8a6',
  teal600: '#0d9488',
  teal700: '#0f766e',
  teal800: '#115e59',
  teal900: '#134e4a',

  emerald50: '#ecfdf5',
  emerald100: '#d1fae5',
  emerald200: '#a7f3d0',
  emerald300: '#6ee7b7',
  emerald400: '#34d399',
  emerald500: '#10b981',
  emerald600: '#059669',
  emerald700: '#047857',
  emerald800: '#065f46',
  emerald900: '#064e3b',

  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',
  green900: '#14532d',

  lime50: '#f7fee7',
  lime100: '#ecfccb',
  lime200: '#d9f99d',
  lime300: '#bef264',
  lime400: '#a3e635',
  lime500: '#84cc16',
  lime600: '#65a30d',
  lime700: '#4d7c0f',
  lime800: '#3f6212',
  lime900: '#365314',

  yellow50: '#fefce8',
  yellow100: '#fef9c3',
  yellow200: '#fef08a',
  yellow300: '#fde047',
  yellow400: '#facc15',
  yellow500: '#eab308',
  yellow600: '#ca8a04',
  yellow700: '#a16207',
  yellow800: '#854d0e',
  yellow900: '#713f12',

  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber900: '#78350f',

  orange50: '#fff7ed',
  orange100: '#ffedd5',
  orange200: '#fed7aa',
  orange300: '#fdba74',
  orange400: '#fb923c',
  orange500: '#f97316',
  orange600: '#ea580c',
  orange700: '#c2410c',
  orange800: '#9a3412',
  orange900: '#7c2d12',

  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red300: '#fca5a5',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',
  red800: '#991b1b',
  red900: '#7f1d1d',

  warmGray50: '#fafaf9',
  warmGray100: '#f5f5f4',
  warmGray200: '#e7e5e4',
  warmGray300: '#d6d3d1',
  warmGray400: '#a8a29e',
  warmGray500: '#78716c',
  warmGray600: '#57534e',
  warmGray700: '#44403c',
  warmGray800: '#292524',
  warmGray900: '#1c1917',

  trueGray50: '#fafafa',
  trueGray100: '#f5f5f5',
  trueGray200: '#e5e5e5',
  trueGray300: '#d4d4d4',
  trueGray400: '#a3a3a3',
  trueGray500: '#737373',
  trueGray600: '#525252',
  trueGray700: '#404040',
  trueGray800: '#262626',
  trueGray900: '#171717',

  gray50: '#fafafa',
  gray100: '#f4f4f5',
  gray200: '#e4e4e7',
  gray300: '#d4d4d8',
  gray400: '#a1a1aa',
  gray500: '#71717a',
  gray600: '#52525b',
  gray700: '#3f3f46',
  gray800: '#27272a',
  gray900: '#18181b',

  coolGray50: '#f9fafb',
  coolGray100: '#f3f4f6',
  coolGray200: '#e5e7eb',
  coolGray300: '#d1d5db',
  coolGray400: '#9ca3af',
  coolGray500: '#6b7280',
  coolGray600: '#4b5563',
  coolGray700: '#374151',
  coolGray800: '#1f2937',
  coolGray900: '#111827',

  blueGray50: '#f8fafc',
  blueGray100: '#f1f5f9',
  blueGray200: '#e2e8f0',
  blueGray300: '#cbd5e1',
  blueGray400: '#94a3b8',
  blueGray500: '#64748b',
  blueGray600: '#475569',
  blueGray700: '#334155',
  blueGray800: '#1e293b',
  blueGray900: '#0f172a',

  solarizedPrimary: '#cb4b16',
  solarizedTextPrimary: '#fff',
  solarizedTextAccent: '#839496',
  solarizedBodyBg: '#073642',
  solarizedHeaderBg: '#002B36',
  solarizedAccent: '#002B36',
  solarizedAccentLight: '#647A82',

  iosPrimary: '#5C8EE6',
  iosTextPrimary: '#000',
  iosTextAccent: '#868686',
  iosBodyBg: '#fff',
  iosHeaderBg: '#F3F2F7',
  iosAccent: '#F5F5F5',
  iosAccentLight: '#F5F5F5',

  draculaPrimary: '#ff5555',
  draculaTextPrimary: '#f8f8f2',
  draculaTextAccent: '#bd93f9',
  draculaBodyBg: '#44475a',
  draculaHeaderBg: '#282a36',
  draculaAccent: '#282a36',
  draculaAccentLight: '#6272a4',

  nordPrimary: '#5E81AC',
  nordTextPrimary: '#ECEFF4',
  nordTextAccent: '#81A1C1',
  nordBodyBg: '#434C5E',
  nordHeaderBg: '#3B4252',
  nordAccent: '#2E3440',
  nordAccentLight: '#6272a4',

  auroraPrimary: '#BF616A',
  auroraTextPrimary: '#E5E9F0',
  auroraTextAccent: '#EBCB8B',
  auroraBodyBg: '#D08770',
  auroraHeaderBg: '#D08770',
  auroraAccent: '#A3BE8C',
  auroraAccentLight: '#8FBCBB',

  commentColorHN1: '#7DB9B6',
  commentColorHN2: '#F5E9CF',
  commentColorHN3: '#E96479',
  commentColorHN4: '#4D455D',
  commentColorHN5: '#7DB9B6',
  commentColorHN6: '#F5E9CF',
  commentColorHN7: '#E96479',
  commentColorHN8: '#4D455D',
  commentColorHN9: '#7DB9B6',
  commentColorHN10: '#F5E9CF',
  commentColorHN11: '#E96479',
  commentColorHN12: '#4D455D',

  commentColorForest1: '#D7FBE8',
  commentColorForest2: '#9DF3C4',
  commentColorForest3: '#62D2A2',
  commentColorForest4: '#1FAB89',
  commentColorForest5: '#D7FBE8',
  commentColorForest6: '#9DF3C4',
  commentColorForest7: '#62D2A2',
  commentColorForest8: '#1FAB89',
  commentColorForest9: '#D7FBE8',
  commentColorForest10: '#9DF3C4',
  commentColorForest11: '#62D2A2',
  commentColorForest12: '#1FAB89',

  commentColorMono1: '#F4F4F2',
  commentColorMono2: '#E8E8E8',
  commentColorMono3: '#BBBFCA',
  commentColorMono4: '#495464',
  commentColorMono5: '#F4F4F2',
  commentColorMono6: '#E8E8E8',
  commentColorMono7: '#BBBFCA',
  commentColorMono8: '#495464',
  commentColorMono9: '#F4F4F2',
  commentColorMono10: '#E8E8E8',
  commentColorMono11: '#BBBFCA',
  commentColorMono12: '#495464',

  commentColorSunset1: '#E23E57',
  commentColorSunset2: '#88304E',
  commentColorSunset3: '#522546',
  commentColorSunset4: '#311D3F',
  commentColorSunset5: '#E23E57',
  commentColorSunset6: '#88304E',
  commentColorSunset7: '#522546',
  commentColorSunset8: '#311D3F',
  commentColorSunset9: '#E23E57',
  commentColorSunset10: '#88304E',
  commentColorSunset11: '#522546',
  commentColorSunset12: '#311D3F',

  commentColorSoftie1: '#FFAAA5',
  commentColorSoftie2: '#FFD3B6',
  commentColorSoftie3: '#DCEDC1',
  commentColorSoftie4: '#A8E6CF',
  commentColorSoftie5: '#FFAAA5',
  commentColorSoftie6: '#FFD3B6',
  commentColorSoftie7: '#DCEDC1',
  commentColorSoftie8: '#A8E6CF',
  commentColorSoftie9: '#FFAAA5',
  commentColorSoftie10: '#FFD3B6',
  commentColorSoftie11: '#DCEDC1',
  commentColorSoftie12: '#A8E6CF',

  commentColorMarine1: '#00A8CC',
  commentColorMarine2: '#0C7B93',
  commentColorMarine3: '#27496D',
  commentColorMarine4: '#142850',
  commentColorMarine5: '#00A8CC',
  commentColorMarine6: '#0C7B93',
  commentColorMarine7: '#27496D',
  commentColorMarine8: '#142850',
  commentColorMarine9: '#00A8CC',
  commentColorMarine10: '#0C7B93',
  commentColorMarine11: '#27496D',
  commentColorMarine12: '#142850'
} as const;

export function createTypeSystem(baseSize = 16) {
  const size = {
    '5xs': responsiveSize(0.45 * baseSize),
    '4xs': responsiveSize(0.5 * baseSize),
    '3xs': responsiveSize(0.6 * baseSize),
    '2xs': responsiveSize(0.67 * baseSize),
    xs: responsiveSize(0.75 * baseSize),
    sm: responsiveSize(0.875 * baseSize),
    base: responsiveSize(baseSize),
    lg: responsiveSize(1.125 * baseSize),
    xl: responsiveSize(1.225 * baseSize),
    '2xl': responsiveSize(1.5 * baseSize),
    '3xl': responsiveSize(1.875 * baseSize),
    '4xl': responsiveSize(2.25 * baseSize),
    '5xl': responsiveSize(3 * baseSize),
    '6xl': responsiveSize(4 * baseSize)
  } as const;

  return {
    size,
    leading(fontSize: keyof typeof size, leading: keyof typeof leadingScale) {
      return leadingScale[leading] * size[fontSize];
    },
    tracking: {
      tighter: responsiveSize(-0.05 * baseSize),
      tight: responsiveSize(-0.025 * baseSize),
      normal: responsiveSize(0 * baseSize),
      wide: responsiveSize(0.025 * baseSize),
      wider: responsiveSize(0.05 * baseSize),
      widest: responsiveSize(0.1 * baseSize)
    }
  } as const;
}

const leadingScale = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2
} as const;

export function isIphoneX() {
  const { width, height } = RN.Dimensions.get('window');

  return (
    RN.Platform.OS === 'ios' &&
    !RN.Platform.isPad &&
    !RN.Platform.isTV &&
    (height === 780 ||
      width === 780 ||
      height === 812 ||
      width === 812 ||
      height === 844 ||
      width === 844 ||
      height === 896 ||
      width === 896 ||
      height === 926 ||
      width === 926)
  );
}

export function getStatusBarHeight(safe: boolean) {
  return RN.Platform.select({
    ios: isIphoneX() ? (safe ? 44 : 30) : 20,
    android: RN.StatusBar.currentHeight,
    default: 0
  });
}

export function responsiveSize(fontSize: number, standardScreenHeight = 680) {
  const { height, width } = RN.Dimensions.get('window');
  const standardLength = width > height ? width : height;
  const offset =
    width > height ? 0 : RN.Platform.OS === 'ios' ? 78 : RN.StatusBar.currentHeight || 0;

  const deviceHeight =
    isIphoneX() || RN.Platform.OS === 'android' ? standardLength - offset : standardLength;

  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
}

export const spaceScale = {
  hairline: RN.StyleSheet.hairlineWidth,
  '2xs': responsiveSize(1),
  xs: responsiveSize(2),
  sm: responsiveSize(4),
  md: responsiveSize(8),
  lg: responsiveSize(16),
  xl: responsiveSize(32),
  '2xl': responsiveSize(64),
  '3xl': responsiveSize(128),
  '4xl': responsiveSize(256)
} as const;

export const radiusScale = {
  none: responsiveSize(0),
  primary: responsiveSize(10000 / 16),
  secondary: responsiveSize(16),
  sm: responsiveSize(0.125 * 16),
  base: responsiveSize(0.25 * 16),
  md: responsiveSize(0.375 * 16),
  lg: responsiveSize(0.5 * 16),
  xl: responsiveSize(16),
  full: responsiveSize(10000 / 16)
} as const;

export const zScale = {
  min: 0,
  lower: 1,
  low: 10,
  medium: 100,
  high: 1000,
  higher: 10000,
  max: 2147483647
} as const;

export const borderWidthScale = {
  none: 0,
  // Hairline borders
  hairline: RN.StyleSheet.hairlineWidth
};

export function createShadowScale(
  shadowColor?:
    | RN.ViewStyle['shadowColor']
    | RN.ImageStyle['shadowColor']
    | RN.TextStyle['shadowColor']
): Record<
  'none' | 'primary' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  Pick<RNStyles, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius'>
> {
  return {
    none: {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(0)
      },
      shadowOpacity: 0,
      shadowRadius: responsiveSize(0)
    },
    primary: {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(0)
      },
      shadowOpacity: 0.2,
      shadowRadius: responsiveSize(12)
    },
    xs: {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(0)
      },
      shadowOpacity: 0.5,
      shadowRadius: responsiveSize(1)
    },
    sm: {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(1)
      },
      shadowOpacity: 0.2,
      shadowRadius: responsiveSize(2)
    },
    md: {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(2)
      },
      shadowOpacity: 0.2,
      shadowRadius: responsiveSize(6)
    },
    lg: {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(2)
      },
      shadowOpacity: 0.2,
      shadowRadius: responsiveSize(15)
    },
    xl: {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(10)
      },
      shadowOpacity: 0.2,
      shadowRadius: responsiveSize(25)
    },
    '2xl': {
      shadowColor,
      shadowOffset: {
        width: responsiveSize(0),
        height: responsiveSize(25)
      },
      shadowOpacity: 0.2,
      shadowRadius: responsiveSize(50)
    }
  };
}

export const tokens = {
  color: colorSystem,
  type: createTypeSystem(),
  space: spaceScale,
  radius: radiusScale,
  z: zScale,
  borderWidth: borderWidthScale
};

export const themes: Record<
  'light' | 'dark' | 'black' | 'solarized' | 'dracula' | 'nord' | 'aurora' | 'ios',
  {
    color: {
      primary: RN.ColorValue;
      textPrimary: RN.ColorValue;
      textAccent: RN.ColorValue;
      bodyBg: RN.ColorValue;
      headerBg: RN.ColorValue;
      accent: RN.ColorValue;
      accentLight: RN.ColorValue;
    };
    shadow: ReturnType<typeof createShadowScale>;
  }
> = {
  light: {
    color: {
      primary: colorSystem.orange500,
      textPrimary: colorSystem.black,
      textAccent: colorSystem.warmGray500,
      bodyBg: colorSystem.white,
      headerBg: colorSystem.white,
      accent: colorSystem.warmGray300,
      accentLight: colorSystem.warmGray200
    },

    shadow: createShadowScale()
  },
  dark: {
    color: {
      primary: colorSystem.orange500,
      textPrimary: colorSystem.white,
      textAccent: colorSystem.warmGray400,
      bodyBg: colorSystem.warmGray900,
      headerBg: colorSystem.warmGray900,
      accent: colorSystem.warmGray600,
      accentLight: colorSystem.warmGray700
    },

    shadow: createShadowScale(colorSystem.white)
  },

  black: {
    color: {
      primary: colorSystem.orange500,
      textPrimary: colorSystem.white,
      textAccent: colorSystem.warmGray300,
      bodyBg: colorSystem.black,
      headerBg: colorSystem.black,
      accent: colorSystem.warmGray800,
      accentLight: colorSystem.warmGray600
    },

    shadow: createShadowScale(colorSystem.white)
  },

  solarized: {
    color: {
      primary: colorSystem.solarizedPrimary,
      textPrimary: colorSystem.solarizedTextPrimary,
      textAccent: colorSystem.solarizedTextAccent,
      bodyBg: colorSystem.solarizedBodyBg,
      headerBg: colorSystem.solarizedHeaderBg,
      accent: colorSystem.solarizedAccent,
      accentLight: colorSystem.solarizedAccentLight
    },

    shadow: createShadowScale(colorSystem.white)
  },

  dracula: {
    color: {
      primary: colorSystem.draculaPrimary,
      textPrimary: colorSystem.draculaTextPrimary,
      textAccent: colorSystem.draculaTextAccent,
      bodyBg: colorSystem.draculaBodyBg,
      headerBg: colorSystem.draculaHeaderBg,
      accent: colorSystem.draculaAccent,
      accentLight: colorSystem.draculaAccentLight
    },

    shadow: createShadowScale(colorSystem.white)
  },

  ios: {
    color: {
      primary: colorSystem.iosPrimary,
      textPrimary: colorSystem.iosTextPrimary,
      textAccent: colorSystem.iosTextAccent,
      bodyBg: colorSystem.iosBodyBg,
      headerBg: colorSystem.iosHeaderBg,
      accent: colorSystem.iosAccent,
      accentLight: colorSystem.iosAccentLight
    },

    shadow: createShadowScale(colorSystem.white)
  },

  nord: {
    color: {
      primary: colorSystem.nordPrimary,
      textPrimary: colorSystem.nordTextPrimary,
      textAccent: colorSystem.nordTextAccent,
      bodyBg: colorSystem.nordBodyBg,
      headerBg: colorSystem.nordHeaderBg,
      accent: colorSystem.nordAccent,
      accentLight: colorSystem.nordAccentLight
    },

    shadow: createShadowScale(colorSystem.white)
  },

  aurora: {
    color: {
      primary: colorSystem.auroraPrimary,
      textPrimary: colorSystem.auroraTextPrimary,
      textAccent: colorSystem.auroraTextAccent,
      bodyBg: colorSystem.auroraBodyBg,
      headerBg: colorSystem.auroraHeaderBg,
      accent: colorSystem.auroraAccent,
      accentLight: colorSystem.auroraAccentLight
    },

    shadow: createShadowScale(colorSystem.white)
  }
};

export const { styles, styled, DashProvider, useDash } = createStyles({
  tokens,
  themes
});

export function tokensAreEqual<Props extends {}>(
  [t]: [AppTokens] | [AppTokens, Props],
  [nt]: [AppTokens] | [AppTokens, Props]
) {
  return t === nt;
}

export type AppTokens =
  | typeof styles.tokens.light
  | typeof styles.tokens.dark
  | typeof styles.tokens.black
  | typeof styles.tokens.solarized
  | typeof styles.tokens.dracula
  | typeof styles.tokens.ios
  | typeof styles.tokens.nord
  | typeof styles.tokens.aurora;
export type AppThemes = typeof themes;
export type AppThemeNames = keyof AppThemes;
export type AppColors =
  | keyof typeof styles.tokens.light.color
  | keyof typeof styles.tokens.dark.color
  | keyof typeof styles.tokens.black.color
  | keyof typeof styles.tokens.solarized.color
  | keyof typeof styles.tokens.ios.color
  | keyof typeof styles.tokens.dracula.color
  | keyof typeof styles.tokens.nord.color
  | keyof typeof styles.tokens.aurora.color;
