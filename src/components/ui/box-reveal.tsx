"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, useAnimation, useInView } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { domAnimation, LazyMotion } from "motion/react";
import { useTheme } from "next-themes";

interface BoxRevealProps {
  children: JSX.Element;
  width?: "fit-content" | "100%";
  boxColor?: string;
  duration?: number;
}

export const BoxReveal = ({
  children,
  width = "fit-content",
  duration,
}: BoxRevealProps) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (isInView) {
      void slideControls.start("visible");
      void mainControls.start("visible");
    } else {
      void slideControls.start("hidden");
      void mainControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence propagate>
          <MotionDiv
            variants={{
              hidden: { opacity: 0, y: 75 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: duration ? duration : 0.5, delay: 0.25 }}
          >
            {children}
          </MotionDiv>
        </AnimatePresence>
      </LazyMotion>
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence propagate>
          <MotionDiv
            variants={{
              hidden: { left: 0 },
              visible: { left: "100%" },
            }}
            initial="hidden"
            animate={slideControls}
            transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: 0,
              right: 0,
              zIndex: 20,
              background: resolvedTheme === "dark" ? "#ffffff" : "#000000",
            }}
          />
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
};

export default BoxReveal;
