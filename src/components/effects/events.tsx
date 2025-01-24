"use client";

import dynamic from "next/dynamic";

const WarpBackground = dynamic(
  () =>
    import("@/components/ui/warp-background").then((mod) => mod.WarpBackground),
  {
    ssr: false,
  },
);

export default function ExploreEffects() {
  return (
    <>
      <WarpBackground />
    </>
  );
}
