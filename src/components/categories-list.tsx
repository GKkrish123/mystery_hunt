import { ParallaxScroll } from "@/components/ui/parallax.scroll";
import { api } from "@/trpc/server";

interface CategoriesListProps {
  className?: string;
  search?: string;
}

export async function CategoriesList({
  className,
  search,
}: CategoriesListProps) {
  const categories = await api.category
    .getCategories({
      search: search ?? undefined,
    })
    .catch(() => []);

  return (
    <ParallaxScroll className={className} items={categories} forCategory />
  );
}
