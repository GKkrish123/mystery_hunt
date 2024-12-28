import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { mysteryFont } from "@/lib/fonts";

import { default as dynamicImport } from "next/dynamic";

const MysteriesList = dynamicImport(() =>
  import("@/components/mysteries-list").then((mod) => mod.MysteriesList),
);
const AppLoader = dynamicImport(() =>
  import("@/components/ui/app-loader").then((mod) => mod.default),
);
const BlurIn = dynamicImport(() =>
  import("@/components/ui/blur-in").then((mod) => mod.default),
);
const CategoryEffects = dynamicImport(() =>
  import("@/components/effects/category").then((mod) => mod.default),
);

interface ExploreCategoryProps {
  params: Promise<{
    exploreId: string;
  }>;
}

export default async function ExploreCategoryPage({
  params,
}: ExploreCategoryProps) {
  const { exploreId } = await params;
  const category = await api.category
    .getCategoryByTag({ tag: exploreId })
    .catch(() => null);

  if (!category) {
    notFound();
  }

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <BlurIn
          word={exploreId.charAt(0).toUpperCase() + exploreId.slice(1)}
          className={cn(
            "col-span-full mx-auto h-8 text-2xl font-bold text-black dark:text-white md:h-10 md:text-3xl",
            mysteryFont.className,
          )}
        />
        <Suspense
          key={`${exploreId}`}
          fallback={
            <AppLoader className="col-span-full h-[calc(100vh-6.7rem)] md:h-[calc(100vh-9.3rem)]" />
          }
        >
          <MysteriesList
            className="col-span-full h-[calc(100vh-6.7rem)] md:h-[calc(100vh-9.3rem)]"
            tags={exploreId}
          />
        </Suspense>
      </div>
      <CategoryEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mysteryverse Category",
  description: "This is a category page of Mysteryverse",
};
