"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { memo } from "react";

const reviews = [
  {
    name: "Rajini",
    username: "@rajini",
    body: "Ha Ha ha.. Konjo frame paarunga jii!",
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/19563e151175451.630738fbe8d78.jpg",
  },
  {
    name: "Kamal",
    username: "@kamal",
    body: "எதிர்பாராததை எதிர்பாருங்கள்! இத்தகைய அறிய செயலியை உருவாக்கியவர்க்கு வாழ்த்துக்கள்",
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/a2490b157638269.637cc8f6e248b.jpg",
  },
  {
    name: "Vijay",
    username: "@vijay",
    body: "App uh sooperunga naa.. Summa pattaya kelappalam!",
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/006da686040121.5d8d5ab1d2ee3.png",
  },
  {
    name: "Ajith Kumar",
    username: "@thala",
    body: "Intha app ah namma paathukitta, Mela irukavan nammala paathukuvan. Athuu!",
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/20f935104926409.5f6d8d1ca68a2.jpg",
  },
  {
    name: "Dhanush",
    username: "@dhanush",
    body: "Yaaruku epdi vena irukalam, aana enaku intha app romba pudikum.",
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/39e656131810851.619cbc7ae5e55.jpg",
  },
  {
    name: "Siva K",
    username: "@siva",
    body: "Oii Mamooty.. App uh sooperano",
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/ff84ab164111361.63f125987e468.jpg",
  },
  {
    name: "Surya",
    username: "@surya",
    body: "Mystery ah Youtube la paathrupa Netflix la paathrupa, Mysteryverse la paathrukiyaa!",
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/0b0c15217078851.678a7020d41e9.jpg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = memo(function ReviewCard({
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
}) {
  return (
    <figure
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        vertical ? "h-52 w-36" : "w-64",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="aspect-square rounded-full object-cover"
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
});

export const FeedbackDisplay = memo(function FeedbackDisplay() {
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
});
