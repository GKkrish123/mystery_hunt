"use client";

import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";
import BlurIn from "@/components/ui/blur-in";
import { mysteryFont } from "@/lib/fonts";
import { FeedbackForm } from "@/components/feedback-form";

export default function FeedbackPage() {
  return (
    <>
      <div className="relative grid h-full grid-cols-1 grid-rows-[55px] gap-4 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:grid-rows-[65px] md:px-4 md:pb-4">
        <div className="col-span-full flex items-center justify-center">
          <BlurIn
            word="Feedback Corner"
            className={cn(
              "mx-auto h-8 text-3xl font-bold text-black dark:text-white md:h-10 md:text-4xl",
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

export const dynamic = "force-static";
export const fetchCache = "force-cache";
