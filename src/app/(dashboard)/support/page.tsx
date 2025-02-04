import BlurIn from "@/components/ui/blur-in";
import { mysteryFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { default as dynamicImport } from "next/dynamic";

const MyProfile = dynamicImport(() =>
  import("@/components/my-profile").then((mod) => mod.MyProfile),
);
const SupportEffects = dynamicImport(
  () => import("@/components/effects/support"),
);
const PinContainer = dynamicImport(() =>
  import("@/components/ui/td-pin").then((mod) => mod.PinContainer),
);

export default function SupportPage() {
  return (
    <>
      <div className="relative grid h-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <div className="col-span-full flex items-center justify-center">
          <BlurIn
            word="Support"
            className={cn(
              "mx-auto h-8 text-3xl font-bold text-black dark:text-white md:h-10 md:text-4xl",
              mysteryFont.className,
            )}
          />
        </div>
        <div className="col-span-full flex h-[21rem] w-full items-start justify-center md:h-[25rem]">
          <PinContainer
            title="Donate"
            href="upi://pay?pa=www.krishnan.arulsigamani-1@okicici&pn=GKkrish&cu=INR"
          >
            <div className="flex h-[17rem] w-[15rem] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 md:h-[20rem] md:w-[20rem]">
              <h3 className="!m-0 max-w-xs !pb-2 text-base font-bold text-black dark:text-slate-100 md:text-lg">
                Treasure Chest of Funds
              </h3>
              <div className="!m-0 !p-0 text-sm font-normal md:text-base">
                <span className="text-slate-600 dark:text-slate-400">
                  Be a part of the Mysteryverse,
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  Your support powers the journey!
                </p>
              </div>
              <div className="mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
            </div>
          </PinContainer>
        </div>
        <MyProfile className="col-span-full justify-self-center" />
      </div>
      <SupportEffects />
    </>
  );
}

export const dynamic = "force-static";
export const fetchCache = "force-cache";
export const revalidate = 3600;
export const metadata = {
  title: "Mysteryverse Support",
  description: "This is a support page of Mysteryverse",
};
