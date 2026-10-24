import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { PostPrivacy } from "../posts.interface";

export async function updatePost({
  postId,
  body,
  image,
  privacy,
}: {
  postId: string;
  body: string;
  image?: File | null;
  privacy: PostPrivacy;
}): Promise<void> {
  const formData = new FormData();
  formData.append("body", body);
  formData.append("privacy", privacy);
  if (image) {
    formData.append("image", image);
  }

  try {
    await http.put(`/posts/${postId}`, formData);
  } catch (err) {
    handleApiError(err);
  }
}
