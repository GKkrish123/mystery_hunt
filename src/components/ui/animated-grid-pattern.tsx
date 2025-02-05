"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { rect as MotionRect } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string | number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDur?: number;
}

export const GridPattern = memo(function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: GridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Array<{ id: number; pos: number[] }>>(
    [],
  );

  // Generate random position within container bounds
  const getPos = () => [
    Math.floor((Math.random() * dimensions.width) / width),
    Math.floor((Math.random() * dimensions.height) / height),
  ];

  // Generate an array of squares
  const generateSquares = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));

  // Update squares when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, numSquares]);

  // Update container dimensions using ResizeObserver
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Update individual square position after animation
  const handleAnimationComplete = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((square) =>
        square.id === id ? { ...square, pos: getPos() } : square,
      ),
    );
  };

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={String(strokeDasharray)}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <LazyMotion key={id} features={domAnimation} strict>
            <AnimatePresence propagate>
              <MotionRect
                className="!will-change-[transform,opacity]"
                initial={{ opacity: 0 }}
                animate={{ opacity: maxOpacity }}
                transition={{
                  duration,
                  repeat: Infinity, // Infinite loop
                  repeatType: "reverse", // Reverse the animation
                  delay: index * 0.1, // Stagger the animations for a cascading effect
                }}
                onAnimationComplete={() => handleAnimationComplete(id)}
                width={width - 1}
                height={height - 1}
                x={(x ?? 0) * width + 1}
                y={(y ?? 0) * height + 1}
                fill="currentColor"
                strokeWidth="0"
              />
            </AnimatePresence>
          </LazyMotion>
        ))}
      </svg>
    </svg>
  );
});

export default GridPattern;
