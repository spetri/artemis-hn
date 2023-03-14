import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { type FC } from 'react';
import {
  Animated,
  Image,
  type ImageStyle,
  Pressable,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';
import { styles, useDash } from '../../../../dash.config';
import { useMetadata } from '../../../hooks/use-metadata';
import { type StackParamList } from '../../../screens/routers';
import { type HackerNewsStory } from '../../../types/hn-api';
import { Skeleton } from '../../Skeleton/Skeleton';
import { pluralize } from '../../../utils/pluralize';
import { ago } from '../../../utils/ago';
import { useAnimateFade } from '../../../hooks/use-animate-fade';

type ComplexStoryProps = {
  data: HackerNewsStory;
  index: number;
};

export const ComplexStory: FC<ComplexStoryProps> = ({ data, index }) => {
  const url = new URL(data.url);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const metadata = useMetadata(url);
  const { fadeIn, fadeOut, animated } = useAnimateFade();
  const {
    tokens: { color }
  } = useDash();

  if (metadata == null) {
    return (
      <View style={storyContainer(index)}>
        <Skeleton style={storySkeleton(index)} />
      </View>
    );
  }

  return (
    <View style={storyContainer(index)}>
      {/* image */}
      {metadata?.image ? (
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          onPress={() => {
            navigation.push('Browser', {
              title: data.title,
              url: url.toString()
            });
          }}
        >
          <Animated.View style={{ opacity: animated }}>
            <Image style={storyImage(index)} source={{ uri: metadata?.image }} />
          </Animated.View>
        </Pressable>
      ) : null}

      {/* url */}
      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        onPress={() => {
          navigation.push('Browser', {
            title: metadata.applicationName || url.hostname,
            url: url.origin
          });
        }}
      >
        <Animated.View style={[hostContainerStyle, { opacity: animated }]}>
          <Image style={favicon()} source={{ uri: metadata.favicon }} />

          <Text style={hostname()} numberOfLines={1} ellipsizeMode="tail">
            {metadata.applicationName || url.host.replace(/^www\./, '')}
          </Text>
        </Animated.View>
      </Pressable>

      {/* titles */}
      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        onPress={() => {
          navigation.push('Browser', {
            title: data.title,
            url: url.toString()
          });
        }}
      >
        <Animated.View style={{ opacity: animated }}>
          <Text
            style={storyTitle(index)}
            adjustsFontSizeToFit
            numberOfLines={index === 0 && !metadata.image ? 5 : index < 5 && metadata.image ? 4 : 7}
          >
            {data.title}
          </Text>
        </Animated.View>
      </Pressable>

      {/* secondary info */}
      <View>
        <View style={byLine}>
          <Pressable
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() => {
              navigation.push('User', { id: data.by });
            }}
          >
            <Animated.View style={{ opacity: animated }}>
              <Text style={byStyle()}>@{data.by}</Text>
            </Animated.View>
          </Pressable>
          <Text style={agoStyle()}>{ago.format(new Date(data.time * 1000), 'mini')}</Text>
        </View>

        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          onPress={() => {
            navigation.push('Thread', { id: data.id });
          }}
        >
          <Animated.View style={[footerText(), { opacity: animated }]}>
            <Text style={score()}>
              <AntDesignIcon size={13} name="arrowup" color={color.primary} />
              <Text>{data.score} &bull;{' '}</Text>
            </Text>
            <Animated.View style={{ opacity: animated }}>
              <Text style={commentsStyle()}>{pluralize(data.descendants, 'comment')}</Text>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: index === 0 || index > 4 ? '100%' : '50%',
  padding: t.space.lg,
  paddingTop: index === 0 ? t.space.xl : index < 5 ? t.space.md : t.space.lg,
  paddingBottom: index === 0 ? t.space.xl : index < 5 ? t.space.lg : t.space.lg
}));

const storySkeleton = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: '100%',
  height: index === 0 || index > 4 ? 172 : 96,
  marginBottom: t.space.md,
  borderRadius: t.radius.secondary
}));

const score = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontWeight: '700'
}));

const storyImage = styles.lazy<number, ImageStyle>((index: number) => (t) => ({
  width: '100%',
  height: index === 0 || index > 4 ? 172 : 96,
  marginBottom: t.space.md,
  borderRadius: t.radius.secondary
}));

const hostContainerStyle: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center'
};

const favicon = styles.one<ImageStyle>((t) => ({
  width: t.type.size.base,
  height: t.type.size.base,
  borderRadius: t.radius.md,
  marginRight: t.space.sm
}));

const hostname = styles.one<TextStyle>((t) => ({
  flex: 1,
  width: '100%',
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '300'
}));

const storyTitle = styles.lazy<number, TextStyle>((index: number) => (t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size[index === 0 ? '6xl' : index < 5 ? 'base' : 'sm'],
  fontWeight: index === 0 ? '900' : index < 5 ? '800' : '700',
  letterSpacing: index < 4 ? t.type.tracking.tighter : t.type.tracking.tight,
  paddingTop: t.space.sm,
  paddingBottom: t.space.sm
}));

const byLine: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between'
};

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '300',
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0,
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '300'
}));

const footerText = styles.one<TextStyle>((t) => ({
  fontWeight: '600',
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  display: "flex",
  flexDirection: "row",
}));

const commentsStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontWeight: '300',
}));
