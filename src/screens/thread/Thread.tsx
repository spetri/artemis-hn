import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import useSWR from 'swr';
import { type FC, useEffect, useState } from 'react';
import {
  type HackerNewsAsk,
  type HackerNewsComment,
  type HackerNewsJob,
  type HackerNewsPoll,
  type HackerNewsStory
} from '../../types/hn-api';
import { type StackParamList } from '../routers';
import { HACKER_NEWS_API } from '../../constants/api';
import { StoryThread } from './StoryThread/StoryThread';
import { CommentThread } from './CommentThread/CommentThread';
import { StoryDatatype } from '../../enums/enums';

export type ThreadProps = NativeStackScreenProps<StackParamList, 'Thread'>;

export const Thread: FC<ThreadProps> = ({ route }) => {
  const { id } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const { data, mutate } = useSWR<
    HackerNewsStory | HackerNewsJob | HackerNewsPoll | HackerNewsAsk | HackerNewsComment
  >(id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`, async (key) => {
    setIsLoading(true);
    return await fetch(key, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(async (res) => {
      setIsLoading(false);
      return await res.json();
    });
  });

  if (data == null) {
    return null;
  } else if (data.type === StoryDatatype.COMMENT) {
    return <CommentThread data={data} onRefresh={async () => await mutate()} />;
  } else {
    return <StoryThread data={data} onRefresh={async () => await mutate()} isLoading={isLoading} />;
  }
};
