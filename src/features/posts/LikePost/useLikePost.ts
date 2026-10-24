import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { likePost } from "./likePost.api";
import type { PostsPage } from "../posts.interface";

function toggleLike(page: PostsPage, postId: string, userId: string): PostsPage {
  return {
    ...page,
    posts: page.posts.map((post) => {
      if (post._id !== postId) return post;

      const alreadyLiked = post.likes.includes(userId);
      return {
        ...post,
        likes: alreadyLiked
          ? post.likes.filter((id) => id !== userId)
          : [...post.likes, userId],
        likesCount: alreadyLiked ? post.likesCount - 1 : post.likesCount + 1,
      };
    }),
  };
}

export function useLikePost(queryKey: QueryKey) {
  const queryClient = useQueryClient();
  const { userData } = useContext(UserAuthContext);

  return useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onMutate: async (postId: string) => {
      if (!userData) return;

      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<InfiniteData<PostsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map((page) => toggleLike(page, postId, userData._id)) };
      });

      return { previous };
    },
    onError: (_err, _postId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
