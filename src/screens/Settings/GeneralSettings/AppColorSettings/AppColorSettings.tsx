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
import { styles } from "../../../../../dash.config";
import { NavigableHeader } from "../../../../components/NavigableHeader/NavigableHeader";
import { StackParamList } from "../../../routers";
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
  const primaryColors = [
    { color: "orange500", name: "HN Default" },
    { color: "red600", name: "Deep Love" },
    { color: "amber500", name: "Gold" },
    { color: "emerald200", name: "Mint" },
    { color: "blue800", name: "Deep Blue Sea" },
    { color: "cyan500", name: "Cyanic" },
    { color: "green500", name: "Saint Patrick's Day" },
    { color: "lime600", name: "Olive" },
    { color: "violet500", name: "Magenta" },
    { color: "indigo500", name: "Wild" },
    { color: "fuchsia500", name: "Pink" },
    { color: "pink500", name: "Party" },
    { color: "rose500", name: "Rose" },
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
      <ScrollView contentContainerStyle={containerBg()}>
        {primaryColors.map((color) => (
          <ListItem
            key={color.color}
            bottomDivider
            containerStyle={containerBg()}
          >
            <View style={listItems()}>
              <Pressable
                key={color.color}
                onPress={() => {
                  setStorage({
                    primaryColor: color.color,
                  });
                }}
              >
                <View
                  style={colorSwatch({
                    color: color.color,
                    selected: color.color === preferences.data?.primaryColor,
                  })}
                />
              </Pressable>
              <ListItem.Title style={header()}>
                <Text>{color.name}</Text>
              </ListItem.Title>
            </View>
          </ListItem>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const colorSwatch = styles.lazy<
  { color: string; selected: boolean },
  ViewStyle
>(({ color, selected }) => (t) => ({
  width: 30,
  height: 30,
  backgroundColor: (t.color as any)[color],
  borderColor: selected ? t.color.textPrimary : "transparent",
  borderWidth: 3,
  borderRadius: 4,
  marginRight: 10,
}));

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
}));

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: "100%",
}));

const listItems = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: 20,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 15,
  color: t.color.textPrimary,
}));
