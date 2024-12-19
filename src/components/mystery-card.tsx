"use client";

import Link from "next/link";
import BlurFade from "./ui/blur-fade";
import Lottie from "lottie-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LottieStarBlack from "@/components/icons/lottie/StarBlack.json";
import LottieStarWhite from "@/components/icons/lottie/StarWhite.json";
import LottieStarColor from "@/components/icons/lottie/StarColor.json";
import { useState } from "react";
import { useTheme } from "next-themes";
import { type Mystery } from "@/server/model/mysteries";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { api } from "@/trpc/react";

export function MysteryCard({
  forDrag,
  id,
  title,
  thumbnailUrl,
  description,
  isLiked: likedStatus,
}: Mystery & { forDrag?: boolean }) {
  const [isLiked, setIsLiked] = useState<boolean>(likedStatus);
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const icon = isLiked
    ? LottieStarColor
    : resolvedTheme === "dark"
      ? LottieStarBlack
      : LottieStarWhite;
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { mutateAsync } = api.mystery.toggleLikeMystery.useMutation();

  const handleLikeToggle = async () => {
    setIsLiked((prev) => !prev);
    try {
      await mutateAsync({
        mysteryId: id,
      });
    } catch (error) {
      setIsLiked((prev) => !prev);
      console.error("Failed to toggle like", error);
    }
  };

  return (
    <BlurFade inView>
      <Link
        href={`/mysteries/${id}`}
        className={cn(
          "relative block cursor-pointer space-y-3 overflow-hidden transition-all",
          !forDrag ? "hover:scale-105" : "space-y-2 md:space-y-3",
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
            router.push(`/mysteries/${id}`);
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
        <div className="overflow-hidden rounded-md">
          <Lottie
            className="absolute -right-2 -top-3 z-[1] block h-10 w-10 md:h-11 md:w-11"
            animationData={icon}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await handleLikeToggle();
            }}
            autoplay={isLiked}
            loop={false}
          />
          <Image
            priority
            src={thumbnailUrl}
            alt={title}
            width={250}
            height={250}
            style={{
              mask: isMobile
                ? "radial-gradient(25px at calc(100% - 13px) calc(8px), rgba(0, 0, 0, 0) 95%, rgb(0, 0, 0))"
                : "radial-gradient(30px at calc(100% - 13px) calc(8px), rgba(0, 0, 0, 0) 95%, rgb(0, 0, 0))",
            }}
            className={cn(
              "pointer-events-none aspect-square h-[250px] w-full object-cover transition-all hover:scale-105",
              forDrag && "h-[150px] md:h-[250px]",
            )}
          />
        </div>

        <div
          className={cn(
            "space-y-1 text-center text-sm",
            forDrag && "space-y-0.5 text-xs md:space-y-1 md:text-sm",
          )}
        >
          <h3 className="font-medium leading-none">{title}</h3>
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
