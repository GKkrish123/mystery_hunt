import { CitiesSelect } from "@/components/cities-select";
import { CountriesSelect } from "@/components/countries-select";
import { LeaderboardsSection } from "@/components/leaderboards-section";
import { StatesSelect } from "@/components/states-select";
import AppLoader from "@/components/ui/app-loader";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Cobe } from "@/components/ui/globe";
import MirrorText from "@/components/ui/mirror-text";
import { StarsBackground } from "@/components/ui/stars-background";
import { Suspense } from "react";

interface LeaderboardPageProps {
  searchParams: Promise<{ state?: string; city?: string }>;
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const { state, city } = await searchParams;

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-6 gap-3 px-3 pb-3 pt-0 md:grid-cols-8 md:px-4 md:pb-4">
        <MirrorText
          text="Mystery Hall of Fame"
          containerClassName="col-span-full text-center"
        />
        <CountriesSelect wrapperClassName="col-span-2 md:col-start-2 z-[12]" />
        <StatesSelect value={state} wrapperClassName="col-span-2 z-[12]" />
        <CitiesSelect wrapperClassName="col-span-2 z-[12]" state={state} />
        <Suspense
          key={`${state}-${city}`}
          fallback={
            <AppLoader className="col-span-full h-[calc(100vh-15rem)]" />
          }
        >
          <LeaderboardsSection state={state} city={city} />
        </Suspense>
      </div>
      <StarsBackground />
      <BackgroundBeams />
      <Cobe />
    </>
  );
}
