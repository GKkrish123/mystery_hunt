"use client";

import dynamic from "next/dynamic";

const HackerBackground = dynamic(() => import("@/components/ui/hackerbg"), {
  ssr: false,
});

export default function ProgressEffects() {
  return (
    <>
      <HackerBackground />
    </>
  );
}
