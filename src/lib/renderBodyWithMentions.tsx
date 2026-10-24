import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { searchUsers } from "@/features/users/users.api";

function useMentionedUser(username: string) {
  return useQuery({
    queryKey: ["users", "mention-lookup", username],
    queryFn: async () => {
      const results = await searchUsers(username);
      return results.find((user) => user.username === username) ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Only renders as a link when `username` matches a real account — an
 * `@word` that doesn't resolve to anyone just stays as plain text instead of
 * being highlighted as if it were a real mention. */
function Mention({ username }: { username: string }) {
  const { data: user } = useMentionedUser(username);

  if (!user) return <>{`@${username}`}</>;

  return (
    <Link
      to={`/profile/${user._id}`}
      className="font-medium text-main-color hover:underline"
    >
      @{username}
    </Link>
  );
}

export function renderBodyWithMentions(body: string | undefined) {
  if (!body) return null;

  return body
    .split(/(@[a-zA-Z0-9_]+)/g)
    .map((part, index) =>
      part.startsWith("@") ? (
        <Mention key={index} username={part.slice(1)} />
      ) : (
        part
      ),
    );
}
