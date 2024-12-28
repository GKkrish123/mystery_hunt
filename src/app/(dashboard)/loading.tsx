"use client";

import dynamic from "next/dynamic";

const AppLoader = dynamic(() => import("@/components/ui/app-loader"), {
  ssr: false,
});

export default function Loading() {
  return <AppLoader />;
}
