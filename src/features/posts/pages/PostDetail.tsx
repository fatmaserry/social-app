import { EmptyState, Skeleton } from "@heroui/react";
import { useParams } from "react-router";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import PostCard from "../components/PostCard";
import { usePost } from "../GetPost/usePost";
import { postDetailKeys } from "../GetPost/getPost.keys";

function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const { data, isLoading, isError, error } = usePost(postId!);
  const post = data?.pages[0]?.posts[0];

  return (
    <>
      {isLoading && (
        <div className="rounded-3xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <Skeleton className="mt-4 h-16 w-full" />
        </div>
      )}

      {isError && (
        <p className="rounded-3xl border border-danger/30 bg-danger-soft px-5 py-4 text-sm text-danger-soft-foreground">
          {(error as Error).message}
        </p>
      )}

      {!isLoading && !isError && !post && (
        <EmptyState className="flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface py-14 text-center text-main-color">
          <AppIcon name="home" size={36} />
          <p className="font-semibold text-foreground">Post not found</p>
          <p className="text-sm text-muted">
            It may have been deleted, or you don't have access to it.
          </p>
        </EmptyState>
      )}

      {post && <PostCard post={post} queryKey={postDetailKeys.detail(postId!)} />}
    </>
  );
}

export default PostDetail;
