import { Modal } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";

function ImageViewerModal({
  src,
  alt = "",
  state,
}: {
  src: string;
  alt?: string;
  state: UseOverlayStateReturn;
}) {
  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Backdrop className="bg-black/90">
        <Modal.Container size="full" placement="center">
          <Modal.Dialog
            aria-label={alt || "Image preview"}
            className="flex items-center justify-center bg-transparent p-4 shadow-none"
          >
            <Modal.CloseTrigger className="bg-white/10 text-white hover:bg-white/20" />
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default ImageViewerModal;
