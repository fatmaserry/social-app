import { Avatar, useOverlayState } from "@heroui/react";
import { useContext } from "react";
import { NavLink } from "react-router";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import type { AppIconName } from "@/SharedComponents/AppIcon/AppIcon";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { getInitials } from "@/lib/getInitials";
import { useUserProfile } from "@/features/users/GetUserProfile/useUserProfile";
import ProfileConnectionsModal from "@/features/users/components/ProfileConnectionsModal";

const navItems: { label: string; icon: AppIconName; to?: string }[] = [
  { label: "Home", icon: "home", to: "/" },
  { label: "Explore people", icon: "search", to: "/explore" },
  { label: "Bookmarks", icon: "bookmark", to: "/bookmarks" },
  { label: "Notifications", icon: "bell", to: "/notifications" },
  { label: "My profile", icon: "person", to: "/profile" },
  { label: "Account settings", icon: "gear", to: "/settings" },
];

function AppSidebar() {
  const { userData } = useContext(UserAuthContext);
  const followersState = useOverlayState();
  const followingState = useOverlayState();
  const { data: profileData } = useUserProfile(userData?._id ?? "");

  if (!userData) return null;

  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="sticky top-24 flex flex-col gap-4">
        <div className="rounded-3xl border border-border bg-surface p-5 text-center">
          <Avatar size="lg" className="mx-auto">
            <Avatar.Image alt={userData.name} src={userData.photo} />
            <Avatar.Fallback>{getInitials(userData.name)}</Avatar.Fallback>
          </Avatar>
          <p className="mt-3 truncate text-sm font-semibold text-foreground">
            {userData.name}
          </p>
          <p className="truncate text-xs text-muted">@{userData.username}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={followersState.open}
              className="cursor-pointer rounded-2xl bg-surface-secondary px-2 py-2 text-center hover:bg-surface-secondary/80"
            >
              <p className="text-sm font-semibold text-foreground">
                {userData.followersCount ?? 0}
              </p>
              <p className="text-xs text-muted">Followers</p>
            </button>
            <button
              type="button"
              onClick={followingState.open}
              className="cursor-pointer rounded-2xl bg-surface-secondary px-2 py-2 text-center hover:bg-surface-secondary/80"
            >
              <p className="text-sm font-semibold text-foreground">
                {userData.followingCount ?? 0}
              </p>
              <p className="text-xs text-muted">Following</p>
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 rounded-3xl border border-border bg-surface p-2">
          {navItems.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/" || item.to === "/profile"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-main-color/10 text-main-color"
                      : "text-foreground hover:bg-surface-secondary"
                  }`
                }
              >
                <AppIcon name={item.icon} size={20} />
                {item.label}
              </NavLink>
            ) : (
              <div
                key={item.label}
                title="Coming soon"
                className="flex cursor-not-allowed items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted opacity-50"
              >
                <AppIcon name={item.icon} size={20} className="grayscale" />
                {item.label}
              </div>
            ),
          )}
        </nav>
      </div>
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
    </aside>
  );
}

export default AppSidebar;
