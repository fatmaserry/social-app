import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { Post } from "../posts.interface";
import type { GetPostResponseType } from "./getPost.interface";

export async function getPost(postId: string): Promise<Post> {
  try {
    const res = await http.get<GetPostResponseType>(`/posts/${postId}`);

    return res.data.data.post;
  } catch (err) {
    handleApiError(err);
  }
}
