"use client";

import dynamic from "next/dynamic";
const StarsBackground = dynamic(
  () =>
    import("@/components/ui/stars-background").then(
      (mod) => mod.StarsBackground,
    ),
  {
    ssr: false,
  },
);

const BackgroundBeams = dynamic(
  () =>
    import("@/components/ui/background-beams").then(
      (mod) => mod.BackgroundBeams,
    ),
  {
    ssr: false,
  },
);

const Cobe = dynamic(
  () => import("@/components/ui/globe").then((mod) => mod.Cobe),
  {
    ssr: false,
  },
);

export default function LeaderboardEffects() {
  return (
    <>
      <StarsBackground />
      <BackgroundBeams />
      <Cobe />
    </>
  );
}
