import home from "@/assets/fluent3d/home.png";
import bell from "@/assets/fluent3d/bell.png";
import bookmark from "@/assets/fluent3d/bookmark.png";
import heart from "@/assets/fluent3d/heart.png";
import heartOutline from "@/assets/fluent3d/heart-outline.png";
import comment from "@/assets/fluent3d/comment.png";
import search from "@/assets/fluent3d/search.png";
import gear from "@/assets/fluent3d/gear.png";
import person from "@/assets/fluent3d/person.png";
import share from "@/assets/fluent3d/share.png";

export const appIcons = {
  home,
  bell,
  bookmark,
  heart,
  heartOutline,
  comment,
  search,
  gear,
  person,
  share,
} as const;

export type AppIconName = keyof typeof appIcons;

function AppIcon({
  name,
  size = 20,
  className,
}: {
  name: AppIconName;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={appIcons[name]}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={className}
    />
  );
}

export default AppIcon;
