import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import {
  Dimensions,
  Image,
  ImageStyle,
  Pressable,
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
          <Pressable
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
          </Pressable>
        ) : (
          <>
            {/* url */}
            <Pressable
              onPress={() =>
                navigation.push("BrowserModal", {
                  title: metadata.applicationName || url.hostname,
                  url: url.origin,
                })
              }
            >
              <View>
                <Image
                  style={storyImage(index)}
                  source={{ uri: metadata.favicon }}
                />

                {/* <Text style={hostname()} numberOfLines={1} ellipsizeMode="tail">
                  {metadata.applicationName || url.host.replace(/^www\./, "")}
                </Text> */}
              </View>
            </Pressable>
          </>
        )}
      </View>
      <Pressable onPress={() => navigation.push("Thread", { id: data.id })}>
        <View style={bodyColumn(index)}>
          <View style={storyTitle(index)}>
            <Text style={storyTitle(index)} numberOfLines={4}>
              {data.title}
            </Text>
          </View>
          <View style={footerText()}>
            <Pressable onPress={() => navigation.push("User", { id: data.by })}>
              <Text style={byStyle()}>{data.by}</Text>
            </Pressable>
            <Text style={restText()}>
              <Text>
                <IoniconIcon size={13} name="arrow-up" />
                {data.score}
              </Text>
              <EntypoIcon name="dot-single" size={10}></EntypoIcon>
              <Text style={commentsStyle}>
                <IoniconIcon
                  size={13}
                  name="ios-chatbubble-outline"
                  style={chatIcon}
                />
                {data.descendants}
              </Text>
              <EntypoIcon name="dot-single" size={10}></EntypoIcon>
              <Text>{ago.format(new Date(data.time * 1000), "mini")}</Text>
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  display: "flex",
  flexDirection: "row",
  height: 90,
  width: Dimensions.get("window").width,
  borderBottomColor: t.color.accent,
  borderBottomWidth: t.borderWidth.hairline,
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
  width: Dimensions.get("window").width,
  justifyContent: "space-around",
  flex: 1,
}));

const storyTitle = styles.lazy<number, TextStyle>((index: number) => (t) => ({
  color: t.color.textPrimary,
  display: "flex",
  flexWrap: "wrap",
  width: Dimensions.get("window").width - 100,
}));

const storySkeleton = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: Dimensions.get("window").width,
  height: index === 0 || index > 4 ? 172 : 96,
  marginBottom: t.space.md,
  borderRadius: t.radius.secondary,
}));

const storyImage = styles.lazy<number, ImageStyle>((index: number) => (t) => ({
  width: 55,
  height: 55,
  borderRadius: 4,
}));

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 13,
  fontWeight: "300",
  marginRight: 5,
}));

const footerText = styles.one<TextStyle>((t) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
}));

const chatIcon = {
  transform: [{ scaleX: -1 }],
};

const restText = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  display: "flex",
  alignItems: "center",
}));

const commentsStyle: TextStyle = { fontWeight: "300" };
