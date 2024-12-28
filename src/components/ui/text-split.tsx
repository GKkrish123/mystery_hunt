"use client";

import { mysteryFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

interface TextSplitProps {
  text: string;
  className?: string;
  containerClassName?: string;
  splitSpacing?: number;
}

export const TextSplit: React.FC<TextSplitProps> = ({
  text = "Payout fees",
  className = "",
  containerClassName = "",
  splitSpacing = 2,
}) => {
  return (
    <MotionDiv
      className={cn(
        "relative inline-block w-full text-center",
        containerClassName,
        mysteryFont.className,
      )}
      whileTap="hover"
      whileHover="hover"
      initial="default"
    >
      <MotionDiv
        className={cn(
          "absolute -ml-0.5 w-full text-3xl md:text-4xl",
          className,
        )}
        variants={{
          default: {
            clipPath: "inset(0 0 50% 0)",
            y: -splitSpacing / 2,
            opacity: 1,
          },
          hover: {
            clipPath: "inset(0 0 0 0)",
            y: 0,
            opacity: 0,
          },
        }}
        transition={{ duration: 0.1 }}
      >
        {text}
      </MotionDiv>
      <MotionDiv
        className={cn("absolute w-full text-3xl md:text-4xl", className)}
        variants={{
          default: {
            clipPath: "inset(50% 0 -6px 0)",
            y: splitSpacing / 2,
            opacity: 1,
          },
          hover: {
            clipPath: "inset(0 0 -6px 0)",
            y: 0,
            opacity: 1,
          },
        }}
        transition={{ duration: 0.1 }}
      >
        {text}
      </MotionDiv>

      {/* Hidden text for maintaining layout size */}
      <div className={cn("invisible text-3xl md:text-4xl", className)}>
        {text}
      </div>
    </MotionDiv>
  );
};
