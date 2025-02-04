"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const Particles = dynamic(() => import("@/components/ui/particles"), {
  ssr: false,
});

export default function SupportEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null : (
    <>
      <Particles
        className="absolute inset-0 z-[-1]"
        quantity={100}
        ease={80}
        size={4}
        refresh
      />
    </>
  );
}
