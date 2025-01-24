"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, memo, forwardRef } from "react";
import { div as MotionDiv, span as MotionSpan } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";

interface Beam {
  initialX: number; // Starting position (in pixels or percentage)
  translateX: number; // End position after translation
  duration: number; // Duration of animation (in seconds)
  repeatDelay: number; // Delay between animation repetitions (in seconds)
  delay?: number; // Initial delay before animation starts (optional)
  className?: string; // Additional CSS class for styling (optional)
}

const generateRandomBeams = (numBeams: number, screenWidth: number) => {
  return Array.from({ length: numBeams }, (_) => {
    const initialX = Math.random() * screenWidth; // Randomize initial position
    const translateX = initialX; // Randomized translation
    const duration = Math.random() * 8 + 3; // Randomize duration between 3-11 seconds
    const repeatDelay = Math.random() * 5 + 1; // Randomize repeat delay 1-6 seconds
    const delay = Math.random() * 4; // Randomize delay before start
    const height = Math.floor(Math.random() * 11 + 5); // Randomize height between 5-11

    return {
      initialX,
      translateX,
      duration,
      repeatDelay,
      delay,
      className: `h-${height}`, // Dynamic height
    } as Beam;
  });
};

const useContainerRect = (
  containerRef: React.RefObject<HTMLDivElement>,
  parentRef: React.RefObject<HTMLDivElement>,
) => {
  const [containerRect, setContainerRect] = useState<{
    rect: DOMRect;
    offset: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !parentRef.current) return;

    const updateRect = () => {
      if (!containerRef.current || !parentRef.current) return;
      const containerElement = containerRef.current;
      const parentElement = parentRef.current;
      const computedStyle = window.getComputedStyle(containerElement);

      setContainerRect({
        rect: {
          ...containerElement.getBoundingClientRect(),
          top: parseFloat(computedStyle.marginTop),
        },
        offset: parseFloat(computedStyle.marginTop),
        width: parentElement.getBoundingClientRect().width,
        height: parentElement.getBoundingClientRect().height,
      });
    };

    updateRect();

    const observer = new ResizeObserver(updateRect);
    observer.observe(containerRef.current);
    observer.observe(parentRef.current);

    return () => observer.disconnect();
  }, [containerRef, parentRef]);

  return containerRect;
};

export const BackgroundBeamsWithCollision = memo(
  ({ className }: { className?: string }) => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    const containerRect = useContainerRect(containerRef, parentRef);
    const [beams, setBeams] = useState<Beam[]>([]);

    useEffect(() => {
      if (containerRect?.width && containerRect?.height) {
        const newBeams = generateRandomBeams(
          isMobile ? 10 : 20,
          containerRect.width,
        );
        setBeams(newBeams);
      }
    }, [isMobile, containerRect]);

    return (
      <div
        ref={parentRef}
        className={cn(
          "absolute z-[-1] flex h-full w-full flex-col overflow-hidden",
          className,
        )}
      >
        {beams.map((beam) => (
          <CollisionMechanism
            key={beam.initialX + "beam-idx"}
            beamOptions={beam}
            containerRect={containerRect}
            parentRef={parentRef}
          />
        ))}
        <div
          ref={containerRef}
          className="pointer-events-none mt-auto h-0 w-full bg-transparent"
          style={{
            boxShadow:
              "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
          }}
        />
      </div>
    );
  },
);

BackgroundBeamsWithCollision.displayName = "BackgroundBeamsWithCollision";

const CollisionMechanism = forwardRef<
  HTMLDivElement,
  {
    containerRect: {
      rect: DOMRect;
      offset: number;
    } | null;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRect, beamOptions = {} }, _ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  const checkCollision = () => {
    if (
      beamRef.current &&
      containerRect?.rect &&
      parentRef.current &&
      !cycleCollisionDetected
    ) {
      const beamRect = beamRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();

      const computedStyle = window.getComputedStyle(beamRef.current);
      const transform = computedStyle.transform;
      let translateYValue = 0;
      if (transform && transform !== "none") {
        const matrixValues = /matrix.*\((.+)\)/.exec(transform);
        if (matrixValues) {
          const values = matrixValues[1]!.split(", ");
          translateYValue = parseFloat(values[5]!);
        }
      }

      if (translateYValue >= containerRect.rect.top - 20) {
        const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
        const relativeY = beamRect.bottom - parentRect.top;

        setCollision({
          detected: true,
          coordinates: {
            x: relativeX,
            y: relativeY - 60,
          },
        });
        setCycleCollisionDetected(true);
      }
    }
  };

  useEffect(() => {
    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleCollisionDetected, containerRect?.rect]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate>
        <MotionDiv
          key={beamKey}
          ref={beamRef}
          animate="animate"
          initial={{
            translateY: beamOptions.initialY ?? "-200px",
            translateX: beamOptions.initialX ?? "0px",
            rotate: beamOptions.rotate ?? 0,
          }}
          variants={{
            animate: {
              translateY:
                beamOptions.translateY ??
                `${(containerRect?.offset ?? 0) - 5}px`,
              translateX: beamOptions.translateX ?? "0px",
              rotate: beamOptions.rotate ?? 0,
            },
          }}
          transition={{
            duration: beamOptions.duration ?? 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beamOptions.delay ?? 0,
            repeatDelay: beamOptions.repeatDelay ?? 0,
          }}
          className={cn(
            "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent",
            beamOptions.className,
          )}
        />
      </AnimatePresence>
      {collision.detected && collision.coordinates && (
        <Explosion
          key={`${collision.coordinates.x}-${collision.coordinates.y}`}
          className=""
          style={{
            left: `${collision.coordinates.x}px`,
            top: `${collision.coordinates.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </LazyMotion>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence propagate>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
          />
        </AnimatePresence>
      </LazyMotion>
      {spans.map((span) => (
        <LazyMotion key={span.id} features={domAnimation} strict>
          <AnimatePresence propagate>
            <MotionSpan
              initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
              animate={{
                x: span.directionX,
                y: span.directionY,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 1.5 + 0.5,
                ease: "easeOut",
              }}
              className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
            />
          </AnimatePresence>
        </LazyMotion>
      ))}
    </div>
  );
};
