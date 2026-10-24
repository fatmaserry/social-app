export const postDetailKeys = {
  detail: (postId: string) => ["posts", "detail", postId] as const,
};
