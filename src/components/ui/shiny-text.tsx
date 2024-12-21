"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";

interface TextShineProps {
  text: string;
  shineColor: string;
  duration: number;
}

export const TextShine: React.FC<TextShineProps> = ({
  text,
  shineColor,
  duration,
}) => {
  const controls = useAnimationControls();
  const textRef = useRef<HTMLSpanElement>(null);

  const updateAnimation = useCallback(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const startPos = textWidth * -0.5;
      const endPos = textWidth * 1.25;

      void controls.start({
        backgroundPosition: [`${startPos}px`, `${endPos}px`],
        transition: {
          duration,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls]);

  useEffect(() => {
    updateAnimation();
    window.addEventListener("resize", updateAnimation);

    return () => {
      window.removeEventListener("resize", updateAnimation);
    };
  }, [updateAnimation]);

  return (
    <motion.span
      ref={textRef}
      className={cn(
        "relative w-fit bg-clip-text px-3 text-3xl font-bold text-[rgb(0,0,0)]/[.10] dark:text-[rgb(255,255,255)]/[.70] md:text-4xl",
        mysteryFont.className,
      )}
      style={{
        backgroundImage: `linear-gradient(to right, #222 0%, ${shineColor} 10%, #222 20%)`,
        backgroundSize: "200%",
      }}
      animate={controls}
    >
      {text}
    </motion.span>
  );
};
