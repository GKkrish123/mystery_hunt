import { Suspense } from "react";

import { default as dynamicImport } from "next/dynamic";

const CitiesSelect = dynamicImport(() =>
  import("@/components/cities-select").then((mod) => mod.CitiesSelect),
);
const CountriesSelect = dynamicImport(() =>
  import("@/components/countries-select").then((mod) => mod.CountriesSelect),
);
const LeaderboardsSection = dynamicImport(() =>
  import("@/components/leaderboards-section").then(
    (mod) => mod.LeaderboardsSection,
  ),
);
const StatesSelect = dynamicImport(() =>
  import("@/components/states-select").then((mod) => mod.StatesSelect),
);
const EventsSelect = dynamicImport(() =>
  import("@/components/events-select").then((mod) => mod.EventsSelect),
);
const AppLoader = dynamicImport(() =>
  import("@/components/ui/app-loader").then((mod) => mod.default),
);
const LeaderboardEffects = dynamicImport(() =>
  import("@/components/effects/leaderboard").then((mod) => mod.default),
);
const MirrorText = dynamicImport(() =>
  import("@/components/ui/mirror-text").then((mod) => mod.default),
);

interface LeaderboardPageProps {
  searchParams: Promise<{ state?: string; city?: string; event?: string }>;
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const { state, city, event } = await searchParams;

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-4 gap-3 px-3 pb-3 pt-0 md:grid-cols-8 md:px-4 md:pb-4">
        <MirrorText
          text="Mystery Hall of Fame"
          containerClassName="col-span-full text-center"
        />
        <CountriesSelect wrapperClassName="col-span-2 z-[12]" />
        <StatesSelect value={state} wrapperClassName="col-span-2 z-[12]" />
        <CitiesSelect
          wrapperClassName="col-span-2 z-[12]"
          state={state}
          value={city}
        />
        <EventsSelect wrapperClassName="col-span-2 z-[12]" value={event} />
        <Suspense
          key={`${state}-${city}`}
          fallback={
            <AppLoader className="col-span-full h-[calc(100vh-15rem)]" />
          }
        >
          <LeaderboardsSection state={state} city={city} event={event} />
        </Suspense>
      </div>
      <LeaderboardEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mysteryverse Leaderboard",
  description: "This is a leaderboard page of Mysteryverse",
};
