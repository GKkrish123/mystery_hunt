"use client";

import React from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <Image
          key={index}
          priority
          className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 md:h-10 md:w-10"
          src={url}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {numPeople ? (
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black md:h-10 md:w-10"
          // href=""
        >
          +{numPeople}
        </span>
      ) : null}
    </div>
  );
};

export default AvatarCircles;
