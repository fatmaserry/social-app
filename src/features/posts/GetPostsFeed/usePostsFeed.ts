import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsFeed } from "./getPostsFeed.api";
import { postsFeedKeys } from "./getPostsFeed.keys";
import type { FeedScope } from "../posts.interface";

export function usePostsFeed(scope: FeedScope = "public") {
  return useInfiniteQuery({
    queryKey: postsFeedKeys.scope(scope),
    queryFn: ({ pageParam }) => getPostsFeed({ scope, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
