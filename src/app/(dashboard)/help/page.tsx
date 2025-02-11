import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";

import { default as dynamicImport } from "next/dynamic";

const HomeEffects = dynamicImport(() => import("@/components/effects/home"));
const BlurIn = dynamicImport(() =>
  import("@/components/ui/blur-in").then((mod) => mod.default),
);
const IconCloud = dynamicImport(() =>
  import("@/components/ui/icon-cloud").then((mod) => mod.IconCloud),
);
const VerticalAccordion = dynamicImport(() =>
  import("@/components/ui/vertical-accordion").then((mod) => mod.default),
);

const slugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "html5",
  "css3",
  "firebase",
  "google",
  "redis",
  "docker",
  "git",
  "github",
  "visualstudiocode",
  "shadcnui",
  "upstash",
  "framer",
  "tailwindcss",
  "trpc",
  "threedotjs",
  "reacthookform",
  "zod",
  "googlepubsub",
  "npm",
];

export default function HelpPage() {
  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 md:grid-cols-5 md:px-4 md:pb-4">
        <BlurIn
          word="Guide"
          className={cn(
            "col-span-full mx-auto h-8 text-3xl font-bold text-black dark:text-white md:h-10 md:text-4xl select-none",
            mysteryFont.className,
          )}
        />
        <div className="col-span-full flex justify-center">
          <VerticalAccordion />
        </div>
        <div className="col-span-full flex justify-center">
          <div className="relative md:w-[350px]">
            <IconCloud iconSlugs={slugs} />
            <span className="pointer-events-none absolute top-[40%] m-auto block w-full whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl">
              Built With
            </span>
          </div>
        </div>
      </div>
      <HomeEffects />
    </>
  );
}

export const dynamic = "force-static";
export const fetchCache = "force-cache";
export const revalidate = 3600;
export const metadata = {
  title: "Mysteryverse Help",
  description: "This is a help page of Mysteryverse",
};
