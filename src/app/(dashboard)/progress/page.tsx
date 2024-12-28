import { api } from "@/trpc/server";

import { default as dynamicImport } from "next/dynamic";

const ProgressEffects = dynamicImport(() => import("@/components/effects/progress").then(mod => mod.default));
const ParallaxScroll = dynamicImport(() => import("@/components/ui/parallax.scroll").then(mod => mod.ParallaxScroll));
const TextSplit = dynamicImport(() => import("@/components/ui/text-split").then(mod => mod.TextSplit));

export default async function ProgressPage() {
  const mysteriesData = await api.mystery
    .getProgressMysteries()
    .catch(() => []);

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <TextSplit text="Progress" containerClassName="h-8 col-span-full" />
        <ParallaxScroll
          className="col-span-full h-[calc(100vh-6.7rem)] md:h-[calc(100vh-9.3rem)]"
          items={mysteriesData}
        />
      </div>
      <ProgressEffects />
    </>
  );
}
