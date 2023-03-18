import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { shallow } from 'zustand/shallow';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { type FC } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Text,
  type TextStyle,
  TouchableHighlight,
  View,
  type ViewStyle
} from 'react-native';
import { ListItem, Skeleton } from '@rneui/themed';
import { styles, useDash } from '../../../../dash.config';
import { useMetadata } from '../../../hooks/use-metadata';
import { type StackParamList } from '../../../screens/routers';
import { type HackerNewsStory } from '../../../types/hn-api';
import { ago } from '../../../utils/ago';
import { usePreferencesStore } from '../../../contexts/store';


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
  const { setCachedThreadId } = usePreferencesStore((state) => ({
    setCachedThreadId: state.setCachedThreadId,
  }), shallow);

  const {
    tokens: { color }
  } = useDash();

  if (metadata == null) {
    return (
      <View>
        <ListItem containerStyle={skeletonContainer(index)}>
          <Skeleton animation="pulse" style={storySkeletonImage(index)} />
          <ListItem.Content>
            <Skeleton style={storySkeletonTitle(index)} />
            <ListItem containerStyle={skeletonContainer(index)}>
              <Skeleton style={storySkeletonBy(index)} />
              <Skeleton style={storySkeletonMetadata(index)} />
            </ListItem>
          </ListItem.Content>
        </ListItem>
      </View>
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
    if (metadata?.image) {
      return (
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={openLinkInBrowser ? inAppBrowser : systemBrowser}>
          <View>
            <Image style={storyImage(thumbnailSize)} source={{ uri: metadata?.image }} />
          </View>
        </TouchableHighlight>
      );
    } else if (metadata?.favicon) {
      return (
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={openLinkInBrowser ? inAppBrowser : systemBrowser}>
          <View>
            <Image style={storyImage(thumbnailSize)} source={{ uri: metadata.favicon }} />
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={openLinkInBrowser ? inAppBrowser : systemBrowser}>
          <View>
            <IoniconIcon name="md-newspaper-outline" style={icon(thumbnailSize)} size={40} />
          </View>
        </TouchableHighlight >
      );
    }
  };

  const navigateToThread = (threadId) => {
    setCachedThreadId(threadId);
    return navigation.push('Thread', { id: threadId });
  }

  return (
    metadata && (
      <View style={storyContainer(thumbnailPosition)} key={data.id}>
        <View style={imageColumn(index)}>{displayImage()}</View>
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={() => navigateToThread(data.id)}
        >
          <View style={bodyColumn(thumbnailPosition)}>
            <View>
              <Text style={storyTitle(index)} numberOfLines={4}>
                {data.title}&nbsp;
                {displaySource ? (
                  <Text style={appName()}>
                    ({metadata.applicationName || url.host.replace(/^www\./, '')})
                  </Text>
                ) : null}
              </Text>
            </View>
            <View style={footerText()}>
              <View>
                <TouchableHighlight underlayColor={color.accentLight}
                  onPress={() => {
                    navigation.push('User', { id: data.by });
                  }}
                >
                  <Text style={byStyle()}>{data.by}</Text>
                </TouchableHighlight>
              </View>
              <View style={restText()}>
                <Text style={rest()}>
                  <AntDesignIcon size={13} name="arrowup" color={color.textAccent} />
                  <Text>{data.score}</Text>
                </Text>
                <View>
                  <View style={rest()}>
                    <Text style={rotate90}>
                      <IoniconIcon size={13} name="chatbubble-outline" color={color.textAccent} />
                    </Text>
                    <Text style={chatText(index)}>{data.descendants}</Text>
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
        </TouchableHighlight>
      </View>
    )
  );
};

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

const chatText = styles.lazy<number, ViewStyle>(() => (t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  marginLeft: 3
}));

const rotate90 = {
  transform: [{ rotateY: '180deg' }]
};

const storyContainer = styles.lazy<number, ViewStyle>((thumbnailPosition) => (t) => ({
  display: 'flex',
  flexDirection: thumbnailPosition === 'Right' ? 'row-reverse' : 'row',
  height: 85,
  width: Dimensions.get('window').width,
  borderBottomColor: t.color.accent,
  borderBottomWidth: t.borderWidth.hairline
}));

const imageColumn = styles.lazy<number, ViewStyle>(() => () => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  marginHorizontal: 15,
  justifyContent: 'center'
}));

const bodyColumn = styles.lazy<number, ViewStyle>((thumbnailPosition) => () => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width:
    thumbnailPosition === 'Right'
      ? -Dimensions.get('window').width
      : Dimensions.get('window').width,
  justifyContent: 'space-around',
  marginVertical: 8,
  flex: 1
}));

const storyTitle = styles.lazy<number, TextStyle>(() => (t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: '500',
  display: 'flex',
  flexWrap: 'wrap',
  width: Dimensions.get('window').width - 100
}));

const skeletonContainer = styles.lazy<number, ViewStyle>(() => (t) => ({
  backgroundColor: t.color.bodyBg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accentLight
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
  height: 15,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));

const storySkeletonBy = styles.lazy<number, ViewStyle>(() => (t) => ({
  height: 15,
  width: 30,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));

const storySkeletonMetadata = styles.lazy<number, ViewStyle>(() => (t) => ({
  height: 15,
  width: 90,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));

const storyImage = styles.lazy<number, ViewStyle>((size) => () => ({
  width: size,
  height: size,
  borderRadius: 4,
}));

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontSize: t.type.size.xs,
  fontWeight: '500',
  marginRight: 5
}));

const appName = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: '300'
}));

const footerText = styles.one<TextStyle>(() => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  alignItems: 'center'
}));

const restText = styles.one<TextStyle>((t) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row'
}));

const icon = styles.lazy<number, ViewStyle>((size) => (t) => ({
  borderRadius: 4,
  width: size,
  height: size,
  color: t.color.accentLight,
  padding: 6
}))
