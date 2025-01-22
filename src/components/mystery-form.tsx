"use client";

import {
  memo,
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, LazyMotion, domMax } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { twMerge } from "tailwind-merge";
import { useGesture } from "@use-gesture/react";
import { type Mystery } from "@/server/model/mysteries";
import { type MysteryFormValues } from "@/server/constants";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { mysteryFont } from "@/lib/fonts";
import confetti from "canvas-confetti";
import { default as dynamicImport } from "next/dynamic";
import Image from "next/image";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Pencil } from "lucide-react";

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
const ScratchToReveal = dynamicImport(
  () => import("@/components/ui/scratch-to-reveal").then((mod) => mod.ScratchToReveal),
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
const MorphingText = dynamicImport(
  () => import("@/components/ui/morphing-text").then((mod) => mod.MorphingText),
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
    <LazyMotion features={domMax} strict>
      <AnimatePresence propagate>
        <MotionDiv
          className="drag-elements absolute rounded bg-zinc-700 p-0.5 pb-3 dark:bg-slate-300"
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
          <Image
            width={300}
            height={500}
            priority
            className={twMerge("w-48", className)}
            src={src}
            alt={alt}
          />
        </MotionDiv>
      </AnimatePresence>
    </LazyMotion>
  );
};

interface MysteryFormProps {
  mystery: Mystery & MysteryFormValues;
}

const useRetryCountdown = (mystery: Mystery & MysteryFormValues) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!mystery.lastTriedAt) {
      setCountdown(0);
      return;
    }

    const calculateRemainingTime = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - mystery.lastTriedAt!) / 1000);
      return Math.max(mystery.retryInterval - elapsed, 0);
    };

    let remainingTime = calculateRemainingTime();
    setCountdown(remainingTime);

    if (remainingTime === 0) return;

    const intervalId = setInterval(() => {
      remainingTime -= 1;
      setCountdown(remainingTime);
      if (remainingTime === 0) clearInterval(intervalId);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [mystery.retryInterval, mystery.lastTriedAt]);

  const canRetry = countdown === 0;

  return { canRetry, countdown };
};

const usePointsCountdown = (mysteryData: Mystery & MysteryFormValues) => {
  const [countdown, setCountdown] = useState(0);
  const [points, setPoints] = useState(mysteryData.maxPoints);

  useEffect(() => {
    const calculatePointsAndCountdown = () => {
      const now = Date.now();
      const targetSeconds =
        mysteryData.solvedCount === 0
          ? mysteryData.firstViewedAt?.seconds
          : mysteryData.solvedBy[0]?.solvedAt?.seconds;
      const firstViewedAtMs = (targetSeconds ?? 0) * 1000 || now;
      const elapsedTime = (now - firstViewedAtMs) / 1000;

      const cooldown =
        mysteryData.solvedCount === 0
          ? mysteryData.preFindCooldown
          : mysteryData.postFindCooldown;
      const cooldownCut =
        mysteryData.solvedCount === 0
          ? mysteryData.preFindCooldownCut
          : mysteryData.postFindCooldownCut;

      const cooldownPeriods = Math.floor(elapsedTime / cooldown);
      const pointsLost = cooldownPeriods * cooldownCut;
      const currentPoints = Math.max(
        mysteryData.maxPoints - pointsLost,
        mysteryData.minPoints,
      );
      setPoints(currentPoints);

      // Calculate remaining time for next cooldown cut
      const timeUntilNextCooldown = cooldown - (elapsedTime % cooldown);
      setCountdown(Math.ceil(timeUntilNextCooldown));

      return currentPoints;
    };

    const intervalId = setInterval(() => {
      const updatedPoints = calculatePointsAndCountdown();
      if (updatedPoints === mysteryData.minPoints) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Initial calculation
    calculatePointsAndCountdown();

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mysteryData.firstViewedAt,
    mysteryData.solvedCount,
    mysteryData.maxPoints,
    mysteryData.minPoints,
    mysteryData.preFindCooldown,
    mysteryData.preFindCooldownCut,
    mysteryData.postFindCooldown,
    mysteryData.postFindCooldownCut,
  ]);

  return { countdown, points };
};

export function MysteryForm({ mystery: mysteryProp }: MysteryFormProps) {
  const [mystery, setMystery] = useState<Mystery & MysteryFormValues>(
    mysteryProp,
  );
  const [secretInput, setSecretInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scratchCardOpen, setScratchCardOpen] = useState(false);
  const { mutateAsync } = api.mystery.recordMysteryView.useMutation();
  const { mutateAsync: verifyMystery } =
    api.mystery.verifyMysterySecret.useMutation();
  const { canRetry, countdown } = useRetryCountdown(mystery);
  const { points: currentPoints, countdown: pointsCountdown } =
    usePointsCountdown(mystery);

  useEffect(() => {
    setMystery(mysteryProp);
  }, [mysteryProp]);

  useEffect(() => {
    void (async () => {
      try {
        const { viewTime } = await mutateAsync({ mysteryId: mystery.id });
        if (!mystery.firstViewedAt)
          setMystery((oldMystery) => ({
            ...oldMystery,
            firstViewedAt: new Timestamp(viewTime / 1000, viewTime % 1000),
          }));
      } catch (error) {
        console.error("Failed to record mystery view", error);
        toast.success("Something went wrong while watching you!", {
          description:
            "Try refreshing to put things in place. God of thunder is looking on this issue.",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const celebrate = () => {
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
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const status = await verifyMystery({
        mysteryId: mystery.id,
        secret: secretInput,
      });
      if (status.success) {
        setTimeout(() => {
          celebrate();
          setMystery({
            ...mystery,
            ...((status.mysteryUpdate ?? {}) as Mystery & MysteryFormValues),
            triesLeft: mystery.triesLeft - 1,
          });
          toast.success("You’ve found it – the mystery is solved!", {
            description:
              "The stars align for those who seek. Proceed to the next secret.",
          });
        }, 1000);
      } else {
        setTimeout(() => {
          setLoading(false);
          setMystery({
            ...mystery,
            ...((status.mysteryUpdate ?? {}) as Mystery & MysteryFormValues),
            triesLeft: mystery.triesLeft - 1,
          });
          toast.success("No, You missed the mark.", {
            description:
              "Every misstep holds a lesson. Look closer; the chase continues.",
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error in verifying mystery", error);
      toast.error("Unknown forces of the universe have interrupted", {
        description: "Something went wrong. Please try again later.",
      });
    }
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
        <AnimatedTooltip items={mystery.topThree.slice(0, 1)} />
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
      {mystery.triesLeft > 0 ? (
        <div className="col-span-full flex justify-center">
          <ShineBorder
            className="relative flex w-fit flex-col items-center justify-center overflow-hidden rounded-lg border bg-background p-5 md:shadow-xl"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <SecretInput
              value={secretInput}
              onChange={(v) => setSecretInput(v.trim().toLowerCase())}
              expectedInput={mystery.expectedSecret}
              className="col-span-full"
            />
          </ShineBorder>
        </div>
      ) : null}
      {!mystery.isSolved ? (
        <div className="col-span-full flex justify-center">
          <SecretButton
            disabled={
              !canRetry ||
              mystery.triesLeft === 0 ||
              secretInput.length !==
                mystery.expectedSecret?.split(" ")?.join("").length
            }
            onClick={onSubmit}
            inputText="Decode Secret"
            loading={loading}
          />
        </div>
      ) : null}
      <div className="col-span-full flex w-full flex-col justify-center gap-1">
        {!mystery.isSolved ? (
          canRetry ? (
            <>
              <span className="h-6 w-full text-center font-mono font-semibold">
                Solve
                {currentPoints === mystery.minPoints
                  ? ""
                  : ` in ${pointsCountdown} seconds`}{" "}
                for {currentPoints} points
              </span>
              <div className="flex w-full justify-center">
                <MorphingText
                  texts={[
                    `${mystery.triesLeft > 0 ? mystery.triesLeft : "No"}`,
                  ]}
                  className={cn(
                    "h-6 w-5 font-mono text-base lg:h-6 lg:text-base",
                    mystery.triesLeft === 0 && "w-7",
                  )}
                />
                <MorphingText
                  texts={[mystery.triesLeft === 1 ? "Try" : "Tries"]}
                  className={cn(
                    "mr-1 h-6 w-12 font-mono text-base lg:h-6 lg:text-base",
                    mystery.triesLeft === 1 && "w-9",
                  )}
                />
                <MorphingText
                  texts={["Left"]}
                  className="mr-1 h-6 w-8 font-mono text-base lg:h-6 lg:text-base"
                />
              </div>
            </>
          ) : (
            <span className="flex font-mono font-semibold">
              You can retry in{" "}
              <MorphingText
                texts={[`${countdown}`]}
                className="h-6 w-10 text-center font-mono text-base lg:h-6 lg:text-base"
                cooldownTime={0.5}
                morphTime={0.5}
              />{" "}
              seconds...
            </span>
          )
        ) : (
          <MorphingText
            texts={["You have already found the secret !"]}
            className="h-6 w-full font-mono text-base lg:h-6 lg:text-base"
          />
        )}
      </div>
      <Dialog
        open={scratchCardOpen}
        onOpenChange={(open) => setScratchCardOpen(open)}
      >
        <DialogTrigger asChild onClick={() => setScratchCardOpen(true)}>
          <Pencil className="z-[1] ml-2 inline h-3 w-3 cursor-pointer" />
        </DialogTrigger>
        <DialogContent
          hideCloseButton
          className="lg: flex size-full max-w-full items-center justify-center border-0 bg-transparent"
          onClick={() => setScratchCardOpen(false)}
        >
          {/* <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
            <DialogDescription>
              Choose wisely, names have power!
            </DialogDescription>
          </DialogHeader> */}
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div> */}
          <ScratchToReveal
            width={250}
            height={250}
            minScratchPercentage={70}
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            // onComplete={handleComplete}
            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          >
            <p className="text-9xl">😎</p>
          </ScratchToReveal>
          {/* <DialogFooter>
            <Button
              type="submit"
              disabled={
                name === userData.name ||
                !name ||
                name.length < 3 ||
                name.length > 50
              }
              onClick={onNameChange}
            >
              {isLoading ? (
                <>
                  <Loader className="text-white dark:text-black" /> Changing
                  name...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
