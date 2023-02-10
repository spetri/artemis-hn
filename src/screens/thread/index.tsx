import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import useSWR from "swr";
import {
  HackerNewsStory,
  HackerNewsJob,
  HackerNewsPoll,
  HackerNewsAsk,
  HackerNewsComment,
} from "../../types/hn-api";
import { StackParamList } from "../routers";
import { HACKER_NEWS_API } from "../../constants/api";
import { StoryThread } from "./StoryThread/StoryThread";
import { CommentThread } from "./CommentThread/CommentThread";
import { FC } from "react";

export interface ThreadProps
  extends NativeStackScreenProps<StackParamList, "Thread"> {}

export const Thread: FC<ThreadProps> = ({ route }) => {
  const { id } = route.params;
  const { data, mutate } = useSWR<
    | HackerNewsStory
    | HackerNewsJob
    | HackerNewsPoll
    | HackerNewsAsk
    | HackerNewsComment
  >(id === -1 ? null : `${HACKER_NEWS_API}/item/${id}.json`, (key) =>
    fetch(key, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json())
  );

  if (!data) {
    return null;
  } else if (data.type === "comment") {
    return <CommentThread data={data} onRefresh={() => mutate()} />;
  } else {
    return <StoryThread data={data} onRefresh={() => mutate()} />;
  }
};
