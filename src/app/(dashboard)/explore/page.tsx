import { api } from "@/trpc/server";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";

import { default as dynamicImport } from "next/dynamic";

const HeadingReveal = dynamicImport(() =>
  import("@/components/heading-reveal").then((mod) => mod.HeadingReveal),
);
const Expandable = dynamicImport(() =>
  import("@/components/ui/big-carousel").then((mod) => mod.Expandable),
);
const ImageCarousel = dynamicImport(() =>
  import("@/components/ui/button-carousel").then((mod) => mod.ImageCarousel),
);
const RainbowButton = dynamicImport(() =>
  import("@/components/ui/rainbow-button").then((mod) => mod.RainbowButton),
);
const Separator = dynamicImport(() =>
  import("@/components/ui/separator").then((mod) => mod.Separator),
);
const ShineBorder = dynamicImport(() => import("@/components/ui/shine-border"));
const ShinyButton = dynamicImport(() =>
  import("@/components/ui/shiny-button").then((mod) => mod.ShinyButton),
);
const TextShine = dynamicImport(() =>
  import("@/components/ui/shiny-text").then((mod) => mod.TextShine),
);
const SwipeCards = dynamicImport(() =>
  import("@/components/ui/swipe-cards").then((mod) => mod.default),
);
const ExploreEffects = dynamicImport(() =>
  import("@/components/effects/explore").then((mod) => mod.default),
);
const BlurFade = dynamicImport(() =>
  import("@/components/ui/blur-fade").then((mod) => mod.default),
);

export default async function ExplorerPage() {
  const [
    shuffledMysteries,
    shuffledCategories,
    featuredCategories,
    hallOfFameMysteries,
  ] = await Promise.all([
    api.mystery.getShuffledMysteries().catch(() => []),
    api.category.getShuffledCategories().catch(() => []),
    api.category.getFeaturedCategories().catch(() => []),
    api.mystery.getHallOfFameMysteries().catch(() => []),
  ]);

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-3 gap-3 px-3 pb-3 pt-0 md:grid-cols-6 md:px-4 md:pb-4">
        <BlurFade className="col-span-full flex items-center justify-center">
          <TextShine text="Explorer" shineColor="#FFD700" duration={5} />
        </BlurFade>
        <ShineBorder
          className="relative col-span-full flex h-[500px] w-full flex-col place-content-center overflow-hidden rounded-lg border bg-[rgb(255,255,255)]/[.50] dark:bg-[rgb(0,0,0)]/[.50] md:h-auto md:flex-row md:shadow-xl"
          borderClassName="z-[15]"
        >
          <SwipeCards cardData={shuffledMysteries} />
          <span
            className={cn(
              "pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl lg:text-7xl",
              mysteryFont.className,
            )}
          >
            Mystery Shuffle
          </span>
          <SwipeCards cardData={shuffledCategories} type="category" />
        </ShineBorder>
        <div className="z-10 col-span-full">
          <HeadingReveal
            title={"Featured"}
            description={
              "Featured categories that are on the rise. Check them out now!"
            }
          />
          <Expandable
            className="col-span-full mt-3"
            autoPlay={false}
            list={featuredCategories}
          />
          <Separator className="mt-3" />
        </div>
        {[
          ...hallOfFameMysteries,
          ...hallOfFameMysteries,
          ...hallOfFameMysteries,
          ...hallOfFameMysteries,
        ].map((item, index) => (
          <div
            key={`hof-${item.category.name}-${index}`}
            className="z-10 col-span-3"
          >
            <HeadingReveal
              title={item.category.name}
              description={item.category.description}
              moreLink={`/explore/${item.category.tag}`}
            />
            <ImageCarousel className="col-span-full" items={item.mysteries} />
            <Separator className="mt-3" />
          </div>
        ))}
        <Link className="col-span-3 h-10 md:col-span-2" href="/mysteries">
          <ShinyButton className="size-full">More Mysteries</ShinyButton>
        </Link>
        <Link className="col-span-3 h-10 md:col-span-2" href="/">
          <RainbowButton className="size-full">Colosseum</RainbowButton>
        </Link>
        <Link className="col-span-3 h-10 md:col-span-2" href="/categories">
          <ShinyButton className="size-full">More Categories</ShinyButton>
        </Link>
      </div>
      <ExploreEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const metadata = {
  title: "Mysteryverse Explore",
  description: "This is a explore page of Mysteryverse",
};
