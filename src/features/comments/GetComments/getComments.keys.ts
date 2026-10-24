export const commentsKeys = {
  all: ["comments"] as const,
  post: (postId: string) => [...commentsKeys.all, "post", postId] as const,
};
