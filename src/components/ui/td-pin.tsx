"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { div as MotionDiv } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";
import { toast } from "sonner";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)",
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "group/pin relative z-50 cursor-pointer",
        containerClassName,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // href={href ?? "/"}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-2 md:mt-10 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 top-1/2 flex items-start justify-start overflow-hidden rounded-2xl border border-black bg-slate-200 p-4 shadow-[0_8px_16px_rgb(0_0_0/0.4)] !transition !duration-700 group-hover/pin:border-white/[0.2] dark:border-white dark:bg-black"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

const PinPerspective = ({ title, href }: { title?: string; href: string }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate>
        <MotionDiv className="z-[60] flex h-80 w-96 items-center justify-center opacity-0 !transition !duration-500 group-hover/pin:opacity-100">
          <div className="inset-0 -mt-7 h-full w-full flex-none">
            <Link
              href={href}
              onClick={async (e) => {
                e.stopPropagation();
                await navigator.clipboard.writeText("www.krishnan.arulsigamani-1@oksbi");
                toast.info("UPI ID copied to your clipboard!", {
                  duration: 1500,
                });
              }}
              className="absolute inset-x-0 top-0 flex justify-center drop-shadow-[1px_1px_2px_rgba(0,0,0)] dark:drop-shadow-[1px_1px_2px_rgba(255,255,255)]"
            >
              <div className="relative z-10 flex items-center space-x-2 rounded-full bg-slate-200 px-4 py-0.5 ring-1 ring-zinc-700 dark:bg-zinc-950 dark:ring-white">
                <div className="relative z-20 inline-block py-0.5 text-xs font-bold text-black dark:text-white">
                  <span className="drop-shadow-[-1px_-1px_3px_rgba(0,0,0)] dark:drop-shadow-[-1px_-1px_3px_rgba(255,255,255)]">
                    ✨
                  </span>{" "}
                  {title}
                </div>

                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover/btn:opacity-40"></span>
              </div>
            </Link>

            <div
              style={{
                perspective: "1000px",
                transform: "rotateX(70deg) translateZ(0)",
              }}
              className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
            >
              <LazyMotion features={domAnimation} strict>
                <AnimatePresence propagate>
                  <MotionDiv
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: "-50%",
                      y: "-50%",
                    }}
                    animate={{
                      opacity: [0, 1, 0.5, 0],
                      scale: 1,

                      z: 0,
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: 0,
                    }}
                    className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
                  />
                </AnimatePresence>
              </LazyMotion>
              <LazyMotion features={domAnimation} strict>
                <AnimatePresence propagate>
                  <MotionDiv
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: "-50%",
                      y: "-50%",
                    }}
                    animate={{
                      opacity: [0, 1, 0.5, 0],
                      scale: 1,

                      z: 0,
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: 2,
                    }}
                    className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
                  />
                </AnimatePresence>
              </LazyMotion>
              <LazyMotion features={domAnimation} strict>
                <AnimatePresence propagate>
                  <MotionDiv
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: "-50%",
                      y: "-50%",
                    }}
                    animate={{
                      opacity: [0, 1, 0.5, 0],
                      scale: 1,

                      z: 0,
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: 4,
                    }}
                    className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
                  />
                </AnimatePresence>
              </LazyMotion>
            </div>
            <LazyMotion features={domAnimation} strict>
              <AnimatePresence propagate>
                <MotionDiv className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-cyan-500 blur-[2px] group-hover/pin:h-40" />
              </AnimatePresence>
            </LazyMotion>
            <LazyMotion features={domAnimation} strict>
              <AnimatePresence propagate>
                <MotionDiv className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-cyan-500 group-hover/pin:h-40" />
              </AnimatePresence>
            </LazyMotion>
            <LazyMotion features={domAnimation} strict>
              <AnimatePresence propagate>
                <MotionDiv className="absolute bottom-1/2 right-1/2 z-40 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-cyan-600 blur-[3px]" />
              </AnimatePresence>
            </LazyMotion>
            <LazyMotion features={domAnimation} strict>
              <AnimatePresence propagate>
                <MotionDiv className="absolute bottom-1/2 right-1/2 z-40 h-[2px] w-[2px] translate-x-[0.5px] translate-y-[14px] rounded-full bg-cyan-300" />
              </AnimatePresence>
            </LazyMotion>
          </div>
        </MotionDiv>
      </AnimatePresence>
    </LazyMotion>
  );
};
