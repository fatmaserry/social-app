import { Dropdown } from "@heroui/react";
import PostPrivacyIcon, { postPrivacyConfig } from "./PostPrivacyIcon";
import type { PostPrivacy } from "../posts.interface";

const options: PostPrivacy[] = ["public", "followers", "only_me"];

function PostPrivacySelect({
  value,
  onChange,
}: {
  value: PostPrivacy;
  onChange: (privacy: PostPrivacy) => void;
}) {
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Post visibility"
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
      >
        <PostPrivacyIcon privacy={value} size={16} />
        {postPrivacyConfig[value].label}
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom start">
        <Dropdown.Menu>
          {options.map((option) => (
            <Dropdown.Item
              key={option}
              id={option}
              onAction={() => onChange(option)}
            >
              <span className="flex items-center gap-2">
                <PostPrivacyIcon privacy={option} size={16} />
                {postPrivacyConfig[option].label}
              </span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default PostPrivacySelect;
