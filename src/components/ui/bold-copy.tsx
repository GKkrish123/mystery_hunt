"use client";

import { Tourney } from "next/font/google";
import { cn } from "@/lib/utils";

const tourney = Tourney({
  subsets: ["latin"],
});

interface BoldCopyProps {
  texts: string[];
  className?: string;
  textClassName?: string[];
  backgroundTextClassName?: string[];
}

export const BoldCopy: React.FC<BoldCopyProps> = ({
  texts = ["animata"],
  className,
  textClassName,
  backgroundTextClassName,
}) => {
  if (!texts?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "group flex flex-col items-center justify-center bg-transparent px-2",
        tourney.className,
        className,
      )}
    >
      {texts.map((text, index) => (
        <div
          className="relative flex items-center justify-center bg-transparent"
          key={`bold-${text}-${index}`}
        >
          <div
            className={cn(
              "text-5xl font-bold uppercase text-foreground/15 !transition-all group-hover:opacity-50 group-active:opacity-50 md:text-7xl",
              backgroundTextClassName?.[index],
            )}
          >
            {text}
          </div>
          <div
            className={cn(
              "absolute text-3xl font-bold uppercase text-foreground !transition-all group-hover:text-5xl group-active:text-5xl md:text-[2.75rem] group-hover:md:text-7xl group-active:md:text-7xl",
              textClassName?.[index],
            )}
          >
            {text}
          </div>
        </div>
      ))}
    </div>
  );
};
