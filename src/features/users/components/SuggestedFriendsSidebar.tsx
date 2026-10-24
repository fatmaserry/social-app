import { Skeleton, ToggleButton } from "@heroui/react";
import { Refresh } from "iconsax-reactjs";
import { useState } from "react";
import { useSuggestedUsers } from "../hooks/useSuggestedUsers";
import { useToggleFollow } from "../hooks/useToggleFollow";
import UserCard from "./UserCard";

function SuggestedFriendsSidebar() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSuggestedUsers(page, 5);
  const { mutate: toggleFollow } = useToggleFollow();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  function handleRefresh() {
    const numberOfPages = data?.numberOfPages ?? 1;
    const nextPage = page >= numberOfPages ? 1 : page + 1;
    if (nextPage === page) refetch();
    else setPage(nextPage);
  }

  function handleToggleFollow(userId: string) {
    const wasFollowing = followedIds.has(userId);

    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (wasFollowing) next.delete(userId);
      else next.add(userId);
      return next;
    });

    toggleFollow(userId, {
      onError: () => {
        setFollowedIds((prev) => {
          const next = new Set(prev);
          if (wasFollowing) next.add(userId);
          else next.delete(userId);
          return next;
        });
      },
    });
  }

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-24 rounded-3xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            You might like
          </p>
          <ToggleButton
            isIconOnly
            variant="ghost"
            size="sm"
            onChange={handleRefresh}
            aria-label="Refresh suggestions"
          >
            <Refresh size="16" className={isFetching ? "animate-spin" : ""} />
          </ToggleButton>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {isLoading &&
            [1, 2, 3, 4, 5].map((key) => (
              <div key={key} className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}

          {isError && (
            <p className="text-sm text-danger">
              {(error as Error).message || "Couldn't load suggestions."}
            </p>
          )}

          {!isLoading && !isError && data?.users.length === 0 && (
            <p className="text-sm text-muted">No suggestions right now.</p>
          )}

          {data?.users.map((user) => (
            <UserCard
              key={user._id}
              userId={user._id}
              name={user.name}
              username={user.username}
              photo={user.photo}
              followersCount={user.followersCount}
              isFollowing={followedIds.has(user._id)}
              onToggleFollow={() => handleToggleFollow(user._id)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SuggestedFriendsSidebar;
