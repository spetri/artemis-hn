import RenderHTML, {
  MixedStyleRecord,
  RenderersProps,
} from "react-native-render-html";
import { Icon } from "../../../../components/Icon";
import { ago } from "../../../../utils/ago";
import { pluralize } from "../../../../utils/pluralize";
import { FC, useCallback, useMemo } from "react";
import {
  Text,
  Image,
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
  ViewStyle,
  ImageStyle,
  TextStyle,
  useWindowDimensions,
  TextProps,
} from "react-native";
import { StackParamList } from "../../../routers";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { styles, useDash } from "../../../../../dash.config";
import { useNavigation } from "@react-navigation/native";
import { linkify } from "../../../../utils/util";
import {
  HackerNewsAsk,
  HackerNewsJob,
  HackerNewsPoll,
  HackerNewsStory,
} from "../../../../types/hn-api";

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

export const StoryThreadHeader: FC<StoryThreadHeaderProps> = ({
  data,
  metadata,
  url,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
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

  return !data ? null : (
    <View>
      {metadata?.image ? (
        <>
          <Pressable
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
          </Pressable>
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
        <Pressable
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
        </Pressable>
      )}

      <Pressable
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
        <Pressable onPress={() => navigation.navigate("User", { id: data.by })}>
          <Text style={byStyle()}>{data.by}</Text>
        </Pressable>
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

const storyByLine = styles.one<ViewStyle>((t) => ({
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingLeft: t.space.lg,
  paddingRight: t.space.lg,
  paddingBottom: t.space.md,
}));

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

export interface StoryThreadHeader
  extends NativeStackScreenProps<StackParamList, "Thread"> {}
