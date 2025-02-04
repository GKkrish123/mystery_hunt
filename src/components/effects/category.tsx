"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "../ui/sidebar";

const SparklingGrid = dynamic(
  () =>
    import("@/components/ui/sparkling-grid").then((mod) => mod.SparklingGrid),
  {
    ssr: false,
  },
);

export default function CategoryEffects() {
  const { openMobile } = useSidebar();
  return openMobile ? null : (
    <>
      <SparklingGrid />
    </>
  );
}
