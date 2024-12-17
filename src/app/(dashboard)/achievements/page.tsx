import { BackgroundLines } from "@/components/backrgound-lines";
import { SparklesText } from "@/components/ui/sparkles-text";
import { LightBoard } from "@/components/ui/lightboard";
import { FocusCards } from "@/components/ui/focus-cards";
import { CoolMode } from "@/components/ui/cool-mode";

const cards = [
  {
    title: "The Art of Reusability 1",
    src: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
  },
  {
    title: "React Rendezvous 2",
    src: "https://i.postimg.cc/zv6qrqWQ/c32b786b1c47426e88f8f9e7c757dc93-free.png",
  },
  {
    title: "Async Awakenings 3",
    src: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
  },
  {
    title: "Stateful Symphony 4",
    src: "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    title: "Async Awakenings 5",
    src: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
  },
  {
    title: "The Art of Reusability 6",
    src: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
  },
  {
    title: "Async Awakenings 7",
    src: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
  },
  {
    title: "Stateful Symphony 8",
    src: "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    title: "Async Awakenings 9",
    src: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
  },
  {
    title: "The Art of Reusability 12",
    src: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
  },
  {
    title: "Stateful Symphony 11",
    src: "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
];

export default function AchievementsPage() {
  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <CoolMode>
          <SparklesText
            text="Achievements"
            sparklesCount={5}
            className="col-span-full mx-auto h-8 cursor-pointer text-2xl font-bold text-black dark:text-white md:h-10 md:text-3xl"
          />
        </CoolMode>
        <LightBoard
          className="col-span-full"
          text="Nee Thaam Ley"
          updateInterval={40}
        />
        <FocusCards className="col-span-full" cards={cards} />
      </div>
      <BackgroundLines />
    </>
  );
}
