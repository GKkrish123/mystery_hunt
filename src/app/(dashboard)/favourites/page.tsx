import { HeartsText } from "@/components/ui/hearts-text";
import { ParallaxScroll } from "@/components/ui/parallax.scroll";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";

export default async function FavouritesPage() {
  const favouritesData = await api.user.getFavourites().catch(() => {
    return {
      likedMysteries: [],
      bookmarkedCategories: [],
    };
  });

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <HeartsText
          text="Favourites"
          heartsCount={5}
          className="col-span-full mx-auto h-8 text-2xl font-bold text-black dark:text-white md:h-10 md:text-3xl"
        />
        <Tabs defaultValue="mysteries" className="col-span-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mysteries">Mysteries</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="mysteries">
            {favouritesData.likedMysteries.length ? (
              <ParallaxScroll items={favouritesData.likedMysteries} />
            ) : (
              <span className="pointer-events-none mt-32 block whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:mx-auto md:mt-52 md:max-w-[500px] md:text-5xl">
                You Have No Favourite Mysteries Yet
              </span>
            )}
          </TabsContent>
          <TabsContent value="categories">
            {favouritesData.bookmarkedCategories.length ? (
              <ParallaxScroll
                items={favouritesData.bookmarkedCategories}
                forCategory
              />
            ) : (
              <span className="pointer-events-none mt-32 block whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:mx-auto md:mt-52 md:max-w-[500px] md:text-5xl">
                You Have No Favourite Categories Yet
              </span>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <ShootingStars />
    </>
  );
}
