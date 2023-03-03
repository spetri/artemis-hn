import { memo, useContext } from 'react';
import { Dimensions, View, type ViewStyle } from 'react-native';
import useSWR from 'swr';

import { ListItem, Skeleton } from '@rneui/themed';
import { styles, useDash } from '../../../dash.config';
import { type HackerNewsAsk, type HackerNewsItem, type HackerNewsPoll } from '../../types/hn-api';
import { HACKER_NEWS_API } from '../../constants/api';
import { JobStory } from './JobStory/JobStory';
import { AskStory } from './AskStory/AskStory';
import { CommentStory } from './CommentStory/CommentStory';
import { MinimalStory } from './MinimalStory/MinimalStory';
import { ComplexStory } from './ComplexStory/ComplexStory';
import { usePreferencesStore } from '../../contexts/store';

export const StoryCard = memo(
  function StoryCard({ index, id }: { index: number; id: number | null }) {
    useDash();
    const displayLargeThumbnails = usePreferencesStore((state) => state.displayLargeThumbnails);

    const story = useSWR<HackerNewsItem>(
      id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`,
      async (key) =>
        await fetch(key, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then(async (res) => await res.json())
    );

    if (story.data == null) {
      return (
        <View>
          <ListItem bottomDivider containerStyle={skeletonContainer(index)}>
            <Skeleton animation="pulse" style={storySkeletonImage(index)} />
            <ListItem.Content>
              <Skeleton style={storySkeletonTitle(index)} />
              <ListItem containerStyle={skeletonContainer(index)}>
                <Skeleton style={storySkeletonBy(index)} />
                <Skeleton style={storySkeletonMetadata(index)} />
              </ListItem>
            </ListItem.Content>
          </ListItem>
        </View>
      );
    }

    if (story.data.deleted || story.data.dead) {
      return null;
    }

    return (!('url' in story.data) || story.data.url === undefined) &&
      story.data.type === 'story' ? (
      <AskStory data={story.data as HackerNewsAsk} index={index} />
    ) : story.data.type === 'job' ? (
      <JobStory data={story.data} index={index} />
    ) : story.data.type === 'comment' ? (
      <CommentStory data={story.data} index={index} />
    ) : story.data.type === 'poll' ? (
      <PollStory data={story.data} index={index} />
    ) : displayLargeThumbnails ? (
      <ComplexStory data={story.data} index={index} />
    ) : (
      <MinimalStory data={story.data} index={index} />
    );
  },
  (prev, next) => prev.id === next.id && prev.index === next.index
);

function PollStory({ data, index }: { data: HackerNewsPoll; index: number }) {
  console.log(data, index);
  return null;
}

const skeletonContainer = styles.lazy<number, ViewStyle>(() => (t) => ({
  backgroundColor: t.color.bodyBg
}));

const storySkeletonImage = styles.lazy<number, ViewStyle>(() => (t) => ({
  display: 'flex',
  borderRadius: 10,
  flexDirection: 'column',
  justifyContent: 'center',
  height: 60,
  width: 60,
  backgroundColor: t.color.accent
}));

const storySkeletonTitle = styles.lazy<number, ViewStyle>(() => (t) => ({
  width: Dimensions.get('window').width - 200,
  height: 15,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));

const storySkeletonBy = styles.lazy<number, ViewStyle>(() => (t) => ({
  height: 15,
  width: 30,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));

const storySkeletonMetadata = styles.lazy<number, ViewStyle>(() => (t) => ({
  height: 15,
  width: 90,
  borderRadius: 10,
  backgroundColor: t.color.accent
}));
