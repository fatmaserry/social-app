import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { sharePost } from "./sharePost.api";
import type { Post, PostsPage } from "../posts.interface";

function bumpSharesCount(page: PostsPage, postId: string): PostsPage {
  return {
    ...page,
    posts: page.posts.map((post) =>
      post._id === postId ? { ...post, sharesCount: (post.sharesCount ?? 0) + 1 } : post,
    ),
  };
}

function prependPost(old: InfiniteData<PostsPage> | undefined, newPost: Post) {
  if (!old) {
    return { pages: [{ posts: [newPost], nextPage: null }], pageParams: [1] };
  }

  const [firstPage, ...restPages] = old.pages;
  return {
    ...old,
    pages: [{ ...firstPage, posts: [newPost, ...firstPage.posts] }, ...restPages],
  };
}

export function useSharePost(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { postId: string; body: string }) => sharePost(vars),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<InfiniteData<PostsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map((page) => bumpSharesCount(page, postId)) };
      });

      return { previous };
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) =>
        prependPost(old, newPost),
      );
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
