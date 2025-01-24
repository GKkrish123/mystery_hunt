"use client";

import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  useMotionValue,
  LazyMotion,
  domMax,
  AnimatePresence,
} from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { ArrowDown } from "lucide-react";
import { RainbowButton } from "./rainbow-button";
import { type MysteryEventWithData } from "@/server/model/events";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 30;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

interface EventsCarouselProps {
  mysteryEvents: MysteryEventWithData[];
}

export const EventsCarousel = ({ mysteryEvents }: EventsCarouselProps) => {
  const [imgIndex, setImgIndex] = useState(0);

  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === mysteryEvents.length - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mysteryEvents]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < mysteryEvents.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div className="relative w-full bg-transparent">
      <LazyMotion features={domMax} strict>
        <AnimatePresence propagate>
          <MotionDiv
            drag="x"
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            style={{
              x: dragX as unknown as number,
            }}
            animate={{
              translateX: `-${imgIndex * 100}%`,
            }}
            transition={SPRING_OPTIONS}
            onDragEnd={onDragEnd}
            className="flex cursor-grab items-center active:cursor-grabbing"
          >
            <Images imgIndex={imgIndex} events={mysteryEvents} />
          </MotionDiv>
        </AnimatePresence>
      </LazyMotion>
      <Dots
        imgIndex={imgIndex}
        setImgIndex={setImgIndex}
        size={mysteryEvents.length}
      />
    </div>
  );
};

function formatDateTime(datetime: number) {
  const date = new Date(datetime);

  // Format date as "07 Feb"
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });

  // Format time as "10:00 AM"
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  // const formattedDate = `${day} ${month}`;
  // const formattedTime = `${formattedHours}:${minutes} ${period}`;

  return { day, month, time: `${formattedHours}:${minutes}`, period };
}

const Images = ({
  imgIndex,
  events,
}: {
  imgIndex: number;
  events: MysteryEventWithData[];
}) => {
  const now = Date.now();

  return (
    <>
      {events.map((event, idx) => {
        const eventStart = event.scheduledFrom.seconds * 1000;
        const { day, month, time, period } = formatDateTime(eventStart);
        return (
          <LazyMotion key={idx} features={domMax} strict>
            <AnimatePresence propagate>
              <MotionDiv
                style={{
                  backgroundImage: `url(${event.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                animate={{
                  scale: imgIndex === idx ? 0.95 : 0.85,
                }}
                transition={SPRING_OPTIONS}
                className="flex aspect-video max-h-96 w-full shrink-0 flex-col items-center justify-center gap-3 rounded-xl bg-transparent object-cover 2xl:max-h-[30rem]"
              >
                <span className="pointer-events-none whitespace-pre-wrap rounded-md bg-gradient-to-b from-black to-zinc-600/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent drop-shadow-[0.03em_0.03em_2px_rgba(255,255,255)] dark:from-white dark:to-slate-500/80 dark:drop-shadow-[0.03em_0.03em_2px_rgba(0,0,0)] md:text-5xl lg:text-7xl">
                  {event.name}
                </span>
                {now > eventStart ? (
                  <RainbowButton
                    scrollTo={`event-${event.id}`}
                    className="z-10"
                    modeShift
                  >
                    Enter <ArrowDown className="ml-2" />
                  </RainbowButton>
                ) : (
                  <div className="grid auto-cols-max grid-flow-col gap-2 text-center font-mono font-bold">
                    <div className="text-neutral-content flex gap-1 rounded-md bg-neutral-300 p-1 text-sm drop-shadow-[3px_3px_2px_rgba(255,255,255)] dark:bg-zinc-700 dark:from-white dark:to-slate-500/80 dark:drop-shadow-[3px_3px_2px_rgba(0,0,0)] lg:text-base">
                      <span>{day}</span>
                      {month}
                    </div>
                    <div className="text-neutral-content flex gap-1 rounded-md bg-neutral-300 p-1 text-sm drop-shadow-[3px_3px_2px_rgba(255,255,255)] dark:bg-zinc-700 dark:from-white dark:to-slate-500/80 dark:drop-shadow-[3px_3px_2px_rgba(0,0,0)] lg:text-base">
                      <span>{time}</span>
                      {period}
                    </div>
                  </div>
                )}
              </MotionDiv>
            </AnimatePresence>
          </LazyMotion>
        );
      })}
    </>
  );
};

const Dots = ({
  imgIndex,
  setImgIndex,
  size,
}: {
  imgIndex: number;
  setImgIndex: Dispatch<SetStateAction<number>>;
  size: number;
}) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-2">
      {Array(size).map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-2 w-2 rounded-full transition-colors lg:h-3 lg:w-3 ${
              idx === imgIndex
                ? "bg-neutral-700 dark:bg-neutral-50"
                : "bg-neutral-400 dark:bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};
