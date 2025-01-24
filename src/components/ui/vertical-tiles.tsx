"use client";

import { memo, useCallback, useRef, useState, useEffect } from "react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  useInView,
} from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import LetterShoot from "./letter-shoot";

interface VerticalTilesProps {
  tileClassName?: string;
  minTileWidth?: number;
  animationDuration?: number;
  animationDelay?: number;
  stagger?: number;
}

export default memo(function VerticalTiles({
  tileClassName,
  minTileWidth = 32,
  animationDuration = 0.5,
  animationDelay = 1,
  stagger = 0.05,
}: VerticalTilesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const [hasAnimated, setHasAnimated] = useState(false); // Track animation completion
  const [letterShootExiting, setLetterShootExiting] = useState(false);

  const calculateTiles = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth: width } = containerRef.current;
      const tileCount = Math.max(
        3,
        Math.floor(width / (isMobile ? minTileWidth / 2 : minTileWidth)),
      );
      const tileWidth = width / tileCount + 1;

      return Array.from({ length: tileCount }, (_, index) => ({
        id: index,
        width: tileWidth,
        order: Math.abs(index - Math.floor((tileCount - 1) / 2)),
      }));
    }
    return [];
  }, [minTileWidth, isMobile]);

  const tiles = calculateTiles();

  const animationVariants = {
    visible: {
      y: "100%",
      borderTop: `${isMobile ? "15px" : "30px"} dotted ${
        resolvedTheme === "dark" ? "white" : "black"
      }`,
    },
    hidden: { y: 0 },
  };

  const tileAnimationDelay = animationDelay + 1.6;

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const totalAnimationTime =
        tileAnimationDelay +
        (tiles.length - 1) * stagger +
        animationDuration +
        (isMobile ? 0.7 : 0);

      const letterShootExitTime = totalAnimationTime - 2.2;

      const letterShootTimeout = setTimeout(() => {
        setLetterShootExiting(true);
      }, letterShootExitTime * 1000);

      const mainTimeout = setTimeout(() => {
        setHasAnimated(true);
      }, totalAnimationTime * 500);

      return () => {
        clearTimeout(mainTimeout);
        clearTimeout(letterShootTimeout);
      };
    }
  }, [
    isInView,
    hasAnimated,
    tiles,
    tileAnimationDelay,
    stagger,
    animationDuration,
    isMobile,
  ]);

  if (hasAnimated) {
    return null; // Don't render anything if the animation has completed
  }

  return (
    <div
      ref={containerRef}
      className="fixed top-0 z-[999999] h-[200vh] w-screen overflow-hidden"
    >
      <div className="absolute inset-0 flex">
        <AnimatePresence mode="wait">
          {!letterShootExiting && (
            <LetterShoot
              wrapperClassName="flex h-screen w-full items-center justify-center"
              className="pointer-events-none z-[55] whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text text-center font-bold uppercase leading-[5rem] tracking-wider text-transparent dark:text-transparent"
              words={"Mysteryverse"}
              delay={0.05}
              animationDelay={animationDelay}
            />
          )}
        </AnimatePresence>
        {tiles.map((tile) => (
          <LazyMotion key={tile.id} features={domAnimation} strict>
            <AnimatePresence propagate>
              <MotionDiv
                className={cn(
                  "relative border-0 bg-[rgb(255,255,255)]/[1] dark:bg-[rgb(0,0,0)]/[1]",
                  tileClassName,
                )}
                style={{
                  width: tile.width,
                  position: "absolute",
                  left: `${(tile.id * 100) / tiles.length}%`,
                  top: 0,
                  height: "100%",
                }}
                variants={animationVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{
                  duration: animationDuration + (isMobile ? 0.7 : 0),
                  delay: tileAnimationDelay + tile.order * stagger,
                  ease: [0.45, 0, 0.55, 1],
                }}
              />
            </AnimatePresence>
          </LazyMotion>
        ))}
      </div>
    </div>
  );
});
