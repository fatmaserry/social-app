import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { savePost } from "./savePost.api";
import type { PostsPage } from "../posts.interface";

function toggleSaved(page: PostsPage, postId: string): PostsPage {
  return {
    ...page,
    posts: page.posts.map((post) =>
      post._id === postId ? { ...post, bookmarked: !post.bookmarked } : post,
    ),
  };
}

export function useSavePost(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => savePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<InfiniteData<PostsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => toggleSaved(page, postId)),
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
