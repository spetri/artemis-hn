import { useAsync } from '@react-hook/async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useLayoutEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colorSystem, createTypeSystem, useDash } from '../../../dash.config';
import { type StackParamList } from '../routers';

type ThumbnailSizeType = 55 | 65 | 75;
type PositionType = 'Left' | 'Right';

enum Position {
  LEFT = 'Left',
  RIGHT = 'Right'
}

export const preferencesVersion = '1.1';
export const defaultPreferences: SetThemeType = {
  cachedThreadId: null,
  displayLargeThumbnails: false,
  thumbnailSize: 55,
  displaySource: true,
  displayReplies: false,
  jumpButtonPosition: Position.RIGHT,
  thumbnailPosition: Position.LEFT,
  showJumpButton: true,
  colorScheme: undefined,
  openLinkInBrowser: false,
  primaryColor: 'orange500',
  commentColors: [
    'commentColorHN1',
    'commentColorHN2',
    'commentColorHN3',
    'commentColorHN4',
    'commentColorHN5',
    'commentColorHN6',
    'commentColorHN7',
    'commentColorHN8',
    'commentColorHN9',
    'commentColorHN10',
    'commentColorHN11',
    'commentColorHN12'
  ],
  baseTypeSize: 14
};

export type SetThemeType = {
  cachedThreadId: number | null;
  displayReplies: boolean;
  displayLargeThumbnails: boolean;
  displaySource: boolean;
  openLinkInBrowser: boolean;
  jumpButtonPosition: PositionType;
  thumbnailPosition: PositionType;
  thumbnailSize: ThumbnailSizeType;
  colorScheme:
  | 'dark'
  | 'light'
  | 'black'
  | 'solarized'
  | 'dracula'
  | 'nord'
  | 'aurora'
  | null
  | undefined;
  primaryColor: keyof typeof colorSystem;
  commentColors: string[];
  baseTypeSize: number;
  showJumpButton: boolean;
};

export type SettingsProps = NativeStackScreenProps<StackParamList, 'User'>;

export const useTheme = () => {
  const { setTheme, insertThemes, insertTokens } = useDash();
  const colorScheme = useColorScheme();
  const [storage, loadStorage] = useAsync(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    const data: Record<string, unknown> = {
      data: defaultPreferences,
      version: preferencesVersion
    };

    for (const [key, value] of values) {
      data[key] = value && JSON.parse(value);
    }

    return data as { data: SetThemeType; version: string };
  });

  useLayoutEffect(() => {
    loadStorage();
  }, []);

  useLayoutEffect(() => {
    const theme = storage.value?.data.colorScheme ?? colorScheme;
    if (theme) {
      setTheme(theme);
    }
  }, [storage.value?.data.colorScheme, colorScheme]);

  useLayoutEffect(() => {
    const baseTypeSize = storage.value?.data.baseTypeSize;
    if (baseTypeSize) {
      insertTokens({
        type: createTypeSystem(baseTypeSize)
      });
    }
  }, [storage.value?.data.baseTypeSize]);

  useLayoutEffect(() => {
    const primaryColor = storage.value?.data.primaryColor;
    if (primaryColor) {
      insertThemes({
        black: { color: { primary: colorSystem[primaryColor] } },
        dark: { color: { primary: colorSystem[primaryColor] } },
        light: { color: { primary: colorSystem[primaryColor] } }
      });
    }
  }, [storage.value?.data.primaryColor]);

  return useMemo(() => {
    const { value, ...rest } = storage;
    return [{ ...rest, data: value?.data, version: value?.version }, loadStorage] as const;
  }, [storage, loadStorage]);
};