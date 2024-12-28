"use client";

import React, {
  memo,
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useGesture } from "@use-gesture/react";
import { type Mystery } from "@/server/model/mysteries";
import { type MysteryFormValues } from "@/server/constants";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";
import confetti from "canvas-confetti";

import { default as dynamicImport } from "next/dynamic";

const BlurIn = dynamicImport(
  () => import("@/components/ui/blur-in").then((mod) => mod.default),
  { ssr: false },
);
const HyperText = dynamicImport(
  () => import("@/components/ui/hyper-text").then((mod) => mod.default),
  { ssr: false },
);
const SecretInput = dynamicImport(
  () => import("@/components/ui/secret-input").then((mod) => mod.SecretInput),
  { ssr: false },
);
const Badge = dynamicImport(
  () => import("@/components/ui/badge").then((mod) => mod.Badge),
  { ssr: false },
);
const AnimatedTooltip = dynamicImport(
  () =>
    import("@/components/ui/animated-tooltip").then(
      (mod) => mod.AnimatedTooltip,
    ),
  { ssr: false },
);
const SecretButton = dynamicImport(
  () => import("@/components/ui/secret-button").then((mod) => mod.SecretButton),
  { ssr: false },
);
const Vortex = dynamicImport(() => import("./ui/vortex"), { ssr: false });
const NumberTicker = dynamicImport(() => import("./ui/number-ticker"), {
  ssr: false,
});
const ShineBorder = dynamicImport(() => import("./ui/shine-border"), {
  ssr: false,
});

interface DragCardsProps {
  items: string[];
}

const DragCards = memo(
  function DragCards({ items }: DragCardsProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
      <div className="absolute inset-0 z-10" ref={containerRef}>
        {items.map((item, index) => {
          const randomRotate = Math.floor(Math.random() * 20) - 10;
          const randomTop = Math.floor(Math.random() * 40) + 10;
          const randomLeft = Math.floor(Math.random() * 30) + 10;

          return (
            <Card
              key={`drag-card-${index}`}
              containerRef={containerRef}
              src={item}
              alt={`Drag card image ${index}`}
              rotate={randomRotate}
              top={`${randomTop}%`}
              left={`${randomLeft}%`}
              className="w-36 md:w-56"
            />
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items);
  },
);

interface Props {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: number;
  className?: string;
}

const Card = ({
  containerRef,
  src,
  alt,
  top,
  left,
  rotate: initialRotate,
  className,
}: Props) => {
  const [zIndex, setZIndex] = useState(0);
  const [rotate, setRotate] = useState(initialRotate);
  // const [scale, setScale] = useState(1);
  const target = useRef<HTMLDivElement>(null);
  const [forRotation, setForRotation] = useState(false);
  const initialAngleRef = useRef(0); // Store initial angle when dragging starts
  const initialRotationRef = useRef(0);

  const updateZIndex = (e: React.MouseEvent<HTMLDivElement>) => {
    const els = document.querySelectorAll(".drag-elements");

    let maxZIndex = -Infinity;

    els.forEach((el) => {
      const zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index"),
      );

      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    setZIndex(maxZIndex + 1);
    const rect = target.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    initialAngleRef.current = getAngle(centerX, centerY, e.clientX, e.clientY);
    initialRotationRef.current = rotate;
  };

  const getAngle = (cx: number, cy: number, x: number, y: number) => {
    // Calculate angle between center and mouse
    const dx = x - cx;
    const dy = y - cy;
    return Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
  };

  const handleMouseRotation = (event: React.MouseEvent<HTMLDivElement>) => {
    if (forRotation && event.shiftKey) {
      const rect = target.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const currentAngle = getAngle(
        centerX,
        centerY,
        event.clientX,
        event.clientY,
      );
      const angle =
        initialRotationRef.current + (currentAngle - initialAngleRef.current);
      setRotate(angle);
    }
  };

  useGesture(
    {
      onPinch: ({
        movement: [
          // scale
        ],
        offset: [_, angle],
      }) => {
        // setScale(scale);
        setRotate(angle);
      },
    },
    {
      target,
    },
  );

  return (
    <motion.div
      className="drag-elements absolute"
      ref={target}
      style={{
        top,
        left,
        rotate: `${rotate}deg`, // Apply rotation dynamically
        zIndex,
      }}
      drag={!forRotation}
      dragConstraints={containerRef}
      dragElastic={0.65}
      onPointerOut={() => {
        setForRotation(false);
      }}
      onPointerUp={() => {
        setForRotation(false);
      }}
      onPointerMove={handleMouseRotation} // Track mouse movement for rotation
      onPointerDown={(e) => {
        e.preventDefault();
        updateZIndex(e);
        if (e.pointerType === "mouse" && e.shiftKey) {
          setForRotation(true);
        }
      }}
    >
      <motion.img
        className={twMerge("w-48 bg-neutral-200 p-1 pb-4", className)}
        src={src}
        alt={alt}
      />
    </motion.div>
  );
};

interface MysteryFormProps {
  mystery: Mystery & MysteryFormValues;
}

export function MysteryForm({ mystery }: MysteryFormProps) {
  const [secretInput, setSecretInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = api.mystery.recordMysteryView.useMutation();

  useEffect(() => {
    void (async () => {
      try {
        await mutateAsync({ mysteryId: mystery.id });
      } catch (error) {
        console.error("Failed to record mystery view", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const end = Date.now() + 3 * 1000;
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

      const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
      };

      const shoot = () => {
        void confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ["star"],
        });

        void confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ["circle"],
        });
      };

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);

      const frame = () => {
        if (Date.now() > end) return;

        void confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });

        void confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      setTimeout(frame, 700);

      const somePoppers = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
        };

        const randomInRange = (min: number, max: number) =>
          Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          void confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          void confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);
      };

      setTimeout(somePoppers, 1500);
    }, 2000);
  };

  return (
    <div className="relative grid h-full auto-rows-min grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7 md:gap-3">
      <BlurIn
        word={mystery.title}
        className={cn(
          "col-span-full mx-auto block min-h-8 text-2xl font-bold text-black dark:text-white md:min-h-12 md:text-3xl",
          mysteryFont.className,
        )}
      />
      <div className="col-span-1 flex flex-wrap content-center items-center gap-1 md:col-span-2">
        {mystery.tags.map((badge) => (
          <Badge
            key={`badge-${badge}`}
            className="h-4 px-1 text-[10px] md:px-2"
          >
            {badge.slice(0, 1).toUpperCase() + badge.slice(1)}
          </Badge>
        ))}
      </div>
      <div className="col-span-1 col-start-2 flex flex-col items-center justify-center gap-1 sm:col-span-2 md:col-span-3 md:col-start-3">
        <span className="text-xs md:text-sm">Unlock Attempts</span>
        <NumberTicker
          className="text-sm font-bold md:text-base"
          value={mystery.guessCount}
        />
      </div>
      <div className="col-span-1 col-start-3 ml-auto flex flex-row-reverse items-center pr-5 sm:col-start-4 md:col-span-2 md:col-start-6">
        <AnimatedTooltip items={mystery.topThree} />
      </div>
      <div className="col-span-full">
        <HyperText
          duration={200}
          wrapperClassName="justify-center"
          className="text-lg text-black dark:text-white md:text-xl"
          text={mystery.question}
        />
      </div>
      <ShineBorder
        className="relative col-span-full grid h-[500px] w-full place-content-center overflow-hidden rounded-lg border bg-[rgb(255,255,255)]/[.50] dark:bg-[rgb(0,0,0)]/[.50] md:shadow-xl"
        borderClassName="z-[15]"
      >
        <Vortex
          backgroundColor="transparent"
          baseHue={210}
          particleCount={300}
        ></Vortex>
        <DragCards items={mystery.attachments.photos} />
      </ShineBorder>
      {mystery.hints.map((hint, index) => (
        <div className="col-span-full" key={`hint-${index}`}>
          <HyperText
            duration={200}
            wrapperClassName="justify-center"
            className="text-lg text-black dark:text-white md:text-xl"
            text={hint}
          />
        </div>
      ))}
      <div className="col-span-full flex justify-center">
        <ShineBorder
          className="relative flex w-fit flex-col items-center justify-center overflow-hidden rounded-lg border bg-background p-5 md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <SecretInput
            value={secretInput}
            onChange={(v) => setSecretInput(v)}
            expectedInput={mystery.expectedSecret}
            className="col-span-full"
          />
        </ShineBorder>
      </div>
      <div className="col-span-full flex justify-center">
        <SecretButton
          disabled={
            mystery.triesLeft === 0 ||
            secretInput.length !==
              mystery.expectedSecret?.split(" ")?.join("").length
          }
          onClick={onSubmit}
          inputText="Decode Secret"
          loading={loading}
        />
      </div>
    </div>
  );
}
