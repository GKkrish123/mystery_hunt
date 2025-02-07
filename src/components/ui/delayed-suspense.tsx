"use client";

import { useEffect, useState, type ReactNode } from "react";

export function DelayedSuspense({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return null;
  return children;
}