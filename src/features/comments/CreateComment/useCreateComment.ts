import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { createComment } from "./createComment.api";
import { commentsKeys } from "../GetComments/getComments.keys";
import type { CommentsPage } from "../comments.interface";
import type { PostsPage } from "@/features/posts/posts.interface";

function bumpCommentsCount(page: PostsPage, postId: string): PostsPage {
  return {
    ...page,
    posts: page.posts.map((post) =>
      post._id === postId
        ? { ...post, commentsCount: (post.commentsCount ?? 0) + 1 }
        : post,
    ),
  };
}

export function useCreateComment(postId: string, postQueryKey?: QueryKey) {
  const queryClient = useQueryClient();
  const queryKey = commentsKeys.post(postId);

  return useMutation({
    mutationFn: (vars: { content: string; image?: File | null }) =>
      createComment({ postId, ...vars }),
    onSuccess: async (newComment) => {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage>>(queryKey, (old) => {
        if (!old) {
          return {
            pages: [{ comments: [newComment], nextPage: null }],
            pageParams: [1],
          };
        }

        const [firstPage, ...restPages] = old.pages;
        return {
          ...old,
          pages: [
            { ...firstPage, comments: [newComment, ...firstPage.comments] },
            ...restPages,
          ],
        };
      });

      if (postQueryKey) {
        queryClient.setQueryData<InfiniteData<PostsPage>>(
          postQueryKey,
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => bumpCommentsCount(page, postId)),
            };
          },
        );
      }
    },
  });
}
