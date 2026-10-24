import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { deletePost } from "./deletePost.api";
import type { PostsPage } from "../posts.interface";

function removePost(page: PostsPage, postId: string): PostsPage {
  return { ...page, posts: page.posts.filter((post) => post._id !== postId) };
}

export function useDeletePost(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<InfiniteData<PostsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => removePost(page, postId)),
        };
      });

      return { previous };
    },
    onError: (_err, _postId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
