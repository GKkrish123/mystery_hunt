"use client";

import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({
  className,
  value,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [searchValue, setSearchValue] = useState<string>(
    (value as string) ?? "",
  );
  const [debouncedSearchValue] = useDebouncedValue<string>(searchValue, 500);
  const router = useRouter();

  useEffect(() => {
    if (!debouncedSearchValue) {
      if (value) {
        router.replace("/mysteries");
      }
      return;
    }
    router.replace(
      `/mysteries?search=${encodeURIComponent(debouncedSearchValue)}`,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  return (
    <div
      className={cn(
        "col-span-full",
        "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[length:200%] px-2 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-[-1] before:h-1/5 before:w-[95%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(1.5rem))]",
        "bg-transparent",
      )}
    >
      {/* <Lottie className="h-8 w-8" animationData={SearchColor} /> */}
      <div className="flex w-full items-center rounded-md bg-transparent text-sm text-black outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:text-white md:h-10">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-60 md:h-5 md:w-5" />
        <Input
          className={cn("h-8", className)}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          {...props}
        />
      </div>
    </div>
  );
}
