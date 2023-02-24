import { useNavigation } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MixedStyleRecord, RenderersProps } from 'react-native-render-html';
import useSWR from 'swr';

import { type FC, memo, useMemo, useState } from 'react';
import {
  Pressable,
  Text,
  type TextProps,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ListItem } from '@rneui/themed';
import { Skeleton } from '../../../components/Skeleton';
import { styles, useDash } from '../../../../dash.config';
import { type HackerNewsComment } from '../../../types/hn-api';
import { ago } from '../../../utils/ago';
import { pluralize } from '../../../utils/pluralize';
import { type StackParamList } from '../../routers';
import { HACKER_NEWS_API } from '../../../constants/api';
import { linkify } from '../../../utils/util';
import { usePreferences } from '../../Settings/usePreferences';
import { defaultPreferences } from '../../Settings/useTheme';

interface CommentProps {
  id: number;
  index: number;
  depth: number;
}

export const Comment: FC<CommentProps> = memo(
  function Comment({ id, depth }) {
    const [collapsed, setCollapsed] = useState(false);
    const actionSheet = useActionSheet();
    const [commentColors] = usePreferences('commentColor', defaultPreferences.commentColor);

    const { theme } = useDash();
    const {
      tokens: { color }
    } = useDash();
    const displayReplies = usePreferences('displayReplies', false);

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
            navigation.navigate('BrowserModal', { title: url, url });
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

    const onCollapse = () => {
      collapsed ? setCollapsed(false) : setCollapsed(true);
    };

    const rightSwipeActions = () => {
      return collapsed ? (
        <Pressable onPress={onCollapse}>
          <View
            style={{
              backgroundColor: color.primary,
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Text
              style={{
                color: '#1b1a17',
                paddingHorizontal: 50,
                transform: [{ rotateY: '180deg' }]
              }}
            >
              <MaterialIcon name="arrow-collapse-left" color={color.textPrimary} size={20} />
            </Text>
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={onCollapse}>
          <View
            style={{
              backgroundColor: color.primary,
              justifyContent: 'center',
              alignItems: 'flex-end',
              height: '100%'
            }}
          >
            <Text
              style={{
                color: '#1b1a17',
                paddingHorizontal: 50
              }}
            >
              <MaterialIcon name="arrow-collapse-left" color={color.textPrimary} size={30} />
            </Text>
          </View>
        </Pressable>
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
              onCollapse();
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

    console.log(commentColors?.[Math.floor(depth)], Math.floor(depth), commentColors);

    return (
      <>
        <ListItem.Swipeable
          containerStyle={{
            backgroundColor: color.bodyBg,
            margin: 0,
            padding: 0
          }}
          key={comment.id}
          rightContent={rightSwipeActions}
          rightWidth={75}
          rightStyle={{ backgroundColor: color.bodyBg }}
          style={{ margin: 0, padding: 0 }}
        >
          <Pressable onPress={onCollapse} style={{ width: '100%' }}>
            <View
              style={commentContainer({
                depth,
                commentColors:
                  commentColors != null ? commentColors?.[Math.floor(depth)] : commentColors
              })}
            >
              <View style={byLine(depth)}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('User', { id: comment.by });
                  }}
                >
                  <Text style={byStyle()}>{comment.by}</Text>
                </Pressable>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: 10
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.push('Thread', {
                        id: comment.id
                      });
                    }}
                  >
                    <Text style={agoStyle()}>
                      {ago.format(new Date(comment.time * 1000), 'mini')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={actionSheetOptions}>
                    <Ionicon name="ellipsis-horizontal" color={color.textPrimary} size={18} />
                  </Pressable>
                </View>
              </View>

              {htmlSource != null && !collapsed && (
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
              )}
            </View>
          </Pressable>
        </ListItem.Swipeable>

        {(showingReplies || displayReplies[0] != null) &&
          !collapsed &&
          comment.kids != null &&
          comment.kids.length > 0 &&
          comment.kids.map((id, index) => (
            <Comment key={id} id={id} index={index} depth={depth + 1.5} />
          ))}

        {comment.kids?.length > 0 && !showingReplies && displayReplies[0] == null && !collapsed && (
          <View
            style={commentContainerReply({
              depth,
              commentColors:
                commentColors != null ? commentColors?.[Math.floor(depth)] : commentColors
            })}
          >
            <Pressable
              onPress={() => {
                setShowingReplies((current) => !current);
              }}
            >
              <Text style={replies(depth)}>
                {pluralize(comment.kids?.length ?? 0, 'reply', 'replies')}
              </Text>
            </Pressable>
          </View>
        )}
      </>
    );
  },
  (prev, next) => prev.id === next.id
);

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
  fontSize: t.type.size.xs,
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
  fontSize: t.type.size['2xs'],
  fontWeight: '700',
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0
}));

const replies = styles.one<any>((t, depth) => ({
  color: t.color.lightBlue300,
  fontSize: t.type.size['2xs'],
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
  fontSize: t.type.size['2xs'],
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
  fontSize: t.type.size['2xs']
}));

const htmlDefaultTextProps: TextProps = {
  selectable: true
};
