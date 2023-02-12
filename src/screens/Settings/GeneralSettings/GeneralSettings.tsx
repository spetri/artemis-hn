import { useAsync } from "@react-hook/async";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, ListItem, Switch } from "@rneui/themed";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as Application from "expo-application";
import * as Updates from "expo-updates";

import { FC, useCallback, useLayoutEffect, useMemo, useState } from "react";
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
  SectionList,
} from "react-native";
import {
  defaultPreferences,
  PreferencesType,
  preferencesVersion,
  usePreferences,
} from "../usePreferences";
import { colorSystem, styles, useDash } from "../../../../dash.config";
import { NavigableHeader } from "../../../components/NavigableHeader";
import { StackParamList } from "../../routers";
import { LogoHeader } from "../../../components/LogoHeader";
import Icon from "react-native-vector-icons/Ionicons";
import { StoryFilters } from "../../../types/hn-api";
import { useNavigation } from "@react-navigation/native";
import { ListItemContent } from "@rneui/base/dist/ListItem/ListItem.Content";
import Slider from "@react-native-community/slider";

export interface SettingsProps
  extends NativeStackScreenProps<StackParamList, "User"> {}

export const GeneralSettings: FC<SettingsProps> = () => {
  const { tokens } = useDash();
  const [baseTypeSize, setBaseTypeSize] = useState<number | undefined>(
    undefined
  );
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, loadPreferences] = usePreferences();
  const colorScheme = useColorScheme();
  const dimensions = useWindowDimensions();

  const [, setStorage_] = useAsync(async (preferences: PreferencesType) => {
    const data = Object.entries({
      data: preferences,
      version: preferencesVersion,
    }).map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(data);
    await loadPreferences();
  });
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const {
    tokens: { color },
  } = useDash();

  const setStorage = useCallback(
    (settings: Partial<PreferencesType>) => {
      setStorage_({ ...defaultPreferences, ...preferences?.data, ...settings });
    },
    [setStorage_, preferences?.data]
  );

  const listItems = [
    {
      id: "1",
      header: "App Color",
      subheader: "Select app color theme",
      iconName: "ios-logo-hackernews",
      type: <ListItem.Chevron />,
    },
    {
      id: "2",
      header: "Dark Mode",
      subheader: "By default, we use your system preferences",
      iconName: "rocket-outline",
      type: (
        <Switch
          value={
            preferences.data?.colorScheme === "dark" ||
            (preferences.data?.colorScheme === undefined &&
              colorScheme === "dark")
          }
          trackColor={{
            false: tokens.color.textAccent,
            true: tokens.color.primary,
          }}
          onValueChange={(value) => {
            setStorage({
              colorScheme: value ? "dark" : "light",
            });
          }}
        />
      ),
    },
    {
      id: "3",
      header: "Text Size",
      subheader: "Select Text Size",
      iconName: "bulb-outline",
      type: <ListItem.Chevron />,
    },
    {
      id: "4",
      header: "Display All Replies",
      subheader: "When selected, display all replies automatically",
      iconName: "file-tray-outline",
      type: (
        <Switch
          value={preferences.data?.displayReplies}
          onValueChange={(value) => {
            setStorage({
              displayReplies: value ? true : false,
            });
          }}
        />
      ),
    },
  ];

  useLayoutEffect(() => {
    if (
      preferences.status === "success" &&
      preferences.data &&
      !Object.values(preferences.data).length
    ) {
      setStorage(defaultPreferences);
    }
  }, [preferences, setStorage]);

  useLayoutEffect(() => {
    if (baseTypeSize) {
      setStorage({
        baseTypeSize,
      });
    }
  }, [baseTypeSize]);

  const twoColumn = (item) => {
    return (
      <>
        <ListItem bottomDivider containerStyle={containerBg()}>
          <Icon
            name={item.iconName}
            color={color.textPrimary}
            size={25}
            style={image}
          />
          <ListItemContent>
            <ListItem.Title
              style={header()}
              onPress={() =>
                navigation.navigate("Stories", {
                  filter: item?.filter as StoryFilters,
                })
              }
            >
              {item.header}
            </ListItem.Title>
            <ListItem.Subtitle
              style={subheader()}
              onPress={() =>
                navigation.navigate("Stories", {
                  filter: item?.filter as StoryFilters,
                })
              }
            >
              {item.subheader}
            </ListItem.Subtitle>
          </ListItemContent>
          <View>
            <Text>{item.type}</Text>
          </View>
        </ListItem>
      </>
    );
  };

  return (
    <SafeAreaView style={container()}>
      <NavigableHeader
        title="Preferences"
        actions={{
          options: {
            options: ["Restore default settings", "Cancel"],
          },
          callback(index) {
            switch (index) {
              case 0:
                setStorage(defaultPreferences);
                break;
            }
          },
        }}
      />
      <View style={containerBg()}>
        <SectionList
          ItemSeparatorComponent={() => (
            <View style={listItemSeparatorStyle()} />
          )}
          sections={[{ title: "Topics", data: listItems }]}
          // renderSectionHeader={({ section }) => (
          //   <Text style={sectionHeaderStyle()}>{section.title}</Text>
          // )}
          renderItem={({ item }) => twoColumn(item)}
        />
      </View>

      {/* <ScrollView style={preferencesContainer()}>
        <View style={preferenceGroup()}>
          <View style={preferenceLabelContainer()}>
            <Text style={preferenceLabel()}>Color</Text>
            <Text style={preferenceDescription()}>
              Sets the primary color used throughout the app
            </Text>
          </View>
          <View style={colorSwatches()}>
            {primaryColors.map((color) => (
              <TouchableOpacity
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
                    size: (dimensions.width - 112) / 4,
                    selected: color === preferences.data?.primaryColor,
                  })}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={preferenceGroup()}>
          <View style={preferenceRow("center")}>
            <View style={preferenceLabelContainer()}>
              <Text style={preferenceLabel()}>Text size</Text>
            </View>
            <View style={sliderContainer}>
              <Slider
                minimumValue={12}
                maximumValue={20}
                step={2}
                value={baseTypeSize ?? preferences.data?.baseTypeSize ?? 16}
                onValueChange={setBaseTypeSize}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
              />
            </View>
          </View>
        </View>

        <Text style={version()}>
          v{Application.nativeBuildVersion}{" "}
          {Updates.updateId && <>&bull; {Updates.updateId}</>}
        </Text>
      </ScrollView> */}
    </SafeAreaView>
  );
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

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
}));

const containerRow = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  flexDirection: "row",
  display: "flex",
  paddingVertical: 10,
}));

const row = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  flexDirection: "row",
  display: "flex",
}));

const col = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  display: "flex",
  flexDirection: "column",
}));

const toggleSwitch = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 12,
}));

const image = styles.one<ViewStyle>((t) => ({
  height: "100%",
  width: "100%",
}));

// const container = styles.one<ViewStyle>((t) => ({
//   flex: 1,
//   justifyContent: "center",
//   backgroundColor: t.color.bodyBg,
// }));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 15,
  fontWeight: "500",
  color: t.color.textPrimary,
}));

const listItemSeparatorStyle = styles.one<TextStyle>((t) => ({
  height: 0.3,
  width: "100%",
  backgroundColor: t.color.accent,
}));
