import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, View, ViewStyle } from "react-native";
import { styles, useDash } from "../../../../dash.config";
import { useMetadata } from "../../../hooks/use-metadata";
import {
  HackerNewsAsk,
  HackerNewsJob,
  HackerNewsPoll,
  HackerNewsStory,
} from "../../../types/hn-api";
import { StoryThreadHeader } from "./StoryThreadHeader/StoryThreadHeader";
import { Comment } from "./../Comment/Comment";
import { fauxFlatComments, keyExtractor } from "../../../utils/util";
import { FAB } from "@rneui/themed";

type StoryThreadProps = {
  data: HackerNewsStory | HackerNewsJob | HackerNewsPoll | HackerNewsAsk;
  onRefresh(): unknown;
};

export const StoryThread: FC<StoryThreadProps> = ({ data, onRefresh }) => {
  const [didMount, setDidMount] = useState(false);
  const {
    tokens: { color },
  } = useDash();
  const scrollViewRef = useRef();
  const [commentsPositions, setCommentsPositions] = useState([]);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);

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

  const pressed = () => {
    const sortCommentPositions = commentsPositions.sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    const comments = sortCommentPositions.map((commentPosition, index) => {
      return { position: commentPosition, index };
    });

    const commentIndex = comments.filter((comment) => {
      if (currentScrollPosition < comment.position) {
        return comment;
      }
    })[0];

    scrollViewRef?.current.scrollToOffset({
      offset: commentIndex.position + 1,
      animated: true,
    });
  };

  const refreshControl = useMemo(
    () => (
      <RefreshControl refreshing={!data && didMount} onRefresh={onRefresh} />
    ),
    [data, didMount, onRefresh]
  );

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    return (
      <Comment
        id={item}
        index={index}
        depth={1}
        setPosition={(position) =>
          setCommentsPositions((prevArray) => [...prevArray, position])
        }
      />
    );
  };

  const onScrollEvent = (event) => {
    setCurrentScrollPosition(event.nativeEvent.contentOffset.y);
  };

  return (
    <View style={container()}>
      <FlatList
        ListHeaderComponent={
          <StoryThreadHeader data={data} metadata={metadata} url={url} />
        }
        scrollToOverflowEnabled={true}
        refreshControl={refreshControl}
        data={!data ? fauxFlatComments : "kids" in data ? data.kids : []}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        renderItem={renderItem}
        style={container()}
        onScroll={onScrollEvent}
        ref={scrollViewRef}
      />
      <FAB
        placement="right"
        icon={{ name: "keyboard-arrow-down", color: color.textPrimary }}
        color={color.primary as string}
        onPress={pressed}
      />
    </View>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  backgroundColor: t.color.bodyBg,
}));
