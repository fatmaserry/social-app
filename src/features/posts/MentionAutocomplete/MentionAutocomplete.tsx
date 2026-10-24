import { Avatar } from "@heroui/react";
import { useUserSearch } from "@/features/users/hooks/useUserSearch";
import { getInitials } from "@/lib/getInitials";

function MentionAutocomplete({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (username: string) => void;
}) {
  const { data: users, isLoading } = useUserSearch(query);

  if (!isLoading && (!users || users.length === 0)) return null;

  return (
    <div className="absolute z-20 mt-1 w-64 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-overlay">
      {isLoading && (
        <p className="px-2.5 py-2 text-xs text-muted">Searching…</p>
      )}

      {users?.map((user) => (
        <button
          key={user._id}
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(user.username);
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-left hover:bg-surface-secondary"
        >
          <Avatar size="sm">
            <Avatar.Image alt={user.name} src={user.photo} />
            <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted">@{user.username}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default MentionAutocomplete;
