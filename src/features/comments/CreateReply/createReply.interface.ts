import type { RawComment } from "../comments.mappers";

export interface CreateReplyResponseType {
  success: boolean;
  message: string;
  data: {
    reply: RawComment;
  };
}
