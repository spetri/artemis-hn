import { useNavigation } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MixedStyleRecord, RenderersProps, RenderHTML } from 'react-native-render-html';
import useSWR from 'swr';
import Collapsible from 'react-native-collapsible';

import { type FC, memo, useMemo, useState } from 'react';
import {
  Text,
  type TextProps,
  type TextStyle,
  TouchableHighlight,
  useWindowDimensions,
  View,
  type ViewStyle
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ListItem } from '@rneui/themed';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { styles, useDash } from '../../../../dash.config';
import { type HackerNewsComment } from '../../../types/hn-api';
import { ago } from '../../../utils/ago';
import { pluralize } from '../../../utils/pluralize';
import { type StackParamList } from '../../routers';
import { HACKER_NEWS_API } from '../../../constants/api';
import { linkify } from '../../../utils/util';
import { usePreferences } from '../../Settings/usePreferences';
import { defaultPreferences } from '../../Settings/useTheme';
import { usePreferencesStore } from '../../../contexts/store';
import { useAnimateFade } from '../../../hooks/use-animate-fade';

type CommentProps = {
  id: number;
  index: number;
  depth: number;
}

export const Comment: FC<CommentProps> = memo(
  function Comment({ id, depth }) {
    const [collapsed, setCollapsed] = useState(false);
    const actionSheet = useActionSheet();
    const [commentColors] = usePreferences('commentColors', defaultPreferences.commentColors);

    const {
      theme,
      tokens: { color }
    } = useDash();
    const displayReplies = usePreferencesStore((state) => state.displayReplies);

    const commentData = useSWR<HackerNewsComment>(
      id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`,
      async (key) =>
        await fetch(key, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then(async (res) => await res.json())
    );
    const dimensions = useWindowDimensions();
    const [showingReplies, setShowingReplies] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
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

    const htmlTagStyles = useMemo<MixedStyleRecord>(() => ({ a: link(), pre: pre() }), [theme]);

    const htmlSource = useMemo(
      () =>
        commentData.data != null && {
          html: linkify(commentData.data.text)
        },
      [commentData.data]
    );

    if (commentData.data == null) {
      return (
        <View>
          <Skeleton />
        </View>
      );
    }

    if (commentData.data.dead || commentData.data.deleted) {
      return null;
    }

    const comment = commentData.data;

    const onCollapse = (reset) => {
      collapsed ? setCollapsed(false) : setCollapsed(true);
      reset();
    };

    const rightSwipeActions = (reset) => {
      const { fadeIn, fadeOut, animated } = useAnimateFade();

      return collapsed ? (
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={() => onCollapse(reset)}
        >
          <View style={collapsedView()}>
            <Text style={collapsedText()}>
              <MaterialIcon name="arrow-collapse-down" color={color.textPrimary} size={20} />
            </Text>
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={() => onCollapse(reset)}
        >
          <View style={openView()}>
            <Text style={openText()}>
              <MaterialIcon name="arrow-collapse-up" color={color.textPrimary} size={30} />
            </Text>
          </View>
        </TouchableHighlight>
      );
    };

    const actionSheetOptions = () => {
      const collapseText = collapsed ? 'Open Thread' : 'Collapse Thread';
      actionSheet.showActionSheetWithOptions(
        {
          options: [collapseText, 'View Thread', 'Copy Text', 'View Profile', 'Cancel'],
          userInterfaceStyle: 'dark',
          tintIcons: true,
          icons: [
            <MaterialIcon name="arrow-collapse-left" color={color.accent} size={25} />,
            <MaterialIcon name="arrow-collapse-left" color={color.accent} size={25} />,
            <MaterialIcon name="arrow-collapse-left" color={color.accent} size={25} />,
            <MaterialIcon name="arrow-collapse-left" color={color.accent} size={25} />,
            <MaterialIcon name="arrow-collapse-left" color={color.accent} size={25} />
          ]
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0: {
              onCollapse(() => collapsed);
              return;
            }
            case 1: {
              navigation.push('Thread', {
                id: comment.id
              });
              return;
            }
            case 2:
              return;
            case 3: {
              navigation.navigate('User', {
                id: comment.by
              });
              return;
            }
            case 4:
          }
        }
      );
    };

    return (
      <>
        <ListItem.Swipeable
          containerStyle={swipeableContainer()}
          key={comment.id}
          rightContent={rightSwipeActions}
          rightWidth={75}
          rightStyle={{ backgroundColor: color.bodyBg }}
          style={noMarginPadding()}
        >
          <TouchableHighlight underlayColor={color.accentLight}
            onPress={() => onCollapse(() => collapsed)} style={width100()}>
            <View
              style={commentContainer({
                depth,
                commentColors:
                  commentColors != null ? color[commentColors?.[Math.floor(depth)]] : commentColors
              })}
            >
              <View style={byLine(depth)}>
                <TouchableHighlight underlayColor={color.accentLight}
                  onPress={() => {
                    navigation.navigate('User', { id: comment.by });
                  }}
                >
                  <View>
                    <Text style={byStyle()}>{comment.by}</Text>
                  </View>
                </TouchableHighlight>
                <View style={TouchableHighlightThread()}>
                  <TouchableHighlight underlayColor={color.accentLight}
                    onPress={() => {
                      navigation.push('Thread', {
                        id: comment.id
                      });
                    }}
                  >
                    <View>
                      <Text style={agoStyle()}>
                        {ago.format(new Date(comment.time * 1000), 'mini')}
                      </Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight underlayColor={color.accentLight}
                    onPress={actionSheetOptions}>
                    <View>
                      <Ionicon name="ellipsis-horizontal" color={color.textPrimary} size={18} />
                    </View>
                  </TouchableHighlight>
                </View>
              </View>

              {htmlSource != null && (
                <Collapsible collapsed={collapsed}>
                  <RenderHTML
                    contentWidth={dimensions.width}
                    source={htmlSource}
                    baseStyle={commentContent(depth)}
                    tagsStyles={htmlTagStyles}
                    defaultTextProps={htmlDefaultTextProps}
                    renderersProps={htmlRenderersProps}
                    enableExperimentalBRCollapsing
                    enableExperimentalGhostLinesPrevention
                    enableExperimentalMarginCollapsing
                  />
                </Collapsible>
              )}
            </View>
          </TouchableHighlight>
        </ListItem.Swipeable>

        {(showingReplies || displayReplies) &&
          !collapsed &&
          comment.kids != null &&
          comment.kids.length > 0 &&
          comment.kids.map((id, index) => (
            <Comment key={id} id={id} index={index} depth={depth + 1.5} />
          ))}

        {comment.kids?.length > 0 && !showingReplies && !displayReplies && !collapsed && (
          <View
            style={commentContainerReply({
              depth,
              commentColors:
                commentColors != null ? commentColors?.[Math.floor(depth)] : commentColors
            })}
          >
            <TouchableHighlight underlayColor={color.accentLight}
              onPress={() => {
                setShowingReplies((current) => !current);
              }}
            >
              <View>
                <Text style={replies(depth)}>
                  {pluralize(comment.kids?.length ?? 0, 'reply', 'replies')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </>
    );
  },
  (prev, next) => prev.id === next.id
);

const width100 = styles.one<TextStyle>(() => ({
  width: '100%'
}));

const TouchableHighlightThread = styles.one<TextStyle>(() => ({
  display: 'flex',
  flexDirection: 'row',
  marginRight: 10
}));

const noMarginPadding = styles.one<TextStyle>(() => ({
  margin: 0,
  padding: 0
}));

const swipeableContainer = styles.one<TextStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  margin: 0,
  padding: 0
}));

const collapsedView = styles.one<TextStyle>((t) => ({
  backgroundColor: t.color.primary,
  justifyContent: 'center',
  height: '100%'
}));

const collapsedText = styles.one<TextStyle>(() => ({
  color: '#1b1a17',
  paddingHorizontal: 50,
  transform: [{ rotateY: '180deg' }]
}));

const openView = styles.one<TextStyle>((t) => ({
  backgroundColor: t.color.primary,
  justifyContent: 'center',
  alignItems: 'flex-end',
  height: '100%'
}));

const openText = styles.one<TextStyle>(() => ({
  color: '#1b1a17',
  paddingHorizontal: 50
}));

const commentContainer = styles.lazy<any>(
  (obj: { depth: number; commentColors: number }) => (t) => ({
    width: '100%',
    padding: t.space.md,
    paddingBottom: 10,
    borderTopWidth: t.borderWidth.hairline,
    borderTopColor: t.color.accent,
    ...(obj.depth > 1
      ? ({
        borderLeftWidth: 2,
        borderLeftColor: obj.commentColors,
        marginLeft: t.space.md * (obj.depth - 1)
      } as const)
      : {})
  })
);

const commentContainerReply = styles.lazy<any>(
  (obj: { depth: number; commentColors: number }) => (t) => ({
    padding: t.space.sm,
    paddingHorizontal: t.space.md,
    borderTopWidth: t.borderWidth.hairline,
    borderTopColor: t.color.accent,
    ...(obj.depth > 0
      ? ({
        borderLeftWidth: 2,
        borderLeftColor: obj.commentColors,
        marginLeft: t.space.md * (obj.depth + 0.5)
      } as const)
      : {})
  })
);

const commentContent = styles.lazy<number, ViewStyle>((depth) => (t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: '300',
  ...(depth > 0
    ? ({
      marginRight: t.space.md * (depth + 0.5)
    } as const)
    : {})
}));

const byLine = styles.lazy<number, ViewStyle>((depth) => (t) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  ...(depth > 0
    ? ({
      marginRight: t.space.md * (depth - 1.5)
    } as const)
    : {})
}));

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: '700',
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0
}));

const replies = styles.one<any>((t, depth) => ({
  color: t.color.lightBlue300,
  fontSize: t.type.size["2xs"],
  fontWeight: '700',
  padding: t.space.sm,
  paddingTop: t.space.md,
  paddingLeft: 0,
  width: '100%',
  ...(depth > 0
    ? ({
      marginLeft: t.space.md * (depth - 2)
    } as const)
    : {})
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '300',
  paddingRight: 10
}));

const link = styles.one((t) => ({
  color: t.color.textPrimary,
  fontWeight: '600',
  textDecorationLine: 'underline',
  textDecorationColor: t.color.primary
}));

const pre = styles.one((t) => ({
  color: t.color.textPrimary,
  backgroundColor: t.color.accent,
  borderRadius: t.radius.xl,
  padding: t.space.lg,
  paddingBottom: t.space.sm,
  fontSize: t.type.size.xs,
}));

const htmlDefaultTextProps: TextProps = {
  selectable: true
};
