export interface PostAuthor {
  _id: string;
  name: string;
  photo?: string;
}

export type PostPrivacy = "public" | "followers" | "only_me";

export interface Post {
  _id: string;
  body?: string;
  image?: string;
  user: PostAuthor;
  createdAt: string;
  likesCount: number;
  likes: string[];
  bookmarked: boolean;
  commentsCount?: number;
  sharesCount?: number;
  isShare?: boolean;
  sharedPost?: Post | null;
  privacy?: PostPrivacy;
}

export type FeedScope = "public" | "following";

export interface PostsPage {
  posts: Post[];
  nextPage: number | null;
}
