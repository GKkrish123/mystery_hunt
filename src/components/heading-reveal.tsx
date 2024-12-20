"use client";

import { cn } from "@/lib/utils";
import BoxReveal from "./ui/box-reveal";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";

interface HeadingRevealProps {
  title: string;
  description: string;
  className?: string;
  headerClassName?: string;
  moreLink?: string;
}

export function HeadingReveal({
  title,
  description,
  className,
  headerClassName,
  moreLink,
}: HeadingRevealProps) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center",
        className,
      )}
    >
      <div className="space-y-1">
        <BoxReveal duration={0.5} width="100%">
          <h2
            className={cn(
              "text-center text-2xl font-semibold tracking-tight",
              headerClassName,
            )}
          >
            {title}
          </h2>
        </BoxReveal>
        <BoxReveal duration={0.5} width="100%">
          <p className="text-center text-sm text-muted-foreground">
            {description}
          </p>
        </BoxReveal>
      </div>
      {moreLink ? (
        <div
          className={cn(
            "group absolute right-0 top-[0.3rem] rounded-full border border-black/5 bg-neutral-100 text-xs text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 lg:text-sm",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-3 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>More</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      ) : null}
    </div>
  );
}
