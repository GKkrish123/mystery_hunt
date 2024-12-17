import { ParallaxScroll } from "@/components/ui/parallax.scroll";
import { api } from "@/trpc/server";

interface LeaderboardsProps {
  className?: string;
  search?: string;
  tags?: string;
}

export async function Leaderboards({
  className,
  search,
  tags,
}: LeaderboardsProps) {
  const mysteries = await api.mystery
    .getMysteries({
      search: search ?? undefined,
      tags: tags ? tags.split(",") : undefined,
    })
    .catch(() => []);

  return <ParallaxScroll className={className} items={mysteries} />;
}
