"use client";

import { AnimatePresence, type TargetAndTransition } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { domAnimation, LazyMotion } from "motion/react";
import { useCallback, useState } from "react";

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
  const [isInView, setIsInView] = useState(false);

  const changeInView = useCallback(() => {
    setIsInView(true);
    return {};
  }, []);

  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence propagate>
          <MotionDiv
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            viewport={{ once: true }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileInView={changeInView as unknown as TargetAndTransition}
            transition={{ duration: duration ? duration : 0.5, delay: 0.25 }}
          >
            {children}
          </MotionDiv>
        </AnimatePresence>
      </LazyMotion>
      {/* <LazyMotion features={domAnimation} strict>
        <AnimatePresence propagate>
          <MotionDiv
            className="bg-black dark:bg-white"
            variants={{
              hidden: { x: 0 },
              visible: { x: "102%" },
            }}
            viewport={{ once: true }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileInView={changeInView as unknown as TargetAndTransition}
            transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: 0,
              right: 0,
              zIndex: 20,
            }}
          />
        </AnimatePresence>
      </LazyMotion> */}
    </div>
  );
};

export default BoxReveal;
