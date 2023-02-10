import { useParents } from "../../../hooks/use-parents";
import { FAB } from "@rneui/themed";
import { HackerNewsComment } from "../../../types/hn-api";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, View, ViewStyle } from "react-native";
import { CommentThreadHeader } from "./CommentThreadHeader/CommentThreadHeader";
import { Comment } from "../Comment/Comment";
import { styles } from "../../../../dash.config";
import { fauxFlatComments, keyExtractor } from "../../../utils/util";

type CommentThreadProps = {
  data: HackerNewsComment;
  onRefresh: () => void;
};

export const CommentThread: FC<CommentThreadProps> = ({ data, onRefresh }) => {
  const parents = useParents(data.parent);
  const parentComments = parents.data ?? [];
  const [didMount, setDidMount] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (data && containerHeight && mainHeight && listRef.current && !didMount) {
      listRef.current.scrollToOffset({
        offset: containerHeight - mainHeight - 64,
      });
      setDidMount(true);
    }
  }, [didMount, data, containerHeight, mainHeight]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl refreshing={!data && didMount} onRefresh={onRefresh} />
    ),
    [data, didMount, onRefresh]
  );

  const renderThreadedItem = ({ item, index }) => (
    <Comment id={item} index={index} depth={3} />
  );

  return (
    <View style={container()}>
      <FlatList
        ListHeaderComponent={
          <CommentThreadHeader
            data={data}
            parentComments={parentComments}
            setContainerHeight={(number: any) => setContainerHeight(number)}
            setMainHeight={(number: any) => setMainHeight(number)}
          />
        }
        refreshControl={refreshControl}
        data={!data ? fauxFlatComments : "kids" in data ? data.kids : []}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        renderItem={renderThreadedItem}
        style={container()}
        ref={listRef}
      />
    </View>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  backgroundColor: t.color.bodyBg,
}));