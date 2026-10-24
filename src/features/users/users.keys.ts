export const usersKeys = {
  suggestions: (page: number, limit: number) =>
    ["users", "suggestions", page, limit] as const,
};
