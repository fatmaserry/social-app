import {
  Avatar,
  EmptyState,
  Skeleton,
  Spinner,
  useOverlayState,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Navigate, useParams } from "react-router";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { getInitials } from "@/lib/getInitials";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";
import PostCard from "@/features/posts/components/PostCard";
import { useUserPosts } from "@/features/posts/GetUserPosts/useUserPosts";
import { userPostsKeys } from "@/features/posts/GetUserPosts/getUserPosts.keys";
import { useUserProfile } from "../GetUserProfile/useUserProfile";
import { useToggleFollow } from "../hooks/useToggleFollow";
import ProfileConnectionsModal from "../components/ProfileConnectionsModal";

function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useContext(UserAuthContext);

  if (userId && userData && userId === userData._id) {
    return <Navigate to="/profile" replace />;
  }

  return <UserProfileContent userId={userId!} />;
}

function UserProfileContent({ userId }: { userId: string }) {
  const { data, isLoading, isError, error } = useUserProfile(userId);
  const { mutate: toggleFollow, isPending: isTogglingFollow } =
    useToggleFollow();
  const [isFollowingOverride, setIsFollowingOverride] = useState<
    boolean | null
  >(null);
  const followersState = useOverlayState();
  const followingState = useOverlayState();

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isPostsError,
    error: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPosts(userId);

  const sentinelRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  if (isError) {
    return (
      <>
        <p className="rounded-3xl border border-danger/30 bg-danger-soft px-5 py-4 text-sm text-danger-soft-foreground">
          {(error as Error).message}
        </p>
      </>
    );
  }

  const posts = postsData?.pages.flatMap((page) => page.posts) ?? [];
  const isFollowing = isFollowingOverride ?? data?.isFollowing ?? false;

  function handleToggleFollow() {
    const next = !isFollowing;
    setIsFollowingOverride(next);
    toggleFollow(userId, { onError: () => setIsFollowingOverride(!next) });
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="h-32 bg-surface-secondary sm:h-40">
          {data?.user.cover && (
            <img
              src={data.user.cover}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>

        <div className="px-5 pb-5">
          <div className="-mt-12 flex items-end justify-between">
            {isLoading ? (
              <Skeleton className="size-24 rounded-full border-4 border-surface" />
            ) : (
              <Avatar size="lg" className="size-24 border-4 border-surface">
                <Avatar.Image alt={data?.user.name} src={data?.user.photo} />
                <Avatar.Fallback className="text-2xl">
                  {data ? getInitials(data.user.name) : ""}
                </Avatar.Fallback>
              </Avatar>
            )}

            {!isLoading && (
              <AppButton
                size="sm"
                variant={isFollowing ? "outline" : "primary"}
                className="rounded-full"
                isDisabled={isTogglingFollow}
                onPress={handleToggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </AppButton>
            )}
          </div>

          {isLoading ? (
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-lg font-bold text-foreground">
                {data?.user.name}
              </p>
              <p className="text-sm text-muted">@{data?.user.username}</p>
            </div>
          )}

          <div className="mt-4 flex gap-6">
            <button
              type="button"
              onClick={followersState.open}
              className="cursor-pointer text-left"
            >
              <span className="text-sm font-semibold text-foreground">
                {data?.user.followersCount ?? 0}
              </span>{" "}
              <span className="text-sm text-muted">Followers</span>
            </button>
            <button
              type="button"
              onClick={followingState.open}
              className="cursor-pointer text-left"
            >
              <span className="text-sm font-semibold text-foreground">
                {data?.user.followingCount ?? 0}
              </span>{" "}
              <span className="text-sm text-muted">Following</span>
            </button>
          </div>
        </div>
      </div>

      <ProfileConnectionsModal
        title="Followers"
        users={data?.user.followers ?? []}
        state={followersState}
      />
      <ProfileConnectionsModal
        title="Following"
        users={data?.user.following ?? []}
        state={followingState}
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted">Posts</h2>

        {isPostsError && (
          <p className="rounded-3xl border border-danger/30 bg-danger-soft px-5 py-4 text-sm text-danger-soft-foreground">
            {(postsError as Error).message}
          </p>
        )}

        {isLoadingPosts && (
          <div className="flex flex-col gap-4">
            {[1, 2].map((key) => (
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

        {!isLoadingPosts && !isPostsError && posts.length === 0 && (
          <EmptyState className="flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface py-14 text-center text-main-color">
            <AppIcon name="home" size={36} />
            <p className="font-semibold text-foreground">No posts yet</p>
          </EmptyState>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            queryKey={userPostsKeys.user(userId)}
          />
        ))}

        {hasNextPage && <div ref={sentinelRef} className="h-1" />}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}

export default UserProfile;
