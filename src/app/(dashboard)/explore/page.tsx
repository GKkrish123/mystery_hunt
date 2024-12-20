import { HeadingReveal } from "@/components/heading-reveal";
import { Expandable } from "@/components/ui/big-carousel";
import { ImageCarousel } from "@/components/ui/button-carousel";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Separator } from "@/components/ui/separator";
import ShineBorder from "@/components/ui/shine-border";
import { ShinyButton } from "@/components/ui/shiny-button";
import { TextShine } from "@/components/ui/shiny-text";
import SwipeCards from "@/components/ui/swipe-cards";
import Swirl from "@/components/ui/swirl";
import { api } from "@/trpc/server";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BlurFade from "@/components/ui/blur-fade";
import { mysteryFont } from "@/lib/fonts";

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
          <SwipeCards
            cardData={shuffledMysteries}
          />
          <span
            className={cn(
              "pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl lg:text-7xl",
              mysteryFont.className,
            )}
          >
            Mystery Shuffle
          </span>
          <SwipeCards
            cardData={shuffledCategories}
            type="category"
          />
        </ShineBorder>
        <div className="z-10 col-span-full">
          <HeadingReveal
            title={"Featured"}
            description={
              "Featured categories that are on the rise. Check them out now!"
            }
          />
          <Separator className="mt-3" />
          <Expandable
            className="col-span-full mt-3"
            autoPlay={false}
            list={featuredCategories}
          />
        </div>
        {hallOfFameMysteries.map((item, index) => (
          <div
            key={`hof-${item.category.name}-${index}`}
            className="z-10 col-span-3"
          >
            <HeadingReveal
              title={item.category.name}
              description={item.category.description}
              moreLink={`/explore/${item.category.tag}`}
            />
            <Separator className="mt-3" />
            <ImageCarousel className="col-span-full" items={item.mysteries} />
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
      <Swirl
        particleCount={50}
        baseTTL={150}
        rangeTTL={300}
        baseSpeed={1}
        rangeSpeed={2}
        baseSize={0.5}
        rangeSize={1}
        baseHue={130}
        rangeHue={90}
        backgroundColor="black"
        className="absolute left-0 top-0"
        containerClassName="relative h-full w-full"
      />
    </>
  );
}
