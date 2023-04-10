import { useNavigation } from '@react-navigation/native';
import * as htmlEntities from 'html-entities';
import stripTags from 'striptags';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MixedStyleRecord, RenderersProps, RenderHTML } from 'react-native-render-html';
import useSWR from 'swr';
import Collapsible from 'react-native-collapsible';

import { type FC, memo, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  Share,
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
import { ThreadReplies } from '../../../enums/enums';

type CommentProps = {
  id: number;
  index: number;
  depth: number;
};

export const Comment: FC<CommentProps> = memo(
  function Comment({ id, depth, index }) {
    const [collapsed, setCollapsed] = useState(false);
    const actionSheet = useActionSheet();
    const [commentColors] = usePreferences('commentColors', defaultPreferences.commentColors);
    const { displayReplies } = usePreferencesStore((state) => ({
      displayReplies: state.displayReplies,
      setDisplayReplies: state.setDisplayReplies
    }));
    const [showingReplies, setShowingReplies] = useState(false);
    const dimensions = useWindowDimensions();
    const [opacity] = useState(new Animated.Value(0.5));
    const {
      theme,
      tokens: { color }
    } = useDash();

    useEffect(() => {
      if (displayReplies === ThreadReplies.AUTO) {
        setShowingReplies(depth < 3);
      } else if (displayReplies === ThreadReplies.NONE) {
        setShowingReplies(false);
      }
    }, [displayReplies]);

    const { data: commentData } = useSWR<HackerNewsComment>(
      id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`,
      async (key) => {
        return await fetch(key, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then(async (res) => {
          return await res.json();
        });
      }
    );

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
        commentData != null && {
          html: linkify(commentData.text)
        },
      [commentData]
    );

    const comment = commentData;

    useEffect(() => {
      if (comment != null) {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }).start();
      }
    }, [comment?.text, opacity]);

    if (comment == null) {
      return (
        <View>
          <ListItem containerStyle={skeletonContainer({ depth })}>
            <ListItem.Content>
              <Skeleton style={storySkeletonTitle(index)} />
              <ListItem containerStyle={skeletonHeaderContainer(index)}>
                <Skeleton style={storySkeletonBy(index)} />
              </ListItem>
            </ListItem.Content>
          </ListItem>
        </View>
      );
    }

    if (comment.deleted || comment.dead) {
      return null;
    }

    const onCollapse = (reset) => {
      collapsed ? setCollapsed(false) : setCollapsed(true);
      reset();
    };

    const rightSwipeActions = (reset) => {
      return collapsed ? (
        <TouchableHighlight underlayColor={color.accentLight} onPress={() => onCollapse(reset)}>
          <View style={collapsedView()}>
            <Text style={collapsedText()}>
              <MaterialIcon name="arrow-collapse-down" color={color.textPrimary} size={20} />
            </Text>
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight underlayColor={color.accentLight} onPress={() => onCollapse(reset)}>
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
          options: [collapseText, 'View Thread', 'Share', 'View Profile', 'Cancel'],
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
              try {
                Share.share({
                  message: stripTags(htmlEntities.decode(comment.text), [], ' ')
                });
              } catch (error) {
                Alert.alert(error.message);
              }
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
          <Animated.View style={{ opacity }}>
            <Pressable
              underlayColor={color.accentLight}
              onPress={() => onCollapse(() => collapsed)}
              style={width100()}
            >
              <View
                style={commentContainer({
                  depth,
                  commentColors:
                    commentColors != null
                      ? color[commentColors?.[Math.floor(depth)]]
                      : commentColors
                })}
              >
                <View style={byLine(depth)}>
                  <TouchableHighlight
                    underlayColor={color.accentLight}
                    onPress={() => {
                      navigation.navigate('User', { id: comment.by });
                    }}
                  >
                    <View>
                      <Text style={byStyle()}>{comment.by}</Text>
                    </View>
                  </TouchableHighlight>
                  <View style={TouchableHighlightThread()}>
                    <TouchableHighlight
                      underlayColor={color.accentLight}
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
                    <TouchableHighlight
                      underlayColor={color.accentLight}
                      onPress={actionSheetOptions}
                    >
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
            </Pressable>
          </Animated.View>
        </ListItem.Swipeable>

        {showingReplies &&
          !collapsed &&
          comment?.kids != null &&
          comment.kids.length > 0 &&
          comment.kids.map((id, index) => (
            <Comment key={id} id={id} index={index} depth={depth + 1.5} />
          ))}

        {comment?.kids != null && comment.kids?.length > 0 && !showingReplies && !collapsed && (
          <View
            style={commentContainerReply({
              depth,
              commentColors:
                commentColors != null ? commentColors?.[Math.floor(depth)] : commentColors
            })}
          >
            <TouchableHighlight
              underlayColor={color.accentLight}
              onPress={() => {
                setShowingReplies((current) => {
                  return !current;
                });
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

const commentContainer = styles.lazy((obj: { depth: number; commentColors: number }) => (t) => ({
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
}));

const commentContainerReply = styles.lazy(
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
  fontSize: t.type.size.xs
}));

const htmlDefaultTextProps: TextProps = {
  selectable: true
};

const skeletonContainer = styles.lazy((obj: { depth: number }) => (t) => ({
  backgroundColor: t.color.bodyBg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accentLight,
  height: 60,
  width: '100%',
  ...(obj.depth > 1
    ? ({
        marginLeft: t.space.md * (obj.depth - 1)
      } as const)
    : {})
}));

const storySkeletonTitle = styles.lazy<number, ViewStyle>(() => (t) => ({
  marginTop: 35,
  width: 30,
  height: 10,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));

const storySkeletonBy = styles.lazy<number, ViewStyle>(() => (t) => ({
  height: 10,
  width: Dimensions.get('window').width - 100,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));

const skeletonHeaderContainer = styles.lazy<number, ViewStyle>(() => (t) => ({
  backgroundColor: t.color.bodyBg
}));
