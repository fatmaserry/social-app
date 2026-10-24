import { Modal } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { QueryKey } from "@tanstack/react-query";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppTextArea from "@/SharedComponents/AppTextArea/AppTextArea";
import { useMentionAutocomplete } from "../MentionAutocomplete/useMentionAutocomplete";
import MentionAutocomplete from "../MentionAutocomplete/MentionAutocomplete";
import SharedPostEmbed from "../components/SharedPostEmbed";
import { useSharePost } from "./useSharePost";
import type { Post } from "../posts.interface";

function ShareModal({
  post,
  queryKey,
  state,
}: {
  post: Post;
  queryKey: QueryKey;
  state: UseOverlayStateReturn;
}) {
  const [body, setBody] = useState("");
  const { mutateAsync, isPending } = useSharePost(queryKey);
  const {
    query: mentionQuery,
    trackCursor,
    selectMention,
    close: closeMentions,
  } = useMentionAutocomplete({ value: body, onChange: setBody });

  async function handleShare() {
    if (isPending) return;

    try {
      await toast.promise(
        mutateAsync({ postId: post._id, body: body.trim() }),
        {
          loading: "Sharing…",
          success: "Shared",
          error: (err) => err.message,
        },
      );
      setBody("");
      state.close();
    } catch {}
  }

  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Share post</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body>
              <div className="relative">
                <AppTextArea
                  rows={2}
                  placeholder="Say something about this…"
                  value={body}
                  autoFocus
                  onChange={(event) => {
                    setBody(event.target.value);
                    trackCursor(event.target);
                  }}
                  onClick={(event) =>
                    trackCursor(event.target as HTMLTextAreaElement)
                  }
                  onKeyUp={(event) => {
                    if (event.key === "Escape") {
                      closeMentions();
                      return;
                    }
                    trackCursor(event.target as HTMLTextAreaElement);
                  }}
                  onBlur={closeMentions}
                />
                {mentionQuery !== null && (
                  <MentionAutocomplete
                    query={mentionQuery}
                    onSelect={selectMention}
                  />
                )}
              </div>

              <div className="mt-3">
                <SharedPostEmbed post={post} />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <AppButton
                variant="ghost"
                onPress={state.close}
                isDisabled={isPending}
              >
                Cancel
              </AppButton>
              <AppButton onPress={handleShare} isDisabled={isPending}>
                Share
              </AppButton>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default ShareModal;
