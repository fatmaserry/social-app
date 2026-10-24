import { useMemo, useState } from "react";

function findActiveMention(
  text: string,
  cursor: number,
): { query: string; start: number } | null {
  const textBeforeCursor = text.slice(0, cursor);
  const atIndex = textBeforeCursor.lastIndexOf("@");
  if (atIndex === -1) return null;

  const charBeforeAt = atIndex > 0 ? textBeforeCursor[atIndex - 1] : " ";
  if (!/\s/.test(charBeforeAt)) return null;

  const candidate = textBeforeCursor.slice(atIndex + 1);
  if (/\s/.test(candidate)) return null;

  return { query: candidate, start: atIndex };
}

export function useMentionAutocomplete({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const mention = useMemo(
    () => findActiveMention(value, cursor),
    [value, cursor],
  );

  function trackCursor(target: HTMLTextAreaElement) {
    setCursor(target.selectionStart ?? 0);
    setIsDismissed(false);
  }

  function close() {
    setIsDismissed(true);
  }

  function selectMention(username: string) {
    if (!mention) return;

    const before = value.slice(0, mention.start);
    const after = value.slice(cursor);
    onChange(`${before}@${username} ${after}`);
  }

  return {
    query: isDismissed ? null : (mention?.query ?? null),
    trackCursor,
    selectMention,
    close,
  };
}
