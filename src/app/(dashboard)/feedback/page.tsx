"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { useIsMobile } from "@/hooks/use-mobile";
import TypingAnimation from "@/components/ui/typing-animation";
import DotPattern from "@/components/ui/dot-pattern";
import Ripple from "@/components/ui/ripple";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import confetti from "canvas-confetti";
import { useRef } from "react";
import BlurIn from "@/components/ui/blur-in";

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
    name: "Ajith",
    username: "@ajith",
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
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        vertical ? "h-44 w-36" : "w-64",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
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

export default function FeedbackPage() {
  const isMobile = useIsMobile();
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  const handleSendClick = () => {
    const scalar = 2;
    const plane = confetti.shapeFromText({ text: "🛩", scalar });
    const buttonOrigin = sendButtonRef.current?.getBoundingClientRect();    

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 15,
      shapes: [plane],
      scalar,
      origin: {
        x: (buttonOrigin?.left || 0) / window.innerWidth + 0.02,
        y: (buttonOrigin?.top || 0) / window.innerHeight + 0.02
      },
    };
   
    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 1,
      });
 
      confetti({
        ...defaults,
        particleCount: 1,
      });
 
      confetti({
        ...defaults,
        particleCount: 1,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };
 
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div className="relative grid-rows-[55px] md:grid-rows-[65px] grid grid-cols-1 h-full gap-4 sm:grid-cols-2 md:grid-cols-5 overflow-hidden">
        <DotPattern
            className={cn(
                isMobile ? "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]" : "[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]",
            )}
        />
        <div className="col-span-full">
          <BlurIn
            word="Feedback Corner"
            className="mx-auto h-8 md:h-10 text-2xl md:text-3xl font-bold text-black dark:text-white"
          />
          <TypingAnimation
              className="text-lg md:text-xl font-normal row-span-1 text-black dark:text-white h-10"
              text="Share your thoughts from the shadows"
              duration={100}
          />
        </div>
        <div className="p-4 relative flex row-span-6 col-span-full md:col-span-3 col-start-1 md:col-start-2 w-full flex-col items-center justify-center rounded-lg border bg-background md:shadow-xl">
            <Textarea className="text-center focus-visible:placeholder:text-transparent placeholder:text-lg md:placeholder:text-xl smh:placeholder:pt-[50px] placeholder:pt-24 md:placeholder:pt-32 text-base md:text-lg pt-6 resize-none z-10 h-full w-full border-transparent border-none shadow-none focus-visible:ring-0 font-medium text-zinc-700 dark:text-slate-100" placeholder="Here's your space to tell me anything you would like to..." />
            <Ripple />
            <Button ref={sendButtonRef} variant="outline" className="absolute -bottom-7 br- z-10 w-14 h-14 md:w-16 md:h-16 rounded-full" size="icon" onClick={handleSendClick}>
              <Send style={{
                width: "1.5rem",
                height: "1.5rem",
              }} />
            </Button>
        </div>
      <div
        className={cn(
          "relative self-end col-span-full flex h-[350px] smh:h-[250px] flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl",
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
    </div>
  );
}
