import { useAsync } from '@react-hook/async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet, Button, ListItem, Slider, Switch } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { type FC, useCallback, useLayoutEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  SectionList,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { styles, useDash } from '../../../../dash.config';
import { type StackParamList } from '../../routers';
import { defaultPreferences, preferencesVersion, type SetThemeType, useTheme } from '../useTheme';
import { usePreferences } from '../usePreferences';

export type SettingsProps = NativeStackScreenProps<StackParamList, 'User'>;

export const GeneralSettings: FC<SettingsProps> = () => {
  const [baseTypeSize, setBaseTypeSize] = useState<number | undefined>(undefined);
  const [displayReplies, setDisplayReplies] = usePreferences('displayReplies', false);
  const [preferences, loadPreferences] = useTheme();
  const {
    tokens: { color }
  } = useDash();

  const [isVisible, setIsVisible] = useState(false);

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

  const listItems = [
    {
      id: '1',
      header: 'Text Size',
      subheader: 'Select Text Size',
      iconName: 'text-outline',
      onPress: () => {
        setIsVisible(true);
      },
      type: (
        <Button
          buttonStyle={{ backgroundColor: color.bodyBg }}
          onPress={() => {
            setIsVisible(true);
          }}
        >
          <ListItem.Chevron />
        </Button>
      )
    },
    {
      id: '2',
      header: 'Display All Replies',
      subheader: 'When selected, display all replies automatically',
      iconName: 'file-tray-outline',
      onPress: false,
      type: (
        <Switch
          value={displayReplies}
          onValueChange={async (value) => {
            await onSetDisplayRepliesChange(value);
          }}
        />
      )
    }
  ];

  const onSetDisplayRepliesChange = async (value) => {
    value ? await setDisplayReplies(true) : await setDisplayReplies(false);
  };

  useLayoutEffect(() => {
    if (
      preferences.status === 'success' &&
      preferences.data != null &&
      Object.values(preferences.data).length === 0
    ) {
      setStorage(defaultPreferences);
    }
  }, [preferences, setStorage]);

  useLayoutEffect(() => {
    if (baseTypeSize) {
      setStorage({
        baseTypeSize
      });
    }
  }, [baseTypeSize]);

  const twoColumn = (item) => {
    return (
      <Pressable onPress={item.onPress}>
        <ListItem bottomDivider containerStyle={containerBg()}>
          <Icon name={item.iconName} color={color.textPrimary} size={25} style={image} />
          <ListItemContent>
            <ListItem.Title style={header()}>{item.header}</ListItem.Title>
            <ListItem.Subtitle style={subheader()}>{item.subheader}</ListItem.Subtitle>
          </ListItemContent>
          <View>
            <Text>{item.type}</Text>
          </View>
        </ListItem>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={container()}>
      <View style={containerBg()}>
        <SectionList
          ItemSeparatorComponent={() => <View style={listItemSeparatorStyle()} />}
          sections={[{ title: 'Topics', data: listItems }]}
          renderItem={({ item }) => twoColumn(item)}
        />
        <BottomSheet
          modalProps={{}}
          isVisible={isVisible}
          children={
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
          }
        ></BottomSheet>
      </View>
    </SafeAreaView>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%',
  width: '100%'
}));

const sliderContainer: ViewStyle = {
  width: '100%',
  marginBottom: 100
};

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 12
}));

const image = styles.one<ViewStyle>(() => ({
  height: '100%',
  width: '100%'
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 15,
  fontWeight: '500',
  color: t.color.textPrimary
}));

const listItemSeparatorStyle = styles.one<TextStyle>((t) => ({
  height: 0.3,
  width: '100%',
  backgroundColor: t.color.accent
}));
