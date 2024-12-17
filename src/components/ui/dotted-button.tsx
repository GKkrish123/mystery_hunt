"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const DottedButton = ({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        "rounded-2xl border-2 border-dashed border-black bg-white px-6 py-1 text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
