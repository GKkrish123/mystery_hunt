/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import TiltedCover from "./tilted-cover";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative h-60 w-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-out dark:bg-neutral-900 md:h-96",
        hovered !== null && hovered !== index && "scale-[0.98] blur-sm",
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="absolute inset-0 object-cover"
      />
      <div
        className={cn(
          "absolute inset-0 flex items-end bg-black/50 px-4 py-8 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-xl font-medium text-transparent md:text-2xl">
          {card.title}
        </div>
      </div>
    </div>
  ),
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
};

export function FocusCards({
  cards,
  className,
}: {
  cards: Card[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 md:px-8 lg:grid-cols-4",
        className,
      )}
    >
      {cards.map((card) => (
        <TiltedCover
          key={card.title}
          image={{
            alt: card.title,
            src: card.src,
          }}
        >
          <div className="p-2">
            <div className="mb-2 text-sm font-semibold text-foreground">
              {card.title}
            </div>
            <p className="leading-2 text-sm text-muted-foreground">
              The Statue of Liberty is a colossal neoclassical sculpture on
              Liberty Island in New York Harbor, within New York City.{" "}
            </p>
          </div>
        </TiltedCover>
      ))}
    </div>
  );
}
