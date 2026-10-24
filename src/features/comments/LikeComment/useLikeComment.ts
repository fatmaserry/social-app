import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { likeComment } from "./likeComment.api";
import type { CommentsPage } from "../comments.interface";

function toggleLike(page: CommentsPage, commentId: string, userId: string): CommentsPage {
  return {
    ...page,
    comments: page.comments.map((comment) => {
      if (comment._id !== commentId) return comment;

      const alreadyLiked = comment.likes.includes(userId);
      return {
        ...comment,
        likes: alreadyLiked
          ? comment.likes.filter((id) => id !== userId)
          : [...comment.likes, userId],
        likesCount: alreadyLiked ? comment.likesCount - 1 : comment.likesCount + 1,
      };
    }),
  };
}

export function useLikeComment(postId: string, queryKey: QueryKey) {
  const queryClient = useQueryClient();
  const { userData } = useContext(UserAuthContext);

  return useMutation({
    mutationFn: (commentId: string) => likeComment({ postId, commentId }),
    onMutate: async (commentId: string) => {
      if (!userData) return;

      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<InfiniteData<CommentsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<CommentsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => toggleLike(page, commentId, userData._id)),
        };
      });

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
