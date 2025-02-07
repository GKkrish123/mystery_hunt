"use client";

import { memo, useState } from "react";
import {
  useScroll,
  useMotionValueEvent,
  LazyMotion,
  domAnimation,
  AnimatePresence,
} from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { MoveUp } from "lucide-react";
import ThemeToggle from "./ui/theme-toggle";

export const FloatingNav = memo(function FloatingNav({
  className,
}: {
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const { openMobile } = useSidebar();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate mode="wait">
        {openMobile ? null : (
          <MotionDiv
            initial={{
              opacity: 1,
              y: -100,
            }}
            animate={{
              y: visible ? 0 : -100,
              opacity: visible ? 1 : 0,
            }}
            exit={{
              y: -100,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className={cn(
              "fixed inset-x-0 top-6 z-[10000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-black/[0.5] bg-white p-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:border-white/[0.5] dark:bg-black",
              className,
            )}
          >
            <SidebarTrigger />

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <MoveUp />
            </Button>

            <ThemeToggle />
          </MotionDiv>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
});
