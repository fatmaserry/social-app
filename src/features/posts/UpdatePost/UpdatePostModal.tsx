import { Avatar, Modal } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { useId, useState } from "react";
import toast from "react-hot-toast";
import type { QueryKey } from "@tanstack/react-query";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppTextArea from "@/SharedComponents/AppTextArea/AppTextArea";
import AppFileInput from "@/SharedComponents/AppFileInput/AppFileInput";
import { useMentionAutocomplete } from "../MentionAutocomplete/useMentionAutocomplete";
import MentionAutocomplete from "../MentionAutocomplete/MentionAutocomplete";
import PostPrivacySelect from "../components/PostPrivacySelect";
import { useUpdatePost } from "./useUpdatePost";
import type { Post, PostPrivacy } from "../posts.interface";
import { getInitials } from "@/lib/getInitials";

function UpdatePostModal({
  post,
  queryKey,
  state,
}: {
  post: Post;
  queryKey: QueryKey;
  state: UseOverlayStateReturn;
}) {
  const replaceInputId = useId();
  const [body, setBody] = useState(post.body ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<PostPrivacy>(post.privacy ?? "public");
  const { mutateAsync, isPending } = useUpdatePost(queryKey);
  const {
    query: mentionQuery,
    trackCursor,
    selectMention,
    close: closeMentions,
  } = useMentionAutocomplete({ value: body, onChange: setBody });

  async function handleSave() {
    const trimmed = body.trim();
    if (!trimmed || isPending) return;

    try {
      await toast.promise(
        mutateAsync({ postId: post._id, body: trimmed, image, privacy }),
        {
          loading: "Saving…",
          success: "Post updated",
          error: (err) => err.message,
        },
      );
      state.close();
    } catch {}
  }

  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Edit post</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body>
              <div className="flex gap-3">
                <Avatar size="md" className="mt-1">
                  <Avatar.Image alt={post.user.name} src={post.user.photo} />
                  <Avatar.Fallback>
                    {getInitials(post.user.name)}
                  </Avatar.Fallback>
                </Avatar>

                <div className="relative flex-1">
                  <AppTextArea
                    rows={4}
                    value={body}
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

                  {image || !post.image ? (
                    <AppFileInput value={image} onChange={setImage} />
                  ) : (
                    <div className="relative mt-3 inline-block">
                      <img
                        src={post.image}
                        alt=""
                        className="max-h-48 rounded-2xl border border-border bg-surface-secondary object-contain"
                      />
                      <input
                        id={replaceInputId}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          setImage(event.target.files?.[0] ?? null)
                        }
                      />
                      <label
                        htmlFor={replaceInputId}
                        className="absolute inset-x-0 bottom-0 cursor-pointer rounded-b-2xl bg-black/50 py-1.5 text-center text-xs font-medium text-white"
                      >
                        Replace photo
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-between">
              <PostPrivacySelect value={privacy} onChange={setPrivacy} />
              <div className="flex gap-2">
                <AppButton
                  variant="ghost"
                  onPress={state.close}
                  isDisabled={isPending}
                >
                  Cancel
                </AppButton>
                <AppButton
                  onPress={handleSave}
                  isDisabled={!body.trim() || isPending}
                >
                  Save
                </AppButton>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default UpdatePostModal;
