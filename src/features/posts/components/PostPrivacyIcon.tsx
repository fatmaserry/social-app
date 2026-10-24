import { Global, Lock, Profile2User } from "iconsax-reactjs";
import type { PostPrivacy } from "../posts.interface";

export const postPrivacyConfig: Record<
  PostPrivacy,
  { icon: typeof Global; label: string }
> = {
  public: { icon: Global, label: "Public" },
  followers: { icon: Profile2User, label: "Followers" },
  only_me: { icon: Lock, label: "Only me" },
};

function PostPrivacyIcon({
  privacy,
  size = 12,
}: {
  privacy: PostPrivacy;
  size?: number;
}) {
  const { icon: Icon } = postPrivacyConfig[privacy];
  return <Icon size={size} variant="Outline" />;
}

export default PostPrivacyIcon;
