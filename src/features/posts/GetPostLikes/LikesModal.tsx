import { Avatar, Modal, Spinner } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { getInitials } from "@/lib/getInitials";
import { usePostLikes } from "./usePostLikes";
import { useLikersByIds } from "./useLikersByIds";

function LikesModal({
  postId,
  likerIds,
  state,
}: {
  postId: string;
  likerIds?: string[];
  state: UseOverlayStateReturn;
}) {
  const isCommentLikes = !!likerIds;
  const postLikes = usePostLikes(postId, state.isOpen && !isCommentLikes);
  const commentLikes = useLikersByIds(
    likerIds ?? [],
    state.isOpen && isCommentLikes,
  );

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = postLikes;
  const isLoading = isCommentLikes
    ? commentLikes.isLoading
    : postLikes.isLoading;
  const likers = isCommentLikes
    ? commentLikes.likers
    : (postLikes.data?.pages.flatMap((page) => page.likers) ?? []);

  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Liked by</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body>
              {isLoading && (
                <div className="flex justify-center py-6">
                  <Spinner size="sm" />
                </div>
              )}

              {!isLoading && likers.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">
                  No likes yet.
                </p>
              )}

              <div className="flex flex-col gap-1">
                {likers.map((liker) => (
                  <div
                    key={liker._id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-secondary"
                  >
                    <Avatar size="sm">
                      <Avatar.Image alt={liker.name} src={liker.photo} />
                      <Avatar.Fallback>
                        {getInitials(liker.name)}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {liker.name}
                      </p>
                      {liker.username && (
                        <p className="truncate text-xs text-muted">
                          @{liker.username}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {hasNextPage && (
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="mt-2 w-full cursor-pointer text-center text-sm font-semibold text-muted hover:text-foreground"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </button>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default LikesModal;
