import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { updateComment } from "./updateComment.api";
import type { CommentsPage } from "../comments.interface";

function patchContent(page: CommentsPage, commentId: string, content: string): CommentsPage {
  return {
    ...page,
    comments: page.comments.map((comment) =>
      comment._id === commentId ? { ...comment, content } : comment,
    ),
  };
}

export function useUpdateComment(postId: string, queryKey: QueryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { commentId: string; content: string; image?: File | null }) =>
      updateComment({ postId, ...vars }),
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<InfiniteData<CommentsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<CommentsPage>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map((page) => patchContent(page, commentId, content)) };
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
