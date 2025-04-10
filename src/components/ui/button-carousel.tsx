"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MysteryCard } from "../mystery-card";
import { type Mystery } from "@/server/model/mysteries";

interface IImageCarouselProps {
  className?: string;
  items: Mystery[];
}

export function ImageCarousel({
  className,
  items: initialItems,
}: IImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % initialItems.length);
  };
  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + initialItems.length) % initialItems.length,
    );
  };

  let visibleItems: Mystery[] = [];

  if (initialItems.length === 1) {
    visibleItems = initialItems;
  } else if (initialItems.length === 2) {
    visibleItems = [
      initialItems[(currentIndex + 1) % initialItems.length]!,
      initialItems[currentIndex]!,
    ];
  } else {
    visibleItems = [
      initialItems[
        (currentIndex - 1 + initialItems.length) % initialItems.length
      ]!,
      initialItems[currentIndex]!,
      initialItems[(currentIndex + 1) % initialItems.length]!,
    ];
  }

  return (
    <div
      className={cn(
        "carousel-container relative h-[400px] w-full rounded-2xl bg-transparent p-2 md:overflow-hidden",
        className,
      )}
    >
      {initialItems.length > 1 && (
        <div
          onClick={handlePrev}
          className="navigation-item-left absolute left-5 top-[50%] z-20 flex h-7 w-7 translate-y-[-50%] cursor-pointer items-center justify-center rounded-full border bg-neutral-200 backdrop-blur-sm backdrop-filter dark:bg-neutral-700"
        >
          <ChevronLeft className="-ml-[2px] text-zinc-700 dark:text-slate-200" />
        </div>
      )}
      {initialItems.length > 1 && (
        <div
          onClick={handleNext}
          className="navigation-item-right absolute right-5 top-[50%] z-20 flex h-7 w-7 translate-y-[-50%] cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-neutral-200 backdrop-blur-sm backdrop-filter dark:border-zinc-800 dark:bg-neutral-700"
        >
          <ChevronRight className="-mr-[2px] text-zinc-700 dark:text-slate-200" />
        </div>
      )}

      {visibleItems.map((item, index) => (
        <div
          key={`${item.id}`}
          className="!animate-fadeIn !transition-filter absolute left-[50%] top-[10%] z-10 w-[220px] rounded-xl bg-transparent !transition-transform !duration-500 !ease-in-out"
          style={{
            transform:
              index === 1
                ? "translateX(-50%)"
                : index === 0
                  ? initialItems.length === 2
                    ? "translateX(-60%) rotate(-10deg)"
                    : initialItems.length === 1
                      ? "translateX(-50%)"
                      : "translateX(-130%) rotate(-10deg)"
                  : "translateX(30%) rotate(10deg)",
            filter:
              index === 1 || initialItems.length === 1 ? "none" : "blur(4px)",
            zIndex: index === 1 ? 3 : 1,
          }}
        >
          <MysteryCard {...item} />
        </div>
      ))}
    </div>
  );
}
