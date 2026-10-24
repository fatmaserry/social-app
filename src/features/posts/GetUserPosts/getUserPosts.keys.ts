export const userPostsKeys = {
  all: ["posts", "user"] as const,
  user: (userId: string) => [...userPostsKeys.all, userId] as const,
};
