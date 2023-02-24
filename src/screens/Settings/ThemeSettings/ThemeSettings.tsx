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
import { styles } from '../../../../dash.config';
import { type StackParamList } from '../../routers';
import { defaultPreferences, preferencesVersion, type SetThemeType, useTheme } from '../useTheme';
import { AppColors } from './ThemeConfig';

export type SettingsProps = NativeStackScreenProps<StackParamList, 'User'>;

export const ThemeSettings: FC<SettingsProps> = () => {
  const [preferences, loadPreferences] = useTheme();
  const appColors = AppColors;
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
        sections={
          [
            { title: 'Theme Colors', data: appColors.themeColors },
            { title: 'Accent Colors', data: appColors.accentColors },
            { title: 'Comment Colors', data: appColors.commentColors }
          ] as any
        }
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
      backgroundColor: t.color[color],
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
  marginTop: 30,
  fontSize: 13,
  textTransform: 'uppercase',
  height: 30,
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: t.color.bodyBg,
  color: t.color.textPrimary
}));
