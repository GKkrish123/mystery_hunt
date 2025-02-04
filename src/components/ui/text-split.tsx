"use client";

import { mysteryFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { div as MotionDiv } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";

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
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate>
        <MotionDiv
          className={cn(
            "relative inline-block text-center",
            containerClassName,
            mysteryFont.className,
          )}
          whileTap="hover"
          whileHover="hover"
          initial="default"
        >
          <LazyMotion features={domAnimation} strict>
            <AnimatePresence propagate>
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
            </AnimatePresence>
          </LazyMotion>
          <LazyMotion features={domAnimation} strict>
            <AnimatePresence propagate>
              <MotionDiv
                className={cn(
                  "absolute w-full text-3xl md:text-4xl",
                  className,
                )}
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
            </AnimatePresence>
          </LazyMotion>

          {/* Hidden text for maintaining layout size */}
          <div className={cn("invisible text-3xl md:text-4xl", className)}>
            {text}
          </div>
        </MotionDiv>
      </AnimatePresence>
    </LazyMotion>
  );
};
