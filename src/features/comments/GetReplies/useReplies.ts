import { useInfiniteQuery } from "@tanstack/react-query";
import { getReplies } from "./getReplies.api";
import { repliesKeys } from "./getReplies.keys";

export function useReplies(postId: string, commentId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: repliesKeys.comment(commentId),
    queryFn: ({ pageParam }) => getReplies({ postId, commentId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
  });
}
