import { styles, useDash } from "../../../dash.config";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { FC, useRef } from "react";
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  TextInput,
  View,
  Text,
  ViewStyle,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../routers";
import { useNavigation } from "@react-navigation/native";
import { HackerNewsStory, StoryFilters } from "../../types/hn-api";
import { SEARCH_API } from "../../constants/api";
import { MinimalStory } from "../../components/StoryCard/MinimalStory/MinimalStory";

type ListItemType = {
  id: string;
  header: string;
  subheader: string;
  iconName: string;
  filter: StoryFilters;
}[];

export const Search: FC = () => {
  useDash();
  const [search, setSearch] = useState("");
  const {
    tokens: { color },
  } = useDash();
  const query = useSWR(
    `${SEARCH_API}/search?query=${search}`,
    (key) =>
      !!search &&
      fetch(key, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json())
  );

  const queryData = useMemo(() => query.data, [query.data]);

  const onChangeText = (text: string) => {
    setSearch(text);
  };

  return (
    <SafeAreaView style={containerBg()}>
      <View style={container()}>
        <Icon name="search" size={25} style={searchIcon()} />
        <TextInput style={input()} onChangeText={onChangeText} autoFocus />
      </View>
      {!!search && (
        <View>
          {queryData?.hits?.map((query) => {
            const story = {
              data: {
                id: query.objectID,
                title: query.title,
                by: query.author,
                time: query.created_at_i,
                score: query.points,
                descendants: query.num_comments,
                url: query.url ?? "http://www.notaurl.com",
                deleted: false,
                dead: false,
              },
            };

            return (
              <MinimalStory
                data={story.data as HackerNewsStory}
                index={story.data.id}
              />
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: "100%",
  width: Dimensions.get("screen").width - 40,
  marginLeft: 20,
}));

const container = styles.one<ViewStyle>((t) => ({
  flexDirection: "row",
  borderWidth: 1,
}));

const searchIcon = styles.one<ViewStyle>((t) => ({
  padding: 10,
  color: t.color.accent,
}));

const input = styles.one<ViewStyle>((t) => ({
  paddingTop: 10,
  paddingRight: 10,
  paddingBottom: 10,
  paddingLeft: 0,
  color: t.color.textPrimary,
}));
