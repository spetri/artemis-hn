import { useAsync } from "@react-hook/async";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListItem } from "@rneui/themed";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { FC, useCallback, useLayoutEffect } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
  Pressable,
} from "react-native";
import { colorSystem, styles } from "../../../../../dash.config";
import { NavigableHeader } from "../../../../components/NavigableHeader";
import { StackParamList } from "../../../routers";
import { ListItemContent } from "@rneui/base/dist/ListItem/ListItem.Content";
import {
  defaultPreferences,
  preferencesVersion,
  SetThemeType,
  useTheme,
} from "../../useTheme";

export interface SettingsProps
  extends NativeStackScreenProps<StackParamList, "User"> {}

export const AppColorSettings: FC<SettingsProps> = () => {
  const [preferences, loadPreferences] = useTheme();
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

  const [, setStorage_] = useAsync(async (preferences: SetThemeType) => {
    const data = Object.entries({
      data: preferences,
      version: preferencesVersion,
    }).map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(data);
    await loadPreferences();
  });

  const setStorage = useCallback(
    (settings: Partial<SetThemeType>) => {
      setStorage_({ ...defaultPreferences, ...preferences?.data, ...settings });
    },
    [setStorage_, preferences?.data]
  );

  useLayoutEffect(() => {
    if (
      preferences.status === "success" &&
      preferences.data &&
      !Object.values(preferences.data).length
    ) {
      setStorage(defaultPreferences);
    }
  }, [preferences, setStorage]);

  return (
    <SafeAreaView style={container()}>
      <NavigableHeader title="Select App Color" />
      <ScrollView>
        {primaryColors.map((color) => (
          <ListItem key={color} bottomDivider containerStyle={containerBg()}>
            <ListItemContent>
              <ListItem containerStyle={containerBg()}>
                <Pressable
                  key={color}
                  onPress={() => {
                    setStorage({
                      primaryColor: color,
                    });
                  }}
                >
                  <View
                    style={colorSwatch({
                      color,
                      size: 50,
                      selected: color === preferences.data?.primaryColor,
                    })}
                  />
                </Pressable>
                <ListItem.Title style={header()}>
                  <Text>{color}</Text>
                </ListItem.Title>
              </ListItem>
            </ListItemContent>
          </ListItem>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
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

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 15,
  fontWeight: "500",
  color: t.color.textPrimary,
}));
