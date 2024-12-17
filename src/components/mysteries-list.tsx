import { ParallaxScroll } from "@/components/ui/parallax.scroll";
import { api } from "@/trpc/server";

interface MysteriesListProps {
  className?: string;
  search?: string;
  tags?: string;
}

export async function MysteriesList({
  className,
  search,
  tags,
}: MysteriesListProps) {
  const mysteries = await api.mystery
    .getMysteries({
      search: search ?? undefined,
      tags: tags ? tags.split(",") : undefined,
    })
    .catch(() => []);

  return <ParallaxScroll className={className} items={mysteries} />;
}
