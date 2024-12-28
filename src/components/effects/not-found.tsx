"use client";

import dynamic from "next/dynamic";

const FlickeringGrid = dynamic(
  () => import("@/components/ui/flickering-grid"),
  {
    ssr: false,
  },
);

export default function NotFoundEffects() {
  return (
    <>
      <FlickeringGrid
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </>
  );
}
