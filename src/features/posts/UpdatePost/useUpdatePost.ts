import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { updatePost } from "./updatePost.api";
import type { PostPrivacy, PostsPage } from "../posts.interface";

function patchPost(
  page: PostsPage,
  postId: string,
  patch: { body: string; privacy: PostPrivacy },
): PostsPage {
  return {
    ...page,
    posts: page.posts.map((post) =>
      post._id === postId ? { ...post, ...patch } : post,
    ),
  };
}

export function useUpdatePost(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      postId: string;
      body: string;
      image?: File | null;
      privacy: PostPrivacy;
    }) => updatePost(vars),
    onMutate: async ({ postId, body, privacy }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<InfiniteData<PostsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            patchPost(page, postId, { body, privacy }),
          ),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
