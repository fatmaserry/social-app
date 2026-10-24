import type { Post } from "../posts.interface";

export interface GetPostResponseType {
  success: boolean;
  message: string;
  data: {
    post: Post;
  };
}
