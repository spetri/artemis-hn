import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "../../../../dash.config";
import { useMetadata } from "../../../hooks/use-metadata";
import { StackParamList } from "../../../screens/routers";
import { HackerNewsStory } from "../../../types/hn-api";
import { Skeleton } from "../../Skeleton";
import { pluralize } from "../../../utils/pluralize";
import { ago } from "../../../utils/ago";

type ComplexStoryProps = {
  data: HackerNewsStory;
  index: number;
};

export const ComplexStory: FC<ComplexStoryProps> = ({ data, index }) => {
  const url = new URL(data.url);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const metadata = useMetadata(url);

  if (!metadata) {
    return (
      <View style={storyContainer(index)}>
        <Skeleton style={storySkeleton(index)} />
      </View>
    );
  }

  return (
    <View style={storyContainer(index)}>
      {/* image */}
      {metadata?.image ? (
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push("BrowserModal", {
              title: data.title,
              url: url.toString(),
            })
          }
        >
          <Image style={storyImage(index)} source={{ uri: metadata?.image }} />
        </TouchableWithoutFeedback>
      ) : null}

      {/* url */}
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.push("BrowserModal", {
            title: metadata.applicationName || url.hostname,
            url: url.origin,
          })
        }
      >
        <View style={hostContainerStyle}>
          <Image style={favicon()} source={{ uri: metadata.favicon }} />

          <Text style={hostname()} numberOfLines={1} ellipsizeMode="tail">
            {metadata.applicationName || url.host.replace(/^www\./, "")}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {/* titles */}
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.push("BrowserModal", {
            title: data.title,
            url: url.toString(),
          })
        }
      >
        <Text
          style={storyTitle(index)}
          adjustsFontSizeToFit
          numberOfLines={
            index === 0 && !metadata.image
              ? 5
              : index < 5 && metadata.image
              ? 4
              : 7
          }
        >
          {data.title}
        </Text>
      </TouchableWithoutFeedback>

      {/* secondary info */}
      <View>
        <View style={byLine}>
          <TouchableWithoutFeedback
            onPress={() => navigation.push("User", { id: data.by })}
          >
            <Text style={byStyle()}>@{data.by}</Text>
          </TouchableWithoutFeedback>
          <Text style={agoStyle()}>
            {ago.format(new Date(data.time * 1000), "mini")}
          </Text>
        </View>

        <Text style={footerText()}>
          <Text style={score()}>⇧{data.score}</Text> &bull;{" "}
          <TouchableWithoutFeedback
            onPress={() => navigation.push("Thread", { id: data.id })}
          >
            <Text style={commentsStyle}>
              {pluralize(data.descendants, "comment")}
            </Text>
          </TouchableWithoutFeedback>
        </Text>
      </View>
    </View>
  );
};

const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: index === 0 || index > 4 ? "100%" : "50%",
  padding: t.space.lg,
  paddingTop: index === 0 ? t.space.xl : index < 5 ? t.space.md : t.space.lg,
  paddingBottom: index === 0 ? t.space.xl : index < 5 ? t.space.lg : t.space.lg,
}));

const storySkeleton = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: "100%",
  height: index === 0 || index > 4 ? 172 : 96,
  marginBottom: t.space.md,
  borderRadius: t.radius.secondary,
}));

const score = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontWeight: "700",
}));

const storyImage = styles.lazy<number, ImageStyle>((index: number) => (t) => ({
  width: "100%",
  height: index === 0 || index > 4 ? 172 : 96,
  marginBottom: t.space.md,
  borderRadius: t.radius.secondary,
}));

const hostContainerStyle: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
};

const favicon = styles.one<ImageStyle>((t) => ({
  width: t.type.size.base,
  height: t.type.size.base,
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

const storyTitle = styles.lazy<number, TextStyle>((index: number) => (t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size[index === 0 ? "6xl" : index < 5 ? "base" : "sm"],
  fontWeight: index === 0 ? "900" : index < 5 ? "800" : "700",
  letterSpacing: index < 4 ? t.type.tracking.tighter : t.type.tracking.tight,
  paddingTop: t.space.sm,
  paddingBottom: t.space.sm,
}));

const byLine: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
};

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: "300",
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0,
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: "300",
}));

const footerText = styles.one<TextStyle>((t) => ({
  fontWeight: "600",
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
}));

const commentsStyle: TextStyle = { fontWeight: "300" };
