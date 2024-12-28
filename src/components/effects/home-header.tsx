"use client";

import dynamic from "next/dynamic";

const ProductFeatures = dynamic(() => import("@/components/ui/feature-card"), {
  ssr: false,
});

export default function HomeHeader() {
  return (
    <>
      <ProductFeatures className="col-span-full bg-transparent" />
    </>
  );
}
