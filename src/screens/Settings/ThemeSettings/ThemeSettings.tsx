import Icon from 'react-native-vector-icons/Ionicons';
import { useAsync } from '@react-hook/async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps
} from '@react-navigation/native-stack';
import { type FC, useCallback, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  SectionList,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';
import { styles, useDash } from '../../../../dash.config';
import { type StackParamList } from '../../routers';
import { defaultPreferences, preferencesVersion, type SetThemeType, useTheme } from '../useTheme';
import { AppColors } from './ThemeConfig';
import { useNavigation } from '@react-navigation/native';
import { ListItemType } from '../../Home/HomeList';
import { ThemeGridList } from '../../../components/ThemeGridList/ThemeGridList';

export type SettingsProps = NativeStackScreenProps<StackParamList, 'User'>;

export const ThemeSettings: FC<SettingsProps> = () => {
  const [preferences, loadPreferences] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const {
    tokens: { color }
  } = useDash();
  const [, setStorage_] = useAsync(async (preferences: SetThemeType) => {
    const data = Object.entries({
      data: preferences,
      version: preferencesVersion
    }).map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(data);
    await loadPreferences();
  });

  const listItems: ListItemType = [
    {
      id: '1',
      header: 'Set Theme',
      iconName: 'ios-settings-outline',
      navigate: () => navigation.navigate('ThemeColorSection')
    },
    {
      id: '2',
      header: 'Set Accent',
      iconName: 'ios-moon-outline',
      navigate: () => navigation.navigate('AccentColorSection')
    },
    {
      id: '3',
      header: 'Set Comment Color',
      iconName: 'ios-logo-hackernews',
      navigate: () => {
        navigation.navigate('CommentColorSection');
      }
    }
  ];

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

  return (
    <SafeAreaView style={container()}>
      <View style={container()}>
        <SectionList
          ItemSeparatorComponent={() => <View style={listItemSeparatorStyle()} />}
          sections={[{ title: 'Topics', data: listItems }]}
          renderItem={({ item }) => (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={imageContainer}>
                <Icon name={item.iconName} color={color.textPrimary} size={18} />
              </Text>
              <View style={row()}>
                <Text style={colorListItem()} onPress={item.navigate}>
                  {item.header}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export const ThemeColorSection: FC = () => {
  const appColors = AppColors;

  return (
    <SafeAreaView style={container()}>
      <ThemeGridList sections={[{ title: 'Theme Colors', data: appColors.themeColors }]} />
    </SafeAreaView>
  );
};

export const AccentColorSection: FC = () => {
  const appColors = AppColors;

  return (
    <SafeAreaView style={container()}>
      <ThemeGridList sections={[{ title: 'Accent Colors', data: appColors.accentColors }]} />
    </SafeAreaView>
  );
};

export const CommentColorSection: FC = () => {
  const appColors = AppColors;

  return (
    <SafeAreaView style={container()}>
      <ThemeGridList sections={[{ title: 'Comment Colors', data: appColors.commentColors }]} />
    </SafeAreaView>
  );
};

const colorListItem = styles.one<TextStyle>((t) => ({
  fontSize: 15,
  color: t.color.textPrimary
}));

const row = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  display: 'flex',
  width: '100%',
  paddingVertical: 15
}));

const imageContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignSelf: 'center',
  paddingHorizontal: 10
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  justifyContent: 'center',
  backgroundColor: t.color.bodyBg
}));

const listItemSeparatorStyle = styles.one<TextStyle>((t) => ({
  height: 0.3,
  width: '100%',
  backgroundColor: t.color.textAccent
}));
