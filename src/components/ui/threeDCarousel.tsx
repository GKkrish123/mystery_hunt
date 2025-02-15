"use client";

import { memo, useEffect, useState } from "react";
import {
  useAnimation,
  useMotionValue,
  useTransform,
  domAnimation,
  LazyMotion,
  domMax,
  AnimatePresence,
} from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { useIsMobile } from "@/hooks/use-mobile";
import ShineBorder from "./shine-border";
import Image from "next/image";
import { useSidebar } from "./sidebar";
import { SpringModal } from "./spring-model";

const cards = [
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Mysteries.jpeg",
    title: "Mysteries",
    description:
      "Puzzles to uncover secret letters using clues for certain points, under challenging conditions.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Secrets.jpeg",
    title: "Secrets",
    description:
      "Secret letters can be anything except spaces. [e.g.] 'The Secret 35' → 11 letters.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Categories.jpeg",
    title: "Categories",
    description:
      "Mysteries are tagged into various categories based on genres and languages.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Events.jpeg",
    title: "Events",
    description:
      "Limited-time or seasonal challenges featuring a set of mysteries added at specific intervals.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Leaderboards.jpeg",
    title: "Leaderboards",
    description:
      "Hunters are ranked based on points and can filter rankings by location or event.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Time.jpeg",
    title: "Time",
    description:
      "Some mysteries have points which decay over time. [e.g.] Max 200 points. Decay: 1 point/10 min before the first solve, 1 point/3 min after.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Languages.jpeg",
    title: "Languages",
    description:
      "Mysteries tagged with regional languages can be solved using respective keyboard inputs. [e.g.] தமிழ்",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Audio.jpeg",
    title: "Audio",
    description:
      "Mysteries may include audio, video, or links pointing to related websites for additional clues.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Gifts.jpeg",
    title: "Gifts",
    description:
      "Top-scoring hunters in events are rewarded with prizes and notified via email.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Limited.jpeg",
    title: "Limited",
    description:
      "Mysteries have limited attempts to test your secret key and cannot be retried frequently.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Favourites.jpeg",
    title: "Favourites",
    description:
      "Mysteries and categories can be added to favourites, marked with dedicated emblems.",
  },
  {
    img: "https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/carousel/Intent.jpeg",
    title: "Vision",
    description:
      "The journey of discovering secrets should also be about gaining knowledge, not just winning. Be restless and responsible!",
  },
];

const Carousel = memo(function CarouselComponent({
  controls,
  isCarouselActive,
}: {
  handleClick: (imgUrl: string, index: number) => void;
  controls: ReturnType<typeof useAnimation>;
  isCarouselActive: boolean;
}) {
  const [openIndex, setOpenIndex] = useState(-1);
  const isMobile = useIsMobile();
  const cylinderWidth = isMobile ? 1500 : 2000;
  const faceCount = cards.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  const { openMobile } = useSidebar();

  const rotation = useMotionValue(0);
  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`,
  );

  const startSlowRotation = async () => {
    await controls.start({
      rotateY: [rotation.get(), rotation.get() + 360],
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 50,
      },
    });
  };

  useEffect(() => {
    if (!openMobile) {
      void startSlowRotation();
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMobile]);

  useEffect(() => {
    if (openIndex === -1) {
      void startSlowRotation();
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  return (
    <>
      <div
        className="bg-mauve-dark-2 flex h-full items-center justify-center"
        style={{
          perspective: isMobile ? "500px" : "250px",
          transformStyle: "preserve-3d",
        }}
      >
        <LazyMotion features={domMax} strict>
          <AnimatePresence propagate>
            <MotionDiv
              drag={isCarouselActive ? "x" : false}
              className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
              style={{
                transform: transform as unknown as string,
                rotateY: rotation as unknown as string,
                width: cylinderWidth,
                transformStyle: "preserve-3d",
              }}
              onPointerDown={async () => {
                controls.stop();
              }}
              onPointerUp={async () => {
                await startSlowRotation();
              }}
              onDrag={(_, info) => {
                controls.stop();
                if (isCarouselActive) {
                  rotation.set(rotation.get() + info.offset.x * 0.007);
                }
              }}
              onDragEnd={async (_, info) => {
                if (isCarouselActive) {
                  await controls.start({
                    rotateY: rotation.get() + info.velocity.x * 0.007,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 5,
                      mass: 0.2,
                    },
                  });
                }
                controls.stop();
                await startSlowRotation();
              }}
              animate={controls}
            >
              {cards.map((card, index) => (
                <LazyMotion
                  key={`key-${card.title}-${index}`}
                  features={domAnimation}
                  strict
                >
                  <AnimatePresence propagate>
                    <MotionDiv
                      className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2 antialiased ![transform-style:preserve-3d] hover:scale-[1]"
                      style={{
                        width: `${faceWidth}px`,
                        transform: `rotateY(${
                          index * (360 / faceCount)
                        }deg) translateZ(${radius}px)`,
                      }}
                      onClick={() => setOpenIndex(index)}
                    >
                      <ShineBorder
                        className="w-full min-w-0 cursor-pointer p-[0.1rem] antialiased transition ease-in-out hover:scale-[1.1]"
                        borderClassName="antialiased"
                        borderRadius={14}
                        borderWidth={1.5}
                        duration={7}
                        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                      >
                        <Image
                          src={card.img}
                          height={300}
                          width={200}
                          className="pointer-events-none h-36 w-full rounded-xl object-fill antialiased group-hover/card:shadow-xl md:h-64 md:scale-x-[-1]"
                          alt={card.title}
                        />
                      </ShineBorder>
                    </MotionDiv>
                  </AnimatePresence>
                </LazyMotion>
              ))}
            </MotionDiv>
          </AnimatePresence>
        </LazyMotion>
      </div>
      <SpringModal
        isOpen={openIndex !== -1}
        setIsOpen={setOpenIndex}
        title={cards[openIndex]?.title ?? ""}
        description={cards[openIndex]?.description ?? ""}
      />
    </>
  );
});

const ThreeDPhotoCarousel = () => {
  const isCarouselActive = true;
  const controls = useAnimation();

  const handleClick = () => {
    controls.stop();
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate>
        <MotionDiv layout className="relative -mt-4 md:-mt-20">
          <div className="relative h-[350px] w-full">
            <Carousel
              handleClick={handleClick}
              controls={controls}
              isCarouselActive={isCarouselActive}
            />
          </div>
        </MotionDiv>
      </AnimatePresence>
    </LazyMotion>
  );
};

export { ThreeDPhotoCarousel };
