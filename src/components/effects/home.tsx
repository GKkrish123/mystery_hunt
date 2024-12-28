"use client";

import dynamic from "next/dynamic";

const BackgroundBeamsWithCollision = dynamic(
  () =>
    import("@/components/ui/background-beams-with-collision").then(
      (mod) => mod.BackgroundBeamsWithCollision,
    ),
  {
    ssr: false,
  },
);

export default function HomeEffects() {
  return (
    <>
      <BackgroundBeamsWithCollision />
    </>
  );
}
