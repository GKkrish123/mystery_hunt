"use client";

import { useEffect, useRef, useState } from "react";
import { type Variants, domAnimation, LazyMotion } from "motion/react";
import { span as MotionSpan } from "motion/react-m";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  wrapperClassName?: string;
  animateOnLoad?: boolean;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export default function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  wrapperClassName,
  animateOnLoad = true,
}: HyperTextProps) {
  const splittedText = text.split(" ");
  const [displayText, setDisplayText] = useState<string[]>(splittedText);
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval);
          isFirstRender.current = false;
          return;
        }
        if (interations.current < splittedText.length) {
          setDisplayText((t) =>
            t.map((word, i) =>
              i <= interations.current
                ? splittedText[i]!
                : Array.from(
                    { length: word.length },
                    () => alphabets[getRandomInt(26)],
                  ).join(""),
            ),
          );
          interations.current = interations.current + 0.05;
        } else {
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (displayText.length * 10),
    );
    // Clean up interval on unmount
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splittedText, duration, trigger, animateOnLoad]);

  return (
    <div
      className={cn(
        "flex scale-100 cursor-default flex-wrap overflow-hidden py-2",
        wrapperClassName,
      )}
    >
      <LazyMotion features={domAnimation} strict>
        {displayText.map((word, i) => (
          <MotionSpan
            key={i}
            className={cn("font-mono", "inline-block", className)}
            {...framerProps}
          >
            {word.toUpperCase() + (i < splittedText.length - 1 ? "\u00A0" : "")}
          </MotionSpan>
        ))}
      </LazyMotion>
    </div>
  );
}
