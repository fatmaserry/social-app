export const userProfileKeys = {
  detail: (userId: string) => ["users", "profile", userId] as const,
};
