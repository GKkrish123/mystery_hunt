"use client";

import dynamic from "next/dynamic";

const VerticalTiles = dynamic(() => import("@/components/ui/vertical-tiles"), {
  ssr: false,
});
const MusicButton = dynamic(
  () => import("@/components/ui/music-button").then((mod) => mod.MusicButton),
  {
    ssr: false,
  },
);

export default function DashboardEffects() {
  return (
    <>
      <VerticalTiles
        animationDelay={0.5}
        animationDuration={0.7}
        minTileWidth={32}
        stagger={0.02}
        tileClassName="z-50"
      />
      <MusicButton />
    </>
  );
}
