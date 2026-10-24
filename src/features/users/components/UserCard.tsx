import { Avatar } from "@heroui/react";
import { Link } from "react-router";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import { getInitials } from "@/lib/getInitials";

const followerCountFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

function UserCard({
  userId,
  name,
  username,
  photo,
  followersCount,
  isFollowing,
  isTogglingFollow,
  onToggleFollow,
}: {
  userId: string;
  name: string;
  username: string;
  photo?: string;
  followersCount?: number;
  isFollowing: boolean;
  isTogglingFollow?: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <div className="rounded-2xl p-3 transition-colors hover:bg-surface-secondary">
      <Link to={`/profile/${userId}`} className="flex items-center gap-3">
        <Avatar size="sm" className="shrink-0">
          <Avatar.Image alt={name} src={photo} />
          <Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="truncate text-xs text-muted">@{username}</p>
        </div>
      </Link>

      {followersCount !== undefined && (
        <p className="mt-2 text-xs text-muted">
          {followerCountFormatter.format(followersCount)} followers
        </p>
      )}

      <AppButton
        size="sm"
        fullWidth
        variant={isFollowing ? "outline" : "primary"}
        className="mt-3 rounded-full"
        isDisabled={isTogglingFollow}
        onPress={onToggleFollow}
      >
        {isFollowing ? "Following" : "Follow"}
      </AppButton>
    </div>
  );
}

export default UserCard;
