import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "./getComments.api";
import { commentsKeys } from "./getComments.keys";

export function useComments(postId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: commentsKeys.post(postId),
    queryFn: ({ pageParam }) => getComments({ postId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
  });
}
