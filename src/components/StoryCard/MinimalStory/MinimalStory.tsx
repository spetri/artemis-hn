import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { styles, useDash } from "../../../../dash.config";
import { useMetadata } from "../../../hooks/use-metadata";
import { StackParamList } from "../../../screens/routers";
import { HackerNewsStory } from "../../../types/hn-api";
import { ago } from "../../../utils/ago";
import { ListItem, Skeleton } from "@rneui/themed";

type MinimalStoryProps = {
  data: HackerNewsStory;
  index: number;
};

export const MinimalStory: FC<MinimalStoryProps> = ({ data, index }) => {
  const url = new URL(data.url);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const metadata = useMetadata(url);
  const {
    tokens: { color },
  } = useDash();

  if (!metadata) {
    return (
      <View>
        <ListItem bottomDivider containerStyle={skeletonContainer(index)}>
          <Skeleton animation="pulse" style={storySkeletonImage(index)} />
          <ListItem.Content>
            <Skeleton style={storySkeletonTitle(index)} />
            <ListItem containerStyle={skeletonContainer(index)}>
              <Skeleton style={storySkeletonBy(index)} />
              <Skeleton style={storySkeletonMetadata(index)} />
            </ListItem>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  }

  const displayImage = () => {
    if (metadata?.image) {
      return (
        <Pressable
          onPress={() =>
            navigation.push("BrowserModal", {
              title: data.title,
              url: url.toString(),
            })
          }
        >
          <Image style={storyImage} source={{ uri: metadata?.image }} />
        </Pressable>
      );
    } else {
      return (
        <Pressable
          onPress={() =>
            navigation.push("BrowserModal", {
              title: metadata.applicationName || url.hostname,
              url: url.origin,
            })
          }
        >
          <View>
            <Image style={storyImage} source={{ uri: metadata.favicon }} />
          </View>
        </Pressable>
      );
    }
  };

  return (
    metadata && (
      <View style={storyContainer(index)} key={data.id}>
        <View style={imageColumn(index)}>{displayImage()}</View>
        <Pressable onPress={() => navigation.push("Thread", { id: data.id })}>
          <View style={bodyColumn(index)}>
            <View>
              <Text style={storyTitle(index)} numberOfLines={4}>
                {data.title}
              </Text>
            </View>
            <View>
              <Text style={appName()}>
                ({metadata.applicationName || url.host.replace(/^www\./, "")})
              </Text>
            </View>
            <View style={footerText()}>
              <View>
                <Pressable
                  onPress={() => navigation.push("User", { id: data.by })}
                >
                  <Text style={byStyle()}>{data.by}</Text>
                </Pressable>
              </View>
              <View style={restText()}>
                <Text style={restIcon()}>
                  <AntDesignIcon
                    size={13}
                    name="arrowup"
                    color={color.textAccent}
                  />
                  <Text>{data.score}</Text>
                </Text>
                <View>
                  <View style={restIcon()}>
                    <Text style={rotate90}>
                      <IoniconIcon
                        size={13}
                        name="chatbubble-outline"
                        color={color.textAccent}
                      />
                    </Text>
                    <Text style={chatText(index)}>{data.descendants}</Text>
                  </View>
                </View>
                <View>
                  <Text style={restIcon()}>
                    <IoniconIcon
                      size={13}
                      name="time-outline"
                      color={color.textAccent}
                    />
                    <Text>
                      {ago.format(new Date(data.time * 1000), "mini")}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    )
  );
};

const restIcon = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 12,
  marginHorizontal: 4,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "nowrap",
}));

const chatText = styles.lazy<number, ViewStyle>((index) => (t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size["2xs"],
  marginLeft: 3,
}));

const rotate90 = {
  transform: [{ rotateY: "180deg" }],
};

const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  display: "flex",
  flexDirection: "row",
  height: 85,
  width: Dimensions.get("window").width,
  borderBottomColor: t.color.accent,
  borderBottomWidth: t.borderWidth.hairline,
}));

const imageColumn = styles.lazy<number, ViewStyle>((index) => (t) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  marginHorizontal: 15,
  justifyContent: "center",
}));

const bodyColumn = styles.lazy<number, ViewStyle>((index) => (t) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: Dimensions.get("window").width,
  justifyContent: "space-around",
  marginVertical: 8,
  flex: 1,
}));

const storyTitle = styles.lazy<number, TextStyle>((index: number) => (t) => ({
  color: t.color.textPrimary,
  fontSize: 15,
  fontWeight: "500",
  display: "flex",
  flexWrap: "wrap",
  width: Dimensions.get("window").width - 100,
}));

const skeletonContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  backgroundColor: t.color.bodyBg,
}));

const storySkeletonImage = styles.lazy<number, ViewStyle>((index) => (t) => ({
  display: "flex",
  borderRadius: 10,
  flexDirection: "column",
  justifyContent: "center",
  height: 60,
  width: 60,
  backgroundColor: t.color.accent,
}));

const storySkeletonTitle = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: Dimensions.get("window").width - 200,
  height: 15,
  borderRadius: 10,
  backgroundColor: t.color.accent,
}));

const storySkeletonBy = styles.lazy<number, ViewStyle>((index) => (t) => ({
  height: 15,
  width: 30,
  borderRadius: 10,
  backgroundColor: t.color.accent,
}));

const storySkeletonMetadata = styles.lazy<number, ViewStyle>(
  (index) => (t) => ({
    height: 15,
    width: 90,
    borderRadius: 10,
    backgroundColor: t.color.accent,
  })
);

const storyImage = {
  width: 55,
  height: 55,
  borderRadius: 4,
};

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontSize: 13,
  fontWeight: "500",
  marginRight: 5,
}));

const appName = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 12,
  fontWeight: "300",
}));

const footerText = styles.one<TextStyle>((t) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
}));

const restText = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size["2xs"],
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
}));
