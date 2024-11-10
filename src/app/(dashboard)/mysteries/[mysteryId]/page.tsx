// app/mystery/[mysteryId]/page.tsx
import { notFound } from 'next/navigation';
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import BlurIn from '@/components/ui/blur-in';
import HyperText from '@/components/ui/hyper-text';
import { DotPattern } from "@/components/ui/dot-pattern";
import AvatarCircles from '@/components/ui/avatar-circles';
import FlickeringGrid from '@/components/ui/flickering-grid';

interface MysteryPageProps {
  params: {
    mysteryId: string;
  };
}

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

// Simulate fetching mystery data by ID (could be from a DB or API)
async function getMysteryById(mysteryId: string) {
  // Example mock data; replace this with your actual data fetching logic
  const mockMysteries = [
    { id: '1', title: 'The Vanishing Act', description: 'A mystery of a missing person.' },
    { id: '2', title: 'The Cursed Amulet', description: 'An ancient relic with dangerous powers.' },
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
    <div className="relative grid-rows-[55px] md:grid-rows-[65px] grid grid-cols-1 h-full gap-4 sm:grid-cols-4 md:grid-cols-6 overflow-hidden">
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
      {/* <div className='relative flex'>
        <BlurIn
        word="The Mystery of Black Hole"
        className="absolute left-1/2 transform -translate-x-1/2 h-8 md:h-12 text-2xl md:text-3xl font-bold text-black dark:text-white"
        />
        <AvatarCircles className='ml-auto' numPeople={99} avatarUrls={avatarUrls} />
        </div> */}
      <div className='col-span-full'>
        <BlurIn
          word="The Mystery of Black Hole"
          className="mx-auto block h-8 md:h-12 text-2xl md:text-3xl font-bold text-black dark:text-white"
        />
        <HyperText
          wrapperClassName="justify-center"
          className="text-lg md:text-xl text-black dark:text-white"
          text="Beyond the stars, where light is bound, In the heart of shadows, a secret’s found. Dare to seek where none return, the void will show what you must learn."
        />
      </div>
      {/* <div className="relative self-end h-[200px] col-span-full sm:col-start-2 sm:col-span-1 md:col-start-3 md:col-span-2 rounded-lg w-full bg-background overflow-hidden border">
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={800}
          width={800}
        />
      </div> */}
    </div>
  );
}
