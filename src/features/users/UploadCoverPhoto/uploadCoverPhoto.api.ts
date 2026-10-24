import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { PostPrivacy } from "@/features/posts/posts.interface";
import type { UploadCoverResponseType } from "./uploadCoverPhoto.interface";

export async function uploadCoverPhoto({
  cover,
  privacy,
}: {
  cover: File;
  privacy: PostPrivacy;
}): Promise<string> {
  const formData = new FormData();
  formData.append("cover", cover);
  formData.append("privacy", privacy);

  try {
    const res = await http.put<UploadCoverResponseType>("/users/upload-cover", formData);

    return res.data.data.cover;
  } catch (err) {
    handleApiError(err);
  }
}
