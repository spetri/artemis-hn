import RenderHTML, { type MixedStyleRecord, type RenderersProps } from 'react-native-render-html';

import React, { type FC, useMemo } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  Text,
  type TextProps,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  type NativeStackNavigationProp,
  type NativeStackScreenProps
} from '@react-navigation/native-stack';
import { ago } from '../../../../utils/ago';
import { type StackParamList } from '../../../routers';
import { styles, useDash } from '../../../../../dash.config';
import { linkify } from '../../../../utils/util';
import { type HackerNewsComment } from '../../../../types/hn-api';
import Icon from 'react-native-vector-icons/Ionicons';
import { ParentComment } from '../ParentComment/ParentComment';
import { useAnimateFade } from '../../../../hooks/use-animate-fade';

type CommentThreadHeaderProps = {
  data: HackerNewsComment;
  parentComments: any;
  setContainerHeight: (number: number) => void;
  setMainHeight: (number: number) => void;
}

export const CommentThreadHeader: FC<CommentThreadHeaderProps> = ({
  data,
  setContainerHeight,
  setMainHeight,
  parentComments
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const parentStory = parentComments[0];
  const { fadeIn, fadeOut, animated } = useAnimateFade();
  const dimensions = useWindowDimensions();
  const { theme } = useDash();
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
  const parentStoryHtml = useMemo(
    () =>
      parentStory &&
      'text' in parentStory &&
      parentStory.text && { html: linkify(parentStory.text) },
    [parentStory]
  );

  return !data || !parentStory ? null : (
    <View
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        setContainerHeight(layout.height);
      }}
    >
      <SafeAreaView>
        <View style={header()}>
          <Pressable
            style={backButton()}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Animated.View style={{ opacity: animated }}>
              <Icon name="chevron-left" size={18} color="textAccent" />
            </Animated.View>
          </Pressable>
        </View>
      </SafeAreaView>

      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        onPress={() => {
          navigation.push('Thread', {
            id: parentStory.id
          });
        }}
      >
        <Animated.View style={{ opacity: animated }}>
          <Text numberOfLines={4} adjustsFontSizeToFit style={title()}>
            {parentStory.title}
          </Text>
        </Animated.View>
      </Pressable>

      {parentStoryHtml && (
        <RenderHTML
          contentWidth={dimensions.width}
          source={parentStoryHtml}
          baseStyle={content()}
          tagsStyles={htmlTagStyles}
          defaultTextProps={htmlDefaultTextProps}
          renderersProps={htmlRenderersProps}
          enableExperimentalBRCollapsing
          enableExperimentalGhostLinesPrevention
          enableExperimentalMarginCollapsing
        />
      )}

      {(parentComments.slice(1) as HackerNewsComment[]).map((comment) => (
        <ParentComment
          key={comment.id}
          comment={comment}
          htmlRenderersProps={htmlRenderersProps}
          contentWidth={dimensions.width}
          htmlTagStyles={htmlTagStyles}
          navigation={navigation}
        />
      ))}

      <View
        style={parentCommentContainer()}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setMainHeight(layout.height);
        }}
      >
        <View style={parentCommentMarker()} />
        <View style={byLine}>
          <Pressable
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() => {
              navigation.navigate('User', { id: data.by });
            }}
          >
            <Animated.View style={{ opacity: animated }}>
              <Text style={byStyle()}>@{data.by}</Text>
            </Animated.View>
          </Pressable>
          <Text style={agoStyle()}>{ago.format(new Date(data.time * 1000), 'mini')}</Text>
        </View>

        {htmlSource && (
          <RenderHTML
            contentWidth={dimensions.width}
            source={htmlSource}
            baseStyle={commentStoryContent()}
            tagsStyles={htmlTagStyles}
            defaultTextProps={htmlDefaultTextProps}
            renderersProps={htmlRenderersProps}
            enableExperimentalBRCollapsing
            enableExperimentalGhostLinesPrevention
            enableExperimentalMarginCollapsing
          />
        )}
      </View>
    </View>
  );
};

const header = styles.one<ViewStyle>((t) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  padding: t.space.md,
  paddingLeft: t.space.lg
}));

const backButton = styles.one<ViewStyle>((t) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: 18 * (t.type.size.base / 16) + t.space.sm * 2,
  height: 18 * (t.type.size.base / 16) + t.space.sm * 2,
  borderRadius: t.radius.full,
  marginRight: t.space.md,
  backgroundColor: t.color.accentLight
}));

const title = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xl,
  fontWeight: '900',
  padding: t.space.lg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md
}));

const content = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: '400',
  padding: t.space.lg,
  paddingTop: 0,
  paddingBottom: 0
}));

const parentCommentContainer = styles.one<ViewStyle>((t) => ({
  padding: t.space.lg,
  paddingTop: 0,
  marginLeft: t.space.md,
  borderLeftWidth: 2,
  borderLeftColor: t.color.primary
}));

const parentCommentMarker = styles.one<ViewStyle>((t) => ({
  position: 'absolute',
  left: -5,
  top: 0,
  width: 8,
  height: 8,
  borderRadius: t.radius.full,
  backgroundColor: t.color.primary
}));

const commentStoryContent = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: '400'
}));

const byLine: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between'
};

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: '700',
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
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

export type CommentThreadHeader = NativeStackScreenProps<StackParamList, 'Thread'>;
