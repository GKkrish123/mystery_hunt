"use client";

import dynamic from "next/dynamic";

const ShootingStars = dynamic(
  () =>
    import("@/components/ui/shooting-stars").then((mod) => mod.ShootingStars),
  {
    ssr: false,
  },
);

export default function FavouritesEffects() {
  return (
    <>
      <ShootingStars />
    </>
  );
}
