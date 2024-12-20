"use client";

import { type HTMLAttributes, useEffect, useState } from "react";

import WaveReveal from "./wave-reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { type Category } from "@/server/model/categories";

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  item: Category;
  index: number;
  activeItem: number;
}

interface ExpandableProps {
  list: Category[];
  autoPlay?: boolean;
  className?: string;
}

const List = ({ item, className, index, activeItem, ...props }: ImageProps) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-5 min-w-5 overflow-hidden rounded-md transition-all delay-0 duration-300 ease-in-out md:w-20 md:min-w-10",
        {
          "flex-grow": index === activeItem,
        },
        className,
      )}
      {...props}
    >
      <Image
        src={item.themePicUrl}
        alt={item.name}
        height={700}
        width={400}
        className={cn("h-full w-full object-cover", {
          "blur-[2px]": index !== activeItem,
        })}
      />
      {index === activeItem && (
        <Link
          href={`/explore/${item.tag}`}
          className="absolute bottom-4 left-4 min-w-fit text-white md:bottom-8 md:left-8"
        >
          <WaveReveal
            duration="1000ms"
            className="items-start justify-start text-xl sm:text-2xl md:text-4xl"
            text={item.name}
            direction="up"
          />
        </Link>
      )}
    </div>
  );
};

export function Expandable({
  list,
  autoPlay = true,
  className,
}: ExpandableProps) {
  const [activeItem, setActiveItem] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    const interval = setInterval(() => {
      if (!isHovering) {
        setActiveItem((prev) => (prev + 1) % list.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, list.length, isHovering]);

  return (
    <div className={cn("flex h-96 w-full gap-1", className)}>
      {list.map((item, index) => (
        <List
          key={item.name}
          item={item}
          index={index}
          activeItem={activeItem}
          onMouseEnter={() => {
            setActiveItem(index);
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
        />
      ))}
    </div>
  );
}
