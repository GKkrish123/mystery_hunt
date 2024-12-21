/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { memo, useEffect, useState } from "react";
import { useDebouncedValue, useViewportSize } from "@mantine/hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
}
export const Meteors = memo(({ number = 20 }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
    [],
  );
  const isMobile = useIsMobile();

  const { width } = useViewportSize();
  const [debouncedWidth] = useDebouncedValue(isMobile ? 120 : width, 500);

  useEffect(() => {
    const styles = [
      ...new Array(isMobile ? Math.floor(number / 3) : number),
    ].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * debouncedWidth) + "px",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number, debouncedWidth]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 size-0.5 rotate-[215deg] rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            isMobile ? "animate-meteor-mobile" : "animate-meteor",
          )}
          style={style}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
});

Meteors.displayName = "Meteors";

export default Meteors;
