"use client";

import { mysteryFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function MirrorText({
  text = "This is a text",
  className,
  direction = "up",
  containerClassName,
}: {
  text: string;
  className?: string;
  /**
   * The direction of the animation
   * @default "up"
   */
  direction?: "up" | "down" | "left" | "right";

  containerClassName?: string;
}) {
  const animation = cn("!transition-all !duration-500 !ease-slow", {
    "group-hover:-translate-y-3": direction === "up",
    "group-hover:translate-y-3": direction === "down",
    "group-hover:-translate-x-3": direction === "left",
    "group-hover:translate-x-3": direction === "right",
  });

  const content = (
    <div
      className={cn(
        "inline-block text-2xl font-light uppercase leading-none md:text-4xl",
        className,
      )}
    >
      {text}
    </div>
  );

  return (
    <div
      className={cn(
        "group relative justify-end text-foreground",
        containerClassName,
        mysteryFont.className,
      )}
    >
      {/* <div className={cn("h-3 overflow-hidden delay-200", animation)}>{content}</div> */}
      <div
        className={cn("h-[0.3rem] overflow-hidden !delay-100 md:h-2", animation)}
      >
        {content}
      </div>
      <div
        className={cn("h-[0.3rem] overflow-hidden !delay-75 md:h-2", animation)}
      >
        {content}
      </div>
      <div className={animation}>{content}</div>
    </div>
  );
}
