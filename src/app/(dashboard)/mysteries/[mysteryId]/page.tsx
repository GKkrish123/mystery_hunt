import { notFound } from "next/navigation";
import { api } from "@/trpc/server";

import { default as dynamicImport } from "next/dynamic";

const MysteryForm = dynamicImport(() =>
  import("@/components/mystery-form").then((mod) => mod.MysteryForm),
);
const MysteryEffects = dynamicImport(() =>
  import("@/components/effects/mystery").then((mod) => mod.default),
);

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
      <MysteryEffects />
    </>
  );
}

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mysteryverse",
  description: "This is mystery page of Mysteryverse",
};
