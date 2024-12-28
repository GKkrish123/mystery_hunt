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
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export default function HelpPage() {
  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 md:grid-cols-5 md:px-4 md:pb-4">
        <BlurIn
          word="Guide"
          className={cn(
            "col-span-full mx-auto h-8 text-3xl font-bold text-black dark:text-white md:h-10 md:text-4xl",
            mysteryFont.className,
          )}
        />
        <div className="col-span-full flex justify-center">
          <VerticalAccordion />
        </div>
        <div className="col-span-full flex justify-center">
          <div className="md:w-[350px]">
            <IconCloud iconSlugs={slugs} />
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
