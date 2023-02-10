import { HackerNewsComment } from "../../../types/hn-api";
import { useNavigation } from "@react-navigation/native";
import * as htmlEntities from "html-entities";
import stripTags from "striptags";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { StackParamList } from "../../../screens/routers";
import { ago } from "../../../utils/ago";
import { styles } from "../../../../dash.config";
import { pluralize } from "../../../utils/pluralize";
import { useParents } from "../../../hooks/use-parents";
import { Skeleton } from "../../Skeleton";
import { FC } from "react";

type CommentStoryProps = {
  data: HackerNewsComment;
  index: number;
};

export const CommentStory: FC<CommentStoryProps> = ({ data, index }) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const parents = useParents(data.parent);

  if (!parents.data) {
    return (
      <View style={storyContainer(index)}>
        <Skeleton style={storySkeleton(index)} />
      </View>
    );
  }
  const parentData = parents.data[0];

  return (
    <View style={storyContainer(index)}>
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.push("Thread", {
            id: parentData.id,
          })
        }
      >
        <Text style={commentStoryTitle()}>{parentData.title}</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.push("Thread", {
            id: data.id,
          })
        }
      >
        <Text ellipsizeMode="tail" style={commentStoryText()} numberOfLines={4}>
          {stripTags(htmlEntities.decode(data.text), [], " ")}
        </Text>
      </TouchableWithoutFeedback>

      <View style={byLine}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push("Thread", {
              id: data.id,
            })
          }
        >
          <Text style={byStyle()}>
            {pluralize(data.kids?.length ?? 0, "reply", "replies")}
          </Text>
        </TouchableWithoutFeedback>
        <Text style={agoStyle()}>
          {ago.format(new Date(data.time * 1000), "mini")}
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

const commentStoryTitle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: "700",
  letterSpacing: t.type.tracking.tight,
  paddingTop: t.space.sm,
  paddingBottom: t.space.sm,
}));

const commentStoryText = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
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
