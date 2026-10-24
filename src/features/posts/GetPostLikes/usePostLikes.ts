import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostLikes } from "./getPostLikes.api";
import { postLikesKeys } from "./getPostLikes.keys";

export function usePostLikes(postId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: postLikesKeys.post(postId),
    queryFn: ({ pageParam }) => getPostLikes({ postId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
  });
}
