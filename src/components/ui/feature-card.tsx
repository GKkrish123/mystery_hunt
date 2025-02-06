import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Map,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { default as dynamicImport } from "next/dynamic";
import { ThreeDPhotoCarousel } from "./threeDCarousel";
import { BoldCopy } from "./bold-copy";
import { WordRotate } from "./word-rotate";
import BlurFade from "./blur-fade";
import { RainbowButton } from "./rainbow-button";
import { AnimatedGradientText } from "./animated-gradient-text";

const CoolMode = dynamicImport(() =>
  import("./cool-mode").then((mod) => mod.default),
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
      <div className="flex items-center gap-3">
        <Link href="/explore" className="z-10 cursor-pointer">
          <AnimatedGradientText>
            <ChevronLeft className="mr-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            <span
              className={cn(
                `inline !animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              Explore
            </span>
            <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
            <Map className="h-5 w-5" />{" "}
          </AnimatedGradientText>
        </Link>
        <Link href="/events" className="z-10 cursor-pointer">
          <AnimatedGradientText>
            <Sparkles className="h-5 w-5" />{" "}
            <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
            <span
              className={cn(
                `inline !animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              Events
            </span>
            <ChevronRight className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
      </div>
      <ThreeDPhotoCarousel />
    </section>
  );
});
