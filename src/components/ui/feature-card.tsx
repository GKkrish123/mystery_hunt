"use client";

import { ArrowDown, ChevronRight, Map } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { cn } from "@/lib/utils";

import { default as dynamicImport } from "next/dynamic";

const ThreeDPhotoCarousel = dynamicImport(
  () => import("./threeDCarousel").then((mod) => mod.ThreeDPhotoCarousel),
  { ssr: false },
);
const BoldCopy = dynamicImport(
  () => import("./bold-copy").then((mod) => mod.BoldCopy),
  { ssr: false },
);
const WordRotate = dynamicImport(
  () => import("./word-rotate").then((mod) => mod.WordRotate),
  { ssr: false },
);
const CoolMode = dynamicImport(
  () => import("./cool-mode").then((mod) => mod.default),
  { ssr: false },
);
const BlurFade = dynamicImport(
  () => import("./blur-fade").then((mod) => mod.default),
  { ssr: false },
);
const RainbowButton = dynamicImport(
  () => import("./rainbow-button").then((mod) => mod.RainbowButton),
  { ssr: false },
);
const AnimatedGradientText = dynamicImport(
  () =>
    import("./animated-gradient-text").then((mod) => mod.AnimatedGradientText),
  { ssr: false },
);

export default memo(function ProductFeatures({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      className={cn(
        "storybook-fix flex w-full flex-col items-center gap-4 bg-orange-50 pt-5",
        className,
      )}
    >
      <BlurFade className="flex cursor-default flex-col items-center gap-2 text-center">
        <CoolMode
          options={{
            particle: "question",
            size: 40,
          }}
        >
          <div>
            <BoldCopy
              texts={["Colosseum", "of", "Mysteries"]}
              backgroundTextClassName={["", "text-2xl md:text-3xl", ""]}
              textClassName={[
                "",
                "text-base group-hover:text-2xl group-active:text-2xl md:text-xl group-hover:md:text-3xl group-active:md:text-3xl",
                "",
              ]}
            />
          </div>
        </CoolMode>
        <h3 className="flex w-full items-center justify-center pt-5 text-lg">
          <WordRotate
            wrapperClassName="w-[25%] md:w-[30%] text-right font-bold mr-1"
            duration={2300}
            words={["Discover", "Explore", "Unlock"]}
            className="text-xl md:text-2xl"
          />
          &nbsp;the&nbsp;
          <WordRotate
            wrapperClassName="text-center w-16 md:w-20 font-bold"
            duration={2400}
            words={["Truths", "Riddles", "Secrets"]}
            className="text-xl md:text-2xl"
          />
          &nbsp;of&nbsp;
          <WordRotate
            wrapperClassName="flex-1 text-left font-bold ml-1"
            duration={2500}
            words={["Universe", "Mysteries", "Uncharted"]}
            className="text-xl md:text-2xl"
          />
        </h3>
      </BlurFade>
      <RainbowButton scrollTo="trending-mysteries" className="z-10">
        Ready to Unravel <ArrowDown className="ml-2" />
      </RainbowButton>
      <Link href="/explore" className="z-10 cursor-pointer">
        <AnimatedGradientText>
          <Map className="h-5 w-5" />{" "}
          <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
          <span
            className={cn(
              `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
            )}
          >
            Explorer
          </span>
          <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedGradientText>
      </Link>
      <ThreeDPhotoCarousel />
    </section>
  );
});
