"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterShoot from "./letter-shoot";
import { useTheme } from "next-themes";

interface Tile {
  id: number;
  width: number;
  order: number;
}

interface VerticalTilesProps {
  tileClassName?: string;
  minTileWidth?: number;
  animationDuration?: number;
  animationDelay?: number;
  stagger?: number;
}

export default function VerticalTiles({
  tileClassName,
  minTileWidth = 32,
  animationDuration = 0.5,
  animationDelay = 1,
  stagger = 0.05,
}: VerticalTilesProps) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [showLetters, setShowLetters] = useState(true); // Control visibility of LetterShoot
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(true);

  const calculateTiles = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth: width } = containerRef.current;
      const tileCount = Math.max(
        3,
        Math.floor(width / (isMobile ? minTileWidth / 2 : minTileWidth)),
      );
      const tileWidth = width / tileCount + 1;

      const newTiles = Array.from({ length: tileCount }, (_, index) => ({
        id: index,
        width: tileWidth,
        order: Math.abs(index - Math.floor((tileCount - 1) / 2)),
      }));

      setTiles(newTiles);
    }
  }, [minTileWidth, isMobile]);

  useEffect(() => {
    calculateTiles();
    // const resizeObserver = new ResizeObserver(calculateTiles);
    // if (containerRef.current) {
    //   resizeObserver.observe(containerRef.current);
    // }

    setTimeout(
      () => {
        setIsAnimating(false);
      },
      (animationDelay + 3.5) * 1000,
    );

    // Set a timer to hide the LetterShoot component after the animation delay
    setTimeout(
      () => {
        setShowLetters(false); // This will remove the LetterShoot component from the DOM
      },
      animationDelay + 1.6 * 1000,
    ); // Delay in milliseconds
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute top-0 overflow-hidden",
        isAnimating ? "h-[200vh] w-screen" : "",
      )}
    >
      {isAnimating ? (
        <div className="absolute inset-0 flex">
          <AnimatePresence mode="wait">
            {showLetters && (
              <LetterShoot
                wrapperClassName="flex h-screen w-full items-center justify-center"
                className="pointer-events-none z-[55] whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text text-center text-5xl font-bold uppercase leading-[5rem] tracking-wider text-transparent dark:text-transparent sm:text-7xl md:leading-[8rem]"
                words={"Mysteryverse"}
                delay={0.05}
                animationDelay={animationDelay}
              />
            )}
          </AnimatePresence>
          {tiles.map((tile) => (
            <motion.div
              key={tile.id}
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
              initial={{ y: 0 }}
              animate={
                isInView
                  ? {
                      y: "100%",
                      borderTop: `${isMobile ? "20px" : "30px"} dotted ${resolvedTheme === "dark" ? "white" : "black"}`,
                    }
                  : { y: 0 }
              }
              transition={{
                duration: animationDuration + (isMobile ? 0.7 : 0),
                delay: animationDelay + 1.6 + tile.order * stagger,
                ease: [0.45, 0, 0.55, 1],
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
