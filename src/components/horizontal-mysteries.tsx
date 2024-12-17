"use client";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { MysteryCard } from "./mystery-card";
import { type Mystery } from "@/server/model/mysteries";

interface HorizontalMysteriesProps {
  mysteries: Mystery[];
  className?: string;
}

export function HorizontalMysteries({
  mysteries,
  className,
}: HorizontalMysteriesProps) {
  return (
    <ScrollArea className={cn("w-full whitespace-nowrap pt-1", className)}>
      <div className="flex w-max space-x-4 p-4 pb-5">
        {mysteries.map((mystery, index) => (
          <MysteryCard key={`mystery-${mystery.id}-${index}`} {...mystery} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
