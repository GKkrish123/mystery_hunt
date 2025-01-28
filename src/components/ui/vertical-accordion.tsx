"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { div as MotionDiv } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";
import { useViewportSize } from "@mantine/hooks";
import {
  CalendarRange,
  ChartColumnStacked,
  LockKeyhole,
  Stars,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import ShineBorder from "./shine-border";

const items: ItemProps[] = [
  {
    id: 1,
    title: "Mysteryverse",
    Icon: Stars,
    imgSrc:
      "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/help_mysteries.jpeg",
    description:
      "Mysteryverse is a platform for mystery enthusiasts to solve thrilling puzzles. Each mystery offers clues to help you uncover hidden secret letters. But be cautious—your points decay with time, and you have limited attempts to solve each mystery!",
  },
  {
    id: 2,
    title: "Categories",
    Icon: ChartColumnStacked,
    imgSrc:
      "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/help_categories.jpeg",
    description:
      "Mysteries are organized into categories based on themes or languages. A mystery can belong to multiple categories. Categories allow you to explore mysteries in your preferred theme or langauge.",
  },
  {
    id: 3,
    title: "Secret Letters",
    Icon: LockKeyhole,
    imgSrc:
      "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/help_secret.jpeg",
    description:
      "Secret letters are always in lowercase. Spaces can be ignored, but other special characters can be entered as they are. Depending on the category, the secret letters can be in regional languages, such as Tamil. Regional keyboard inputs are also supported.",
  },
  {
    id: 4,
    title: "Events and Prizes",
    Icon: CalendarRange,
    imgSrc:
      "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/help_events.jpeg",
    description:
      "Events are time-limited challenges where you can participate and solve mysteries within a specific time frame. Once the event concludes, the top scorers are rewarded with mysterious prizes!",
  },
  {
    id: 5,
    title: "Leaderboards",
    Icon: Trophy,
    imgSrc:
      "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/help_leaderboards.jpeg",
    description:
      "The leaderboards display the top mystery hunters based on their performance across different regions and events. Keep an eye on your rank, compete with others, and strive to reach the top to earn rewards and recognition!",
  },
];

interface ItemProps {
  id: number;
  Icon: LucideIcon;
  title: string;
  imgSrc: string;
  description: string;
}

const VerticalAccordion = () => {
  const [open, setOpen] = useState<number>(items?.[0]?.id ?? 0);

  return (
    <ShineBorder
      duration={7}
      className="w-fit overflow-hidden rounded-lg bg-[rgb(0,0,0)]/[.03] p-0 shadow-lg dark:bg-[rgb(255,255,255)]/[.03] md:shadow-xl"
      borderClassName="z-[15]"
    >
      <div className="mx-auto flex h-fit w-full max-w-6xl flex-col overflow-hidden rounded-lg shadow lg:h-[450px] lg:flex-row">
        {items.map((item) => {
          return (
            <Panel
              key={item.id}
              open={open}
              setOpen={setOpen}
              id={item.id}
              Icon={item.Icon}
              title={item.title}
              imgSrc={item.imgSrc}
              description={item.description}
            />
          );
        })}
      </div>
    </ShineBorder>
  );
};

interface PanelProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  id: number;
  Icon: LucideIcon;
  title: string;
  imgSrc: string;
  description: string;
}

const Panel = ({
  open,
  setOpen,
  id,
  Icon,
  title,
  imgSrc,
  description,
}: PanelProps) => {
  const { width } = useViewportSize();
  const isOpen = open === id;

  return (
    <>
      <button
        className="group relative flex flex-row-reverse items-center justify-end gap-4 p-3 transition-colors hover:bg-[rgb(0,0,0)]/[.05] dark:hover:bg-[rgb(255,255,255)]/[.05] lg:flex-col"
        onClick={() => setOpen(id)}
      >
        <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden rotate-180 text-lg font-light lg:block lg:text-xl"
        >
          {title}
        </span>
        <span className="block text-lg font-light lg:hidden lg:text-xl">
          {title}
        </span>
        <div className="grid aspect-square w-6 place-items-center text-black dark:text-white lg:w-full">
          <Icon />
        </div>
        <span className="absolute bottom-0 right-[50%] z-10 h-4 w-4 translate-x-[50%] translate-y-[50%] rotate-45 bg-zinc-700 transition-colors group-hover:bg-zinc-700 dark:bg-slate-100 dark:group-hover:bg-slate-50 lg:bottom-[50%] lg:right-0" />
      </button>

      {isOpen && (
        <LazyMotion features={domAnimation} strict>
          <AnimatePresence propagate>
            <MotionDiv
              key={`panel-${id}`}
              variants={width && width > 1024 ? panelVariants : panelVariantsSm}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                backgroundImage: `url(${imgSrc})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              className="relative flex h-full w-full items-end overflow-hidden bg-black"
            >
              <LazyMotion features={domAnimation} strict>
                <AnimatePresence propagate>
                  <MotionDiv
                    variants={descriptionVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="bg-black/40 px-4 py-2 text-white backdrop-blur-sm"
                  >
                    <p>{description}</p>
                  </MotionDiv>
                </AnimatePresence>
              </LazyMotion>
            </MotionDiv>
          </AnimatePresence>
        </LazyMotion>
      )}
    </>
  );
};

export default VerticalAccordion;

const panelVariants = {
  open: {
    width: "100%",
    height: "100%",
  },
  closed: {
    width: "0%",
    height: "100%",
  },
};

const panelVariantsSm = {
  open: {
    width: "100%",
    height: "230px",
  },
  closed: {
    width: "100%",
    height: "0px",
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "100%" },
};
