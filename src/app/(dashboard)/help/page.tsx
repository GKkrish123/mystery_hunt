import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import BlurIn from "@/components/ui/blur-in";
import { IconCloud } from "@/components/ui/icon-cloud";
import VerticalAccordion from "@/components/ui/vertical-accordion";
import { cn } from "@/lib/utils";
import { Mystery_Quest } from "next/font/google";

const fontType = Mystery_Quest({
  subsets: ["latin"],
  weight: "400",
});

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
            fontType.className,
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
      <BackgroundBeamsWithCollision />
    </>
  );
}
