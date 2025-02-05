"use client";

import Link from "next/link";
import BlurFade from "./ui/blur-fade";
import Lottie from "lottie-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LottieWingsBlack from "@/components/icons/lottie/WingsBlack.json";
import LottieWingsWhite from "@/components/icons/lottie/WingsWhite.json";
import LottieWingsColor from "@/components/icons/lottie/WingsColor.json";
import { useState } from "react";
import { useTheme } from "next-themes";
import { type Category } from "@/server/model/categories";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { api } from "@/trpc/react";

export function CategoryCard({
  id,
  forDrag,
  name,
  description,
  themePicUrl,
  tag,
  isBookmarked: bookmarkStatus,
}: Category & { forDrag?: boolean }) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarkStatus);
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const icon = isBookmarked
    ? LottieWingsColor
    : resolvedTheme === "dark"
      ? LottieWingsBlack
      : LottieWingsWhite;
  const { mutateAsync } = api.category.toggleWatchCategory.useMutation();

  const handleBookmarkToggle = async () => {
    setIsBookmarked((prev) => !prev);
    try {
      await mutateAsync({
        categoryId: id,
      });
    } catch (error) {
      setIsBookmarked((prev) => !prev);
      console.error("Failed to toggle bookmark", error);
    }
  };

  return (
    <BlurFade inView>
      <Link
        href={`/explore/${tag}`}
        className={cn(
          "block cursor-pointer space-y-3 p-1 transition-all",
          forDrag ? "space-y-2 md:space-y-3" : "hover:scale-105",
        )}
        onClick={(e) => {
          if (forDrag && isDragging) e.preventDefault();
        }}
        onPointerUp={() => {
          if (forDrag) {
            setTimeout(() => {
              setIsDragging(false);
            }, 300);
          }
        }}
        onTouchEnd={(e) => {
          if (!(e.target instanceof SVGElement) && forDrag && !isDragging) {
            router.push(`/explore/${tag}`);
          }
        }}
        onTouchMove={() => {
          if (forDrag) {
            setIsDragging(true);
          }
        }}
        onDragStart={(e) => {
          if (forDrag) {
            e.preventDefault();
            setIsDragging(true);
          }
        }}
        onDragEnd={(e) => {
          if (forDrag) {
            e.preventDefault();
            setTimeout(() => {
              setIsDragging(false);
            }, 300);
          }
        }}
      >
        <div className="relative overflow-hidden rounded-md">
          <Lottie
            className="absolute right-0 top-0 z-[1] h-8 w-8 rotate-[35deg] md:h-9 md:w-9"
            animationData={icon}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await handleBookmarkToggle();
            }}
            autoplay={isBookmarked}
            loop={false}
          />
          <Image
            priority
            src={themePicUrl}
            alt={name}
            width={250}
            height={200}
            style={{
              mask: isMobile
                ? "radial-gradient(25px at calc(100% - 10px) calc(8px), rgba(0, 0, 0, 0) 95%, rgb(0, 0, 0))"
                : "radial-gradient(30px at calc(100% - 10px) calc(8px), rgba(0, 0, 0, 0) 95%, rgb(0, 0, 0))",
            }}
            className={cn(
              "aspect-square h-[200px] w-full object-cover transition-all",
              forDrag && "h-[130px] hover:scale-100 md:h-[200px]",
            )}
          />
        </div>
        <div
          className={cn(
            "space-y-1 text-center text-sm",
            forDrag && "space-y-0.5 text-xs md:space-y-1 md:text-sm",
          )}
        >
          <h3 className="font-medium leading-none">{name}</h3>
          <p
            className={cn(
              "text-xs text-muted-foreground",
              forDrag && "text-[10px] md:text-xs",
            )}
          >
            {description}
          </p>
        </div>
      </Link>
    </BlurFade>
  );
}
