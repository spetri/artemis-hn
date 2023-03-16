import { useAsync } from '@react-hook/async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ListItem, Switch } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { type FC, useCallback, useLayoutEffect, useState } from 'react';
import {
  SafeAreaView,
  SectionList,
  Text,
  type TextStyle,
  TouchableHighlight,
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
  const {
    displayLargeThumbnails,
    setDisplayLargeThumbnails,
    displayReplies,
    setDisplayReplies,
    displaySource,
    setDisplaySource,
    showJumpButton,
    setShowJumpButton,
    thumbnailSize,
    setThumbnailSize,
    jumpButtonPosition,
    setJumpButtonPosition,
    openLinkInBrowser,
    setOpenLinkInBrowser,
    thumbnailPosition,
    setThumbnailPosition
  } = usePreferencesStore(
    (state) => ({
      displayLargeThumbnails: state.displayLargeThumbnails,
      setDisplayLargeThumbnails: state.setDisplayLargeThumbnails,

      displaySource: state.displaySource,
      setDisplaySource: state.setDisplaySource,

      displayReplies: state.displayReplies,
      setDisplayReplies: state.setDisplayReplies,

      showJumpButton: state.showJumpButton,
      setShowJumpButton: state.setShowJumpButton,

      thumbnailSize: state.thumbnailSize,
      setThumbnailSize: state.setThumbnailSize,

      jumpButtonPosition: state.jumpButtonPosition,
      setJumpButtonPosition: state.setJumpButtonPosition,

      openLinkInBrowser: state.openLinkInBrowser,
      setOpenLinkInBrowser: state.setOpenLinkInBrowser,

      setThumbnailPosition: state.setThumbnailPosition,
      thumbnailPosition: state.thumbnailPosition
    }),
    shallow
  );

  const [baseTypeSize, setBaseTypeSize] = useState<number | undefined>(undefined);
  const [buttonJumpText, setButtonJumpText] = useState(jumpButtonPosition ?? 'right');
  const [buttonThumbnailSize, setButtonThumbnailSize] = useState<string | number>(thumbnailSize ?? 'Small');
  const [buttonThumbnailPosition, setButtonThumbnailPosition] = useState(
    thumbnailPosition ?? 'Small'
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
        <View style={sliderContainer()}>
          <Slider
            style={slider()}
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
      subheader: 'When selected, display all replies automatically. This will impact performance.',
      iconName: 'file-tray-outline',
      onPress: () => setDisplayReplies(!displayReplies),
      type: (
        <Switch
          value={displayReplies}
          onValueChange={(value) => {
            setDisplayReplies(!value);
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
            setDisplayLargeThumbnails(!value);
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
          onValueChange={(value) => {
            setShowJumpButton(!value);
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
          buttonStyle={{ backgroundColor: color.primary }}
          onPress={() => {
            actionSheet.showActionSheetWithOptions(
              {
                options: ['left', 'right', 'Cancel']
              },
              (index) => {
                switch (index) {
                  case 0:
                    setJumpButtonPosition('left');
                    setButtonJumpText('left');
                    break;
                  case 1:
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
          <Text>{buttonJumpText}</Text>
        </Button>
      )
    },
    {
      id: '6',
      header: 'Open Links In Safari',
      subheader: 'Open in Safari instead of built-in browser',
      iconName: 'ios-compass-outline',
      onPress: () => setOpenLinkInBrowser(!openLinkInBrowser),
      type: (
        <Switch value={openLinkInBrowser} onValueChange={(value) => setOpenLinkInBrowser(!value)} />
      )
    },
    {
      id: '7',
      header: 'Display source',
      subheader: 'Show link source',
      iconName: 'ios-link-outline',
      onPress: () => setDisplaySource(!displaySource),
      type: <Switch value={displaySource} onValueChange={(value) => setDisplaySource(!value)} />
    },
    {
      id: '8',
      header: 'Thumbnail Size',
      subheader: 'Adjust image size',
      iconName: 'ios-image',
      type: (
        <Button
          buttonStyle={{ backgroundColor: color.primary }}
          onPress={() => {
            actionSheet.showActionSheetWithOptions(
              {
                options: ['Small', 'Medium', 'Large', 'Cancel']
              },
              (index) => {
                switch (index) {
                  case 0:
                    setThumbnailSize(55);
                    setButtonThumbnailSize('Small');
                    break;
                  case 1:
                    setThumbnailSize(65);
                    setButtonThumbnailSize('Medium');
                    break;
                  case 2:
                    setThumbnailSize(75);
                    setButtonThumbnailSize('Large');
                    break;

                  case 3:
                    break;
                }
              }
            );
          }}
        >
          <Text>{buttonThumbnailSize ?? 'Small'}</Text>
        </Button>
      )
    },
    {
      id: '9',
      header: 'Thumbnail Position',
      subheader: 'Right-handed or left-handed?',
      iconName: 'ios-hand-left-outline',
      type: (
        <Button
          buttonStyle={{ backgroundColor: color.primary }}
          onPress={() => {
            actionSheet.showActionSheetWithOptions(
              {
                options: ['Left', 'Right', 'Cancel']
              },
              (index) => {
                switch (index) {
                  case 0:
                    setThumbnailPosition('Left');
                    setButtonThumbnailPosition('Left');
                    break;
                  case 1:
                    setThumbnailPosition('Right');
                    setButtonThumbnailPosition('Right');
                    break;

                  case 2:
                    break;
                }
              }
            );
          }}
        >
          <Text>{buttonThumbnailPosition ?? 'Small'}</Text>
        </Button>
      )
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
      <TouchableHighlight underlayColor={color.accentLight}
        onPress={item.onPress}
      >
        <View>
          <ListItem containerStyle={containerBg()}>
            <Icon name={item.iconName} color={color.textPrimary} size={25} style={image} />
            <ListItemContent>
              <ListItem.Title style={header()}>{item.header}</ListItem.Title>
              <ListItem.Subtitle style={subheader()}>{item.subheader}</ListItem.Subtitle>
            </ListItemContent>
            <View>
              <Text>{item.type}</Text>
            </View>
          </ListItem>
        </View>
      </TouchableHighlight>
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
  backgroundColor: t.color.bodyBg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accentLight
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
}));

const image = styles.one<ViewStyle>(() => ({
  height: '100%',
  width: '100%'
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.sm,
  fontWeight: '500',
  color: t.color.textPrimary
}));

const listItemSeparatorStyle = styles.one<TextStyle>((t) => ({
  height: 0.3,
  width: '100%',
  backgroundColor: t.color.accent
}));

const sliderContainer = styles.one<TextStyle>(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const slider = styles.one<TextStyle>(() => ({
  display: 'flex',
  marginRight: 1,
  width: 100
}));