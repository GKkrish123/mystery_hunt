"use client";

import { mysteryFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { span as MotionSpan } from "motion/react-m";
import { useEffect, useState } from "react";

export function ColourfulText({ text, className }: { text: string, className?: string }) {
  const colors = [
    "rgb(131, 179, 32)",
    "rgb(47, 195, 106)",
    "rgb(42, 169, 210)",
    "rgb(4, 112, 202)",
    "rgb(107, 10, 255)",
    "rgb(183, 0, 218)",
    "rgb(218, 0, 171)",
    "rgb(230, 64, 92)",
    "rgb(232, 98, 63)",
    "rgb(249, 129, 47)",
  ];

  const [currentColors, setCurrentColors] = useState(colors);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return text.split("").map((char, index) => (
    <MotionSpan
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className={cn("inline-block drop-shadow-[0.02em_0.02em_0.7px_#000000] dark:drop-shadow-[0.02em_0.02em_0.7px_#cbd5e1]", className, mysteryFont.className)}
    >
      {char}
    </MotionSpan>
  ));
}
