import type { Post } from "../posts.interface";
import type { SharePostResponseType } from "./sharePost.interface";

type RawSharedPost = SharePostResponseType["data"]["post"];

export function toPost(raw: RawSharedPost): Post {
  return {
    ...raw,
    bookmarked: raw.bookmarked ?? false,
    sharedPost: raw.sharedPost ? toPost(raw.sharedPost) : undefined,
  };
}
