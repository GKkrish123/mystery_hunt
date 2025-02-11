"use client";

import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";

import { default as dynamicImport } from "next/dynamic";

const DotPattern = dynamicImport(
  () => import("@/components/ui/dot-pattern").then((mod) => mod.default),
  { ssr: false },
);
const BlurIn = dynamicImport(
  () => import("@/components/ui/blur-in").then((mod) => mod.default),
  { ssr: false },
);
const FeedbackForm = dynamicImport(
  () => import("@/components/feedback-form").then((mod) => mod.FeedbackForm),
  { ssr: false },
);

export default function FeedbackPage() {
  return (
    <>
      <div className="relative grid h-full grid-cols-1 grid-rows-[55px] gap-4 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:grid-rows-[65px] md:px-4 md:pb-4">
        <div className="col-span-full flex items-center justify-center">
          <BlurIn
            word="Feedback Corner"
            className={cn(
              "mx-auto h-8 text-3xl font-bold text-black dark:text-white md:h-10 md:text-4xl select-none",
              mysteryFont.className,
            )}
          />
        </div>
        <FeedbackForm />
      </div>
      <DotPattern className="z-[-1]" />
    </>
  );
}
