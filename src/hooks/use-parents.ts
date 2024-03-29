import useSWR, { useSWRConfig } from 'swr';
import { HACKER_NEWS_API } from '../constants/api';
import { StoryDatatype } from '../enums/enums';
import {
  type HackerNewsAsk,
  type HackerNewsComment,
  type HackerNewsPoll,
  type HackerNewsStory
} from '../types/hn-api';

export function useParents(firstParent?: number | null) {
  const { cache } = useSWRConfig();

  return useSWR<
    [story: HackerNewsStory | HackerNewsPoll | HackerNewsAsk, ...other: HackerNewsComment[]]
  >(
    firstParent === void 0 || firstParent === null
      ? null
      : [`${HACKER_NEWS_API}/item/${firstParent}.json`, 'parents'],
    async (key) => {
      let next =
        cache.get(key) ??
        (await fetch(key, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then<Promise<HackerNewsStory | HackerNewsPoll | HackerNewsAsk | HackerNewsComment>>(
          async (res) => await res.json()
        ));
      const parents: [
        story: HackerNewsStory | HackerNewsPoll | HackerNewsAsk,
        ...other: HackerNewsComment[]
      ] = [next as any];
      let foundStory = next.type === StoryDatatype.STORY || next.type === StoryDatatype.POLL;
      cache.set(`${HACKER_NEWS_API}/item/${firstParent}.json`, next);

      while (!foundStory) {
        const key = `${HACKER_NEWS_API}/item/${next.parent}.json`;
        next =
          cache.get(key) ??
          (await fetch(key, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }).then<Promise<HackerNewsStory | HackerNewsPoll | HackerNewsAsk | HackerNewsComment>>(
            async (res) => await res.json()
          ));
        parents.unshift(next);
        cache.set(key, next);
        foundStory = next.type === StoryDatatype.STORY || next.type === StoryDatatype.POLL;
      }

      return parents;
    }
  );
}
