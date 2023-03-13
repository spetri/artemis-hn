import { useAsync } from '@react-hook/async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from '@rneui/themed';
import { FC, useCallback, useLayoutEffect } from 'react';
import { Pressable, SectionList, Text, TextStyle, View, ViewStyle } from 'react-native';
import { styles, useDash } from '../../../dash.config';
import { usePreferences } from '../../screens/Settings/usePreferences';
import {
  defaultPreferences,
  preferencesVersion,
  SetThemeType,
  useTheme
} from '../../screens/Settings/useTheme';

type ThemeGridListType = {
  sections: [];
};

export const ThemeGridList: FC<ThemeGridListType> = ({ sections }) => {
  const {
    tokens: { color }
  } = useDash();
  const [preferences, loadPreferences] = useTheme();
  const [, setCommentColors] = usePreferences('commentColors', defaultPreferences.commentColors);
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
      setCommentColors?.(appColor.item.colors);
    } else {
      setStorage({
        primaryColor: appColor.item.color
      });
    }
  };

  const displayColors = (appColor) => {
    if (appColor.item?.colors?.length) {
      return appColor.item.colors.map((color, index) => {
        if (index < 5) {
          return (
            <View
              style={colorSwatch({
                color: color,
                selected: color === preferences.data?.commentColors,
                size: 20
              })}
            />
          );
        }
      });
    } else {
      return (
        <View
          style={colorSwatch({
            color: appColor.item.color,
            selected: appColor.item.color === preferences.data?.primaryColor,
            size: 30
          })}
        />
      );
    }
  };

  return (
    <SectionList
      style={{ backgroundColor: color.bodyBg }}
      sections={sections}
      renderItem={(appColor) => {
        return (
          <Pressable
            key={appColor.item.name}
            onPress={() => {
              setColorStorage(appColor);
            }}
          >
            <ListItem key={appColor.item.name} bottomDivider containerStyle={containerBg()}>
              <View style={listItems()}>
                <>
                  {displayColors(appColor)}
                  <ListItem.Title style={header()}>
                    <Text>{appColor.item.displayName}</Text>
                  </ListItem.Title>
                </>
              </View>
            </ListItem>
          </Pressable>
        );
      }}
    />
  );
};

const colorSwatch = styles.lazy<{ color: string; selected: boolean; size: number }, ViewStyle>(
  ({ color, selected, size }) =>
    (t) => ({
      width: size,
      height: size,
      backgroundColor: t.color[color],
      borderColor: selected ? t.color.textPrimary : 'transparent',
      borderWidth: 3,
      borderRadius: 4,
      marginRight: 10
    })
);

const listItems = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: 20,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.sm,
  fontWeight: '500',
  color: t.color.textPrimary
}));
