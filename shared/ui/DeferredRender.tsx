"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}

export function DeferredRender({
  children,
  fallback = <div className="min-h-[220px]" aria-hidden="true" />,
  rootMargin = "240px",
  className,
}: DeferredRenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={containerRef} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
