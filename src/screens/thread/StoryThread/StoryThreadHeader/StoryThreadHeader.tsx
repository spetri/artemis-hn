import RenderHTML, { type MixedStyleRecord, type RenderersProps } from 'react-native-render-html';
import { type FC, useMemo } from 'react';
import {
  Image,
  type ImageStyle,
  Pressable,
  Text,
  type TextProps,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle
} from 'react-native';
import {
  type NativeStackNavigationProp,
  type NativeStackScreenProps
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ago } from '../../../../utils/ago';
import { pluralize } from '../../../../utils/pluralize';
import { type StackParamList } from '../../../routers';
import { styles, useDash } from '../../../../../dash.config';
import { linkify } from '../../../../utils/util';
import {
  type HackerNewsAsk,
  type HackerNewsJob,
  type HackerNewsPoll,
  type HackerNewsStory
} from '../../../../types/hn-api';

interface StoryThreadHeaderProps {
  data:
    | HackerNewsStory
    | HackerNewsJob
    | HackerNewsStory
    | HackerNewsJob
    | HackerNewsPoll
    | HackerNewsAsk;
  metadata: any;
  url: any;
}

export const StoryThreadHeader: FC<StoryThreadHeaderProps> = ({ data, metadata, url }) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const dimensions = useWindowDimensions();
  const { theme } = useDash();
  const htmlRenderersProps = useMemo<Partial<RenderersProps>>(
    () => ({
      a: {
        onPress(_, url) {
          navigation.navigate('BrowserModal', { title: url, url });
        }
      }
    }),
    [navigation]
  );

  const htmlTagStyles = useMemo<MixedStyleRecord>(() => ({ a: link() }), [theme]);

  const htmlSource = useMemo(
    () =>
      'text' in data && {
        html: linkify(data.text)
      },
    [data]
  );

  return !data ? null : (
    <View>
      <Pressable
        onPress={() => {
          data &&
            url &&
            navigation.navigate('BrowserModal', {
              title: data.title,
              url: url.toString()
            });
        }}
      >
        <Image style={storyImage()} source={{ uri: metadata?.image }} />
      </Pressable>

      {metadata && url && (
        <Pressable
          onPress={() => {
            navigation.navigate('BrowserModal', {
              title: metadata.applicationName || url.hostname,
              url: url.origin
            });
          }}
        >
          <View style={hostContainerStyle()}>
            <Image style={favicon()} source={{ uri: metadata.favicon }} />

            <Text style={hostname()} numberOfLines={1} ellipsizeMode="tail">
              {metadata.applicationName || url.host.replace(/^www\./, '')}
            </Text>
          </View>
        </Pressable>
      )}

      <Pressable
        onPress={() => {
          data &&
            url &&
            navigation.navigate('BrowserModal', {
              title: data.title,
              url: url.toString()
            });
        }}
      >
        <Text numberOfLines={4} adjustsFontSizeToFit style={title()}>
          {data.title}
        </Text>
      </Pressable>

      {htmlSource && (
        <RenderHTML
          contentWidth={dimensions.width}
          source={htmlSource}
          baseStyle={content()}
          tagsStyles={htmlTagStyles}
          defaultTextProps={htmlDefaultTextProps}
          renderersProps={htmlRenderersProps}
          enableExperimentalBRCollapsing
          enableExperimentalGhostLinesPrevention
          enableExperimentalMarginCollapsing
        />
      )}

      <View style={storyByLine()}>
        <Pressable
          onPress={() => {
            navigation.navigate('User', { id: data.by });
          }}
        >
          <Text style={byStyle()}>{data.by}</Text>
        </Pressable>
        <Text style={agoStyle()}>{ago.format(new Date(data.time * 1000), 'mini')}</Text>
      </View>

      {data.type !== 'job' && (data.score || ('descendants' in data && data.descendants > 0)) && (
        <Text style={subtitle()}>
          {data.score && <Text style={score()}>⇧{data.score}</Text>}
          {'descendants' in data && <> &bull; {pluralize(data.descendants, 'comment')}</>}
        </Text>
      )}
    </View>
  );
};

const title = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xl,
  fontWeight: '900',
  padding: t.space.lg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md
}));

const subtitle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: '600',
  padding: t.space.lg,
  paddingTop: t.space.md
}));

const score = styles.one<TextStyle>((t) => ({
  color: t.color.primary
}));

const storyImage = styles.one<ImageStyle>((t) => ({
  width: '100%',
  height: 240,
  marginBottom: t.space.md
}));

const hostContainerStyle = styles.one<ViewStyle>((t) => ({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  paddingRight: t.space.lg,
  paddingLeft: t.space.lg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md
}));

const favicon = styles.one<ImageStyle>((t) => ({
  width: 20,
  height: 20,
  borderRadius: t.radius.md,
  marginRight: t.space.sm
}));

const hostname = styles.one<TextStyle>((t) => ({
  flex: 1,
  width: '100%',
  color: t.color.textAccent,
  fontSize: t.type.size['2xs'],
  fontWeight: '300'
}));

const content = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: '400',
  padding: t.space.lg,
  paddingTop: 0,
  paddingBottom: 0
}));

const storyByLine = styles.one<ViewStyle>((t) => ({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingLeft: t.space.lg,
  paddingRight: t.space.lg,
  paddingBottom: t.space.md
}));

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size['2xs'],
  fontWeight: '700',
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size['2xs'],
  fontWeight: '300'
}));

const link = styles.one((t) => ({
  color: t.color.textPrimary,
  fontWeight: '600',
  textDecorationLine: 'underline',
  textDecorationColor: t.color.primary
}));

const htmlDefaultTextProps: TextProps = {
  selectable: true
};

export type StoryThreadHeader = NativeStackScreenProps<StackParamList, 'Thread'>;
