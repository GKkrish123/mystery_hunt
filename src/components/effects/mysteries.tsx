"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const AuroraBackground = dynamic(
  () => import("@/components/ui/aurora-bg").then((mod) => mod.AuroraBackground),
  {
    ssr: false,
  },
);

export default function MysteriesEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null : (
    <>
      <AuroraBackground />
    </>
  );
}
