import { AlertDialog } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import toast from "react-hot-toast";
import AppButton from "@/SharedComponents/AppButton/AppButton";

function DeleteCommentDialog({
  onConfirm,
  state,
}: {
  onConfirm: () => Promise<unknown>;
  state: UseOverlayStateReturn;
}) {
  async function handleDelete() {
    try {
      await toast.promise(onConfirm(), {
        loading: "Deleting…",
        success: "Comment deleted",
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
              <AlertDialog.Heading>Delete comment?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>This can't be undone.</AlertDialog.Body>
            <AlertDialog.Footer>
              <AppButton variant="ghost" onPress={state.close}>
                Cancel
              </AppButton>
              <AppButton variant="danger" onPress={handleDelete}>
                Delete
              </AppButton>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export default DeleteCommentDialog;
