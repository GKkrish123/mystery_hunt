"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface AnimatedSubscribeButtonProps {
  buttonColor?: string;
  buttonTextColor?: string;
  subscribeStatus?: boolean;
  initialText?: React.ReactElement | string;
  changeText?: React.ReactElement | string;
}

export const AnimatedSubscribeButton: React.FC<
  AnimatedSubscribeButtonProps
> = ({
  subscribeStatus = false,
  changeText = (
    <BookmarkCheck className="h-5 w-5 fill-sky-300 dark:fill-blue-700" />
  ),
  initialText = <Bookmark className="h-5 w-5" />,
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  return (
    <div className="absolute right-2 top-2 z-[1]">
      <AnimatePresence mode="wait">
        {isSubscribed ? (
          <motion.button
            className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg bg-slate-200 p-[10px] outline outline-1 outline-blue-700 dark:bg-zinc-800 dark:outline-sky-300"
            onClick={() => setIsSubscribed(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              key="action"
              className="relative block font-semibold text-zinc-600 dark:text-slate-200"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
            >
              {changeText}
            </motion.span>
          </motion.button>
        ) : (
          <motion.button
            className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border-none bg-slate-200 p-[10px] dark:bg-zinc-800"
            onClick={() => setIsSubscribed(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              key="reaction"
              className="relative block font-semibold text-zinc-500 dark:text-slate-400"
              initial={{ x: 0 }}
              exit={{ x: 50, transition: { duration: 0.1 } }}
            >
              {initialText}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
