"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import TinderCard from "react-tinder-card";
import { MysteryCard } from "../mystery-card";
import { CategoryCard } from "../category-card";
import { type Mystery } from "@/server/model/mysteries";
import { type Category } from "@/server/model/categories";

interface SwipeCardsProps {
  cardData: (Mystery | Category)[];
  className?: string;
  type?: "mystery" | "category";
}

interface RenderDragComponentProps {
  forCategory: boolean;
  item: Mystery | Category;
}

const RenderDragComponent = ({
  forCategory,
  item,
}: RenderDragComponentProps) => {
  return forCategory ? (
    <CategoryCard {...(item as Category)} forDrag />
  ) : (
    <MysteryCard {...(item as Mystery)} forDrag />
  );
};

const SwipeCards = ({
  className,
  cardData,
  type = "mystery",
}: SwipeCardsProps) => {
  const [cards, setCards] = useState<(Mystery | Category)[]>(cardData);

  return (
    <div
      className={cn(
        "relative grid h-full w-full place-items-center bg-transparent md:h-[350px]",
        className,
      )}
    >
      {cards.map((card, index) => {
        return (
          <TinderCard
            className="swipe absolute"
            flickOnSwipe
            key={`card-${card.id}-card`}
            onCardLeftScreen={() =>
              setCards((prev) => prev.filter((c) => c.id !== card.id))
            }
          >
            <Card
              index={index}
              zIndex={cards.length - index}
              key={`card-${card.id}-card`}
              card={card}
              type={type}
            />
          </TinderCard>
        );
      })}
    </div>
  );
};

const Card = ({
  index,
  zIndex,
  card,
  type,
}: {
  index: number;
  zIndex: number;
  card: Mystery | Category;
  type: "mystery" | "category";
}) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const isFront = index === 0;

  return (
    <motion.div
      className={cn(
        "rounded-lg bg-slate-100 object-cover outline outline-zinc-600 dark:bg-zinc-900 dark:outline-slate-300",
        type === "mystery" ? "p-2 pt-3" : "p-1 pt-2",
      )}
      style={{
        zIndex: zIndex,
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate: isFront ? rotateRaw : `${(index + 1) % 2 ? 6 : -6}deg`,
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={"x"}
      dragConstraints={{ left: 0, right: 0 }}
    >
      <RenderDragComponent forCategory={type === "category"} item={card} />
    </motion.div>
  );
};

export default SwipeCards;

type Card = {
  id: number;
  url: string;
};
