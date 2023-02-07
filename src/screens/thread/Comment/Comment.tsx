import { useNavigation } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type {
  MixedStyleRecord,
  RenderersProps,
} from "react-native-render-html";
import RenderHTML from "react-native-render-html";
import useSWR from "swr";

import { Skeleton } from "../../../components/Skeleton";
import { styles, useDash } from "../../../../dash.config";
import { HackerNewsComment } from "../../../types/hn-api";
import { ago } from "../../../utils/ago";
import { pluralize } from "../../../utils/pluralize";
import { StackParamList } from "../../routers";
import { HACKER_NEWS_API } from "../../../constants/api";
import { FC, memo, useMemo, useState } from "react";
import {
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
  ImageStyle,
  TextStyle,
  TextProps,
  Pressable,
} from "react-native";
import { linkify } from "../../../utils/util";

type CommentProps = {
  id: number;
  index: number;
  depth: number;
};

export const Comment: FC<CommentProps> = memo(
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

const commentContent = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.xs,
  fontWeight: "300",
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
  color: t.color.lightBlue300,
  fontSize: t.type.size["2xs"],
  fontWeight: "700",
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
