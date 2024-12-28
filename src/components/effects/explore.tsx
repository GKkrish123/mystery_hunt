"use client";

import dynamic from "next/dynamic";

const Swirl = dynamic(() => import("@/components/ui/swirl"), {
  ssr: false,
});

export default function ExploreEffects() {
  return (
    <>
      <Swirl
        particleCount={50}
        baseTTL={150}
        rangeTTL={300}
        baseSpeed={1}
        rangeSpeed={2}
        baseSize={0.5}
        rangeSize={1}
        baseHue={130}
        rangeHue={90}
        backgroundColor="black"
        className="absolute left-0 top-0"
        containerClassName="relative h-full w-full"
      />
    </>
  );
}

