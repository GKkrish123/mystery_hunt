"use client";

import { memo, useEffect, useMemo } from "react";
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
import { CardContainer, CardItem } from "./three-d-card";
import Image from "next/image";

const keywords = [
  "night",
  "city",
  "sky",
  "sunset",
  "sunrise",
  "winter",
  "skyscraper",
  "building",
  "cityscape",
  "architecture",
  "street",
  "lights",
  "downtown",
  "bridge",
];

const Carousel = memo(function CarouselComponent({
  handleClick,
  controls,
  cards,
  isCarouselActive,
}: {
  handleClick: (imgUrl: string, index: number) => void;
  controls: ReturnType<typeof useAnimation>;
  cards: string[];
  isCarouselActive: boolean;
}) {
  const isMobile = useIsMobile();
  const cylinderWidth = isMobile ? 1500 : 2000;
  const faceCount = cards.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);

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
        duration: 40,
      },
    });
  };

  useEffect(() => {
    void startSlowRotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
            onClick={async () => {
              controls.stop();
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
                    damping: 30,
                    mass: 0.5,
                  },
                });
              }
              controls.stop();
              await startSlowRotation();
            }}
            animate={controls}
          >
            {cards.map((imgUrl, index) => (
              <LazyMotion
                key={`key-${imgUrl}-${index}`}
                features={domAnimation}
                strict
              >
                <AnimatePresence propagate>
                  <MotionDiv
                    className="bg-mauve-dark-2 absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
                    style={{
                      width: `${faceWidth}px`,
                      transform: `rotateY(${
                        index * (360 / faceCount)
                      }deg) translateZ(${radius}px)`,
                    }}
                    onPointerDown={() => handleClick(imgUrl, index)}
                  >
                    <CardContainer className="w-full">
                      <CardItem translateZ="100" className="w-full">
                        <ShineBorder
                          className="w-full min-w-0 p-0"
                          borderRadius={10}
                          borderWidth={1.5}
                          duration={7}
                          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                        >
                          <Image
                            src={imgUrl}
                            height={300}
                            width={300}
                            className="pointer-events-none h-36 w-full rounded-xl object-cover group-hover/card:shadow-xl md:h-64"
                            alt="thumbnail"
                          />
                        </ShineBorder>
                      </CardItem>
                    </CardContainer>
                  </MotionDiv>
                </AnimatePresence>
              </LazyMotion>
            ))}
          </MotionDiv>
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
});

const ThreeDPhotoCarousel = () => {
  const isCarouselActive = true;
  const controls = useAnimation();
  const cards = useMemo(
    () => keywords.map((keyword) => `https://picsum.photos/200/300?${keyword}`),
    [],
  );

  const handleClick = () => {
    controls.stop();
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate>
        <MotionDiv layout className="relative -mt-2 md:-mt-20">
          <div className="relative h-[350px] w-full">
            <Carousel
              handleClick={handleClick}
              controls={controls}
              cards={cards}
              isCarouselActive={isCarouselActive}
            />
          </div>
        </MotionDiv>
      </AnimatePresence>
    </LazyMotion>
  );
};

export { ThreeDPhotoCarousel };
