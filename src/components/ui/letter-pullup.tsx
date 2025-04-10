/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";
import { memo } from "react";
import { h1 as MotionH1 } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";

interface LetterPullupProps {
  className?: string;
  words: string;
  delay?: number;
  wrapperClassName?: string;
  type?: string;
  forSidebar?: boolean;
  forHeader?: boolean;
}

const pullupVariant = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1, transition: { duration: 0.5 } },
  initial: { y: 30, opacity: 0 },
  animate: (i: any) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.03, // By default, delay each letter's animation by 0.05 seconds
    },
  }),
  exit: (i: any) => ({
    x: -50,
    opacity: 0,
    transition: {
      delay: i * 0.01, // By default, delay each letter's animation by 0.05 seconds
    },
  }),
};

export default memo(function LetterPullup({
  className,
  words,
  // delay,
  wrapperClassName,
  type,
  forSidebar,
  forHeader,
}: LetterPullupProps) {
  const letters = words.split("");

  return (
    <div
      className={cn(
        "flex justify-center select-none",
        wrapperClassName,
        mysteryFont.className,
      )}
    >
      {letters.map((letter, i) => (
        <div
          key={`mysteryverse - ${i}`}
          className={cn(
            "relative",
            letter === "e" ? "w-[1.6em]" : "",
            letter === "M" ? "w-[1.6em]" : "",
            forSidebar && letter === "e" ? "w-[1.1em]" : "",
            forHeader && letter === "e" ? "w-[0.7em] md:w-[1.1em]" : "",
          )}
        >
          <LazyMotion features={domAnimation} strict>
            <AnimatePresence propagate>
              <MotionH1
                variants={pullupVariant}
                initial={type === "blur" ? "hidden" : "initial"}
                animate={type === "blur" ? "visible" : "animate"}
                exit="exit"
                custom={i}
                className={cn(
                  "font-display text-center text-2xl font-bold uppercase tracking-wide text-black dark:text-white md:leading-[5rem]",
                  className,
                  letter === "e"
                    ? "absolute -left-[0.1em] indent-2 tracking-[0.13em]"
                    : "",
                  letter === "M"
                    ? "absolute -right-[0.08em] -top-[0.22em] leading-[1.5em] tracking-[0.13em] md:-top-[0.02em]"
                    : "",
                  // "drop-shadow-[-0.02em_-0.02em_#000000] dark:drop-shadow-[-0.02em_-0.02em_#ffffff]",
                  forSidebar ? "leading-[1.5em] md:leading-[1.5em]" : "",
                  forSidebar && letter === "M"
                    ? "-top-[0.3em] leading-[2em] md:-top-[0.05em]"
                    : "",
                  forSidebar && letter === "e" ? "-left-[0.2em]" : "",
                  forHeader ? "leading-[1.7em] md:leading-[1.7em]" : "",
                  forHeader && letter === "M"
                    ? "-top-[0.18em] leading-[2em] md:-top-[0.05rem]"
                    : "",
                  forHeader && letter === "e"
                    ? "-left-[0.4em] md:-left-[0.2em]"
                    : "",
                  "drop-shadow-[-0.02em_-0.02em_0.7px_#000000] dark:drop-shadow-[-0.02em_-0.02em_0.7px_#cbd5e1]",
                )}
              >
                {letter === " " ? <span>&nbsp;</span> : letter}
              </MotionH1>
            </AnimatePresence>
          </LazyMotion>
        </div>
      ))}
    </div>
  );
});
