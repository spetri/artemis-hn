import { HackerNewsAsk } from "../../../types/hn-api";
import { useNavigation } from "@react-navigation/native";
import * as htmlEntities from "html-entities";
import stripTags from "striptags";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, ImageStyle, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { StackParamList } from "../../../screens/routers";
import { ago } from "../../../utils/ago";
import { styles } from "../../../../dash.config";
import { pluralize } from "../../../utils/pluralize";
import { FC } from "react";

type AskStoryProps = {
    data: HackerNewsAsk;
    index: number;
};

export const AskStory: FC<AskStoryProps> = ({ data, index }) => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  
    return (
      <View style={storyContainer(index)}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push("Thread", {
              id: data.id,
            })
          }
        >
          <Text
            style={storyTitle(index)}
            adjustsFontSizeToFit
            numberOfLines={index === 0 ? 5 : 7}
          >
            {data.title}
          </Text>
        </TouchableWithoutFeedback>
  
        {data.text && (
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.push("Thread", {
                id: data.id,
              })
            }
          >
            <Text ellipsizeMode="tail" style={storyText()} numberOfLines={4}>
              {stripTags(htmlEntities.decode(data.text), [], " ")}
            </Text>
          </TouchableWithoutFeedback>
        )}
  
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
  }

  const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
    width: index === 0 || index > 4 ? "100%" : "50%",
    padding: t.space.lg,
    paddingTop: index === 0 ? t.space.xl : index < 5 ? t.space.md : t.space.lg,
    paddingBottom: index === 0 ? t.space.xl : index < 5 ? t.space.lg : t.space.lg,
  }));
  
  const score = styles.one<TextStyle>((t) => ({
    color: t.color.primary,
    fontWeight: "700",
  }));
  
  const storyTitle = styles.lazy<number, TextStyle>(
    (index: number) => (t) => ({
      color: t.color.textPrimary,
      fontSize: t.type.size[index === 0 ? "6xl" : index < 5 ? "base" : "sm"],
      fontWeight: index === 0 ? "900" : index < 5 ? "800" : "700",
      letterSpacing: index < 4 ? t.type.tracking.tighter : t.type.tracking.tight,
      paddingTop: t.space.sm,
      paddingBottom: t.space.sm,
    })
  );
  
  const storyText = styles.one<TextStyle>((t) => ({
    color: t.color.textAccent,
    fontSize: t.type.size.xs,
    fontWeight: "400",
    letterSpacing: t.type.tracking.tight,
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