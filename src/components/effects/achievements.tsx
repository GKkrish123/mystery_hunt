"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const BackgroundLines = dynamic(
  () =>
    import("@/components/backrgound-lines").then((mod) => mod.BackgroundLines),
  {
    ssr: false,
  },
);

export default function AchievementsEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null : (
    <>
      <BackgroundLines />
    </>
  );
}
