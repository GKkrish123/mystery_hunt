import { SparklesText } from "@/components/ui/sparkles-text";
import { api } from "@/trpc/server";

import { default as dynamicImport } from "next/dynamic";

const LightBoard = dynamicImport(() =>
  import("@/components/ui/lightboard").then((mod) => mod.LightBoard),
);
const FocusCards = dynamicImport(() =>
  import("@/components/ui/focus-cards").then((mod) => mod.FocusCards),
);
const CoolMode = dynamicImport(() =>
  import("@/components/ui/cool-mode").then((mod) => mod.default),
);
const AchievementsEffects = dynamicImport(() =>
  import("@/components/effects/achievements").then((mod) => mod.default),
);

export default async function AchievementsPage() {
  const { achievements, lastScored, scoreBoard } = await api.mystery
    .getAchievements()
    .catch(() => ({
      achievements: null,
      lastScored: 0,
      scoreBoard: null,
    }));

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <CoolMode>
          <SparklesText
            text="Achievements"
            sparklesCount={5}
            className="col-span-full select-none mx-auto h-8 cursor-pointer text-2xl font-bold text-black dark:text-white md:h-10 md:text-3xl"
          />
        </CoolMode>
        <LightBoard
          className="col-span-full"
          text={
            lastScored && scoreBoard
              ? `LAST SCORE ${lastScored.toString().split("").join(" ")} TOTAL SCORE ${scoreBoard.totalScore.toString().split("").join(" ")}`
              : "RISE STRIVE CONQUER REPEAT"
          }
          updateInterval={40}
        />
        {achievements ? (
          <FocusCards className="col-span-full" cards={achievements} />
        ) : (
          <div className="col-span-full flex h-[400px] items-center">
            <span className="pointer-events-none m-auto block whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl">
              No Achievements Found
            </span>
          </div>
        )}
      </div>
      <AchievementsEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mysteryverse Achievements",
  description: "This is a achievements page of Mysteryverse",
};
