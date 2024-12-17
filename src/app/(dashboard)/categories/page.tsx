import { CategoriesList } from "@/components/categories-list";
import { SearchBar } from "@/components/search-bar";
import AppLoader from "@/components/ui/app-loader";
import { BounceText } from "@/components/ui/bounce-text";
import Particles from "@/components/ui/particles";
import { Suspense } from "react";

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
          wrapperClassName="col-span-full"
          bouncingIndices={[0, 2, 5, 9]}
        />
        <SearchBar value={search} />
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
      <Particles
        className="absolute inset-0 z-[-1]"
        quantity={300}
        ease={80}
        refresh
      />
    </>
  );
}
