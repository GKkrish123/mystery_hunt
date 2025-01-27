import { api } from "@/trpc/server";
import Link from "next/link";

import { default as dynamicImport } from "next/dynamic";
import { HorizontalMysteries } from "@/components/horizontal-mysteries";
import { ColourfulText } from "@/components/ui/colourful-text";
import { EventsCarousel } from "@/components/ui/events-carousel";
import BlurFade from "@/components/ui/blur-fade";
import { notFound } from "next/navigation";

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

export default async function EventsPage() {
  const eventMysteries = await api.events.getEvents().catch(() => []);

  if (eventMysteries.length === 0) {
    notFound();
  }

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-3 gap-3 px-3 pb-3 pt-0 md:grid-cols-6 md:px-4 md:pb-4">
        <BlurFade className="col-span-full flex flex-col items-center justify-center">
          <div className="flex py-2">
            <ColourfulText text="Events" className="text-4xl !font-extrabold" />
          </div>
          <div className="flex w-full justify-center md:px-[10%] lg:px-[15%] xl:px-[20%] 2xl:px-[25%]">
            <EventsCarousel mysteryEvents={eventMysteries} />
          </div>
        </BlurFade>
        <Separator className="col-span-full" />
        {eventMysteries.map((event) => (
          <div
            id={`event-${event.id}`}
            key={`event-${event.id}`}
            className="col-span-full"
          >
            <HeadingReveal
              title={event.name}
              coundown={event.scheduledTo.seconds * 1000}
            />
            <HorizontalMysteries mysteries={event.mysteries} />
            <Separator className="mt-3" />
          </div>
        ))}
        <Link className="col-span-3 h-10 md:col-span-2" href="/explore">
          <ShinyButton className="size-full">Explore More</ShinyButton>
        </Link>
        <Link className="col-span-3 h-10 md:col-span-2" href="/">
          <RainbowButton className="size-full">Leaderboard</RainbowButton>
        </Link>
        <Link className="col-span-3 h-10 md:col-span-2" href="/categories">
          <ShinyButton className="size-full">Colosseum</ShinyButton>
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
