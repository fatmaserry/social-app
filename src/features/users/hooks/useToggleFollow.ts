import { useMutation } from "@tanstack/react-query";
import { toggleFollow } from "../users.api";

export function useToggleFollow() {
  return useMutation({
    mutationFn: (userId: string) => toggleFollow(userId),
  });
}
