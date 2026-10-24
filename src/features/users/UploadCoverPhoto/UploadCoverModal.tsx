import { Modal } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppFileInput from "@/SharedComponents/AppFileInput/AppFileInput";
import PostPrivacySelect from "@/features/posts/components/PostPrivacySelect";
import type { PostPrivacy } from "@/features/posts/posts.interface";
import { useUploadCoverPhoto } from "./useUploadCoverPhoto";

function UploadCoverModal({ state }: { state: UseOverlayStateReturn }) {
  const [file, setFile] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<PostPrivacy>("public");
  const { mutateAsync, isPending } = useUploadCoverPhoto();

  async function handleUpload() {
    if (!file || isPending) return;

    try {
      await toast.promise(mutateAsync({ cover: file, privacy }), {
        loading: "Updating cover…",
        success: "Cover photo updated",
        error: (err) => err.message,
      });
      setFile(null);
      state.close();
    } catch {}
  }

  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Update cover photo</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-4">
              <AppFileInput value={file} onChange={setFile} />
              <PostPrivacySelect value={privacy} onChange={setPrivacy} />
            </Modal.Body>

            <Modal.Footer>
              <AppButton
                variant="ghost"
                onPress={state.close}
                isDisabled={isPending}
              >
                Cancel
              </AppButton>
              <AppButton onPress={handleUpload} isDisabled={!file || isPending}>
                Upload
              </AppButton>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default UploadCoverModal;
