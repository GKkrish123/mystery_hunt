import { Suspense } from "react";

import { default as dynamicImport } from "next/dynamic";

const CategoriesList = dynamicImport(() =>
  import("@/components/categories-list").then((mod) => mod.CategoriesList),
);
const SupportEffects = dynamicImport(() =>
  import("@/components/effects/support").then((mod) => mod.default),
);
const SearchBar = dynamicImport(() =>
  import("@/components/search-bar").then((mod) => mod.SearchBar),
);
const AppLoader = dynamicImport(() =>
  import("@/components/ui/app-loader").then((mod) => mod.default),
);
const BounceText = dynamicImport(() =>
  import("@/components/ui/bounce-text").then((mod) => mod.BounceText),
);

interface CategoriesPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const { search } = await searchParams;

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <BounceText
          text="Categories"
          wrapperClassName="col-span-full select-none"
          bouncingIndices={[0, 2, 5, 9]}
        />
        <SearchBar value={search} forCategory />
        <Suspense
          key={`${search}`}
          fallback={
            <AppLoader className="col-span-full h-[calc(100vh-10.2rem)] md:h-[calc(100vh-12.8rem)]" />
          }
        >
          <CategoriesList
            className="col-span-full h-[calc(100vh-10.2rem)] md:h-[calc(100vh-12.8rem)]"
            search={search}
          />
        </Suspense>
      </div>
      <SupportEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mysteryverse Categories",
  description: "This is a categories page of Mysteryverse",
};
