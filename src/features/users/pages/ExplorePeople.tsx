import { Skeleton, ToggleButton } from "@heroui/react";
import { Refresh, SearchNormal1 } from "iconsax-reactjs";
import { useState } from "react";
import { useUserSearch } from "../hooks/useUserSearch";
import { useSuggestedUsers } from "../hooks/useSuggestedUsers";
import { useToggleFollow } from "../hooks/useToggleFollow";
import UserCard from "../components/UserCard";

function ExplorePeople() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const isSearching = query.trim().length > 0;
  const search = useUserSearch(query);
  const suggestions = useSuggestedUsers(page, 15);
  const { mutate: toggleFollow } = useToggleFollow();

  function handleRefreshSuggestions() {
    const numberOfPages = suggestions.data?.numberOfPages ?? 1;
    const nextPage = page >= numberOfPages ? 1 : page + 1;
    if (nextPage === page) suggestions.refetch();
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

  const users: {
    _id: string;
    name: string;
    username: string;
    photo?: string;
    followersCount?: number;
  }[] = isSearching ? (search.data ?? []) : (suggestions.data?.users ?? []);
  const isLoading = isSearching ? search.isLoading : suggestions.isLoading;
  const isError = isSearching ? search.isError : suggestions.isError;

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-foreground">Explore people</h1>
        {!isSearching && (
          <ToggleButton
            isIconOnly
            variant="ghost"
            size="sm"
            onChange={handleRefreshSuggestions}
            aria-label="Refresh suggestions"
          >
            <Refresh
              size="16"
              className={suggestions.isFetching ? "animate-spin" : ""}
            />
          </ToggleButton>
        )}
      </div>

      <div className="relative">
        <SearchNormal1
          size="18"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search people by name or username…"
          className="w-full rounded-full border border-border bg-surface py-2.5 pl-11 pr-4 text-sm text-foreground outline-none focus:border-main-color"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {isLoading &&
          [1, 2, 3, 4].map((key) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
            >
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          ))}

        {isError && (
          <p className="col-span-full text-sm text-danger">
            {isSearching
              ? "Couldn't search right now."
              : "Couldn't load suggestions."}
          </p>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted">
            {isSearching
              ? "No one matches that search."
              : "No suggestions right now."}
          </p>
        )}

        {!isLoading &&
          users.map((user) => (
            <div
              key={user._id}
              className="rounded-2xl border border-border bg-surface"
            >
              <UserCard
                userId={user._id}
                name={user.name}
                username={user.username}
                photo={user.photo}
                followersCount={user.followersCount}
                isFollowing={followedIds.has(user._id)}
                onToggleFollow={() => handleToggleFollow(user._id)}
              />
            </div>
          ))}
      </div>
    </>
  );
}

export default ExplorePeople;
