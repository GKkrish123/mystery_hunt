import { notFound } from "next/navigation";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { MysteryForm } from "@/components/mystery-form";
import { api } from "@/trpc/server";

interface MysteryPageProps {
  params: Promise<{ mysteryId: string }>;
}

export default async function MysteryPage({ params }: MysteryPageProps) {
  const { mysteryId } = await params;
  const mystery = await api.mystery
    .getMysteryById({ mysteryId })
    .catch(() => null);

  if (!mystery) {
    notFound();
  }

  return (
    <>
      <div className="relative h-full px-3 pb-3 pt-0 md:px-4 md:pb-4">
        <MysteryForm mystery={mystery} />
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "z-[-1] [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12",
        )}
      />
    </>
  );
}
