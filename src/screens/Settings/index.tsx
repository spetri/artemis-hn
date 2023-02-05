import { useAsync } from "@react-hook/async";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import { NavigableHeader } from "../../components/NavigableHeader";
import {
  useDash,
  createTypeSystem,
  colorSystem,
  styles,
} from "../../../dash.config";

import { StackParamList } from "../routers";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  TextStyle,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewStyle,
  Switch,
} from "react-native";

export function usePreferences() {
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
}

const preferencesVersion = "1.0";
const defaultPreferences: PreferencesType = {
  colorScheme: undefined,
  primaryColor: "orange500",
  baseTypeSize: 16,
};
const primaryColors: (keyof typeof colorSystem)[] = [
  "orange500",
  "amber500",
  "emerald500",
  "blue500",
  "cyan500",
  "teal500",
  "green500",
  "lime600",
  "red600",
  "lightBlue500",
  "violet500",
  "purple500",
  "indigo500",
  "fuchsia500",
  "pink500",
  "rose500",
];

export type PreferencesType = {
  colorScheme: "dark" | "light" | null | undefined;
  primaryColor: keyof typeof colorSystem;
  baseTypeSize: number;
};

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: "100%",
  width: "100%",
}));

const preferencesContainer = styles.one<ViewStyle>((t) => ({
  paddingTop: t.space.lg,
  width: "100%",
}));

const slider: ViewStyle = { width: "100%", height: 40 };
const sliderContainer: ViewStyle = {
  width: "100%",
  flexGrow: 1,
  flexShrink: 1,
};

const preferenceGroup = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.accentLight,
  padding: t.space.lg,
  margin: t.space.lg,
  marginTop: 0,
  borderRadius: t.radius.xl,
}));

const preferenceLabel = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.base,
  fontWeight: "700",
  width: "100%",
}));

const preferenceDescription = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: "400",
  width: "100%",
  marginTop: t.space.sm,
}));

const preferenceRow = styles.lazy<"center" | "start", ViewStyle>(
  (variant) => () => ({
    flexDirection: "row",
    alignItems: variant === "center" ? "center" : "flex-start",
  })
);

const preferenceLabelContainer = styles.one<ViewStyle>((t) => ({
  flexDirection: "column",
  flexGrow: 1,
  flexShrink: 1,
  flexWrap: "wrap",
  minWidth: 128,
  marginRight: t.space.lg,
}));

const colorSwatches = styles.one<ViewStyle>((t) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: t.space.lg,
}));

const colorSwatch = styles.lazy<
  { color: string; size: number; selected: boolean },
  ViewStyle
>(({ color, size, selected }) => (t) => ({
  width: size,
  height: size,
  marginBottom: t.space.md,
  backgroundColor: (t.color as any)[color],
  borderColor: selected ? t.color.textPrimary : "transparent",
  borderWidth: 6,
  borderRadius: t.radius.primary,
}));

const resetToDefault = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontWeight: "500",
}));

const version = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  textAlign: "center",
  marginBottom: t.space["2xl"],
}));

export interface SettingsProps
  extends NativeStackScreenProps<StackParamList, "User"> {}
