"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

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
  const { openMobile } = useSidebar();
  return openMobile ? null : <BackgroundBeamsWithCollision />;
}
