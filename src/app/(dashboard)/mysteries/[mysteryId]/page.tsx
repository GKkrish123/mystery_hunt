// app/mystery/[mysteryId]/page.tsx
import { notFound } from "next/navigation";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import BlurIn from "@/components/ui/blur-in";
import HyperText from "@/components/ui/hyper-text";
import { DotPattern } from "@/components/ui/dot-pattern";
import AvatarCircles from "@/components/ui/avatar-circles";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { SecretInput } from "@/components/ui/secret-input";
import { Badge } from "@/components/ui/badge";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { SecretButton } from "@/components/ui/secret-button";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { MysteryForm } from "@/components/mystery-form";

interface MysteryPageProps {
  params: {
    mysteryId: string;
  };
}

// const avatarUrls = [
//   "https://avatars.githubusercontent.com/u/16860528",
//   "https://avatars.githubusercontent.com/u/20110627",
//   "https://avatars.githubusercontent.com/u/106103625",
// ];

const avatars = [
  {
    id: 1,
    name: "John Doe",
    designation: "I'm the boss",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Merry Christmas",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "God of War",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
]

const badges = ["space", "dark", "science"];

// Simulate fetching mystery data by ID (could be from a DB or API)
async function getMysteryById(mysteryId: string) {
  // Example mock data; replace this with your actual data fetching logic
  const mockMysteries = [
    {
      id: "1",
      title: "The Vanishing Act",
      description: "A mystery of a missing person.",
    },
    {
      id: "2",
      title: "The Cursed Amulet",
      description: "An ancient relic with dangerous powers.",
    },
  ];

  return mockMysteries.find((mystery) => mystery.id === mysteryId) || null;
}

export default async function MysteryPage({ params }: MysteryPageProps) {
  const { mysteryId } = await params;

  // Fetch the mystery based on the ID
  const mystery = await getMysteryById(mysteryId);

  // Handle not found case
  if (!mystery) {
    notFound(); // Redirect to a 404 page if the mystery is not found
  }

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12",
        )}
      />
      {/* <div className="relative grid-rows-[55px] md:grid-rows-[65px] grid grid-cols-1 h-full gap-4 sm:grid-cols-4 md:grid-cols-6"> */}
      <MysteryForm />
    </div>
  );
}
