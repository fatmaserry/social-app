import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { Post } from "../posts.interface";
import type { SharePostResponseType } from "./sharePost.interface";

export async function sharePost({
  postId,
  body,
}: {
  postId: string;
  body: string;
}): Promise<Post> {
  try {
    const res = await http.post<SharePostResponseType>(
      `/posts/${postId}/share`,
      { body },
    );

    return res.data.data.post;
  } catch (err) {
    handleApiError(err);
  }
}
