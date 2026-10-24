import { Avatar } from "@heroui/react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppTextArea from "@/SharedComponents/AppTextArea/AppTextArea";
import AppFileInput from "@/SharedComponents/AppFileInput/AppFileInput";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { useCreatePost } from "./useCreatePost";
import { useMentionAutocomplete } from "../MentionAutocomplete/useMentionAutocomplete";
import MentionAutocomplete from "../MentionAutocomplete/MentionAutocomplete";
import PostPrivacySelect from "../components/PostPrivacySelect";
import { getInitials } from "@/lib/getInitials";
import type { PostPrivacy } from "../posts.interface";

function PostComposer() {
  const { userData } = useContext(UserAuthContext);
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<PostPrivacy>("public");
  const { mutateAsync, isPending } = useCreatePost();
  const {
    query: mentionQuery,
    trackCursor,
    selectMention,
    close: closeMentions,
  } = useMentionAutocomplete({
    value: body,
    onChange: setBody,
  });

  if (!userData) return null;

  async function handleSubmit() {
    const trimmed = body.trim();
    if (!trimmed || isPending) return;

    try {
      await toast.promise(mutateAsync({ body: trimmed, image, privacy }), {
        loading: "Posting…",
        success: "Posted",
        error: (err) => err.message,
      });
      setBody("");
      setImage(null);
    } catch {}
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-5">
      <div className="flex gap-3">
        <Avatar size="md" className="mt-1">
          <Avatar.Image alt={userData.name} src={userData.photo} />
          <Avatar.Fallback>{getInitials(userData.name)}</Avatar.Fallback>
        </Avatar>
        <div className="relative w-full flex-col flex justify-between gap-2">
          <PostPrivacySelect value={privacy} onChange={setPrivacy} />
          <AppTextArea
            rows={2}
            className="max-h-40 overflow-y-auto"
            placeholder={`What's on your mind, ${userData.name.split(" ")[0]}?`}
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
          <AppFileInput value={image} onChange={setImage} />
        </div>
      </div>
      <div className="mt-3 float-end">
        <AppButton
          size="sm"
          className="rounded-full"
          isDisabled={!body.trim() || isPending}
          onPress={handleSubmit}
        >
          Post
        </AppButton>
      </div>
    </div>
  );
}

export default PostComposer;
