import { useAsync } from '@react-hook/async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { type FC, useCallback, useLayoutEffect } from 'react';
import {
  Pressable,
  SafeAreaView,
  SectionList,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';
import { styles } from '../../../../../dash.config';
import { type StackParamList } from '../../../routers';
import {
  defaultPreferences,
  preferencesVersion,
  type SetThemeType,
  useTheme
} from '../../useTheme';

export type SettingsProps = NativeStackScreenProps<StackParamList, 'User'>;

export const AppColorSettings: FC<SettingsProps> = () => {
  const [preferences, loadPreferences] = useTheme();
  const appColors = {
    commentColors: [
      {
        colors: ['4D455D', '#E96479', '#F5E9CF', '#7DB9B6'],
        name: 'HN Default',
        displayName: 'HN Default'
      }
      // { colors: ["red600"], name: "Deep Love", displayName: "Deep Love" },
      // { colors: ["amber500"], name: "Gold", displayName: "Gold" },
      // { colors: ["emerald200"], name: "Mint", displayName: "Mint" },
      // { colors: ["blue800"], name: "Deep Blue Sea", displayName: "Deep Blue Sea" },
      // { colors: ["cyan500"], name: "Cyanic", displayName: "Cyanic" },
    ],
    accentColors: [
      { color: 'orange500', name: 'HN Default', displayName: 'HN Default' },
      { color: 'red600', name: 'Deep Love', displayName: 'Deep Love' },
      { color: 'amber500', name: 'Gold', displayName: 'Gold' },
      { color: 'emerald200', name: 'Mint', displayName: 'Mint' },
      { color: 'blue800', name: 'Deep Blue Sea', displayName: 'Deep Blue Sea' },
      { color: 'cyan500', name: 'Cyanic', displayName: 'Cyanic' },
      {
        color: 'green500',
        name: "Saint Patrick's Day",
        displayName: "Saint Patrick's Day"
      },
      { color: 'lime600', name: 'Olive', displayName: 'Olive' },
      { color: 'violet500', name: 'Magenta', displayName: 'Magenta' },
      { color: 'indigo500', name: 'Wild', displayName: 'Wild' },
      { color: 'fuchsia500', name: 'Pink', displayName: 'Pink' },
      { color: 'pink500', name: 'Party', displayName: 'Party' },
      { color: 'rose500', name: 'Rose', displayName: 'Rose' }
    ],
    themeColors: [
      {
        theme: styles.tokens.light.color,
        color: 'white',
        name: 'light',
        displayName: 'Light'
      },
      {
        theme: styles.tokens.dark.color,
        color: 'warmGray900',
        name: 'dark',
        displayName: 'Dark'
      },
      {
        theme: styles.tokens.black.color,
        color: 'black',
        name: 'black',
        displayName: 'Black'
      },
      {
        theme: styles.tokens.solarized.color,
        color: 'solarizedBodyBg',
        name: 'solarized',
        displayName: 'Solarized'
      },
      {
        theme: styles.tokens.dracula.color,
        color: 'draculaBodyBg',
        name: 'dracula',
        displayName: 'Dracula'
      },
      {
        theme: styles.tokens.nord.color,
        color: 'nordBodyBg',
        name: 'nord',
        displayName: 'Nord'
      },
      {
        theme: styles.tokens.aurora.color,
        color: 'auroraBodyBg',
        name: 'aurora',
        displayName: 'Aurora'
      }
    ]
  };
  const [, setStorage_] = useAsync(async (preferences: SetThemeType) => {
    const data = Object.entries({
      data: preferences,
      version: preferencesVersion
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
      preferences.status === 'success' &&
      preferences.data != null &&
      Object.values(preferences.data).length === 0
    ) {
      setStorage(defaultPreferences);
    }
  }, [preferences, setStorage]);

  const setColorStorage = (appColor) => {
    if (appColor.item.theme) {
      setStorage({
        colorScheme: appColor.item.name
      });
    } else if (appColor.item.colors) {
      setStorage({
        commentColors: appColor.item.name
      });
    } else {
      setStorage({
        primaryColor: appColor.item.color
      });
    }
  };

  return (
    <SafeAreaView style={container()}>
      <SectionList
        sections={[
          { title: 'Comment Colors', data: appColors.commentColors },
          { title: 'Theme Colors', data: appColors.themeColors },
          { title: 'Accent Colors', data: appColors.accentColors }
        ]}
        renderSectionHeader={({ section }) => (
          <Text style={sectionHeaderStyle()}>{section.title}</Text>
        )}
        renderItem={(appColor) => {
          return (
            <Pressable
              key={appColor.item.name}
              onPress={() => {
                console.log(appColor);
                setColorStorage(appColor);
              }}
            >
              <ListItem key={appColor.item.name} bottomDivider containerStyle={containerBg()}>
                <View style={listItems()}>
                  <View
                    style={colorSwatch({
                      color: appColor.item.color,
                      selected: appColor.item.color === preferences.data?.primaryColor
                    })}
                  />
                  <ListItem.Title style={header()}>
                    <Text>{appColor.item.displayName}</Text>
                  </ListItem.Title>
                </View>
              </ListItem>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

const colorSwatch = styles.lazy<{ color: string; selected: boolean }, ViewStyle>(
  ({ color, selected }) =>
    (t) => ({
      width: 30,
      height: 30,
      backgroundColor: (t.color as any)[color],
      borderColor: selected ? t.color.textPrimary : 'transparent',
      borderWidth: 3,
      borderRadius: 4,
      marginRight: 10
    })
);

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg
}));

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%'
}));

const listItems = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: 20,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 15,
  color: t.color.textPrimary
}));

const sectionHeaderStyle = styles.one<TextStyle>((t) => ({
  marginLeft: 10,
  fontSize: 13,
  textTransform: 'uppercase',
  height: 30,
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: t.color.bodyBg,
  color: t.color.textPrimary
}));
