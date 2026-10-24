import type { FeedScope } from "../posts.interface";

export const postsFeedKeys = {
  all: ["posts", "feed"] as const,
  scope: (scope: FeedScope) => [...postsFeedKeys.all, scope] as const,
};
