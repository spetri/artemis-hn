import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RefreshControl,
  View,
  type ViewabilityConfigCallbackPair,
  type ViewStyle
} from 'react-native';
import { styles, useDash } from '../../../../dash.config';
import { useMetadata } from '../../../hooks/use-metadata';
import {
  type HackerNewsAsk,
  type HackerNewsJob,
  type HackerNewsPoll,
  type HackerNewsStory
} from '../../../types/hn-api';
import { Fab } from '../../../components/Fab/Fab';
import { Comment } from '../Comment/Comment';
import { fauxFlatComments, keyExtractor } from '../../../utils/util';
import { StoryThreadHeader } from './StoryThreadHeader/StoryThreadHeader';
import { usePreferencesStore } from '../../../contexts/store';
import { FlashList } from '@shopify/flash-list';

type StoryThreadProps = {
  data: HackerNewsStory | HackerNewsJob | HackerNewsPoll | HackerNewsAsk;
  onRefresh: () => unknown;
};

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
      viewportOffsetTopComment[0].index === totalCommentCount
    ) {
      return;
    } else {
      if (viewportOffsetTopComment != null && viewportOffsetTopComment.length > 0) {
        if (isLongPressed) {
          if (viewportOffsetTopComment[0].index < 1) {
            return;
          } else {
            setTimeout(() => {
              scrollViewRef?.current?.scrollToIndex({
                index: viewportOffsetTopComment[0].index - 1,
                animated: true
              });
            }, 100);
          }
        } else {
          setTimeout(() => {
            scrollViewRef?.current.scrollToIndex({
              index: viewportOffsetTopComment[0].index + 1,
              animated: true,
              viewOffset: -10
            });
          }, 100);
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
      <FlashList
        ListHeaderComponent={<StoryThreadHeader data={data} metadata={metadata} url={url} />}
        scrollToOverflowEnabled={true}
        refreshControl={refreshControl}
        data={!data ? fauxFlatComments : 'kids' in data ? data.kids : []}
        keyExtractor={keyExtractor}
        estimatedItemSize={266}
        renderItem={renderItem}
        viewabilityConfigCallbackPairs={
          viewabilityConfigCallbackPairs.current as ViewabilityConfigCallbackPair[]
        }
        viewabilityConfig={viewConfigRef.current}
        ref={scrollViewRef}
      />
      {showJumpButton && (
        <Fab
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
