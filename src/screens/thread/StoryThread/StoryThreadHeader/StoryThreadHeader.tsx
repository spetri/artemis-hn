import RenderHTML, { type MixedStyleRecord, type RenderersProps } from 'react-native-render-html';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { type FC, useMemo } from 'react';
import {
  Image,
  type ImageStyle,
  Text,
  type TextProps,
  type TextStyle,
  TouchableHighlight,
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

type StoryThreadHeaderProps = {
  data:
    | HackerNewsStory
    | HackerNewsJob
    | HackerNewsStory
    | HackerNewsJob
    | HackerNewsPoll
    | HackerNewsAsk;
  metadata: any;
  url: any;
};

export const StoryThreadHeader: FC<StoryThreadHeaderProps> = ({ data, metadata, url }) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const dimensions = useWindowDimensions();
  const {
    theme,
    tokens: { color }
  } = useDash();
  const htmlRenderersProps = useMemo<Partial<RenderersProps>>(
    () => ({
      a: {
        onPress(_, url) {
          navigation.navigate('Browser', { title: url, url });
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

  const urlBar = () => {
    const image = metadata?.image || metadata?.favicon;

    if (metadata && url) {
      return (
        <TouchableHighlight
          underlayColor={color.accentLight}
          onPress={() => {
            navigation.navigate('Browser', {
              title: metadata.applicationName || url.hostname,
              url: url.origin
            });
          }}
        >
          <View style={imageLink()}>
            <Image
              style={storyImage()}
              source={{ uri: image ?? <IoniconIcon name="md-newspaper-outline" size={40} /> }}
            />

            <Text style={hostname()} numberOfLines={1} ellipsizeMode="tail">
              {metadata.applicationName || url.host.replace(/^www\./, '')}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
  };

  return !data ? null : (
    <View>
      <TouchableHighlight
        underlayColor={color.accentLight}
        onPress={() => {
          data &&
            url &&
            navigation.navigate('Browser', {
              title: data.title,
              url: url.toString()
            });
        }}
      >
        <View style={hostContainerStyle()}>
          <Text numberOfLines={4} adjustsFontSizeToFit style={title()}>
            {data.title}
          </Text>
        </View>
      </TouchableHighlight>

      <View>{urlBar()}</View>

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

      {data.type !== 'job' && (data.score || ('descendants' in data && data.descendants > 0)) && (
        <TouchableHighlight
          underlayColor={color.accentLight}
          onPress={() => {
            navigation.navigate('User', { id: data.by });
          }}
        >
          <View style={rest()}>
            <Text style={subtitle()}>
              <Text style={byStyle()}>{data.by} &bull; </Text>
              {data.score && (
                <Text style={{ color: color.primary }}>
                  <AntDesignIcon size={13} name="arrowup" color={color.primary} />
                  {data.score}
                </Text>
              )}
              {'descendants' in data && (
                <Text> &bull; {pluralize(data.descendants, 'comment')}</Text>
              )}
            </Text>
            <Text style={agoStyle()}>{ago.format(new Date(data.time * 1000), 'mini')}</Text>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

const title = styles.one<TextStyle>((t) => ({
  marginTop: t.space.md,
  color: t.color.textPrimary,
  fontSize: t.type.size.base,
  fontWeight: '500'
}));

const subtitle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: '600',
  paddingLeft: t.space.lg,
  paddingBottom: t.space.lg
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

const imageLink = styles.one<ViewStyle>((t) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: t.space.lg,
  marginVertical: t.space.md,
  backgroundColor: t.color.accent,
  borderRadius: 8
}));

const storyImage = styles.one<ImageStyle>(() => ({
  width: 45,
  height: 45,
  borderTopLeftRadius: 8,
  borderBottomLeftRadius: 8
}));

const hostname = styles.one<TextStyle>((t) => ({
  width: '100%',
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '400',
  marginLeft: t.space.md
}));

const content = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: '400',
  padding: t.space.lg,
  paddingTop: 0,
  paddingBottom: 0
}));

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: '500'
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '500',
  marginBottom: t.space.lg,
  marginRight: t.space.lg
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

const rest = styles.one<TextStyle>((t) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accentLight
}));

export type StoryThreadHeader = NativeStackScreenProps<StackParamList, 'Thread'>;
