import { AlertDialog } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import toast from "react-hot-toast";
import type { QueryKey } from "@tanstack/react-query";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import { useDeletePost } from "./useDeletePost";

function DeletePostDialog({
  postId,
  queryKey,
  state,
}: {
  postId: string;
  queryKey: QueryKey;
  state: UseOverlayStateReturn;
}) {
  const { mutateAsync, isPending } = useDeletePost(queryKey);

  async function handleDelete() {
    try {
      await toast.promise(mutateAsync(postId), {
        loading: "Deleting…",
        success: "Post deleted",
        error: (err) => err.message,
      });
      state.close();
    } catch {}
  }

  return (
    <AlertDialog isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Header>
              <AlertDialog.Heading>Delete post?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              This can't be undone. The post will be removed for everyone who
              can see it.
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <AppButton
                variant="ghost"
                onPress={state.close}
                isDisabled={isPending}
              >
                Cancel
              </AppButton>
              <AppButton
                variant="danger"
                onPress={handleDelete}
                isDisabled={isPending}
              >
                Delete
              </AppButton>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export default DeletePostDialog;
