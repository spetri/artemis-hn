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

type MinimalStoryProps = {
  data: HackerNewsStory;
  index: number;
};

export const MinimalStory: FC<MinimalStoryProps> = ({ data, index }) => {
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
      <View style={imageColumn(index)}>
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
            <Image
              style={storyImage(index)}
              source={{ uri: metadata?.image }}
            />
          </TouchableWithoutFeedback>
        ) : (
          <>
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
                <Image
                  style={storyImage(index)}
                  source={{ uri: metadata.favicon }}
                />

                {/* <Text style={hostname()} numberOfLines={1} ellipsizeMode="tail">
                  {metadata.applicationName || url.host.replace(/^www\./, "")}
                </Text> */}
              </View>
            </TouchableWithoutFeedback>
          </>
        )}
      </View>

      <View style={bodyColumn(index)}>
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
          <Text style={footerText()}>
            <TouchableWithoutFeedback
              onPress={() => navigation.push("User", { id: data.by })}
            >
              <>
                <Text style={byStyle()}>@{data.by}</Text> &bull;{" "}
              </>
            </TouchableWithoutFeedback>
            <Text style={score()}>⇧{data.score}</Text> &bull;{" "}
            <TouchableWithoutFeedback
              onPress={() => navigation.push("Thread", { id: data.id })}
            >
              <Text style={commentsStyle}>
                {pluralize(data.descendants, "comment")} &bull;{" "}
              </Text>
            </TouchableWithoutFeedback>
            <Text style={agoStyle()}>
              {ago.format(new Date(data.time * 1000), "mini")}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  // width: index === 0 || index > 4 ? "100%" : "50%",
  display: "flex",
  flexDirection: "row",
  height: 90,
  width: "100%",
  borderStyle: "solid",
  borderColor: "#000",
  borderWidth: 1,
}));

const imageColumn = styles.lazy<number, ViewStyle>((index) => (t) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  marginLeft: 10,
  marginRight: 10,
  justifyContent: "center",
}));

const bodyColumn = styles.lazy<number, ViewStyle>((index) => (t) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "space-around",
}));

const storySkeleton = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: "100%",
  height: index === 0 || index > 4 ? 172 : 96,
  marginBottom: t.space.md,
  borderRadius: t.radius.secondary,
}));

const storyImage = styles.lazy<number, ImageStyle>((index: number) => (t) => ({
  width: 55,
  height: 55,
  borderRadius: 4,
}));

const score = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontWeight: "700",
}));

const hostContainerStyle: ViewStyle = {
  //   flexDirection: "row",
  //   alignItems: "center",
};

const hostname = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: "300",
}));

const storyTitle = styles.lazy<number, TextStyle>((index: number) => (t) => ({
  color: t.color.textPrimary,
  //   fontSize: t.type.size[index === 0 ? "6xl" : index < 5 ? "base" : "sm"],
  fontWeight: index === 0 ? "900" : index < 5 ? "800" : "700",
  letterSpacing: index < 4 ? t.type.tracking.tighter : t.type.tracking.tight,
}));

const byLine: ViewStyle = {};

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  fontWeight: "300",
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
