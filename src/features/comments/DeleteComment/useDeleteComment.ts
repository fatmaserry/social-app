import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { deleteComment } from "./deleteComment.api";
import { commentsKeys } from "../GetComments/getComments.keys";
import type { CommentsPage } from "../comments.interface";
import type { PostsPage } from "@/features/posts/posts.interface";

function removeComment(page: CommentsPage, commentId: string): CommentsPage {
  return { ...page, comments: page.comments.filter((comment) => comment._id !== commentId) };
}

function dropCommentsCount(page: PostsPage, postId: string): PostsPage {
  return {
    ...page,
    posts: page.posts.map((post) =>
      post._id === postId
        ? { ...post, commentsCount: Math.max(0, (post.commentsCount ?? 1) - 1) }
        : post,
    ),
  };
}

function dropRepliesCount(page: CommentsPage, parentCommentId: string): CommentsPage {
  return {
    ...page,
    comments: page.comments.map((comment) =>
      comment._id === parentCommentId
        ? { ...comment, repliesCount: Math.max(0, (comment.repliesCount ?? 1) - 1) }
        : comment,
    ),
  };
}

export function useDeleteComment(
  postId: string,
  queryKey: QueryKey,
  postQueryKey?: QueryKey,
  parentCommentId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment({ postId, commentId }),
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<InfiniteData<CommentsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<CommentsPage>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map((page) => removeComment(page, commentId)) };
      });

      if (postQueryKey) {
        queryClient.setQueryData<InfiniteData<PostsPage>>(postQueryKey, (old) => {
          if (!old) return old;
          return { ...old, pages: old.pages.map((page) => dropCommentsCount(page, postId)) };
        });
      }

      if (parentCommentId) {
        queryClient.setQueryData<InfiniteData<CommentsPage>>(
          commentsKeys.post(postId),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => dropRepliesCount(page, parentCommentId)),
            };
          },
        );
      }

      return { previous };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
