import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
  children: React.ReactNode;
  onLoadMore: () => void;
  threshold?: number;
};

/**
 * InfiniteScroll component that triggers loading more content when scrolling near the bottom.
 *
 * @param onLoadMore - Callback to load more content.
 * @param threshold - Distance in pixels from bottom to trigger loading (default: 500)
 */
export function InfiniteScroll({
  children,
  onLoadMore,
  threshold = 500,
}: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [onLoadMore, threshold]);

  return (
    <div>
      {children}
      <div ref={containerRef} className="h-1" />
    </div>
  );
}
