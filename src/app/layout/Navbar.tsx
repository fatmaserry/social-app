import { Avatar, Skeleton, ToggleButton } from "@heroui/react";
import { Activity, LogoutCurve, Moon, Sun1, User } from "iconsax-reactjs";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import type { AppIconName } from "@/SharedComponents/AppIcon/AppIcon";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { ThemeContext } from "@/app/providers/ThemeProvider/ThemeProvider";
import { getInitials } from "@/lib/getInitials";
import NotificationBell from "@/features/notifications/components/NotificationBell";

const navIcons: { label: string; icon: AppIconName; to?: string }[] = [
  { label: "Home", icon: "home", to: "/" },
  { label: "Explore", icon: "search", to: "/explore" },
  { label: "Bookmarks", icon: "bookmark", to: "/bookmarks" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { userData, setUserData, isLoading } = useContext(UserAuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const router = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogOut() {
    localStorage.removeItem("user_tkn");
    setUserData(null);
    setIsMenuOpen(false);
    router("/login");
  }

  return (
    <div className="fixed inset-x-0 top-4 z-20 flex justify-center px-4">
      <nav className="flex w-full max-w-2xl items-center justify-between gap-4 rounded-full border border-border bg-surface/90 px-4 py-2 shadow-sm backdrop-blur-md sm:px-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-main-color">
            <Activity size="18" color="white" variant="Bold" />
          </div>
          <span className="hidden text-base font-bold tracking-tight text-foreground sm:block">
            Pulse
          </span>
        </Link>

        {(userData || isLoading) && (
          <div className="hidden items-center gap-1 sm:flex">
            {navIcons.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex size-9 items-center justify-center rounded-full transition-colors ${
                      isActive ? "bg-main-color/10" : "hover:bg-surface-secondary"
                    }`
                  }
                >
                  <AppIcon name={item.icon} size={20} />
                </NavLink>
              ) : (
                <span
                  key={item.label}
                  title="Coming soon"
                  className="flex size-9 cursor-not-allowed items-center justify-center rounded-full opacity-40"
                >
                  <AppIcon name={item.icon} size={20} className="grayscale" />
                </span>
              ),
            )}
            <NotificationBell />
          </div>
        )}

        <div className="flex items-center gap-2">
          <ToggleButton
            isIconOnly
            variant="ghost"
            isSelected={theme === "dark"}
            onChange={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun1 size="18" variant="Outline" />
            ) : (
              <Moon size="18" variant="Outline" />
            )}
          </ToggleButton>

          {isLoading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : userData ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setIsMenuOpen((open) => !open)}
                type="button"
                className="block cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-main-color"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
              >
                <span className="sr-only">Open user menu</span>
                <Avatar size="sm">
                  <Avatar.Image alt={userData.name} src={userData.photo} />
                  <Avatar.Fallback>{getInitials(userData.name)}</Avatar.Fallback>
                </Avatar>
              </button>

              {isMenuOpen && (
                <div
                  role="menu"
                  className="absolute inset-e-0 top-full z-50 mt-2 w-56 rounded-2xl border border-border bg-surface py-1.5 shadow-overlay"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {userData.name}
                    </p>
                    <p className="truncate text-xs text-muted">{userData.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface-hover"
                  >
                    <User size="16" />
                    My profile
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogOut}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface-hover"
                  >
                    <LogoutCurve size="16" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <AppButton variant="ghost" size="sm" className="rounded-full">
                  Log in
                </AppButton>
              </Link>
              <Link to="/register">
                <AppButton size="sm" className="rounded-full">
                  Sign up
                </AppButton>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
