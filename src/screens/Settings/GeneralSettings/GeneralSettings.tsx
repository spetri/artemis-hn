import { useAsync } from '@react-hook/async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ListItem, Switch } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { type FC, useCallback, useLayoutEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  SectionList,
  Share,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';

import { shallow } from 'zustand/shallow';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { styles, useDash } from '../../../../dash.config';
import { type StackParamList } from '../../routers';
import { defaultPreferences, preferencesVersion, type SetThemeType, useTheme } from '../useTheme';
import Slider from '@react-native-community/slider';
import { usePreferencesStore } from '../../../contexts/store';
import { useActionSheet } from '@expo/react-native-action-sheet';

export type SettingsProps = NativeStackScreenProps<StackParamList, 'User'>;

export const GeneralSettings: FC<SettingsProps> = () => {
  const actionSheet = useActionSheet();

  const [baseTypeSize, setBaseTypeSize] = useState<number | undefined>(undefined);
  // const displayLargeThumbnails = usePreferencesStore((state) => state.displayLargeThumbnails);
  // const setDisplayLargeThumbnails = usePreferencesStore((state) => state.setDisplayLargeThumbnails);
  // const displayReplies = usePreferencesStore((state) => state.displayReplies);
  // const setDisplayReplies = usePreferencesStore((state) => state.setDisplayReplies);
  // const showJumpButton = usePreferencesStore((state) => state.showJumpButton);
  // const setShowJumpButton = usePreferencesStore((state) => state.setShowJumpButton);
  const jumpButtonPosition = usePreferencesStore((state) => state.jumpButtonPosition);
  const setJumpButtonPosition = usePreferencesStore((state) => state.jumpButtonPosition);
  const [buttonJumpText, setButtonJumpText] = useState(jumpButtonPosition);
  const displaySource = usePreferencesStore((state) => state.displaySource);
  const setDisplaySource = usePreferencesStore((state) => state.setDisplaySource);
  const {
    displayLargeThumbnails,
    setDisplayLargeThumbnails,
    displayReplies,
    setDisplayReplies,
    showJumpButton,
    setShowJumpButton
  } = usePreferencesStore(
    (state) => ({
      displayLargeThumbnails: state.displayLargeThumbnails,
      setDisplayLargeThumbnails: state.setDisplayLargeThumbnails,
      displayReplies: state.displayReplies,
      setDisplayReplies: state.setDisplayReplies,
      showJumpButton: state.showJumpButton,
      setShowJumpButton: state.setShowJumpButton
    }),
    shallow
  );

  const [preferences, loadPreferences] = useTheme();
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
      type: (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Slider
            style={{ display: 'flex', marginRight: 1, width: 100 }}
            minimumValue={12}
            maximumValue={20}
            step={2}
            value={baseTypeSize ?? preferences.data?.baseTypeSize ?? 16}
            onValueChange={setBaseTypeSize}
          />
          <Text
            style={{
              marginLeft: 10,
              fontSize: baseTypeSize,
              color: color.primary,
              fontWeight: '600'
            }}
          >
            {baseTypeSize ? baseTypeSize : defaultPreferences.baseTypeSize}
          </Text>
        </View>
      )
    },
    {
      id: '2',
      header: 'Display All Replies',
      subheader: 'When selected, display all replies automatically',
      iconName: 'file-tray-outline',
      onPress: () => setDisplayReplies(!displayReplies),
      type: (
        <Switch
          value={displayReplies}
          onValueChange={(value) => {
            setDisplayReplies(value);
          }}
        />
      )
    },
    {
      id: '3',
      header: 'Toggle Large Thumbnails',
      subheader: 'Larger story views',
      iconName: 'ios-images-outline',
      onPress: () => setDisplayLargeThumbnails(!displayLargeThumbnails),
      type: (
        <Switch
          value={displayLargeThumbnails}
          onValueChange={(value) => {
            setDisplayLargeThumbnails(value);
          }}
        />
      )
    },
    {
      id: '4',
      header: 'Show Jump Button',
      subheader: 'Display / hide the jump comment button',
      iconName: 'caret-down-circle-outline',
      onPress: () => setShowJumpButton(!showJumpButton),
      type: (
        <Switch
          value={showJumpButton}
          onValueChange={async (value) => {
            setShowJumpButton(value);
          }}
        />
      )
    },
    {
      id: '5',
      header: 'Jump Button Position',
      subheader: 'Move jump button',
      iconName: 'ios-move',
      type: (
        <Button
          containerStyle={{ backgroundColor: color.primary }}
          titleStyle={{ color: color.textPrimary }}
          onPress={() => {
            actionSheet.showActionSheetWithOptions(
              {
                options: ['Left', 'Right', 'Cancel']
              },
              (index) => {
                switch (index) {
                  case 0:
                    console.log('leftt');
                    setButtonJumpText('left');
                    setJumpButtonPosition('left');
                    break;
                  case 1:
                    console.log('rightt');
                    setButtonJumpText('right');
                    setJumpButtonPosition('right');
                    break;
                  case 2:
                    break;
                }
              }
            );
          }}
        >
          {buttonJumpText}
        </Button>
      )
    },
    {
      id: '6',
      header: 'Open Links In Safari',
      subheader: 'Open in Safari instead of built-in browser',
      iconName: 'ios-compass-outline'
      // onPress: () => setDisplayLargeThumbnails?.(!displayLargeThumbnails)
      // type: (
      //   <Switch
      //     value={displayLargeThumbnails}
      //     onValueChange={async (value) => {
      //       await onSetDisplayLargeThumbnailsChange(value);
      //     }}
      //   />
      // )
    },
    {
      id: '7',
      header: 'Display source',
      subheader: 'Show link source',
      iconName: 'ios-link-outline',
      onPress: () => setDisplaySource(!displaySource),
      type: <Switch value={displaySource} onValueChange={(value) => setDisplaySource(value)} />
    },
    {
      id: '8',
      header: 'Thumbnail Size',
      subheader: 'Adjust image size',
      iconName: 'ios-image'
      // onPress: () => setDisplayLargeThumbnails?.(!displayLargeThumbnails)
      // type: (
      //   <Switch
      //     value={displayLargeThumbnails}
      //     onValueChange={async (value) => {
      //       await onSetDisplayLargeThumbnailsChange(value);
      //     }}
      //   />
      // )
    },
    {
      id: '9',
      header: 'Thumbnail Position',
      subheader: 'Right-handed or left-handed?',
      iconName: 'ios-hand-left-outline'
      // onPress: () => setDisplayLargeThumbnails?.(!displayLargeThumbnails)
      // type: (
      //   <Switch
      //     value={displayLargeThumbnails}
      //     onValueChange={async (value) => {
      //       await onSetDisplayLargeThumbnailsChange(value);
      //     }}
      //   />
      // )
    },
    {
      id: '10',
      header: 'Default Sort',
      subheader: 'Set default sorting',
      iconName: 'ios-filter-outline'
      // onPress: () => setDisplayLargeThumbnails?.(!displayLargeThumbnails)
      // type: (
      //   <Switch
      //     value={displayLargeThumbnails}
      //     onValueChange={async (value) => {
      //       await onSetDisplayLargeThumbnailsChange(value);
      //     }}
      //   />
      // )
    },
    {
      id: '11',
      header: 'Set Home Landing',
      subheader: 'When opening the app, set view',
      iconName: 'ios-home-outline'
      // onPress: () => setDisplayLargeThumbnails?.(!displayLargeThumbnails)
      // type: (
      //   <Switch
      //     value={displayLargeThumbnails}
      //     onValueChange={async (value) => {
      //       await onSetDisplayLargeThumbnailsChange(value);
      //     }}
      //   />
      // )
    }
  ];

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
      </View>
    </SafeAreaView>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%',
  width: '100%'
}));

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
