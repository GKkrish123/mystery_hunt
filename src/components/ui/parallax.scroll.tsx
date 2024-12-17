"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { MysteryCard } from "../mystery-card";
import { CategoryCard } from "../category-card";
import { type Mystery } from "@/server/model/mysteries";
import { type Category } from "@/server/model/categories";

interface ParallaxScrollProps {
  items: Mystery[] | Category[];
  className?: string;
  forCategory?: boolean;
}

interface RenderComponentProps {
  forCategory: boolean;
  item: Mystery | Category;
}

const RenderComponent = ({ forCategory, item }: RenderComponentProps) => {
  return forCategory ? (
    <CategoryCard {...(item as Category)} />
  ) : (
    <MysteryCard {...(item as Mystery)} />
  );
};

export const ParallaxScroll = ({
  items,
  className,
  forCategory = false,
}: ParallaxScrollProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const divideInto = isMobile ? 2 : 3;
  const parts = Math.ceil(items.length / divideInto);

  const firstPart = items.slice(0, parts - 1);
  const secondPart = items.slice(parts - 1, 2 * parts - 1);
  const thirdPart = items.slice(2 * parts - 1);

  return (
    <div
      className={cn(
        "z-1 h-[calc(100vh-9.5rem)] w-full items-start overflow-y-auto md:h-[calc(100vh-12rem)]",
        className,
      )}
      ref={gridRef}
    >
      <div
        className="mx-auto grid max-w-5xl grid-cols-2 items-start gap-3 pt-2 md:gap-5 md:pt-4 lg:grid-cols-3"
        ref={gridRef}
      >
        <div className="grid gap-3 md:gap-5">
          {firstPart.map((item, idx) => (
            <motion.div key={"grid-1" + idx} style={{ y: translateFirst }}>
              <RenderComponent forCategory={forCategory} item={item} />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-3 md:gap-5">
          {secondPart.map((item, idx) => (
            <motion.div key={"grid-2" + idx} style={{ y: translateSecond }}>
              <RenderComponent forCategory={forCategory} item={item} />
            </motion.div>
          ))}
        </div>
        {!isMobile ? (
          <div className="grid gap-3 md:gap-5">
            {thirdPart.map((item, idx) => (
              <motion.div key={"grid-3" + idx} style={{ y: translateThird }}>
                <RenderComponent forCategory={forCategory} item={item} />
              </motion.div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
