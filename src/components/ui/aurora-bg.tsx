"use client";

import { memo } from "react";

export const AuroraBackground = memo(() => {
  return (
    <div className="absolute z-[-2] h-full w-full">
      <div className="transition-bg relative flex h-full flex-col items-center justify-center bg-transparent text-slate-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none absolute -inset-[10px] animate-none opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] [background-image:var(--white-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] [mask-image:radial-gradient(ellipse_at_100%_0%,black_40%,var(--transparent)_70%)] after:absolute after:inset-0 after:animate-aurora after:mix-blend-difference after:content-[''] after:[background-attachment:fixed] after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] dark:invert-0 dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]"></div>
        </div>
      </div>
    </div>
  );
});

AuroraBackground.displayName = "AuroraBackground";
