import "react-native-url-polyfill/auto";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect, useMemo, useCallback, FC } from "react";
import { LogBox, RefreshControl, FlatList, ViewStyle } from "react-native";
import useSWR from "swr";
import { StoryCard } from "../../components/StoryCard";
import { useDash, styles } from "../../../dash.config";
import { StackParamList } from "../routers";
import { HACKER_NEWS_API } from "../../constants/api";
import { keyExtractor } from "../../utils/util";
import { EmbeddedSearch } from "../Search/EmbeddedSearch";

type StoriesProps = {} & NativeStackScreenProps<StackParamList, "Stories">;

export const Stories: FC<StoriesProps> = (props) => {
  useDash();
  const { filter } = props.route.params;
  const [didMount, setDidMount] = useState(false);
  const fauxFlatStories = Array.from<number>({ length: 3 }).fill(-1);

  const stories = useSWR<number[]>(
    `${HACKER_NEWS_API}/${filter}stories.json`,
    (key) =>
      fetch(key, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json())
  );

  const renderFlatListItem = ({
    item,
    index,
  }: {
    item: number;
    index: number;
  }) => {
    return (
      <StoryCard key={item === -1 ? index : item} index={index + 5} id={item} />
    );
  };

  useEffect(() => {
    if (stories.data) {
      setDidMount(true);
    }
  }, [stories.data]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const flatListData = useMemo(() => stories.data?.slice(0), [stories.data]);

  const listHeaderComponent = useCallback(() => {
    return <EmbeddedSearch />;
  }, [stories.data, filter]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={!stories.data && didMount}
        onRefresh={() => stories.mutate()}
      />
    ),
    [stories.data, stories.mutate, didMount]
  );

  return (
    <FlatList
      ListHeaderComponent={listHeaderComponent}
      stickyHeaderIndices={[0]}
      refreshControl={refreshControl}
      data={flatListData ?? fauxFlatStories}
      keyExtractor={keyExtractor}
      initialNumToRender={4}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      windowSize={3}
      renderItem={renderFlatListItem}
      style={container()}
    />
  );
};

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: "100%",
  width: "100%",
}));

const navButton = styles.lazy<"hidden" | "visible", ViewStyle>(
  (visibilty) => (t) => ({
    alignItems: "center",
    justifyContent: "center",
    width: 18 * (t.type.size.base / 16) + t.space.sm * 2,
    height: 18 * (t.type.size.base / 16) + t.space.sm * 2,
    borderRadius: t.radius.full,
    color: t.color.accentLight,
    opacity: visibilty === "visible" ? 1 : 0,
  })
);
