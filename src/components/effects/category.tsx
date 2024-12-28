"use client";

import dynamic from "next/dynamic";

const SparklingGrid = dynamic(
  () =>
    import("@/components/ui/sparkling-grid").then((mod) => mod.SparklingGrid),
  {
    ssr: false,
  },
);

export default function CategoryEffects() {
  return (
    <>
      <SparklingGrid />
    </>
  );
}
