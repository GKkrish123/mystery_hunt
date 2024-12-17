import { Separator } from "@/components/ui/separator";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { HeadingReveal } from "@/components/heading-reveal";
import { HorizontalMysteries } from "@/components/horizontal-mysteries";
import { CarouselCategories } from "@/components/carousel-categories";
import { api } from "@/trpc/server";
import { type Mystery } from "@/server/model/mysteries";
import { type Category } from "@/server/model/categories";
import ProductFeatures from "@/components/ui/feature-card";
import Particles from "@/components/ui/particles";
import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";

type DashboardContentType = {
  title: string;
  description: string;
  type: "mysteries" | "categories";
  id: string;
};

const dashboardContents: DashboardContentType[] = [
  {
    title: "Trending Mysteries",
    description:
      "Discover the most captivating mysteries everyone’s unraveling right now.",
    type: "mysteries",
    id: "trending-mysteries",
  },
  {
    title: "Popular Categories",
    description: "Dive into diverse categories, each with its own mystery.",
    type: "categories",
    id: "popular-categories",
  },
  {
    title: "Most Popular",
    description:
      "Explore the most popular mysteries that everyone’s talking about.",
    type: "mysteries",
    id: "popular-mysteries",
  },
  {
    title: "Most Bookmarked",
    description: "Discover the categories that have been bookmarked the most.",
    type: "categories",
    id: "most-bookmarked-categories",
  },
  {
    title: "Most Liked",
    description:
      "Explore the most liked mysteries that everyone’s thinking about.",
    type: "mysteries",
    id: "most-liked-mysteries",
  },
  {
    title: "Most Solved",
    description: "Explore the most failed mysteries that everyone’s wanted.",
    type: "mysteries",
    id: "most-solved-mysteries",
  },
  {
    title: "Most Guessed",
    description: "Discover the mysteries that have been guessed the most.",
    type: "mysteries",
    id: "most-guessed-mysteries",
  },
];

export default async function DashboardPage() {
  const [
    trendingMysteries,
    popularCategories,
    popularMysteries,
    mostBookmarkedCategories,
    mostLikedMysteries,
    mostSolvedMysteries,
    mostGuessedMysteries,
  ] = await Promise.all([
    api.mystery.getTrendingMysteries().catch(() => []),
    api.category.getPopularCategories().catch(() => []),
    api.mystery.getPopularMysteries().catch(() => []),
    api.category.getMostWatchedCategories().catch(() => []),
    api.mystery.getMostLikedMysteries().catch(() => []),
    api.mystery.getMostGuessedMysteries().catch(() => []),
    api.mystery.getMostSolvedMysteries().catch(() => []),
  ]);

  const dashboardData = [
    trendingMysteries,
    popularCategories,
    popularMysteries,
    mostBookmarkedCategories,
    mostLikedMysteries,
    mostSolvedMysteries,
    mostGuessedMysteries,
  ];

  return (
    <>
      <div className="relative grid auto-rows-min grid-cols-1 gap-4 px-3 pb-3 pt-0 sm:grid-cols-3 md:px-4 md:pb-4">
        <ProductFeatures className="col-span-full bg-transparent" />
        {dashboardContents.map(({ title, description, type, id }, index) => (
          <div id={id} key={id} className="z-10 col-span-full">
            <HeadingReveal title={title} description={description} />
            <Separator className="mt-3" />
            {type === "mysteries" ? (
              <HorizontalMysteries
                mysteries={dashboardData[index] as Mystery[]}
              />
            ) : (
              <div className="flex justify-center pt-4">
                <CarouselCategories
                  categories={dashboardData[index] as Category[]}
                />
              </div>
            )}
          </div>
        ))}
        <Link className="col-span-1 h-10 sm:col-start-2" href="/explore">
          <RainbowButton className="size-full">Explore More</RainbowButton>
        </Link>
      </div>
      <BackgroundBeamsWithCollision />
      <Particles
        className="absolute inset-0 z-[-1]"
        quantity={200}
        ease={80}
        size={3}
        refresh
      />
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 60;
