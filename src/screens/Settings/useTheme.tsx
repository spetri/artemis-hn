import { useAsync } from "@react-hook/async";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDash, createTypeSystem, colorSystem } from "../../../dash.config";

import { useLayoutEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { StackParamList } from "../routers";

export const preferencesVersion = "1.1";
export const defaultPreferences: SetThemeType = {
  displayReplies: false,
  colorScheme: undefined,
  primaryColor: "orange500",
  commentColor: [
    "#233cfb",
    "#ff7d2d",
    "#fac846",
    "#a0c382",
    "#5f9b8c",
    "#233cfb",
    "#ff7d2d",
    "#fac846",
    "#a0c382",
    "#5f9b8c",
  ],
  baseTypeSize: 14,
};

export type SetThemeType = {
  displayReplies: boolean;
  colorScheme:
    | "dark"
    | "light"
    | "black"
    | "solarized"
    | "dracula"
    | "nord"
    | "aurora"
    | null
    | undefined;
  primaryColor: keyof typeof colorSystem;
  commentColor: string[];
  baseTypeSize: number;
};

export interface SettingsProps
  extends NativeStackScreenProps<StackParamList, "User"> {}

export const useTheme = () => {
  const { setTheme, insertThemes, insertTokens } = useDash();
  const colorScheme = useColorScheme();
  const [storage, loadStorage] = useAsync(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    const data: Record<string, unknown> = {
      data: defaultPreferences,
      version: preferencesVersion,
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
        type: createTypeSystem(baseTypeSize),
      });
    }
  }, [storage.value?.data.baseTypeSize]);

  useLayoutEffect(() => {
    const primaryColor = storage.value?.data.primaryColor;
    if (primaryColor) {
      insertThemes({
        black: { color: { primary: colorSystem[primaryColor] } },
        dark: { color: { primary: colorSystem[primaryColor] } },
        light: { color: { primary: colorSystem[primaryColor] } },
      });
    }
  }, [storage.value?.data.primaryColor]);

  return useMemo(() => {
    const { value, ...rest } = storage;
    return [
      { ...rest, data: value?.data, version: value?.version },
      loadStorage,
    ] as const;
  }, [storage, loadStorage]);
};
