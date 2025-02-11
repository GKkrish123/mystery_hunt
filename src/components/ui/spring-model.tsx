import { mysteryFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { type Dispatch, memo, type SetStateAction } from "react";

export const SpringModal = memo(function SpringModal({
  title,
  description,
  isOpen,
  setIsOpen,
}: {
  title: string;
  description: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<number>>;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(-1)}
          className={cn(
            "absolute inset-0 z-50 grid cursor-pointer place-items-center overflow-y-scroll p-8 md:-mb-20",
            // "backdrop-blur"
          )}
        >
          <motion.div
            initial={{ scale: 0, rotate: "50deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "-25deg" }}
            onClick={(e) => e.stopPropagation()}
            className="relative h-72 w-56 cursor-default overflow-hidden rounded-lg bg-gradient-to-br from-zinc-500 via-slate-800 to-gray-600 px-6 py-3 text-white shadow-xl !duration-75"
          >
            <div className="flex min-h-full flex-col justify-center gap-1 md:gap-2">
              <h1
                className={cn(
                  "text-center text-lg font-bold text-white antialiased md:text-xl",
                  mysteryFont.className,
                )}
              >
                {title}
              </h1>
              <p className="mt-1 border-t border-t-gray-200 py-2 text-center font-mono text-sm font-medium leading-normal text-white antialiased md:py-4">
                {description}
              </p>
              <div
                onClick={() => setIsOpen(-1)}
                className="mx-auto mt-auto w-fit cursor-pointer gap-1 rounded-md bg-neutral-300 p-1 px-3 pr-[0.9rem] text-sm text-black drop-shadow-[1px_1px_2px_rgba(0,0,0)] dark:bg-zinc-700 dark:from-white dark:to-slate-500/80 dark:text-white dark:drop-shadow-[1px_1px_2px_rgba(255,255,255)] lg:text-base"
              >
                <span className={mysteryFont.className}>OK</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
