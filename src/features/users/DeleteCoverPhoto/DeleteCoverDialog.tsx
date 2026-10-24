import { AlertDialog } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import toast from "react-hot-toast";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import { useDeleteCoverPhoto } from "./useDeleteCoverPhoto";

function DeleteCoverDialog({ state }: { state: UseOverlayStateReturn }) {
  const { mutateAsync, isPending } = useDeleteCoverPhoto();

  async function handleDelete() {
    try {
      await toast.promise(mutateAsync(), {
        loading: "Removing cover…",
        success: "Cover photo removed",
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
              <AlertDialog.Heading>Remove cover photo?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              You can always add a new one later.
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
                Remove
              </AppButton>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export default DeleteCoverDialog;
