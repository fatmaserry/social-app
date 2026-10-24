import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "../users.api";
import { usersKeys } from "../users.keys";

export function useSuggestedUsers(page: number, limit = 5) {
  return useQuery({
    queryKey: usersKeys.suggestions(page, limit),
    queryFn: () => getSuggestedUsers({ page, limit }),
  });
}
