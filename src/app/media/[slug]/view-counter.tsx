"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { incrementViewCountAction } from "./actions";

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const hasIncremented = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasIncremented.current) return;
    hasIncremented.current = true;

    // Deduplicate: only count once per slug per browser session
    const key = `viewed_${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    incrementViewCountAction(slug).then((result) => {
      if (result.success) {
        router.refresh();
      }
    });
  }, [slug, router]);

  // This component doesn't render anything visible
  return null;
}