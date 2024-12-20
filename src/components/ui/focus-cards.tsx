/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import TiltedCover from "./tilted-cover";

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
