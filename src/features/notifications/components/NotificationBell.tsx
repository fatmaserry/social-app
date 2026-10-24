import { Dropdown } from "@heroui/react";
import { useState } from "react";
import AppIcon from "@/SharedComponents/AppIcon/AppIcon";
import { useUnreadCount } from "../GetUnreadCount/useUnreadCount";
import NotificationsPanel from "./NotificationsPanel";

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadCount } = useUnreadCount();

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dropdown.Trigger
        aria-label="Notifications"
        className="relative flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface-secondary"
      >
        <AppIcon name="bell" size={20} />
        {!!unreadCount && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <NotificationsPanel
          isOpen={isOpen}
          onNavigate={() => setIsOpen(false)}
        />
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default NotificationBell;
