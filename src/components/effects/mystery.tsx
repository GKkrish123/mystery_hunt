"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const AnimatedGridPattern = dynamic(
  () =>
    import("@/components/ui/animated-grid-pattern").then((mod) => mod.default),
  {
    ssr: false,
  },
);

export default function MysteryEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null : (
    <>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDur={1}
        className="inset-x-0 z-[-1] h-full skew-y-12 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      />
    </>
  );
}
