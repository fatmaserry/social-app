import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { PostPrivacy } from "../posts.interface";
import type {
  CreatedPost,
  CreatePostResponseType,
} from "./createPost.interface";

export async function createPost({
  body,
  image,
  privacy,
}: {
  body: string;
  image?: File | null;
  privacy: PostPrivacy;
}): Promise<CreatedPost> {
  const formData = new FormData();
  formData.append("body", body);
  formData.append("privacy", privacy);
  if (image) {
    formData.append("image", image);
  }

  try {
    const res = await http.post<CreatePostResponseType>("/posts", formData);

    return res.data.data.post;
  } catch (err) {
    handleApiError(err);
  }
}
