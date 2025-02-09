/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import TiltedCover from "./tilted-cover";
import { type Achievement } from "@/server/model/hunter-trails";

export function FocusCards({
  cards,
  className,
}: {
  cards: Achievement[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 md:px-8 lg:grid-cols-4",
        className,
      )}
    >
      {cards.map((card, index) => (
        <TiltedCover
          key={`achieved-${card.name}-${index}`}
          image={{
            alt: `achieved-${card.name}`,
            src: card.imgUrl,
          }}
        >
          <div className="p-2">
            <div className="mb-2 text-center text-xs lg:text-sm font-semibold text-foreground">
              {card.name}
            </div>
            <div className="mb-2 text-center font-mono text-xs lg:text-sm text-foreground">
              {card.points} Points
            </div>
            <p className="leading-2 text-center text-xs lg:text-sm text-muted-foreground">
              {card.achievement}
            </p>
          </div>
        </TiltedCover>
      ))}
    </div>
  );
}
