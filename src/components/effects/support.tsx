"use client";

import dynamic from "next/dynamic";

const Particles = dynamic(() => import("@/components/ui/particles"), {
  ssr: false,
});

export default function SupportEffects() {
  return (
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
