"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  useInView,
  type UseInViewOptions,
  type Variants,
  domAnimation,
  LazyMotion,
} from "motion/react";
import { div as MotionDiv } from "motion/react-m";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

export default function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant ?? defaultVariants;
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait" propagate>
        <MotionDiv
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          exit="hidden"
          variants={combinedVariants}
          transition={{
            delay: 0.04 + delay,
            duration,
            ease: "easeInOut",
          }}
          className={className}
        >
          {children}
        </MotionDiv>
      </AnimatePresence>
    </LazyMotion>
  );
}
