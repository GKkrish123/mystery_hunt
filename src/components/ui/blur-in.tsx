"use client";

import { cn } from "@/lib/utils";
import { h1 as MotionH1 } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";
import { memo } from "react";

interface BlurIntProps {
  word: string;
  className?: string;
  variant?: {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  };
  duration?: number;
}
const BlurIn = memo(function BlurIn({ word, className, variant, duration = 1 }: BlurIntProps){
  const defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant ?? defaultVariants;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate>
        <MotionH1
          initial="hidden"
          animate="visible"
          transition={{ duration }}
          variants={combinedVariants}
          className={cn(
            "text-center text-4xl tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]",
            className,
          )}
        >
          {word}
        </MotionH1>
      </AnimatePresence>
    </LazyMotion>
  );
});

export default BlurIn;
