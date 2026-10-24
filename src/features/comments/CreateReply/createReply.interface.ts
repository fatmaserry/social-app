import type { Comment } from "../comments.interface";

export interface CreateReplyResponseType {
  success: boolean;
  message: string;
  data: {
    reply: Comment;
  };
}
