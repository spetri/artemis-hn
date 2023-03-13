import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  type ViewabilityConfigCallbackPair,
  type ViewStyle
} from 'react-native';
import { FAB } from '@rneui/themed';
import { styles, useDash } from '../../../../dash.config';
import { useMetadata } from '../../../hooks/use-metadata';
import {
  type HackerNewsAsk,
  type HackerNewsJob,
  type HackerNewsPoll,
  type HackerNewsStory
} from '../../../types/hn-api';
import { Comment } from '../Comment/Comment';
import { fauxFlatComments, keyExtractor } from '../../../utils/util';
import { StoryThreadHeader } from './StoryThreadHeader/StoryThreadHeader';
import { usePreferencesStore } from '../../../contexts/store';

type StoryThreadProps = {
  data: HackerNewsStory | HackerNewsJob | HackerNewsPoll | HackerNewsAsk;
  onRefresh: () => unknown;
}

export const StoryThread: FC<StoryThreadProps> = ({ data, onRefresh }) => {
  const [didMount, setDidMount] = useState(false);
  const {
    tokens: { color }
  } = useDash();
  const scrollViewRef = useRef<any>();
  const [viewportOffsetTopComment, setViewportOffsetTopComment] = useState<[{ index: number }]>();
  const showJumpButton = usePreferencesStore((state) => state.showJumpButton);
  const jumpButtonPosition = usePreferencesStore((state) => state.jumpButtonPosition);

  const url = useMemo(() => ('url' in data && data.url ? new URL(data.url) : undefined), [data]);

  const metadata = useMetadata(url);
  useEffect(() => {
    if (data) {
      setDidMount(true);
    }
  }, [data]);

  const pressed = (isLongPressed: boolean) => {
    const totalCommentCount = data?.kids.length - 1;
    if (
      viewportOffsetTopComment != null &&
      viewportOffsetTopComment[0].index === 0 &&
      viewportOffsetTopComment.length === 1
    ) {
      scrollViewRef?.current.scrollToIndex({
        index: 0,
        animated: true
      });
    } else if (
      viewportOffsetTopComment != null &&
      viewportOffsetTopComment[0].index === totalCommentCount
    ) {
      return;
    } else {
      if (viewportOffsetTopComment != null && viewportOffsetTopComment.length > 0) {
        if (isLongPressed) {
          if (viewportOffsetTopComment[0].index < 1) {
            return;
          } else {
            scrollViewRef?.current.scrollToIndex({
              index: viewportOffsetTopComment[0].index - 1,
              animated: true
            });
          }
        } else {
          scrollViewRef?.current.scrollToIndex({
            index: viewportOffsetTopComment[0].index + 1,
            animated: true,
            viewOffset: -10
          });
        }
      }
    }
  };

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={!data && didMount} onRefresh={onRefresh} />,
    [data, didMount, onRefresh]
  );

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    return <Comment id={item} index={index} depth={1} />;
  };

  const onViewableItemsChanged = useCallback(
    (viewableItems) => {
      if (viewableItems.viewableItems) {
        setViewportOffsetTopComment(viewableItems.viewableItems);
      }
    },
    [setViewportOffsetTopComment]
  );

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 10 });

  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

  return (
    <View style={container()}>
      <FlatList
        ListHeaderComponent={<StoryThreadHeader data={data} metadata={metadata} url={url} />}
        scrollToOverflowEnabled={true}
        refreshControl={refreshControl}
        data={!data ? fauxFlatComments : 'kids' in data ? data.kids : []}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        renderItem={renderItem}
        style={container()}
        viewabilityConfigCallbackPairs={
          viewabilityConfigCallbackPairs.current as ViewabilityConfigCallbackPair[]
        }
        viewabilityConfig={viewConfigRef.current}
        ref={scrollViewRef}
      />
      {showJumpButton && (
        <FAB
          placement={jumpButtonPosition}
          icon={{ name: 'keyboard-arrow-down', color: color.textPrimary }}
          color={color.primary as string}
          onPress={() => pressed(false)}
          onLongPress={() => pressed(true)}
        />
      )}
    </View>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  backgroundColor: t.color.bodyBg
}));
