"use client";

import { Suspense, useEffect, useState } from "react";

export function DelayedSuspense({
  children,
  fallback,
  delay = 300,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}) {
  const [showSuspense, setShowSuspense] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuspense(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!showSuspense) return null;

  return (
    <Suspense fallback={showSuspense ? fallback : null}>{children}</Suspense>
  );
}
