import { Avatar, Modal } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { Link } from "react-router";
import { getInitials } from "@/lib/getInitials";
import type { ProfileConnection } from "../GetUserProfile/getUserProfile.interface";

function ProfileConnectionsModal({
  title,
  users,
  state,
}: {
  title: string;
  users: ProfileConnection[];
  state: UseOverlayStateReturn;
}) {
  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body>
              {users.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  No {title.toLowerCase()} yet.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {users.map((user) => (
                    <Link
                      key={user._id}
                      to={`/profile/${user._id}`}
                      onClick={state.close}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-secondary"
                    >
                      <Avatar size="sm">
                        <Avatar.Image alt={user.name} src={user.photo} />
                        <Avatar.Fallback>
                          {getInitials(user.name)}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        {user.username && (
                          <p className="truncate text-xs text-muted">
                            @{user.username}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default ProfileConnectionsModal;
