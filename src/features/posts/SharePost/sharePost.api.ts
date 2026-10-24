import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import { toPost } from "./sharePost.mappers";
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
    const res = await http.post<SharePostResponseType>(`/posts/${postId}/share`, { body });

    return toPost(res.data.data.post);
  } catch (err) {
    handleApiError(err);
  }
}
