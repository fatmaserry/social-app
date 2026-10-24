import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "./getUserPosts.api";
import { userPostsKeys } from "./getUserPosts.keys";

export function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: userPostsKeys.user(userId),
    queryFn: ({ pageParam }) => getUserPosts({ userId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
