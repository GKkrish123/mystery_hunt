/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import React, { type SyntheticEvent, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const colors = [
    "--sky-400",
    "--pink-400",
    "--green-400",
    "--yellow-400",
    "--red-400",
    "--purple-400",
    "--blue-400",
    "--indigo-400",
    "--violet-400",
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  let isDragging = false;
  let currentColor = "";
  let tapCount = 0;
  let tapTimer: NodeJS.Timeout | null = null;

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const handleInteraction = (element: HTMLElement | null) => {
    if (element?.classList.contains("box")) {
      if (!element.style.backgroundColor) {
        element.style.backgroundColor = currentColor;
      }
      //   else {
      //     element.style.backgroundColor = "";
      //   }
    }
  };

  const startDragging = (event: MouseEvent | TouchEvent) => {
    isDragging = true;
    currentColor = `var(${getRandomColor()})`;
    const target = event.target as HTMLElement;
    handleInteraction(target);
  };

  const stopDragging = () => {
    isDragging = false;
  };

  const handleDrag = (event: SyntheticEvent) => {
    if (!isDragging) return;

    const container = containerRef.current;
    if (!container) return;
    if (event instanceof MouseEvent) {
      const element = document.elementFromPoint(
        event.clientX,
        event.clientY,
      ) as HTMLElement;
      handleInteraction(element);
    } else if (
      event.nativeEvent instanceof TouchEvent &&
      event.nativeEvent.touches[0]
    ) {
      const element = document.elementFromPoint(
        event.nativeEvent.touches[0].clientX,
        event.nativeEvent.touches[0].clientY,
      ) as HTMLElement;
      handleInteraction(element);
    }
  };

  const resetColors = () => {
    if (!containerRef.current) return;

    const boxes = containerRef.current.querySelectorAll(".box");
    boxes.forEach((box) => {
      (box as HTMLElement).style.backgroundColor = "";
    });
  };

  const handleTripleTap = () => {
    tapCount += 1;

    if (tapTimer) clearTimeout(tapTimer);

    if (tapCount === 3) {
      resetColors();
      tapCount = 0;
      return;
    }

    tapTimer = setTimeout(() => {
      tapCount = 0; // Reset tap count after a short delay
    }, 300); // 500ms window for triple-tap detection
  };

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
      onMouseDown={(e) => {
        startDragging(e as unknown as MouseEvent);
        handleTripleTap();
      }}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onMouseMove={(e) => handleDrag(e)}
      onTouchStart={(e) => {
        startDragging(e as unknown as TouchEvent);
        handleTripleTap();
      }}
      onTouchMove={(e) => handleDrag(e)}
      onTouchEnd={stopDragging}
    >
      {Array.from({ length: 150 }).map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className="relative h-8 w-16 border-l border-slate-300 dark:border-slate-700"
        >
          {Array.from({ length: 100 }).map((_, j) => (
            <motion.div
              key={`col-${j}`}
              className="box relative h-8 w-16 border-r border-t border-slate-300 dark:border-slate-700"
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
