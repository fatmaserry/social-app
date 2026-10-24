import type { Post } from "../posts.interface";


export interface SharePostResponseType {
  success: boolean;
  message: string;
  data: {
    post: Post;
  };
}
