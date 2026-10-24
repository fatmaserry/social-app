import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

/** Attach the returned ref to a sentinel element; calls `onIntersect` once it scrolls into view. */
export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = "200px",
}: UseIntersectionObserverOptions) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onIntersect, rootMargin]);

  return targetRef;
}
