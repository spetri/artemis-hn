import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, View, ViewStyle } from "react-native";
import { styles } from "../../../../dash.config";
import { useMetadata } from "../../../hooks/use-metadata";
import {
  HackerNewsAsk,
  HackerNewsJob,
  HackerNewsPoll,
  HackerNewsStory,
} from "../../../types/hn-api";
import { StoryThreadHeader } from "./StoryThreadHeader/StoryThreadHeader";
import { Comment } from "./../Comment/Comment";

export const StoryThread = ({
  data,
  onRefresh,
}: {
  data: HackerNewsStory | HackerNewsJob | HackerNewsPoll | HackerNewsAsk;
  onRefresh(): unknown;
}) => {
  const [didMount, setDidMount] = useState(false);
  const url = useMemo(
    () => ("url" in data && data.url ? new URL(data.url) : undefined),
    [data]
  );
  const metadata = useMetadata(url);
  useEffect(() => {
    if (data) {
      setDidMount(true);
    }
  }, [data]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl refreshing={!data && didMount} onRefresh={onRefresh} />
    ),
    [data, didMount, onRefresh]
  );

  const renderItem = ({ item, index }: { item: number; index: number }) => (
    <Comment id={item} index={index} depth={1} />
  );

  const fauxFlatComments = Array.from<number>({ length: 3 }).fill(-1);

  const keyExtractor = (item: number, index: number) => {
    return item === -1 ? index.toString() : item.toString();
  };

  return (
    <View style={container()}>
      <FlatList
        ListHeaderComponent={
          <StoryThreadHeader data={data} metadata={metadata} url={url} />
        }
        refreshControl={refreshControl}
        data={!data ? fauxFlatComments : "kids" in data ? data.kids : []}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        renderItem={renderItem}
        style={container()}
      />
    </View>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  backgroundColor: t.color.bodyBg,
}));
