"use client";

import dynamic from "next/dynamic";
import LoaderOrange from "@/components/icons/lottie/LoaderOrange.json";
import { cn } from "@/lib/utils";
import { memo } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AppLoaderProps {
  className?: string;
}

export default memo(function AppLoader({ className }: AppLoaderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <Lottie
          className="h-40 w-40"
          animationData={LoaderOrange}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
          }}
          autoplay={true}
          loop={true}
        />
      </div>
    </div>
  );
});
