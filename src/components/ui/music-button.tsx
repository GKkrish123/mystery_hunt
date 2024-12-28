"use client";

import { type FC, memo, type ReactNode, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, XIcon } from "lucide-react";
import YoutubeColor from "@/components/icons/lottie/YoutubeColor.json";
import YoutubeColorDark from "@/components/icons/lottie/YoutubeColorDark.json";
import MusicBlack from "@/components/icons/lottie/MusicBlack.json";
import MusicWhite from "@/components/icons/lottie/MusicWhite.json";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import { Button } from "./button";
import { useTheme } from "next-themes";
import TypingAnimation from "./typing-animation";
import { PlayerState, useYoutube } from "@/hooks/use-youtube";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

const CONTAINER_SIZE = 200;

const playlistId = "PLtTWsPB9EYIt-2NdKICG3X6eYUJ4jNw7N";

const YTLINK = `https://music.youtube.com/playlist?list=${playlistId}`;

interface FamilyButtonProps {
  children?: React.ReactNode;
}

function createRandomGenerator(min: number, max: number): () => number {
  if (min >= max) return () => 0;

  // Track previously generated numbers to reduce repetition
  const rangeSize = max - min + 1;
  const cache = new Set<number>();

  return function generateRandom(): number {
    // Reset cache if all numbers are used
    if (cache.size === rangeSize) cache.clear();

    let randomNumber: number;

    do {
      randomNumber = Math.floor(Math.random() * rangeSize) + min;
    } while (cache.has(randomNumber));

    cache.add(randomNumber);
    return randomNumber;
  };
}

export const MusicButton: React.FC<FamilyButtonProps> = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const { resolvedTheme } = useTheme();
  const { playerDetails, actions } = useYoutube({
    id: playlistId,
    type: "playlist",
    options: {
      shuffle: true,
      loop: true,
    },
  });

  const randomSongNumber = createRandomGenerator(
    0,
    playerDetails.playlistCount - 1,
  );

  const title =
    playerDetails?.title?.length > 40
      ? playerDetails.title.substring(0, 50) + "..."
      : playerDetails.title || "";

  return (
    <div className="fixed bottom-2 right-2 z-10 md:bottom-3 md:right-3">
      <div
        className={cn(
          "rounded-[24px] border border-black/10 shadow-sm dark:border-yellow-400/20",
          "bg-white dark:bg-black",
          isExpanded ? "w-[180px]" : "",
        )}
      >
        <div className="rounded-[23px] border border-black/10">
          <div className="rounded-[22px] border border-white/50 dark:border-stone-800">
            <div className="flex items-center justify-center rounded-[21px] border border-neutral-950/20">
              <FamilyButtonContainer
                isExpanded={isExpanded}
                toggleExpand={toggleExpand}
                theme={resolvedTheme}
                playerDetails={playerDetails}
              >
                {isExpanded ? (
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.3,
                        duration: 0.4,
                        ease: "easeOut",
                      },
                    }}
                    className="relative flex size-full flex-col items-center p-2 pb-1"
                  >
                    <Lottie
                      className="h-14 w-14"
                      animationData={
                        resolvedTheme === "dark"
                          ? YoutubeColorDark
                          : YoutubeColor
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(YTLINK, "_blank");
                      }}
                      autoplay={playerDetails.state === PlayerState.PLAYING}
                      loop={playerDetails.state === PlayerState.PLAYING}
                    />
                    <TypingAnimation
                      className="flex-1 content-center text-center font-mono text-sm font-normal tracking-[-0.02em] text-black drop-shadow-sm dark:text-white"
                      text={title}
                    />
                    <div className="mt-auto flex gap-2 pt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-secondary-foreground/90 p-1 hover:bg-secondary-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          actions.stopVideo();
                          actions.playVideo();
                        }}
                      >
                        <SkipBack className="h-4 w-4 text-white dark:text-black" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-secondary-foreground/90 p-1 hover:bg-secondary-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          if (playerDetails.state === PlayerState.PLAYING) {
                            actions.pauseVideo();
                          } else {
                            actions.playVideo();
                          }
                        }}
                      >
                        {playerDetails.state === PlayerState.PLAYING ? (
                          <Pause className="h-4 w-4 text-white dark:text-black" />
                        ) : (
                          <Play className="h-4 w-4 text-white dark:text-black" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-secondary-foreground/90 p-1 hover:bg-secondary-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          actions.playVideoAt(randomSongNumber());
                        }}
                      >
                        <SkipForward className="h-4 w-4 text-white dark:text-black" />
                      </Button>
                    </div>
                  </MotionDiv>
                ) : null}
              </FamilyButtonContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MusicButton.displayName = "MusicButton";

// A container that wraps content and handles animations
interface FamilyButtonContainerProps {
  isExpanded: boolean;
  toggleExpand: () => void;
  children: ReactNode;
  theme?: string;
  playerDetails?: { state: PlayerState };
}

const FamilyButtonContainer: FC<FamilyButtonContainerProps> = ({
  isExpanded,
  toggleExpand,
  children,
  playerDetails,
  theme,
}) => {
  return (
    <MotionDiv
      className={cn(
        "relative z-10 flex cursor-pointer flex-col items-center justify-center space-y-1 border border-white/10 bg-transparent text-white shadow-lg",
        !isExpanded ? "" : "",
      )}
      layoutRoot
      layout
      initial={{ borderRadius: 21, width: "2rem", height: "2rem" }}
      animate={
        isExpanded
          ? {
              borderRadius: 20,
              width: CONTAINER_SIZE,
              height: CONTAINER_SIZE + 50,

              transition: {
                type: "spring",
                damping: 25,
                stiffness: 400,
                when: "beforeChildren",
              },
            }
          : {
              borderRadius: 21,
              width: "2rem",
              height: "2rem",
            }
      }
    >
      {children}
      <MotionDiv
        animate={{
          transition: {
            type: "tween",
            ease: "easeOut",
            duration: 0.2,
          },
        }}
        style={{
          left: isExpanded ? "" : "50%",
          bottom: 0.5,
        }}
      >
        {isExpanded ? (
          <MotionDiv
            className="group rounded-full border bg-neutral-800/50 p-[10px] text-orange-50 shadow-2xl transition-colors duration-300 hover:border-neutral-200 dark:bg-black/50"
            onClick={toggleExpand}
            layoutId="expand-toggle"
            initial={false}
            animate={{
              rotate: -360,
              transition: {
                duration: 0.4,
              },
            }}
          >
            <XIcon
              className={cn(
                "h-4 w-4 text-black transition-colors duration-200 group-hover:text-neutral-500 dark:text-white",
              )}
            />
          </MotionDiv>
        ) : (
          <MotionDiv
            className={cn(
              "flex items-center justify-center rounded-full",
              // "group border border-cyan-100/10 bg-neutral-200 p-[10px] text-cyan-50 shadow-2xl transition-colors duration-200 dark:bg-cyan-500/90",
            )}
            style={{ borderRadius: 24 }}
            onClick={toggleExpand}
            layoutId="expand-toggle"
            initial={{ rotate: 0 }}
            animate={{
              rotate: 360,
              transition: {
                duration: 0.4,
              },
            }}
          >
            {/* <Music className="h-4 w-4 text-black" /> */}
            <Lottie
              className="h-12 w-12"
              animationData={theme === "dark" ? MusicWhite : MusicBlack}
              autoplay={playerDetails?.state === PlayerState.PLAYING}
              loop={playerDetails?.state === PlayerState.PLAYING}
            />
          </MotionDiv>
        )}
      </MotionDiv>
    </MotionDiv>
  );
};
