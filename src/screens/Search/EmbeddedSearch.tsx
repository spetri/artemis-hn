import { styles, useDash } from "../../../dash.config";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { FC } from "react";
import { Dimensions, SafeAreaView, View, ViewStyle } from "react-native";
import { HackerNewsStory } from "../../types/hn-api";
import { SEARCH_API } from "../../constants/api";
import { MinimalStory } from "../../components/StoryCard/MinimalStory/MinimalStory";
import { SearchBar } from "@rneui/base";

export const EmbeddedSearch: FC = () => {
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

  return (
    <>
      <View>
        <SearchBar
          platform="ios"
          onChangeText={setSearch}
          placeholder="Search HN"
          value={search}
          containerStyle={{ backgroundColor: color.bodyBg }}
          inputContainerStyle={inputContainerStyle()}
        />
      </View>
      {!!search && (
        <View>
          {queryData?.hits?.map((query) => {
            const story = {
              data: {
                id: Number(query.objectID),
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
    </>
  );
};

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: "100%",
  width: Dimensions.get("screen").width,
}));

const inputContainerStyle = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.accent,
  height: 40,
}));
