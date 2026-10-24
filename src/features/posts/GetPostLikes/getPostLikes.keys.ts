export const postLikesKeys = {
  all: ["posts", "likes"] as const,
  post: (postId: string) => [...postLikesKeys.all, postId] as const,
};
