"use client";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { CategoryCard } from "./category-card";
import { type Category } from "@/server/model/categories";

interface CarouselCategoriesProps {
  categories: Category[];
  className?: string;
}

export function CarouselCategories({
  categories,
  className,
}: CarouselCategoriesProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className={cn("w-9/12 sm:w-5/6 lg:w-11/12", className)}
    >
      <CarouselPrevious className="-left-10 z-10 -mt-5" />
      <CarouselContent>
        {categories.map((category, index) => (
          <CarouselItem
            key={`category-${category.id}-${index}`}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <CategoryCard {...category} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="-right-10 z-10 -mt-5" />
    </Carousel>
  );
}
