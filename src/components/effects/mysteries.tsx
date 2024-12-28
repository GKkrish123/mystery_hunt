"use client";

import dynamic from "next/dynamic";

const AuroraBackground = dynamic(
  () => import("@/components/ui/aurora-bg").then((mod) => mod.AuroraBackground),
  {
    ssr: false,
  },
);

export default function MysteriesEffects() {
  return (
    <>
      <AuroraBackground />
    </>
  );
}
