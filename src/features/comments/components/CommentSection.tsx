import { Spinner } from "@heroui/react";
import type { QueryKey } from "@tanstack/react-query";
import { useComments } from "../GetComments/useComments";
import { useCreateComment } from "../CreateComment/useCreateComment";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";
import { commentsKeys } from "../GetComments/getComments.keys";

function CommentSection({ postId, postQueryKey }: { postId: string; postQueryKey: QueryKey }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(postId);
  const { mutateAsync: createComment } = useCreateComment(postId, postQueryKey);

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-border pt-3">
      <CommentComposer
        placeholder="Write a comment…"
        onSubmit={(content) => createComment({ content })}
        autoFocus
      />

      {isLoading && (
        <div className="flex justify-center py-2">
          <Spinner size="sm" />
        </div>
      )}

      {!isLoading && comments.length === 0 && (
        <p className="py-1 text-center text-sm text-muted">No comments yet. Be the first.</p>
      )}

      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          postId={postId}
          comment={comment}
          queryKey={commentsKeys.post(postId)}
        />
      ))}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="cursor-pointer self-center text-sm font-semibold text-muted hover:text-foreground"
        >
          {isFetchingNextPage ? "Loading…" : "Load more comments"}
        </button>
      )}
    </div>
  );
}

export default CommentSection;
