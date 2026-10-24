import {
  Avatar,
  EmptyState,
  Skeleton,
  Spinner,
  useOverlayState,
} from "@heroui/react";
import { Camera, Trash } from "iconsax-reactjs";
import { useContext, useId } from "react";
import toast from "react-hot-toast";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import ImageViewerModal from "@/SharedComponents/ImageViewerModal/ImageViewerModal";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";
import { getInitials } from "@/lib/getInitials";
import PostCard from "@/features/posts/components/PostCard";
import { useUserPosts } from "@/features/posts/GetUserPosts/useUserPosts";
import { userPostsKeys } from "@/features/posts/GetUserPosts/getUserPosts.keys";
import { useUploadProfilePhoto } from "../UploadProfilePhoto/useUploadProfilePhoto";
import UploadCoverModal from "../UploadCoverPhoto/UploadCoverModal";
import DeleteCoverDialog from "../DeleteCoverPhoto/DeleteCoverDialog";
import ProfileConnectionsModal from "../components/ProfileConnectionsModal";
import { useUserProfile } from "../GetUserProfile/useUserProfile";

function Profile() {
  const { userData } = useContext(UserAuthContext);
  const photoInputId = useId();
  const { mutate: uploadPhoto, isPending: isUploadingPhoto } =
    useUploadProfilePhoto();
  const coverModalState = useOverlayState();
  const coverViewerState = useOverlayState();
  const removeCoverState = useOverlayState();
  const followersState = useOverlayState();
  const followingState = useOverlayState();

  const userId = userData?._id ?? "";
  const { data: profileData } = useUserProfile(userId);
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPosts(userId);

  const sentinelRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  if (!userData) return null;

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    toast.promise(
      new Promise<void>((resolve, reject) => {
        uploadPhoto(file, {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        });
      }),
      {
        loading: "Updating photo…",
        success: "Profile photo updated",
        error: (err) => err.message,
      },
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="relative h-32 bg-surface-secondary sm:h-40">
          {userData.cover && (
            <button
              type="button"
              onClick={coverViewerState.open}
              aria-label="View cover photo"
              className="block size-full cursor-pointer"
            >
              <img
                src={userData.cover}
                alt=""
                className="size-full object-cover"
              />
            </button>
          )}

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {userData.cover && (
              <button
                type="button"
                onClick={removeCoverState.open}
                title="Remove cover photo"
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/60"
              >
                <Trash size="14" variant="Bold" />
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={coverModalState.open}
              title="Change cover photo"
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/60"
            >
              <Camera size="14" variant="Bold" />
              Edit cover
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="-mt-12 flex items-end justify-between">
            <div className="relative">
              <Avatar size="lg" className="size-24 border-4 border-surface">
                <Avatar.Image alt={userData.name} src={userData.photo} />
                <Avatar.Fallback className="text-2xl">
                  {getInitials(userData.name)}
                </Avatar.Fallback>
              </Avatar>

              <input
                id={photoInputId}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={isUploadingPhoto}
              />
              <label
                htmlFor={photoInputId}
                title="Change profile photo"
                className="absolute bottom-0 right-0 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-main-color text-white hover:brightness-110"
              >
                {isUploadingPhoto ? (
                  <Spinner size="sm" className="text-white" />
                ) : (
                  <Camera size="16" variant="Bold" />
                )}
              </label>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-lg font-bold text-foreground">{userData.name}</p>
            <p className="text-sm text-muted">@{userData.username}</p>
          </div>

          <div className="mt-4 flex gap-6">
            <button
              type="button"
              onClick={followersState.open}
              className="cursor-pointer text-left"
            >
              <span className="text-sm font-semibold text-foreground">
                {userData.followersCount ?? 0}
              </span>{" "}
              <span className="text-sm text-muted">Followers</span>
            </button>
            <button
              type="button"
              onClick={followingState.open}
              className="cursor-pointer text-left"
            >
              <span className="text-sm font-semibold text-foreground">
                {userData.followingCount ?? 0}
              </span>{" "}
              <span className="text-sm text-muted">Following</span>
            </button>
            <div>
              <span className="text-sm font-semibold text-foreground">
                {userData.bookmarksCount ?? 0}
              </span>{" "}
              <span className="text-sm text-muted">Saved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted">Posts</h2>

        {isError && (
          <p className="rounded-3xl border border-danger/30 bg-danger-soft px-5 py-4 text-sm text-danger-soft-foreground">
            {(error as Error).message}
          </p>
        )}

        {isLoading && (
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

        {!isLoading && !isError && posts.length === 0 && (
          <EmptyState className="flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface py-14 text-center text-main-color">
            <AppIcon name="home" size={36} />
            <p className="font-semibold text-foreground">No posts yet</p>
            <p className="text-sm text-muted">
              Posts you share will show up here.
            </p>
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

      <UploadCoverModal state={coverModalState} />
      <DeleteCoverDialog state={removeCoverState} />
      <ProfileConnectionsModal
        title="Followers"
        users={profileData?.user.followers ?? []}
        state={followersState}
      />
      <ProfileConnectionsModal
        title="Following"
        users={profileData?.user.following ?? []}
        state={followingState}
      />
      {userData.cover && (
        <ImageViewerModal
          src={userData.cover}
          alt="Cover photo"
          state={coverViewerState}
        />
      )}
    </>
  );
}

export default Profile;
