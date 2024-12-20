"use client";

import { memo, useEffect, useMemo } from "react";
import {
  type AnimationControls,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
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
  controls: AnimationControls;
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
      rotateY: [rotation.get(), rotation.get() + 360], // Use current value as the starting point
      transition: {
        // rotateY: [rotation.get(), rotation.get() + 360], // Ensure it continues smoothly
        repeat: Infinity,
        ease: "linear",
        duration: 40, // Adjust for slow rotation
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
        willChange: "transform",
      }}
    >
      <motion.div
        drag={isCarouselActive ? "x" : false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
        }}
        onClick={async () => {
          controls.stop();
          await startSlowRotation();
        }}
        onDrag={(_, info) => {
          controls.stop();
          if (isCarouselActive)
            rotation.set(rotation.get() + info.offset.x * 0.007);
        }}
        onDragEnd={async (_, info) => {
          if (isCarouselActive) {
            await controls?.start({
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
        {cards.map((imgUrl, i) => (
          <motion.div
            key={`key-${imgUrl}-${i}`}
            className="bg-mauve-dark-2 absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${
                i * (360 / faceCount)
              }deg) translateZ(${radius}px)`,
            }}
            onPointerDown={() => handleClick(imgUrl, i)}
          >
            {/* <motion.img
                    src={imgUrl}
                    alt={`keyword_${i} ${imgUrl}`}
                    layoutId={`img-${imgUrl}`}
                    className="pointer-events-none w-full rounded-xl object-cover dark:border-zinc-600 border border-zinc-300"
                    initial={{ filter: "blur(4px)" }}
                    layout="position"
                    animate={{ filter: "blur(0px)" }}
                    transition={transition}
                    /> */}
            <CardContainer className="w-full">
              <CardItem translateZ="100" className="w-full">
                <ShineBorder
                  className="w-full min-w-0 p-0"
                  borderRadius={10}
                  borderWidth={1.5}
                  duration={7}
                  // color={resolvedTheme === "dark" ? "white" : "black"}
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

function ThreeDPhotoCarousel() {
  // const [isCarouselActive, setIsCarouselActive] = useState(true);
  const isCarouselActive = true;
  const controls = useAnimation();
  const cards = useMemo(
    () => keywords.map((keyword) => `https://picsum.photos/200/300?${keyword}`),
    [],
  );

  useEffect(() => {
    console.log("Cards loaded:", cards);
  }, [cards]);

  const handleClick = () => {
    controls.stop();
  };

  return (
    <motion.div layout className="relative -mt-2 md:-mt-20">
      <div className="relative h-[350px] w-full">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={cards}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  );
}

export { ThreeDPhotoCarousel };
