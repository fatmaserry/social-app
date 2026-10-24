import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarkedPosts } from "./getBookmarks.api";
import { bookmarksKeys } from "./getBookmarks.keys";

export function useBookmarkedPostsFeed() {
  return useInfiniteQuery({
    queryKey: bookmarksKeys.all,
    queryFn: ({ pageParam }) => getBookmarkedPosts({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
