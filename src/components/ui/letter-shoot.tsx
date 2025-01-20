"use client";

import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";
import { memo } from "react";
import { span as MotionSpan } from "motion/react-m";
import { domAnimation, LazyMotion } from "motion/react";

interface LetterShootProps {
  className?: string;
  words: string;
  delay?: number;
  animationDelay?: number; // New prop to control when letters drop and exit
  wrapperClassName?: string;
}

export default memo(function LetterShoot({
  className,
  words,
  delay = 0.1, // Delay between each letter animation in seconds
  animationDelay = 1, // Default delay after which letters will drop
  wrapperClassName,
}: LetterShootProps) {
  const letters = words.split("");
  const centerIndex = Math.floor(letters.length / 2);

  const generateRandomPosition = () => ({
    x: Math.random() * 7000 - 1000, // Random value between -100 and 100
    y: Math.random() * 4000 - 3000, // Random value between -100 and 100
  });

  const generateRandomExitPosition = () => ({
    y: Math.random() * 4000 + 3000, // Random drop to bottom (100 to 400px)
    // x: Math.random() * 2000 - 1000, // Slight horizontal shift (-50 to 50px)
  });

  const scaleVariant = {
    hidden: () => ({
      scale: 30,
      opacity: 0,
      ...generateRandomPosition(),
    }),
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        duration: 1,
        delay: i * delay,
        ease: "circOut",
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      ...generateRandomExitPosition(),
      transition: {
        duration: 0.8,
        // delay: animationDelay + i * 0.05, // Staggered exit after animationDelay
        delay: animationDelay + Math.abs(centerIndex - i) * 0.05, // Staggered exit after animationDelay
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      className={cn(
        "z-[51] flex justify-center",
        wrapperClassName,
        mysteryFont.className,
      )}
    >
      {letters.map((letter, i) => (
        <div
          key={`mysteryverse - ${i}`}
          className={cn(
            "relative h-[10rem]",
            letter === "e" ? "w-[1.5em] md:w-[2.5em]" : "",
            letter === "M" ? "w-[2.5em]" : "",
          )}
        >
          <LazyMotion features={domAnimation} strict>
            <MotionSpan
              key={`letter-${i}`}
              custom={i}
              variants={scaleVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "font-display inline-block text-center text-4xl font-bold tracking-wide text-black drop-shadow-sm dark:text-white md:text-6xl md:leading-[7rem]",
                className,
                letter === "e" ? "absolute -left-[0.1em] indent-2" : "",
                letter === "M"
                  ? "absolute -right-[0.08em] top-0 leading-[5rem] tracking-[0.14em] md:top-0"
                  : "",
                "drop-shadow-[-0.02em_-0.02em_#000000] dark:drop-shadow-[-0.02em_-0.02em_#ffffff]",
              )}
            >
              {letter === " " ? <span>&nbsp;</span> : letter}
            </MotionSpan>
          </LazyMotion>
        </div>
      ))}
    </div>
  );
});
