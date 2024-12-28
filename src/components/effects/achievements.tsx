"use client";

import dynamic from "next/dynamic";

const BackgroundLines = dynamic(
  () =>
    import("@/components/backrgound-lines").then((mod) => mod.BackgroundLines),
  {
    ssr: false,
  },
);

export default function AchievementsEffects() {
  return (
    <>
      <BackgroundLines />
    </>
  );
}
