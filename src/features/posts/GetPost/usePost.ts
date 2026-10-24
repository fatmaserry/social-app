import { useInfiniteQuery } from "@tanstack/react-query";
import { getPost } from "./getPost.api";
import { postDetailKeys } from "./getPost.keys";

export function usePost(postId: string) {
  return useInfiniteQuery({
    queryKey: postDetailKeys.detail(postId),
    queryFn: () => getPost(postId).then((post) => ({ posts: [post], nextPage: null })),
    initialPageParam: 1,
    getNextPageParam: () => null,
    retry: false,
  });
}
