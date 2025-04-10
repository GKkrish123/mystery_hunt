"use client";

import Image from "next/image";
import React, { memo, useMemo, useState, type MouseEvent } from "react";
import {
  useTransform,
  useMotionValue,
  useSpring,
  domAnimation,
  LazyMotion,
} from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { type HunterRank } from "@/server/model/hunters";
import { ShieldAlert, ShieldQuestion } from "lucide-react";

export const AnimatedTooltip = memo(
  ({ items, insideEvent }: { items: HunterRank[]; insideEvent: boolean }) => {
    const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

    // Motion configuration
    const springConfig = { stiffness: 120, damping: 8, mass: 0.5 }; // Adjusted for smooth animations
    const x = useMotionValue(0);
    const rotate = useSpring(
      useTransform(x, [-100, 100], [-5, 5]),
      springConfig,
    );
    const translateX = useSpring(
      useTransform(x, [-100, 100], [-50, 50]),
      springConfig,
    );

    // Handles mouse movement for x-axis transformation
    const handleMouseMove = (event: MouseEvent<HTMLImageElement>) => {
      const halfWidth = event.currentTarget.offsetWidth / 2;
      x.set(event.nativeEvent.offsetX - halfWidth);
    };

    const UnknownIcon = useMemo(
      () => (insideEvent ? ShieldQuestion : ShieldAlert),
      [insideEvent],
    );

    return (
      <>
        {insideEvent || items.length === 0 ? (
          <div
            className="group relative -mr-4"
            key={`anime-tooltip-unknown`}
            onMouseEnter={() => setHoveredIndex("anime-tooltip-unknown")}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <LazyMotion features={domAnimation} strict>
              {hoveredIndex === "anime-tooltip-unknown" && (
                <MotionDiv
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { ...springConfig, type: "spring" },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  style={{
                    translateX: translateX as unknown as number,
                    rotate: rotate as unknown as number,
                  }}
                  className="absolute -top-4 right-10 z-50 flex max-h-36 min-h-16 w-36 translate-x-1/2 flex-col items-center justify-center rounded-md border border-black bg-white px-4 py-2 text-xs shadow-xl dark:border-white dark:bg-black"
                >
                  <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                  <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

                  <div className="relative z-30 text-ellipsis text-center text-sm text-black dark:text-white">
                    {insideEvent
                      ? "The first finder will be revealed once the event is over."
                      : "No one found the secret yet."}
                  </div>
                </MotionDiv>
              )}
            </LazyMotion>

            <UnknownIcon className="relative h-7 w-7 rounded-full border border-black object-cover object-top p-1 transition-transform duration-300 group-hover:scale-105 dark:border-white md:h-9 md:w-9 md:border-2" />
          </div>
        ) : (
          items.map((item, index) => {
            const tooltipKey = `${item.name}-${index}`;
            const isHovered = hoveredIndex === tooltipKey;

            return (
              <div
                className="group relative -mr-4"
                key={tooltipKey}
                onMouseEnter={() => setHoveredIndex(tooltipKey)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <LazyMotion features={domAnimation} strict>
                  {isHovered && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { ...springConfig, type: "spring" },
                      }}
                      exit={{
                        opacity: 0,
                        y: 20,
                        scale: 0.8,
                        transition: { duration: 0.2 },
                      }}
                      style={{
                        translateX: translateX as unknown as number,
                        rotate: rotate as unknown as number,
                      }}
                      className="absolute -top-4 right-10 z-50 flex max-h-36 min-h-16 w-36 translate-x-1/2 flex-col items-center justify-center rounded-md border border-black bg-white px-4 py-2 text-xs shadow-xl dark:border-white dark:bg-black"
                    >
                      <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                      <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

                      <div className="relative z-30 text-ellipsis text-center text-sm font-bold text-black dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs font-semibold text-black dark:text-white">
                        {item.state}
                      </div>
                      <div className="text-xs text-black dark:text-white">
                        {item.city}
                      </div>
                    </MotionDiv>
                  )}
                </LazyMotion>

                <Image
                  onMouseMove={handleMouseMove}
                  height={40}
                  width={40}
                  src={item.proPicUrl}
                  alt={item.name}
                  className="relative h-8 w-8 rounded-full border border-black object-cover object-top transition-transform duration-300 group-hover:scale-105 dark:border-white md:h-10 md:w-10 md:border-2"
                />
              </div>
            );
          })
        )}
      </>
    );
  },
);

AnimatedTooltip.displayName = "AnimatedTooltip";
