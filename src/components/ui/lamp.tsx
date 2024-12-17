"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// export function LampDemo() {
//   return (
//     <LampContainer>
//       <motion.h1
//         initial={{ opacity: 0.5, y: 100 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{
//           delay: 0.3,
//           duration: 0.8,
//           ease: "easeInOut",
//         }}
//         className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
//       >
//         Build lamps <br /> the right way
//       </motion.h1>
//     </LampContainer>
//   );
// }

export const LampContainer = ({
  //   children,
  className,
}: {
  //   children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn(
        "absolute z-[-2] flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white dark:bg-slate-950",
        className,
      )}
    >
      <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
        <motion.div
          initial={{ opacity: 0.5, width: "7.5rem" }}
          whileInView={{ opacity: 0.9, width: isMobile ? "15rem" : "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            clipPath: "border-box",
          }}
          className="bg-gradient-conic absolute inset-auto right-1/2 -mt-[25%] h-56 w-[10rem] overflow-visible from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] md:w-[30rem]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-[100%] bg-white [mask-image:linear-gradient(to_top,white,transparent)] dark:bg-slate-950" />
          <div className="absolute bottom-0 left-0 z-20 h-[100%] w-20 bg-white [mask-image:linear-gradient(to_right,white,transparent)] dark:bg-slate-950 md:w-40" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "7.5rem" }}
          whileInView={{ opacity: 0.9, width: isMobile ? "15rem" : "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            clipPath: "border-box",
          }}
          className="bg-gradient-conic absolute inset-auto left-1/2 -mt-[25%] h-56 w-[10rem] from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top] md:w-[30rem]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-[100%] w-20 bg-white [mask-image:linear-gradient(to_left,white,transparent)] dark:bg-slate-950 md:w-40" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-[100%] bg-white [mask-image:linear-gradient(to_top,white,transparent)] dark:bg-slate-950" />
        </motion.div>
        <div className="absolute top-1/2 -mt-[25%] h-48 w-full translate-y-12 scale-x-150 bg-white blur-2xl dark:bg-slate-950"></div>
        <div className="absolute top-1/2 z-50 -mt-[25%] h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 -mt-[25%] h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "4rem" }}
          whileInView={{ width: isMobile ? "8rem" : "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 -mt-[25%] h-36 w-32 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl md:w-64"
        ></motion.div>
        <motion.div
          initial={{ width: "7.5rem" }}
          whileInView={{ width: isMobile ? "15rem" : "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 -mt-[25%] h-0.5 w-[10rem] -translate-y-[7rem] bg-cyan-400 md:w-[30rem]"
        ></motion.div>

        <div className="absolute inset-auto z-40 -mt-[25%] h-44 w-full -translate-y-[12.5rem] bg-white dark:bg-slate-950"></div>
      </div>

      {/* <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div> */}
    </div>
  );
};
