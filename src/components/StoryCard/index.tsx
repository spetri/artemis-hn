import { memo } from "react";
import { View, ViewStyle } from "react-native";
import useSWR from "swr";

import { styles, useDash } from "../../../dash.config";
import {
  HackerNewsAsk,
  HackerNewsItem,
  HackerNewsPoll,
} from "../../types/hn-api";
import { Skeleton } from "../Skeleton";
import { HACKER_NEWS_API } from "../../constants/api";
import { JobStory } from "./JobStory/JobStory";
import { AskStory } from "./AskStory/AskStory";
import { CommentStory } from "./CommentStory/CommentStory";
import { MinimalStory } from "./MinimalStory/MinimalStory";

export const StoryCard = memo(
  function StoryCard({ index, id }: { index: number; id: number | null }) {
    useDash();
    const story = useSWR<HackerNewsItem>(
      id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`,
      (key) =>
        fetch(key, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }).then((res) => res.json())
    );

    if (!story.data) {
      return (
        <View style={storyContainer(index)}>
          <Skeleton style={storySkeleton(index)} />
        </View>
      );
    }

    if (story.data.deleted || story.data.dead) {
      return null;
    }

    return (!("url" in story.data) || story.data.url === undefined) &&
      story.data.type === "story" ? (
      <AskStory data={story.data as HackerNewsAsk} index={index} />
    ) : story.data.type === "job" ? (
      <JobStory data={story.data} index={index} />
    ) : story.data.type === "comment" ? (
      <CommentStory data={story.data} index={index} />
    ) : story.data.type === "poll" ? (
      <PollStory data={story.data} index={index} />
    ) : (
      <MinimalStory data={story.data} index={index} />
    );
  },
  (prev, next) => prev.id === next.id && prev.index === next.index
);

function PollStory({ data, index }: { data: HackerNewsPoll; index: number }) {
  return null;
}

const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: index === 0 || index > 4 ? "100%" : "50%",
  padding: t.space.lg,
  paddingTop: index === 0 ? t.space.xl : index < 5 ? t.space.md : t.space.lg,
  paddingBottom: index === 0 ? t.space.xl : index < 5 ? t.space.lg : t.space.lg,
}));

const storySkeleton = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: "100%",
  height: index === 0 || index > 4 ? 172 : 96,
  marginBottom: t.space.md,
  borderRadius: t.radius.secondary,
}));
