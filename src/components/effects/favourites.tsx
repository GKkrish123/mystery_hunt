"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const ShootingStars = dynamic(
  () =>
    import("@/components/ui/shooting-stars").then((mod) => mod.ShootingStars),
  {
    ssr: false,
  },
);

export default function FavouritesEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null : (
    <>
      <ShootingStars />
    </>
  );
}
