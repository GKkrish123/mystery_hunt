"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";

interface WordRotateProps {
  words: string[];
  duration?: number;
  framerProps?: HTMLMotionProps<"h1">;
  className?: string;
  wrapperClassName?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  framerProps = {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
  wrapperClassName,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className={cn("py-2", wrapperClassName)}>
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          className={cn(className, mysteryFont.className)}
          {...framerProps}
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
