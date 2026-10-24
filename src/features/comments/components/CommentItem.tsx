import { Avatar, Dropdown, Spinner, useOverlayState } from "@heroui/react";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { More2 } from "iconsax-reactjs";
import type { QueryKey } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppTextArea from "@/SharedComponents/AppTextArea/AppTextArea";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { getInitials } from "@/lib/getInitials";
import { timeAgo } from "@/lib/timeAgo";
import { renderBodyWithMentions } from "@/lib/renderBodyWithMentions";
import { useLikeComment } from "../LikeComment/useLikeComment";
import { useUpdateComment } from "../UpdateComment/useUpdateComment";
import { useDeleteComment } from "../DeleteComment/useDeleteComment";
import { useReplies } from "../GetReplies/useReplies";
import { useCreateReply } from "../CreateReply/useCreateReply";
import { repliesKeys } from "../GetReplies/getReplies.keys";
import DeleteCommentDialog from "./DeleteCommentDialog";
import CommentComposer from "./CommentComposer";
import type { Comment } from "../comments.interface";

function CommentItem({
  postId,
  comment,
  queryKey,
  isReply = false,
  parentCommentId,
}: {
  postId: string;
  comment: Comment;
  queryKey: QueryKey;
  isReply?: boolean;
  parentCommentId?: string;
}) {
  const { userData } = useContext(UserAuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [repliesOpen, setRepliesOpen] = useState(false);

  const { mutate: toggleLike, isPending: isLikePending } = useLikeComment(
    postId,
    queryKey,
  );
  const { mutateAsync: update, isPending: isUpdating } = useUpdateComment(
    postId,
    queryKey,
  );
  const { mutateAsync: remove } = useDeleteComment(
    postId,
    queryKey,
    undefined,
    parentCommentId,
  );

  const deleteState = useOverlayState();

  const isLiked = !!userData && comment.likes.includes(userData._id);
  const isOwnComment = !!userData && userData._id === comment.user._id;

  const hasExistingReplies = (comment.repliesCount ?? 0) > 0;
  const repliesQuery = useReplies(
    postId,
    comment._id,
    repliesOpen && hasExistingReplies,
  );
  const { mutateAsync: createReply } = useCreateReply(postId, comment._id);
  const replies =
    repliesQuery.data?.pages.flatMap((page) => page.comments) ?? [];

  async function handleSaveEdit() {
    const trimmed = editValue.trim();
    if (!trimmed) return;

    try {
      await toast.promise(
        update({ commentId: comment._id, content: trimmed }),
        {
          loading: "Saving…",
          success: "Comment updated",
          error: (err) => err.message,
        },
      );
      setIsEditing(false);
    } catch {}
  }

  return (
    <div className="flex gap-2">
      <Link to={`/profile/${comment.user._id}`}>
        <Avatar size="sm">
          <Avatar.Image alt={comment.user.name} src={comment.user.photo} />
          <Avatar.Fallback>{getInitials(comment.user.name)}</Avatar.Fallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-2xl bg-surface-secondary px-3 py-2">
            <Link
              to={`/profile/${comment.user._id}`}
              className="text-xs font-semibold text-foreground hover:underline"
            >
              {comment.user.name}
            </Link>

            {isEditing ? (
              <div className="mt-1 flex flex-col gap-2">
                <AppTextArea
                  rows={1}
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <AppButton
                    size="sm"
                    className="rounded-full"
                    isDisabled={!editValue.trim() || isUpdating}
                    onPress={handleSaveEdit}
                  >
                    Save
                  </AppButton>
                  <AppButton
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    isDisabled={isUpdating}
                    onPress={() => {
                      setEditValue(comment.content);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </AppButton>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap wrap-break-word text-sm text-foreground">
                {renderBodyWithMentions(comment.content)}
              </p>
            )}
          </div>

          {isOwnComment && !isEditing && (
            <Dropdown>
              <Dropdown.Trigger
                aria-label="Comment options"
                className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface-secondary hover:text-foreground"
              >
                <More2 size="14" />
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu>
                  <Dropdown.Item id="edit" onAction={() => setIsEditing(true)}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="delete"
                    variant="danger"
                    onAction={deleteState.open}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>

        {!isEditing && (
          <div className="mt-1 flex items-center gap-3 px-1 text-xs text-muted">
            <span>{timeAgo(comment.createdAt)} ago</span>
            <button
              type="button"
              onClick={() => toggleLike(comment._id)}
              disabled={isLikePending}
              className={`cursor-pointer font-semibold ${isLiked ? "text-danger" : "hover:text-foreground"}`}
            >
              Like{comment.likesCount > 0 && ` · ${comment.likesCount}`}
            </button>
            {!isReply && (
              <button
                type="button"
                onClick={() => setRepliesOpen((open) => !open)}
                className="cursor-pointer font-semibold hover:text-foreground"
              >
                {comment.repliesCount
                  ? `${repliesOpen ? "Hide" : "View"} ${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}`
                  : "Reply"}
              </button>
            )}
          </div>
        )}

        {isOwnComment && (
          <DeleteCommentDialog
            state={deleteState}
            onConfirm={() => remove(comment._id)}
          />
        )}

        {!isReply && repliesOpen && (
          <div className="mt-3 flex flex-col gap-3">
            {replies.map((reply) => (
              <CommentItem
                key={reply._id}
                postId={postId}
                comment={reply}
                queryKey={repliesKeys.comment(comment._id)}
                isReply
                parentCommentId={comment._id}
              />
            ))}

            {repliesQuery.isLoading && (
              <div className="flex justify-center py-2">
                <Spinner size="sm" />
              </div>
            )}

            <CommentComposer
              placeholder="Write a reply…"
              onSubmit={(content) => createReply({ content })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
