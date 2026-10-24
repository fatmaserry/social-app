import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { createReply } from "./createReply.api";
import { repliesKeys } from "../GetReplies/getReplies.keys";
import { commentsKeys } from "../GetComments/getComments.keys";
import type { CommentsPage } from "../comments.interface";

function bumpRepliesCount(page: CommentsPage, commentId: string): CommentsPage {
  return {
    ...page,
    comments: page.comments.map((comment) =>
      comment._id === commentId
        ? { ...comment, repliesCount: (comment.repliesCount ?? 0) + 1 }
        : comment,
    ),
  };
}

export function useCreateReply(postId: string, commentId: string) {
  const queryClient = useQueryClient();
  const queryKey = repliesKeys.comment(commentId);
  const parentQueryKey = commentsKeys.post(postId);

  return useMutation({
    mutationFn: (vars: { content: string; image?: File | null }) =>
      createReply({ postId, commentId, ...vars }),
    onSuccess: async (newReply) => {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage>>(queryKey, (old) => {
        if (!old) {
          return { pages: [{ comments: [newReply], nextPage: null }], pageParams: [1] };
        }

        const [firstPage, ...restPages] = old.pages;
        return {
          ...old,
          pages: [{ ...firstPage, comments: [newReply, ...firstPage.comments] }, ...restPages],
        };
      });

      queryClient.setQueryData<InfiniteData<CommentsPage>>(parentQueryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map((page) => bumpRepliesCount(page, commentId)) };
      });
    },
  });
}
