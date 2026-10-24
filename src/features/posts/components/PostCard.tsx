import { Avatar, Dropdown, useOverlayState } from "@heroui/react";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { More2 } from "iconsax-reactjs";
import type { QueryKey } from "@tanstack/react-query";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { useLikePost } from "../LikePost/useLikePost";
import { useSavePost } from "../SavePost/useSavePost";
import UpdatePostModal from "../UpdatePost/UpdatePostModal";
import DeletePostDialog from "../DeletePost/DeletePostDialog";
import ShareModal from "../SharePost/ShareModal";
import SharedPostEmbed from "./SharedPostEmbed";
import PostPrivacyIcon from "./PostPrivacyIcon";
import LikesModal from "../GetPostLikes/LikesModal";
import ImageViewerModal from "@/SharedComponents/ImageViewerModal/ImageViewerModal";
import type { Post } from "../posts.interface";
import { getInitials } from "@/lib/getInitials";
import { timeAgo } from "@/lib/timeAgo";
import { renderBodyWithMentions } from "@/lib/renderBodyWithMentions";
import CommentSection from "@/features/comments/components/CommentSection";

function PostCard({ post, queryKey }: { post: Post; queryKey: QueryKey }) {
  const { userData } = useContext(UserAuthContext);
  const { mutate: toggleLike, isPending: isLikePending } = useLikePost(queryKey);
  const { mutate: toggleBookmark, isPending: isBookmarkPending } = useSavePost(queryKey);
  const isLiked = !!userData && post.likes.includes(userData._id);
  const isOwnPost = !!userData && userData._id === post.user._id;
  const [commentsOpen, setCommentsOpen] = useState(false);

  const editState = useOverlayState();
  const deleteState = useOverlayState();
  const shareState = useOverlayState();
  const likesState = useOverlayState();
  const imageViewerState = useOverlayState();

  return (
    <article className="rounded-3xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/profile/${post.user._id}`} className="flex items-center gap-3">
          <Avatar size="md">
            <Avatar.Image alt={post.user.name} src={post.user.photo} />
            <Avatar.Fallback>{getInitials(post.user.name)}</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground hover:underline">
              {post.user.name}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted">
              {timeAgo(post.createdAt)} ago
              {post.privacy && (
                <>
                  <span>·</span>
                  <PostPrivacyIcon privacy={post.privacy} />
                </>
              )}
            </p>
          </div>
        </Link>

        {isOwnPost && (
          <Dropdown>
            <Dropdown.Trigger
              aria-label="Post options"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface-secondary hover:text-foreground"
            >
              <More2 size="18" />
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu>
                <Dropdown.Item id="edit" onAction={editState.open}>
                  Edit post
                </Dropdown.Item>
                <Dropdown.Item id="delete" variant="danger" onAction={deleteState.open}>
                  Delete post
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )}
      </div>

      {isOwnPost && <UpdatePostModal post={post} queryKey={queryKey} state={editState} />}
      {isOwnPost && (
        <DeletePostDialog postId={post._id} queryKey={queryKey} state={deleteState} />
      )}
      <ShareModal
        post={post.isShare && post.sharedPost ? post.sharedPost : post}
        queryKey={queryKey}
        state={shareState}
      />
      <LikesModal postId={post._id} state={likesState} />

      {post.body && (
        <p className="mt-4 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground">
          {renderBodyWithMentions(post.body)}
        </p>
      )}

      {post.isShare && post.sharedPost ? (
        <div className="mt-4">
          <SharedPostEmbed post={post.sharedPost} />
        </div>
      ) : (
        post.image && (
          <>
            <button
              type="button"
              onClick={imageViewerState.open}
              aria-label="View image"
              className="mt-4 block w-full cursor-pointer"
            >
              <img
                src={post.image}
                alt=""
                className="w-full rounded-2xl border border-border bg-surface-secondary object-contain"
              />
            </button>
            <ImageViewerModal src={post.image} state={imageViewerState} />
          </>
        )
      )}

      <div className="mt-4 flex items-center gap-5 border-t border-border pt-3">
        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            onClick={() => toggleLike(post._id)}
            disabled={isLikePending}
            className={`flex cursor-pointer items-center gap-1.5 transition-colors ${
              isLiked ? "text-danger" : "text-muted hover:text-foreground"
            }`}
          >
            <AppIcon name={isLiked ? "heart" : "heartOutline"} size={18} />
            Like
          </button>
          {post.likesCount > 0 && (
            <button
              type="button"
              onClick={likesState.open}
              className="cursor-pointer text-muted hover:text-foreground hover:underline"
            >
              · {post.likesCount}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCommentsOpen((open) => !open)}
          className={`flex cursor-pointer items-center gap-1.5 text-sm transition-colors ${
            commentsOpen ? "text-main-color" : "text-muted hover:text-foreground"
          }`}
        >
          <AppIcon name="comment" size={18} />
          Comment{(post.commentsCount ?? 0) > 0 && ` · ${post.commentsCount}`}
        </button>
        <button
          type="button"
          onClick={shareState.open}
          className="flex cursor-pointer items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <AppIcon name="share" size={18} />
          Share{(post.sharesCount ?? 0) > 0 && ` · ${post.sharesCount}`}
        </button>
        <button
          type="button"
          onClick={() => toggleBookmark(post._id)}
          disabled={isBookmarkPending}
          className={`ml-auto flex cursor-pointer items-end gap-1 text-sm transition-colors ${
            post.bookmarked ? "text-main-color" : "text-muted hover:text-foreground"
          }`}
        >
          <AppIcon name="bookmark" size={18} />
          {post.bookmarked ? "Saved" : "Save"}
        </button>
      </div>

      {commentsOpen && <CommentSection postId={post._id} postQueryKey={queryKey} />}
    </article>
  );
}

export default PostCard;
