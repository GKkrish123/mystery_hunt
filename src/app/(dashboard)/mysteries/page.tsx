import { MysteriesList } from "@/components/mysteries-list";
import { SearchBar } from "@/components/search-bar";
import AppLoader from "@/components/ui/app-loader";
import { AuroraBackground } from "@/components/ui/aurora-bg";
import SplitText from "@/components/ui/split-text";
import { Suspense } from "react";
import { Mystery_Quest } from "next/font/google";
import { cn } from "@/lib/utils";

const fontType = Mystery_Quest({
  subsets: ["latin"],
  weight: "400",
});

interface MysteriesPageProps {
  searchParams: Promise<{ search?: string; tags?: string }>;
}

export default async function MysteriesPage({
  searchParams,
}: MysteriesPageProps) {
  const { search, tags } = await searchParams;

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <SplitText
          text="Mysteries"
          className={cn(
            "col-span-full mx-auto h-8 text-3xl font-bold tracking-wider text-black dark:text-white md:h-10 md:text-4xl lg:text-4xl",
            fontType.className,
          )}
        />
        <SearchBar value={search} />
        <Suspense
          key={`${search}-${tags}`}
          fallback={
            <AppLoader className="col-span-full h-[calc(100vh-10.2rem)] md:h-[calc(100vh-12.8rem)]" />
          }
        >
          <MysteriesList
            className="col-span-full h-[calc(100vh-10.2rem)] md:h-[calc(100vh-12.8rem)]"
            search={search}
            tags={tags}
          />
        </Suspense>
      </div>
      <AuroraBackground />
    </>
  );
}
