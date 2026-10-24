export const repliesKeys = {
  all: ["comments", "replies"] as const,
  comment: (commentId: string) => [...repliesKeys.all, commentId] as const,
};
