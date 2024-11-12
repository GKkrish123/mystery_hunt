"use client";

import Particles from "@/components/ui/particles";
import { PinContainer } from "@/components/ui/td-pin";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";


export default function SupportPage() {
    const {resolvedTheme} = useTheme();
    const isMobile = useIsMobile();
  return (
    <div className="relative auto-rows-min grid grid-cols-1 h-full gap-3 sm:grid-cols-2 md:grid-cols-5 overflow-hidden">
       <div className="h-[35rem] md:h-[40rem] w-full col-span-full flex items-center justify-center ">
            <PinContainer
                title="/gkkrish123.git"
                href="https://github.com/gkkrish123"
            >
                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[15rem] h-[20rem] md:w-[20rem] md:h-[20rem] ">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-lg dark:text-slate-100 text-black">
                    Treasure Chest of Funds
                </h3>
                <div className="text-base !m-0 !p-0 font-normal">
                    <span className="text-slate-600 dark:text-slate-400 ">
                        Be Part of the Mysteryverse: Your Support Powers the Journey!
                    </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
                </div>
            </PinContainer>
            <Particles
                className="absolute inset-0"
                quantity={isMobile ? 200 : 300}
                ease={80}
                color={resolvedTheme === "dark" ? "#ffffff" : "#000000"}
                refresh
            />
        </div>
    </div>
  );
}
