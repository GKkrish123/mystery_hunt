"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

const reviews = [
  {
    name: "Rajini",
    username: "@rajini",
    body: "Kanna kalakkitta da kanna",
    img: "https://avatar.vercel.sh/rajini",
  },
  {
    name: "Kamal",
    username: "@kamal",
    body: "Idhuvum kadandhu pogum, aana indha app top la pogum!",
    img: "https://avatar.vercel.sh/kamal",
  },
  {
    name: "Vijay",
    username: "@vijay",
    body: "App uh sooperu. Summa pattaya kelappalam!",
    img: "https://avatar.vercel.sh/vijay",
  },
  {
    name: "Ajith Kumar",
    username: "@thala",
    body: "Intha App uh. Thamaasu Thamaasu!",
    img: "https://avatar.vercel.sh/ajith",
  },
  {
    name: "Dhanush",
    username: "@dhanush",
    body: "Rowdy baby... indha app vera level!",
    img: "https://avatar.vercel.sh/dhanush",
  },
  {
    name: "Sivakarthikeyan",
    username: "@siva",
    body: "Oii Mamooty App uh sooperano",
    img: "https://avatar.vercel.sh/siva",
  },
  {
    name: "Vikram",
    username: "@vikram",
    body: "Indha app oda speed ah yaaralayum adakkave mudiyadhu",
    img: "https://avatar.vercel.sh/vikram",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
  vertical,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  vertical: boolean;
}) => {
  return (
    <figure
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        vertical ? "h-44 w-36" : "w-64",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export const FeedbackDisplay = () => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "relative col-span-full flex h-[350px] flex-col items-center justify-center self-end overflow-hidden rounded-lg border bg-background md:shadow-xl smh:h-[250px]",
        isMobile ? "flex-row" : "flex-col",
      )}
    >
      <Marquee vertical={isMobile} pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard vertical={isMobile} key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee
        vertical={isMobile}
        reverse
        pauseOnHover
        className="[--duration:20s]"
      >
        {secondRow.map((review) => (
          <ReviewCard vertical={isMobile} key={review.username} {...review} />
        ))}
      </Marquee>
      <div
        className={cn(
          "pointer-events-none absolute from-white dark:from-background",
          isMobile
            ? "inset-x-0 top-0 h-1/4 bg-gradient-to-b"
            : "inset-y-0 left-0 w-1/4 bg-gradient-to-r",
        )}
      ></div>
      <div
        className={cn(
          "pointer-events-none absolute from-white dark:from-background",
          isMobile
            ? "inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"
            : "inset-y-0 right-0 w-1/4 bg-gradient-to-l",
        )}
      ></div>
      <BorderBeam size={isMobile ? 300 : 400} duration={6} delay={9} />
    </div>
  );
};
