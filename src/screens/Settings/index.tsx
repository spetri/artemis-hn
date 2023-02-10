import { useAsync } from "@react-hook/async";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDash, createTypeSystem, colorSystem } from "../../../dash.config";

import { StackParamList } from "../routers";
import { useLayoutEffect, useMemo } from "react";
import { useColorScheme } from "react-native";

export const preferencesVersion = "1.0";
export const defaultPreferences: PreferencesType = {
  colorScheme: undefined,
  primaryColor: "orange500",
  baseTypeSize: 16,
};

export type PreferencesType = {
  colorScheme: "dark" | "light" | null | undefined;
  primaryColor: keyof typeof colorSystem;
  baseTypeSize: number;
};

export const usePreferences = () => {
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

    return data as { data: PreferencesType; version: string };
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

export interface SettingsProps
  extends NativeStackScreenProps<StackParamList, "User"> {}
