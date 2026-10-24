import { Avatar, useOverlayState } from "@heroui/react";
import { Link } from "react-router";
import { getInitials } from "@/lib/getInitials";
import { timeAgo } from "@/lib/timeAgo";
import { renderBodyWithMentions } from "@/lib/renderBodyWithMentions";
import ImageViewerModal from "@/SharedComponents/ImageViewerModal/ImageViewerModal";
import PostPrivacyIcon from "./PostPrivacyIcon";
import type { Post } from "../posts.interface";

function SharedPostEmbed({ post }: { post: Post }) {
  const imageViewerState = useOverlayState();

  return (
    <div className="rounded-2xl border border-border p-3">
      <Link to={`/profile/${post.user._id}`} className="flex items-center gap-2">
        <Avatar size="sm">
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

      {post.body && (
        <p className="mt-2 line-clamp-3 whitespace-pre-wrap wrap-break-word text-sm text-foreground">
          {renderBodyWithMentions(post.body)}
        </p>
      )}

      {post.image && (
        <>
          <button
            type="button"
            onClick={imageViewerState.open}
            aria-label="View image"
            className="mt-2 block w-full cursor-pointer"
          >
            <img
              src={post.image}
              alt=""
              className="w-full rounded-xl border border-border bg-surface-secondary object-contain"
            />
          </button>
          <ImageViewerModal src={post.image} state={imageViewerState} />
        </>
      )}
    </div>
  );
}

export default SharedPostEmbed;
