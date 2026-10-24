import { Avatar } from "@heroui/react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppTextArea from "@/SharedComponents/AppTextArea/AppTextArea";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { getInitials } from "@/lib/getInitials";

function CommentComposer({
  placeholder,
  onSubmit,
  autoFocus,
}: {
  placeholder: string;
  onSubmit: (content: string) => Promise<unknown>;
  autoFocus?: boolean;
}) {
  const { userData } = useContext(UserAuthContext);
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  if (!userData) return null;

  async function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    setIsPending(true);
    try {
      await toast.promise(onSubmit(trimmed), {
        loading: "Posting…",
        success: "Posted",
        error: (err) => err.message,
      });
      setContent("");
    } catch {
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Avatar size="sm" className="mt-0.5">
        <Avatar.Image alt={userData.name} src={userData.photo} />
        <Avatar.Fallback>{getInitials(userData.name)}</Avatar.Fallback>
      </Avatar>
      <div className="flex flex-1 items-end gap-2">
        <AppTextArea
          rows={1}
          placeholder={placeholder}
          value={content}
          autoFocus={autoFocus}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />
        <AppButton
          size="sm"
          className="rounded-full"
          isDisabled={!content.trim() || isPending}
          onPress={handleSubmit}
        >
          Post
        </AppButton>
      </div>
    </div>
  );
}

export default CommentComposer;
