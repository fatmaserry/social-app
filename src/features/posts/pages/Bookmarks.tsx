import { EmptyState, Skeleton, Spinner } from "@heroui/react";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import PostCard from "../components/PostCard";
import { useBookmarkedPostsFeed } from "../GetBookmarks/useBookmarkedPostsFeed";
import { bookmarksKeys } from "../GetBookmarks/getBookmarks.keys";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";

function Bookmarks() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookmarkedPostsFeed();

  const sentinelRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <h1 className="text-lg font-bold text-foreground">Saved posts</h1>

      {isError && (
        <p className="rounded-3xl border border-danger/30 bg-danger-soft px-5 py-4 text-sm text-danger-soft-foreground">
          {(error as Error).message}
        </p>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="rounded-3xl border border-border bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
              <Skeleton className="mt-4 h-16 w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <EmptyState className="flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface py-14 text-center text-main-color">
          <AppIcon name="bookmark" size={36} />
          <p className="font-semibold text-foreground">No saved posts yet</p>
          <p className="text-sm text-muted">
            Posts you save will show up here.
          </p>
        </EmptyState>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} queryKey={bookmarksKeys.all} />
      ))}

      {hasNextPage && <div ref={sentinelRef} className="h-1" />}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </>
  );
}

export default Bookmarks;
