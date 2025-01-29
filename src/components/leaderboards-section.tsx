import { api } from "@/trpc/server";

import { default as dynamicImport } from "next/dynamic";

const LeaderboardsTable = dynamicImport(() =>
  import("./leaderboards-table").then((mod) => mod.LeaderboardsTable),
);
const CanvasRevealEffect = dynamicImport(() =>
  import("./ui/canvas-reveal-effect").then((mod) => mod.CanvasRevealEffect),
);
const RevealCard = dynamicImport(() =>
  import("./ui/canvas-reveal-effect").then((mod) => mod.RevealCard),
);
const BlurFade = dynamicImport(() =>
  import("./ui/blur-fade").then((mod) => mod.default),
);

interface LeaderboardsSectionProps {
  state?: string;
  city?: string;
  event?: string;
}

export async function LeaderboardsSection({
  state,
  city,
  event,
}: LeaderboardsSectionProps) {
  const leaderboardsData = await api.user
    .getLeaderboards({
      state: state ?? undefined,
      city: city ?? undefined,
      event: event ?? undefined,
    })
    .catch(() => []);

  const topThree = [2, 1, 3].map(
    (rank) => leaderboardsData.find((item) => item.rank === rank) ?? null,
  );

  return (
    <BlurFade className="z-[1] col-span-full flex flex-col gap-3 pt-2">
      <div className="flex w-full justify-center gap-2">
        {topThree[0] ? (
          <RevealCard
            name={topThree[0].name}
            picUrl={topThree[0].proPicUrl}
            position={2}
          >
            <CanvasRevealEffect
              animationSpeed={5.1}
              containerClassName="bg-emerald-900"
            />
            <div className="absolute inset-0 bg-black/50 [mask-image:radial-gradient(200px_at_center,white,transparent)] dark:bg-black/90" />
          </RevealCard>
        ) : null}
        {topThree[1] ? (
          <RevealCard
            name={topThree[1].name}
            picUrl={topThree[1].proPicUrl}
            position={1}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [236, 72, 153],
                [232, 121, 249],
              ]}
              dotSize={2}
            />
            <div className="absolute inset-0 bg-black/50 [mask-image:radial-gradient(100px_at_center,white,transparent)] dark:bg-black/90" />
          </RevealCard>
        ) : null}
        {topThree[2] ? (
          <RevealCard
            name={topThree[2].name}
            picUrl={topThree[2].proPicUrl}
            position={3}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[125, 211, 252]]}
            />
            <div className="absolute inset-0 bg-black/50 [mask-image:radial-gradient(200px_at_center,white,transparent)] dark:bg-black/90" />
          </RevealCard>
        ) : null}
      </div>
      <div className="flex h-[550px] w-full">
        {leaderboardsData.length === 0 ? (
          <span className="pointer-events-none m-auto block whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl">
            No Hunters found in {city ? city : state}
          </span>
        ) : (
          <LeaderboardsTable
            data={leaderboardsData}
            state={state}
            city={city}
            event={event}
          />
        )}
      </div>
    </BlurFade>
  );
}
