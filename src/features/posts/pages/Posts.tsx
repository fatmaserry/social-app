import { useState } from "react";
import { EmptyState, Skeleton, Spinner } from "@heroui/react";
import { Global, Profile2User } from "iconsax-reactjs";
import PostCard from "../components/PostCard";
import PostComposer from "../CreatePost/PostComposer";
import { usePostsFeed } from "../GetPostsFeed/usePostsFeed";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";
import { postsFeedKeys } from "../GetPostsFeed/getPostsFeed.keys";
import type { FeedScope } from "../posts.interface";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";

const scopeTabs: { scope: FeedScope; label: string; icon: typeof Global }[] = [
  { scope: "public", label: "For You", icon: Global },
  { scope: "following", label: "Following", icon: Profile2User },
];

function Posts() {
  const [scope, setScope] = useState<FeedScope>("public");
  const queryKey = postsFeedKeys.scope(scope);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsFeed(scope);

  const sentinelRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <div className="flex gap-2 rounded-full border border-border bg-surface p-1.5">
        {scopeTabs.map((tab) => {
          const isActive = scope === tab.scope;
          return (
            <button
              key={tab.scope}
              type="button"
              onClick={() => setScope(tab.scope)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-main-color text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <tab.icon size="16" variant={isActive ? "Bold" : "Outline"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {scope === "public" && <PostComposer />}

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

      {!isLoading && posts.length === 0 && (
        <EmptyState className="flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface py-14 text-center text-main-color">
          <AppIcon name="home" size={36} />
          <p className="font-semibold text-foreground">
            {scope === "following"
              ? "No posts from people you follow yet"
              : "No posts yet"}
          </p>
          <p className="text-sm text-muted">
            {scope === "following"
              ? "Follow people to see their posts here."
              : "Be the first to share something with your circle."}
          </p>
        </EmptyState>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} queryKey={queryKey} />
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

export default Posts;
