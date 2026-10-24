import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { createPost } from "./createPost.api";
import { postsFeedKeys } from "../GetPostsFeed/getPostsFeed.keys";
import type { FeedScope, Post, PostsPage } from "../posts.interface";

export function useCreatePost(scope: FeedScope = "public") {
  const queryClient = useQueryClient();
  const { userData } = useContext(UserAuthContext);
  const queryKey = postsFeedKeys.scope(scope);

  return useMutation({
    mutationFn: createPost,
    onSuccess: async (created, variables) => {
      if (!userData) return;

      const fullPost: Post = {
        _id: created._id,
        body: created.body,
        image: created.image,
        createdAt: created.createdAt,
        likesCount: created.likesCount,
        likes: [],
        bookmarked: false,
        user: { _id: userData._id, name: userData.name, photo: userData.photo },
        privacy: variables.privacy,
      };

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (old) => {
        if (!old) {
          return {
            pages: [{ posts: [fullPost], nextPage: null }],
            pageParams: [1],
          };
        }

        const [firstPage, ...restPages] = old.pages;
        return {
          ...old,
          pages: [
            { ...firstPage, posts: [fullPost, ...firstPage.posts] },
            ...restPages,
          ],
        };
      });
    },
  });
}
