import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";

import { default as dynamicImport } from "next/dynamic";

const MysteriesList = dynamicImport(() =>
  import("@/components/mysteries-list").then((mod) => mod.MysteriesList),
);
const SearchBar = dynamicImport(() =>
  import("@/components/search-bar").then((mod) => mod.SearchBar),
);
const AppLoader = dynamicImport(() =>
  import("@/components/ui/app-loader").then((mod) => mod.default),
);
const SplitText = dynamicImport(() =>
  import("@/components/ui/split-text").then((mod) => mod.default),
);
const MysteriesEffects = dynamicImport(() =>
  import("@/components/effects/mysteries").then((mod) => mod.default),
);

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
            mysteryFont.className,
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
      <MysteriesEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mysteryverse Mysteries",
  description: "This is a mysteries page of Mysteryverse",
};
