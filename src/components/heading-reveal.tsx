"use client";

import { cn } from "@/lib/utils";
import BoxReveal from "./ui/box-reveal";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface HeadingRevealProps {
  title: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  descriptionClassName?: string;
  moreLink?: string;
  coundown?: number;
}

const useCountdown = (endTime?: number) => {
  const calculateTimeLeft = () => {
    const now = Date.now();
    const difference = (endTime ?? now) - now;

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        isOver: true,
        isWarning: false,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const isWarning = difference <= 2 * 60 * 60 * 1000; // Less than 2 hours

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      isOver: false,
      isWarning,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft.isOver) return;

    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime, timeLeft.isOver]);

  return timeLeft;
};

export function HeadingReveal({
  title,
  description,
  className,
  headerClassName,
  descriptionClassName,
  moreLink,
  coundown,
}: HeadingRevealProps) {
  const { days, hours, minutes, seconds, isOver, isWarning } =
    useCountdown(coundown);

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
          {coundown ? (
            <div className="grid auto-cols-max grid-flow-col gap-2 text-center font-mono font-bold">
              <div
                className={cn(
                  "text-neutral-content flex gap-1 rounded-md bg-neutral-300 p-1 text-xs dark:bg-neutral-500 lg:text-sm",
                  isWarning && "bg-orange-500/70 dark:bg-orange-600/70",
                  isOver && "bg-red-600/80 dark:bg-red-600/60",
                )}
              >
                <span className="!transition-[all_1s_cubic-bezier(1,0,0,1)]">
                  {days}
                </span>
                Days
              </div>
              <div
                className={cn(
                  "text-neutral-content flex gap-1 rounded-md bg-neutral-300 p-1 text-xs dark:bg-neutral-500 lg:text-sm",
                  isWarning && "bg-orange-500/70 dark:bg-orange-600/70",
                  isOver && "bg-red-600/80 dark:bg-red-600/60",
                )}
              >
                <span className="!transition-[all_1s_cubic-bezier(1,0,0,1)]">
                  {hours}
                </span>
                Hrs
              </div>
              <div
                className={cn(
                  "text-neutral-content flex gap-1 rounded-md bg-neutral-300 p-1 text-xs dark:bg-neutral-500 lg:text-sm",
                  isWarning && "bg-orange-500/70 dark:bg-orange-600/70",
                  isOver && "bg-red-600/80 dark:bg-red-600/60",
                )}
              >
                <span className="!transition-[all_1s_cubic-bezier(1,0,0,1)]">
                  {minutes}
                </span>
                Min
              </div>
              <div
                className={cn(
                  "text-neutral-content flex gap-1 rounded-md bg-neutral-300 p-1 text-xs dark:bg-neutral-500 lg:text-sm",
                  isWarning && "bg-orange-500/70 dark:bg-orange-600/70",
                  isOver && "bg-red-600/80 dark:bg-red-600/60",
                )}
              >
                <span className="!transition-[all_1s_cubic-bezier(1,0,0,1)]">
                  {seconds}
                </span>
                Sec
              </div>
            </div>
          ) : (
            <p
              className={cn(
                "text-center text-sm text-muted-foreground",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          )}
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
