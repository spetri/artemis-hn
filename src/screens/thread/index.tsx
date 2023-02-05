import { useNavigation } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as htmlEntities from "html-entities";
import type {
  MixedStyleRecord,
  RenderersProps,
} from "react-native-render-html";
import RenderHTML from "react-native-render-html";
import useSWR from "swr";

import { Icon } from "../../components/Icon";
import { Skeleton } from "../../components/Skeleton";
import { styles, useDash } from "../../../dash.config";
import { useMetadata } from "../../hooks/use-metadata";
import { useParents } from "../../hooks/use-parents";
import {
  HackerNewsStory,
  HackerNewsJob,
  HackerNewsPoll,
  HackerNewsAsk,
  HackerNewsComment,
} from "../../types/hn-api";
import { ago } from "../../utils/ago";
import { pluralize } from "../../utils/pluralize";
import { StackParamList } from "../routers";
import { HACKER_NEWS_API } from "../../constants/api";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
  ImageStyle,
  TextStyle,
  TextProps,
  Pressable,
} from "react-native";

export function Thread({ route }: ThreadProps) {
  const { id } = route.params;
  const { data, mutate } = useSWR<
    | HackerNewsStory
    | HackerNewsJob
    | HackerNewsPoll
    | HackerNewsAsk
    | HackerNewsComment
  >(id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`, (key) =>
    fetch(key, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json())
  );

  if (!data) {
    return null;
  }

  return data.type === "comment" ? (
    <CommentThread data={data} onRefresh={() => mutate()} />
  ) : (
    <StoryThread data={data} onRefresh={() => mutate()} />
  );
}

function StoryThread({
  data,
  onRefresh,
}: {
  data: HackerNewsStory | HackerNewsJob | HackerNewsPoll | HackerNewsAsk;
  onRefresh(): unknown;
}) {
  const { theme } = useDash();
  const dimensions = useWindowDimensions();
  const [didMount, setDidMount] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const url = useMemo(
    () => ("url" in data && data.url ? new URL(data.url) : undefined),
    [data]
  );
  const metadata = useMetadata(url);
  useEffect(() => {
    if (data) {
      setDidMount(true);
    }
  }, [data]);
  const htmlRenderersProps = useMemo<Partial<RenderersProps>>(
    () => ({
      a: {
        onPress(_, url) {
          navigation.navigate("BrowserModal", { title: url, url });
        },
      },
    }),
    [navigation]
  );

  const htmlTagStyles = useMemo<MixedStyleRecord>(
    () => ({ a: link() }),
    [theme]
  );

  const htmlSource = useMemo(
    () =>
      "text" in data && {
        html: linkify(data.text),
      },
    [data]
  );

  const listHeaderComponent = useCallback(
    () =>
      !data ? null : (
        <View>
          {metadata?.image ? (
            <>
              <View style={floatingHeader()}>
                <SafeAreaView>
                  <TouchableOpacity
                    style={backButton()}
                    onPress={() => navigation.goBack()}
                  >
                    <Icon name="chevron-left" size={18} color="textAccent" />
                  </TouchableOpacity>
                </SafeAreaView>
              </View>

              <TouchableWithoutFeedback
                onPress={() =>
                  data &&
                  url &&
                  navigation.navigate("BrowserModal", {
                    title: data.title,
                    url: url.toString(),
                  })
                }
              >
                <Image style={storyImage()} source={{ uri: metadata?.image }} />
              </TouchableWithoutFeedback>
            </>
          ) : (
            <SafeAreaView>
              <View style={header()}>
                <TouchableOpacity
                  style={backButton()}
                  onPress={() => navigation.goBack()}
                >
                  <Icon name="chevron-left" size={18} color="textAccent" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          )}

          {metadata && url && (
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("BrowserModal", {
                  title: metadata.applicationName || url.hostname,
                  url: url.origin,
                })
              }
            >
              <View style={hostContainerStyle()}>
                <Image style={favicon()} source={{ uri: metadata.favicon }} />

                <Text style={hostname()} numberOfLines={1} ellipsizeMode="tail">
                  {metadata.applicationName || url.host.replace(/^www\./, "")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}

          <TouchableWithoutFeedback
            onPress={() =>
              data &&
              url &&
              navigation.navigate("BrowserModal", {
                title: data.title,
                url: url.toString(),
              })
            }
          >
            <Text numberOfLines={4} adjustsFontSizeToFit style={title()}>
              {data.title}
            </Text>
          </TouchableWithoutFeedback>

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
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("User", { id: data.by })}
            >
              <Text style={byStyle()}>@{data.by}</Text>
            </TouchableWithoutFeedback>
            <Text style={agoStyle()}>
              {ago.format(new Date(data.time * 1000), "mini")}
            </Text>
          </View>

          {data.type !== "job" &&
            (data.score || ("descendants" in data && data.descendants > 0)) && (
              <Text style={subtitle()}>
                {data.score && <Text style={score()}>⇧{data.score}</Text>}
                {"descendants" in data && (
                  <> &bull; {pluralize(data.descendants, "comment")}</>
                )}
              </Text>
            )}
        </View>
      ),
    [
      data,
      metadata,
      htmlSource,
      dimensions.width,
      htmlTagStyles,
      htmlRenderersProps,
      url,
      navigation,
    ]
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl refreshing={!data && didMount} onRefresh={onRefresh} />
    ),
    [data, didMount, onRefresh]
  );

  return (
    <View style={container()}>
      <FlatList
        ListHeaderComponent={listHeaderComponent}
        refreshControl={refreshControl}
        data={!data ? fauxFlatComments : "kids" in data ? data.kids : []}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        renderItem={renderItem}
        style={container()}
      />
    </View>
  );
}

function CommentThread({
  data,
  onRefresh,
}: {
  data: HackerNewsComment;
  onRefresh(): unknown;
}) {
  const { theme } = useDash();
  const parents = useParents(data.parent);
  const parentComments = parents.data ?? [];
  const parentStory = parentComments[0];
  const dimensions = useWindowDimensions();
  const [didMount, setDidMount] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (data && containerHeight && mainHeight && listRef.current && !didMount) {
      listRef.current.scrollToOffset({
        offset: containerHeight - mainHeight - 64,
      });
      setDidMount(true);
    }
  }, [didMount, data, containerHeight, mainHeight]);

  const htmlRenderersProps = useMemo<Partial<RenderersProps>>(
    () => ({
      a: {
        onPress(_, url) {
          navigation.navigate("BrowserModal", { title: url, url });
        },
      },
    }),
    [navigation]
  );

  const htmlTagStyles = useMemo<MixedStyleRecord>(
    () => ({ a: link() }),
    [theme]
  );

  const htmlSource = useMemo(
    () =>
      "text" in data && {
        html: linkify(data.text),
      },
    [data]
  );
  const parentStoryHtml = useMemo(
    () =>
      parentStory &&
      "text" in parentStory &&
      parentStory.text && { html: linkify(parentStory.text) },
    [parentStory]
  );

  const listHeaderComponent = useCallback(
    () =>
      !data || !parentStory ? null : (
        <View
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setContainerHeight(layout.height);
          }}
        >
          <SafeAreaView>
            <View style={header()}>
              <TouchableOpacity
                style={backButton()}
                onPress={() => navigation.goBack()}
              >
                <Icon name="chevron-left" size={18} color="textAccent" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <TouchableWithoutFeedback
            onPress={() =>
              navigation.push("Thread", {
                id: parentStory.id,
              })
            }
          >
            <Text numberOfLines={4} adjustsFontSizeToFit style={title()}>
              {parentStory.title}
            </Text>
          </TouchableWithoutFeedback>

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
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("User", { id: data.by })}
              >
                <Text style={byStyle()}>@{data.by}</Text>
              </TouchableWithoutFeedback>
              <Text style={agoStyle()}>
                {ago.format(new Date(data.time * 1000), "mini")}
              </Text>
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
      ),
    [
      data,
      parentStory,
      parentStoryHtml,
      dimensions.width,
      htmlTagStyles,
      htmlRenderersProps,
      htmlSource,
      navigation,
    ]
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl refreshing={!data && didMount} onRefresh={onRefresh} />
    ),
    [data, didMount, onRefresh]
  );

  return (
    <View style={container()}>
      <FlatList
        ListHeaderComponent={listHeaderComponent}
        refreshControl={refreshControl}
        data={!data ? fauxFlatComments : "kids" in data ? data.kids : []}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        renderItem={renderThreadedItem}
        style={container()}
        ref={listRef}
      />
    </View>
  );
}

const fauxFlatComments = Array.from<number>({ length: 3 }).fill(-1);

function renderItem({ item, index }: { item: number; index: number }) {
  return <Comment id={item} index={index} depth={1} />;
}

function renderThreadedItem({ item, index }: { item: number; index: number }) {
  return <Comment id={item} index={index} depth={3} />;
}

function keyExtractor(item: number, index: number) {
  return item === -1 ? index.toString() : item.toString();
}

const ParentComment = memo<{
  comment: HackerNewsComment;
  contentWidth: number;
  htmlRenderersProps: Partial<RenderersProps>;
  htmlTagStyles: MixedStyleRecord;
  navigation: NativeStackNavigationProp<StackParamList>;
}>(function ParentComment({
  comment,
  contentWidth,
  htmlRenderersProps,
  htmlTagStyles,
  navigation,
}) {
  const htmlSource = useMemo(
    () => ({
      html: linkify(comment.text),
    }),
    [comment.text]
  );

  return (
    <View style={parentCommentContainer()}>
      <View style={parentCommentMarker()} />
      <View style={byLine}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("User", { id: comment.by })}
        >
          <Text style={byStyle()}>@{comment.by}</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push("Thread", {
              id: comment.id,
            })
          }
        >
          <Text style={agoStyle()}>
            {ago.format(new Date(comment.time * 1000), "mini")}
          </Text>
        </TouchableWithoutFeedback>
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
});

const Comment = memo<{ id: number; index: number; depth: number }>(
  function Comment({ id, depth }) {
    const { theme } = useDash();
    const comment = useSWR<HackerNewsComment>(
      id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`,
      (key) =>
        fetch(key, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }).then((res) => res.json())
    );
    const dimensions = useWindowDimensions();
    const [showingReplies, setShowingReplies] = useState(false);
    const navigation =
      useNavigation<NativeStackNavigationProp<StackParamList>>();
    const htmlRenderersProps = useMemo<Partial<RenderersProps>>(
      () => ({
        a: {
          onPress(_, url) {
            navigation.navigate("BrowserModal", { title: url, url });
          },
        },
      }),
      [navigation]
    );

    const htmlTagStyles = useMemo<MixedStyleRecord>(
      () => ({ a: link(), pre: pre() }),
      [theme]
    );

    const htmlSource = useMemo(
      () =>
        comment.data && {
          html: linkify(comment.data.text),
        },
      [comment.data]
    );

    if (!comment.data) {
      return (
        <View>
          <Skeleton />
        </View>
      );
    }

    if (comment.data.dead || comment.data.deleted) {
      return null;
    }

    const data = comment.data;
    console.log(comment.data);
    return (
      <>
        <View style={commentContainer(depth)}>
          <View style={byLine}>
            <Pressable
              onPress={() => navigation.navigate("User", { id: data.by })}
            >
              <Text style={byStyle()}>{data.by}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.push("Thread", {
                  id: data.id,
                })
              }
            >
              <Text style={agoStyle()}>
                {ago.format(new Date(data.time * 1000), "mini")}
              </Text>
            </Pressable>
          </View>

          {htmlSource && (
            <RenderHTML
              contentWidth={dimensions.width}
              source={htmlSource}
              baseStyle={commentContent()}
              tagsStyles={htmlTagStyles}
              defaultTextProps={htmlDefaultTextProps}
              renderersProps={htmlRenderersProps}
              enableExperimentalBRCollapsing
              enableExperimentalGhostLinesPrevention
              enableExperimentalMarginCollapsing
            />
          )}
        </View>

        {showingReplies &&
          data.kids &&
          data.kids.length > 0 &&
          data.kids.map((id, index) => (
            <Comment key={id} id={id} index={index} depth={depth + 1.5} />
          ))}

        {data.kids?.length > 0 && !showingReplies && (
          <View style={commentContainerReply(depth)}>
            <Pressable
              onPress={() => {
                setShowingReplies((current) => !current);
              }}
            >
              <Text style={replies(depth)}>
                {pluralize(data.kids?.length ?? 0, "reply", "replies")}
              </Text>
            </Pressable>
          </View>
        )}
      </>
    );
  },
  (prev, next) => prev.id === next.id
);

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  backgroundColor: t.color.bodyBg,
}));

const commentContainer = styles.lazy<number, ViewStyle>((depth) => (t) => ({
  padding: t.space.md,
  borderTopWidth: t.borderWidth.hairline,
  borderTopColor: t.color.accent,
  ...(depth > 1
    ? ({
        borderLeftWidth: 2,
        borderLeftColor: t.color.primary,
        marginLeft: t.space.md * (depth - 1),
      } as const)
    : {}),
}));

const commentContainerReply = styles.lazy<number, ViewStyle>(
  (depth) => (t) => ({
    padding: t.space.sm,
    paddingHorizontal: t.space.md,
    borderTopWidth: t.borderWidth.hairline,
    borderTopColor: t.color.accent,
    ...(depth > 0
      ? ({
          borderLeftWidth: 2,
          borderLeftColor: t.color.primary,
          marginLeft: t.space.md * (depth + 0.5),
        } as const)
      : {}),
  })
);

const parentCommentContainer = styles.one<ViewStyle>((t) => ({
  padding: t.space.lg,
  paddingTop: 0,
  marginLeft: t.space.md,
  borderLeftWidth: 2,
  borderLeftColor: t.color.primary,
}));

const parentCommentMarker = styles.one<ViewStyle>((t) => ({
  position: "absolute",
  left: -5,
  top: 0,
  width: 8,
  height: 8,
  borderRadius: t.radius.full,
  backgroundColor: t.color.primary,
}));

const header = styles.one<ViewStyle>((t) => ({
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  padding: t.space.md,
  paddingLeft: t.space.lg,
}));

const floatingHeader = styles.one<ViewStyle>((t) => ({
  position: "absolute",
  left: t.space.lg,
  top: t.space.lg,
  zIndex: 10,
}));

const backButton = styles.one<ViewStyle>((t) => ({
  alignItems: "center",
  justifyContent: "center",
  width: 18 * (t.type.size.base / 16) + t.space.sm * 2,
  height: 18 * (t.type.size.base / 16) + t.space.sm * 2,
  borderRadius: t.radius.full,
  marginRight: t.space.md,
  backgroundColor: t.color.accentLight,
}));

const title = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xl,
  fontWeight: "900",
  padding: t.space.lg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md,
}));

const subtitle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: "600",
  padding: t.space.lg,
  paddingTop: t.space.md,
}));

const score = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
}));

const storyImage = styles.one<ImageStyle>((t) => ({
  width: "100%",
  height: 240,
  marginBottom: t.space.md,
}));

const hostContainerStyle = styles.one<ViewStyle>((t) => ({
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  paddingRight: t.space.lg,
  paddingLeft: t.space.lg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md,
}));

const favicon = styles.one<ImageStyle>((t) => ({
  width: 20,
  height: 20,
  borderRadius: t.radius.md,
  marginRight: t.space.sm,
}));

const hostname = styles.one<TextStyle>((t) => ({
  flex: 1,
  width: "100%",
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: "300",
}));

const content = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: "400",
  padding: t.space.lg,
  paddingTop: 0,
  paddingBottom: 0,
}));

const commentStoryContent = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: "400",
}));

const commentContent = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: "300",
}));

const storyByLine = styles.one<ViewStyle>((t) => ({
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingLeft: t.space.lg,
  paddingRight: t.space.lg,
  paddingBottom: t.space.md,
}));

const byLine: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
};

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size["2xs"],
  fontWeight: "700",
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0,
}));

const replies = styles.one<any>((t, depth) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: "300",
  padding: t.space.sm,
  paddingTop: t.space.md,
  paddingLeft: 0,
  width: "100%",
  ...(depth > 0
    ? ({
        marginLeft: t.space.md * (depth - 2),
      } as const)
    : {}),
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: "300",
}));

const link = styles.one((t) => ({
  color: t.color.textPrimary,
  fontWeight: "600",
  textDecorationLine: "underline",
  textDecorationColor: t.color.primary,
}));

const pre = styles.one((t) => ({
  color: t.color.textPrimary,
  backgroundColor: t.color.accent,
  borderRadius: t.radius.xl,
  padding: t.space.lg,
  paddingBottom: t.space.sm,
  fontSize: t.type.size["2xs"],
}));

const htmlDefaultTextProps: TextProps = {
  selectable: true,
};

const urlRe =
  /(?:^|\s)((https?:\/\/|\/\/)[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

function linkify(text: string) {
  text = htmlEntities.decode(text);
  const matches = text.matchAll(urlRe);

  for (const match of matches) {
    const href = match[1];
    text = text.replace(
      href,
      `<a href="${href}" rel="nofollow noreferrer">${href}</a>`
    );
  }

  return text;
}

export interface ThreadProps
  extends NativeStackScreenProps<StackParamList, "Thread"> {}
