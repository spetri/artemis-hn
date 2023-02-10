import RenderHTML, {
  MixedStyleRecord,
  RenderersProps,
} from "react-native-render-html";

import { Icon } from "../../../../components/Icon";
import { ago } from "../../../../utils/ago";
import { FC, useMemo } from "react";
import {
  Text,
  Image,
  SafeAreaView,
  View,
  Pressable,
  TextStyle,
  ViewStyle,
  TextProps,
  ImageStyle,
  useWindowDimensions,
} from "react-native";
import { StackParamList } from "../../../routers";
import { styles, useDash } from "../../../../../dash.config";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { linkify } from "../../../../utils/util";
import { HackerNewsComment } from "../../../../types/hn-api";
import { ParentComment } from "../ParentComment/ParentComment";

type CommentThreadHeaderProps = {
  data: any;
  parentComments: any;
  setContainerHeight: (number: number) => void;
  setMainHeight: (number: number) => void;
};

export const CommentThreadHeader: FC<CommentThreadHeaderProps> = ({
  data,
  setContainerHeight,
  setMainHeight,
  parentComments,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const parentStory = parentComments[0];

  const dimensions = useWindowDimensions();
  const { theme } = useDash();
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

  return !data || !parentStory ? null : (
    <View
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        setContainerHeight(layout.height);
      }}
    >
      <SafeAreaView>
        <View style={header()}>
          <Pressable style={backButton()} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={18} color="textAccent" />
          </Pressable>
        </View>
      </SafeAreaView>

      <Pressable
        onPress={() =>
          navigation.push("Thread", {
            id: parentStory.id,
          })
        }
      >
        <Text numberOfLines={4} adjustsFontSizeToFit style={title()}>
          {parentStory.title}
        </Text>
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
            onPress={() => navigation.navigate("User", { id: data.by })}
          >
            <Text style={byStyle()}>@{data.by}</Text>
          </Pressable>
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
  );
};

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

const commentStoryContent = styles.one((t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size.sm,
  fontWeight: "400",
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

const htmlDefaultTextProps: TextProps = {
  selectable: true,
};

export interface CommentThreadHeader
  extends NativeStackScreenProps<StackParamList, "Thread"> {}
