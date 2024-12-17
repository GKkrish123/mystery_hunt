import AppLoader from "@/components/ui/app-loader";
import HackerBackground from "@/components/ui/hackerbg";
import { ParallaxScroll } from "@/components/ui/parallax.scroll";
import { TextSplit } from "@/components/ui/text-split";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function ProgressPage() {
  const mysteriesData = await api.mystery
    .getProgressMysteries()
    .catch(() => []);

  return (
    <Suspense fallback={<AppLoader />}>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <TextSplit text="Progress" containerClassName="h-8 col-span-full" />
        <ParallaxScroll
          className="col-span-full h-[calc(100vh-6.7rem)] md:h-[calc(100vh-9.3rem)]"
          items={mysteriesData}
        />
      </div>
      <HackerBackground />
    </Suspense>
  );
}
