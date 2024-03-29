import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { shallow } from 'zustand/shallow';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { type FC, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
  Linking,
  Text,
  type TextStyle,
  TouchableHighlight,
  View,
  type ViewStyle
} from 'react-native';
import { Badge, ListItem } from '@rneui/themed';
import { styles, useDash } from '../../../../dash.config';
import { useMetadata } from '../../../hooks/use-metadata';
import { type StackParamList } from '../../../screens/routers';
import { type HackerNewsStory } from '../../../types/hn-api';
import { ago } from '../../../utils/ago';
import { usePreferencesStore } from '../../../contexts/store';
import { Skeleton } from '../../Skeleton/Skeleton';
import { HN } from '../../../constants/api';
import parse from 'node-html-parser';

type MinimalStoryProps = {
  data: HackerNewsStory;
  index: number;
};

export const MinimalStory: FC<MinimalStoryProps> = ({ data, index }) => {
  const url = new URL(data.url);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const metadata = useMetadata(url);
  const displaySource = usePreferencesStore((state) => state.displaySource);
  const thumbnailSize = usePreferencesStore((state) => state.thumbnailSize);
  const thumbnailPosition = usePreferencesStore((state) => state.thumbnailPosition);
  const openLinkInBrowser = usePreferencesStore((state) => state.openLinkInBrowser);
  const [storyHasImage, setStoryHasImage] = useState(true);

  const { setCachedThreadId, setStoryCount } = usePreferencesStore(
    (state) => ({
      setCachedThreadId: state.setCachedThreadId,
      setStoryCount: state.setStoryCount
    }),
    shallow
  );
  const [opacity] = useState(new Animated.Value(0.5));

  const {
    tokens: { color }
  } = useDash();

  const getUpvoteUrl = (itemId) =>
    fetch(`${HN}/item?id=${itemId}`, {
      mode: 'no-cors',
      credentials: 'include'
    })
      .then((response) => response.text())
      .then((responseText) => {
        console.log('TEST', responseText);
        const document = parse(responseText);
        return document.querySelector(`#up_${itemId}`)?.attrs.href;
      });

  const upvote = (itemId) =>
    getUpvoteUrl(itemId)
      .then((upvoteUrl) =>
        fetch(`${HN}/${upvoteUrl}`, {
          mode: 'no-cors',
          credentials: 'include'
        })
      )
      .then((response) => response.text())
      .then((responseText) => {
        const document = parse(responseText);
        console.log('ZERROR', document);
        // return document.querySelector();
      })
      .catch((error) => {
        return false;
      });

  useEffect(() => {
    if (data != null && metadata != null) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }).start();
    }
  }, [opacity, data, metadata]);

  if (metadata == null || data == null) {
    return (
      <Animated.View style={{ opacity }}>
        <ListItem containerStyle={skeletonContainer(index)}>
          <Skeleton style={storySkeletonImage(index)} />
          <ListItem.Content>
            <Skeleton style={storySkeletonTitle(index)} />
            <ListItem containerStyle={skeletonTitleContainer(index)}>
              <Skeleton style={storySkeletonBy(index)} />
              <Skeleton style={storySkeletonMetadata(index)} />
            </ListItem>
          </ListItem.Content>
        </ListItem>
      </Animated.View>
    );
  }

  const displayImage = () => {
    const inAppBrowser = () => {
      navigation.push('Browser', {
        title: data.title,
        url: url.toString()
      });
    };
    const systemBrowser = async () => await Linking.openURL(url.toString());
    if (metadata?.image && storyHasImage) {
      return (
        <TouchableHighlight
          underlayColor={color.accentLight}
          onPress={openLinkInBrowser ? inAppBrowser : systemBrowser}
        >
          <View>
            <Image
              style={storyImage(thumbnailSize)}
              onError={() => setStoryHasImage(false)}
              source={{ uri: metadata?.image }}
            />
          </View>
        </TouchableHighlight>
      );
    } else if (metadata?.favicon && storyHasImage) {
      return (
        <TouchableHighlight
          underlayColor={color.accentLight}
          onPress={openLinkInBrowser ? inAppBrowser : systemBrowser}
        >
          <View>
            <Image
              onError={() => setStoryHasImage(false)}
              style={storyImage(thumbnailSize)}
              source={{ uri: metadata.favicon }}
            />
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          underlayColor={color.accentLight}
          onPress={openLinkInBrowser ? inAppBrowser : systemBrowser}
        >
          <View>
            <IoniconIcon name="md-newspaper-outline" style={icon(thumbnailSize)} size={40} />
          </View>
        </TouchableHighlight>
      );
    }
  };

  const navigateToThread = (threadId) => {
    setCachedThreadId(threadId);
    setStoryCount(data.descendants);
    return navigation.push('Thread', { id: threadId });
  };

  const displayBadge = (title) => {
    if (title.startsWith('Show HN:')) {
      return <Badge badgeStyle={{ borderRadius: 4 }} value="Show HN" status="success" />;
    } else if (title.startsWith('Ask HN:')) {
      return <Badge badgeStyle={{ borderRadius: 4 }} value="Ask HN" status="success" />;
    }
  };

  const checkTitle = (title) => title.replace('Show HN: ', '');

  return (
    metadata && (
      <TouchableHighlight
        underlayColor={color.accentLight}
        onPress={() => navigateToThread(data.id)}
      >
        <Animated.View style={{ opacity }}>
          <View style={storyContainer(thumbnailPosition)} key={data.id}>
            <View style={imageColumn(index)}>{displayImage()}</View>
            <View style={bodyColumn(thumbnailPosition)}>
              <View>
                <Text style={storyTitle(index)} numberOfLines={4}>
                  <>
                    <Text>{checkTitle(data.title)}</Text>&nbsp;
                    <Text style={appName()}>
                      {displaySource ? (
                        <Text style={appName()}>
                          ({metadata.applicationName || url.host.replace(/^www\./, '')})
                        </Text>
                      ) : null}
                    </Text>
                  </>
                </Text>
              </View>
              <View style={footerText()}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  {data.title.startsWith('Show HN:') || data.title.startsWith('Ask HN:') ? (
                    <TouchableHighlight
                      underlayColor={color.accentLight}
                      style={{ marginRight: 10 }}
                      onPress={() => {
                        navigation.push('User', { id: data.by });
                      }}
                    >
                      <Text>{displayBadge(data.title)}</Text>
                    </TouchableHighlight>
                  ) : null}
                  <TouchableHighlight
                    underlayColor={color.accentLight}
                    onPress={() => {
                      navigation.push('User', { id: data.by });
                    }}
                  >
                    <Text style={byStyle()}>{data.by}</Text>
                  </TouchableHighlight>
                </View>
                <View style={restText()}>
                  <View style={rest()}>
                    <TouchableHighlight
                      underlayColor={color.accentLight}
                      onPress={() => {
                        upvote(data.id);
                      }}
                    >
                      <AntDesignIcon size={13} name="arrowup" color={color.textAccent} />
                    </TouchableHighlight>
                    <Text style={footerRestText(index)}>{data.score}</Text>
                  </View>
                  <View>
                    <View style={rest()}>
                      <Text style={rotate90}>
                        <IoniconIcon size={13} name="chatbubble-outline" color={color.textAccent} />
                      </Text>
                      <Text style={footerRestText(index)}>{data.descendants}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={rest()}>
                      <IoniconIcon size={13} name="time-outline" color={color.textAccent} />
                      <Text>{ago.format(new Date(data.time * 1000), 'mini')}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableHighlight>
    )
  );
};

const storyContainer = styles.lazy<string, ViewStyle>((thumbnailPosition) => (t) => ({
  display: 'flex',
  flexDirection: thumbnailPosition === 'Right' ? 'row-reverse' : 'row',
  height: 85,
  width: Dimensions.get('window').width,
  borderBottomColor: t.color.accent,
  borderBottomWidth: t.borderWidth.hairline,
  paddingHorizontal: 10
}));

const imageColumn = styles.lazy<number, ViewStyle>(() => () => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center'
}));

const bodyColumn = styles.lazy<string, ViewStyle>((thumbnailPosition) => () => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width:
    thumbnailPosition === 'Right'
      ? -Dimensions.get('window').width
      : Dimensions.get('window').width,
  justifyContent: 'space-around',
  flex: 1,
  marginHorizontal: thumbnailPosition === 'Right' ? 0 : 15
}));

const storyTitle = styles.lazy<number, TextStyle>(() => (t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: '500',
  display: 'flex',
  flexWrap: 'wrap',
  width: Dimensions.get('window').width - 100
}));

const storyImage = styles.lazy<number, ImageStyle>((size) => () => ({
  width: size,
  height: size,
  borderRadius: 4
}));

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontSize: t.type.size.xs,
  fontWeight: '500',
  marginRight: 5
}));

const appName = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size['2xs'],
  fontWeight: '300'
}));

const footerText = styles.one<TextStyle>(() => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  alignItems: 'center'
}));

const restText = styles.one<TextStyle>(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row'
}));

const icon = styles.lazy<number, ViewStyle>((size) => (t) => ({
  borderRadius: 4,
  width: size,
  height: size,
  color: t.color.accent,
  padding: 6
}));

const rest = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  marginHorizontal: 4,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'nowrap'
}));

const footerRestText = styles.lazy<number, ViewStyle>(() => (t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  marginLeft: 3
}));

const rotate90 = {
  transform: [{ rotateY: '180deg' }]
};

const skeletonContainer = styles.lazy<number, ViewStyle>(() => (t) => ({
  backgroundColor: t.color.bodyBg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accentLight
}));

const skeletonTitleContainer = styles.lazy<number, ViewStyle>(() => (t) => ({
  backgroundColor: t.color.bodyBg
}));

const storySkeletonImage = styles.lazy<number, ViewStyle>(() => (t) => ({
  display: 'flex',
  borderRadius: 10,
  flexDirection: 'column',
  justifyContent: 'center',
  height: 60,
  width: 60,
  backgroundColor: t.color.accent
}));

const storySkeletonTitle = styles.lazy<number, ViewStyle>(() => (t) => ({
  width: Dimensions.get('window').width - 200,
  height: 13,
  backgroundColor: t.color.accent
}));

const storySkeletonBy = styles.lazy<number, ViewStyle>(() => (t) => ({
  height: 13,
  width: 30,
  backgroundColor: t.color.accent
}));

const storySkeletonMetadata = styles.lazy<number, ViewStyle>(() => (t) => ({
  height: 13,
  width: 90,
  backgroundColor: t.color.accent
}));
