"use client";

import {
  useInView,
  type Variants,
  domAnimation,
  LazyMotion,
} from "motion/react";
import { h1 as MotionH1 } from "motion/react-m";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface GradualSpacingProps {
  text: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

export function GradualSpacing({
  text,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  className,
}: GradualSpacingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="flex flex-wrap justify-center space-x-[0.15rem]">
      {text.split("").map((char, i) => (
        <LazyMotion key={i} features={domAnimation} strict>
          <MotionH1
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
            className={cn("drop-shadow-sm", className)}
          >
            {char === " " ? <span>&nbsp;</span> : char}
          </MotionH1>
        </LazyMotion>
      ))}
    </div>
  );
}
