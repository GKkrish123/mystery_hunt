"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const HackerBackground = dynamic(() => import("@/components/ui/hackerbg"), {
  ssr: false,
});

export default function ProgressEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null : (
    <>
      <HackerBackground />
    </>
  );
}
