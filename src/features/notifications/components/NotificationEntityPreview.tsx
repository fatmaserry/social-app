import type { AppNotification } from "../notifications.interface";

function NotificationEntityPreview({
  notification,
}: {
  notification: AppNotification;
}) {
  const entity = notification.entity;
  if (notification.entityType !== "post") return null;

  const post = entity && "body" in entity ? entity : undefined;
  const topComment =
    notification.type === "comment_post" ? post?.topComment : null;
  const hasContent = !!post && !!(post.body || post.image || topComment);

  if (!hasContent) {
    return (
      <div className="mt-1.5 rounded-xl border border-border bg-surface/60 p-2">
        <p className="text-xs italic text-muted">
          This post is no longer available.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-1.5 rounded-xl border border-border bg-surface/60 p-2">
      {post?.body && (
        <p className="line-clamp-2 text-xs text-muted">{post.body}</p>
      )}

      {post?.image && (
        <img
          src={post.image}
          alt=""
          className="mt-1.5 max-h-28 w-full rounded-lg border border-border object-cover"
        />
      )}

      {topComment && (
        <p className="mt-1.5 border-l-2 border-main-color/40 pl-2 text-xs italic text-muted">
          "{topComment.content}"
        </p>
      )}
    </div>
  );
}

export default NotificationEntityPreview;
