import FlickeringGrid from "@/components/ui/flickering-grid";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="relative grid auto-rows-min grid-cols-3 gap-4 px-3 pb-3 pt-0 md:px-4 md:pb-4">
      <div className="col-span-full pt-10">
        <span className="pointer-events-none block whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl">
          What You Seek is No More
        </span>
      </div>
      <div className="col-span-full py-10 md:py-20">
        <span className="pointer-events-none block whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl">
          Beyond Reach
        </span>
        <span className="pointer-events-none block whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-5xl">
          Beyond Reason
        </span>
      </div>
      <Link className="col-span-3 h-10 md:col-span-1 md:col-start-2" href="/">
        <RainbowButton className="size-full">Enter Colosseum</RainbowButton>
      </Link>
      <FlickeringGrid
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </div>
  );
}
