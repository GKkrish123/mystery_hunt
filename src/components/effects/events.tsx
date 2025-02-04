"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const WarpBackground = dynamic(
  () =>
    import("@/components/ui/warp-background").then((mod) => mod.WarpBackground),
  {
    ssr: false,
  },
);

export default function ExploreEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null :(
    <>
      <WarpBackground />
    </>
  );
}
