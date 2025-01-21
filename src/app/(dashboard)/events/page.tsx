import { api } from "@/trpc/server";
import Link from "next/link";

import { default as dynamicImport } from "next/dynamic";
import { HorizontalMysteries } from "@/components/horizontal-mysteries";
import { ColourfulText } from "@/components/ui/colourful-text";

const HeadingReveal = dynamicImport(() =>
  import("@/components/heading-reveal").then((mod) => mod.HeadingReveal),
);
const RainbowButton = dynamicImport(() =>
  import("@/components/ui/rainbow-button").then((mod) => mod.RainbowButton),
);
const Separator = dynamicImport(() =>
  import("@/components/ui/separator").then((mod) => mod.Separator),
);
const ShinyButton = dynamicImport(() =>
  import("@/components/ui/shiny-button").then((mod) => mod.ShinyButton),
);
const EventsEffects = dynamicImport(() =>
  import("@/components/effects/events").then((mod) => mod.default),
);
const BlurFade = dynamicImport(() =>
  import("@/components/ui/blur-fade").then((mod) => mod.default),
);

export default async function EventsPage() {
  const [eventMysteries] = await Promise.all([
    api.mystery.getTrendingMysteries().catch(() => []),
  ]);

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-3 gap-3 px-3 pb-3 pt-0 md:grid-cols-6 md:px-4 md:pb-4">
        <BlurFade className="col-span-full flex items-center justify-center">
          <ColourfulText text="Events" className="text-4xl" />
        </BlurFade>
        <div className="col-span-full">
          <HeadingReveal title={"February"} description={"summaa"} />
          <HorizontalMysteries
            mysteries={[
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
            ]}
          />
          <Separator className="mt-3" />
        </div>
        <div className="col-span-full">
          <HeadingReveal title={"March"} description={"summaa"} />
          <HorizontalMysteries
            mysteries={[
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
            ]}
          />
          <Separator className="mt-3" />
        </div>
        <div className="col-span-full">
          <HeadingReveal title={"April"} description={"summaa"} />
          <HorizontalMysteries
            mysteries={[
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
            ]}
          />
          <Separator className="mt-3" />
        </div>
        <div className="col-span-full">
          <HeadingReveal title={"May"} description={"summaa"} />
          <HorizontalMysteries
            mysteries={[
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
              ...eventMysteries,
            ]}
          />
          <Separator className="mt-3" />
        </div>
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
      <EventsEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const metadata = {
  title: "Mysteryverse Events",
  description: "This is an events page of Mysteryverse",
};
