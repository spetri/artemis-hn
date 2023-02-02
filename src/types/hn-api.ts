export type HackerNewsItem =
  | HackerNewsStory
  | HackerNewsAsk
  | HackerNewsJob
  | HackerNewsComment
  | HackerNewsPoll;

export type HackerNewsItemBase = {
  id: number; // The item's unique id
  by: string; // The username of the item's author.
  descendants: number; // In the case of stories or polls, the total comment count.
  kids?: number[]; // The ids of the item's comments, in ranked display order.
  parts: number[]; // A list of related pollopts, in display order.
  score: number; // The story's score, or the votes for a pollopt.
  time: number; // Creation date of the item, in Unix Time.
  title: string; // The title of the story, poll or job.
  text: string; // The comment, story, or poll text. HTML.
  parent: number; // The comment's parent: either another comment or the relevant story
  poll: number; // The pollopt's associated poll.
  url: string; // The URL of the story.
  deleted: boolean; // `true` if the item is deleted.
  dead: boolean; // `true` if the item is dead.
};

export type HackerNewsStory = Pick<
  HackerNewsItemBase,
  | "by"
  | "descendants"
  | "id"
  | "kids"
  | "score"
  | "time"
  | "title"
  | "url"
  | "deleted"
  | "dead"
> & {
  type: "story";
};

export type HackerNewsComment = Pick<
  HackerNewsItemBase,
  "by" | "id" | "kids" | "parent" | "time" | "text" | "deleted" | "dead"
> & {
  type: "comment";
};

export type HackerNewsAsk = (
  | Pick<
      HackerNewsItemBase,
      | "by"
      | "descendants"
      | "id"
      | "kids"
      | "score"
      | "time"
      | "title"
      | "text"
      | "deleted"
      | "dead"
    >
  | (Pick<
      HackerNewsItemBase,
      | "by"
      | "descendants"
      | "id"
      | "kids"
      | "score"
      | "time"
      | "title"
      | "text"
      | "deleted"
      | "dead"
    > & {
      url: undefined;
    })
) & {
  type: "story";
};

export type HackerNewsJob = Pick<
  HackerNewsItemBase,
  "by" | "id" | "score" | "time" | "title" | "text" | "url" | "deleted" | "dead"
> & {
  type: "job";
};

export type HackerNewsPoll = Pick<
  HackerNewsItemBase,
  | "by"
  | "id"
  | "descendants"
  | "kids"
  | "parts"
  | "score"
  | "time"
  | "title"
  | "text"
  | "deleted"
  | "dead"
> & {
  type: "poll";
};

export type HackerNewsPollOpt = Pick<
  HackerNewsItemBase,
  | "by"
  | "id"
  | "poll"
  | "score"
  | "time"
  | "title"
  | "text"
  | "deleted"
  | "dead"
> & {
  type: "pollopt";
};

export type HackerNewsUser = {
  id: string; // The user's unique username. Case-sensitive. Required.
  about: string; // The user's optional self-description. HTML.
  created: number; // Creation date of the user, in Unix Time.
  karma: number; // The user's karma.
  submitted: number[]; // List of the user's stories, polls and comments.
};

export type StoryFilters =
  | "home"
  | "top"
  | "new"
  | "best"
  | "show"
  | "ask"
  | "job";
