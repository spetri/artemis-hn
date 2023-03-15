import RenderHTML, { MixedStyleRecord, RenderersProps } from 'react-native-render-html';
import { type FC, memo, useMemo } from 'react';
import {
  Animated,
  Pressable,
  Text,
  type TextProps,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';
import { type HackerNewsComment } from '../../../../types/hn-api';
import { ago } from '../../../../utils/ago';
import { type StackParamList } from '../../../routers';
import { linkify } from '../../../../utils/util';
import { styles } from '../../../../../dash.config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAnimateFade } from '../../../../hooks/use-animate-fade';

type ParentCommentType = {
  comment: HackerNewsComment;
  contentWidth: number;
  htmlRenderersProps: Partial<RenderersProps>;
  htmlTagStyles: MixedStyleRecord;
  navigation: NativeStackNavigationProp<StackParamList>;
}

export const ParentComment: FC<ParentCommentType> = memo(
  ({ comment, contentWidth, htmlRenderersProps, htmlTagStyles, navigation }) => {
    const { fadeIn, fadeOut, animated } = useAnimateFade();

    const htmlSource = useMemo(
      () => ({
        html: linkify(comment.text)
      }),
      [comment.text]
    );

    return (
      <View style={parentCommentContainer()}>
        <View style={parentCommentMarker()} />
        <View style={byLine}>
          <Pressable
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() => {
              navigation.navigate('User', { id: comment.by });
            }}
          >
            <Animated.View style={{ opacity: animated }}>
              <Text style={byStyle()}>@{comment.by}</Text>
            </Animated.View>
          </Pressable>
          <Pressable
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() => {
              navigation.push('Thread', {
                id: comment.id
              });
            }}
          >
            <Animated.View style={{ opacity: animated }}>
              <Text style={agoStyle()}>{ago.format(new Date(comment.time * 1000), 'mini')}</Text>
            </Animated.View>
          </Pressable>
        </View>

        <RenderHTML
          contentWidth={contentWidth}
          source={htmlSource}
          baseStyle={commentContent()}
          tagsStyles={htmlTagStyles}
          defaultTextProps={htmlDefaultTextProps}
          renderersProps={htmlRenderersProps}
          enableExperimentalBRCollapsing
          enableExperimentalGhostLinesPrevention
          enableExperimentalMarginCollapsing
        />
      </View>
    );
  }
);

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

const commentContent = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: '300'
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.sm,
  fontWeight: '300'
}));

const htmlDefaultTextProps: TextProps = {
  selectable: true
};
