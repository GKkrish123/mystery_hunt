"use client";

// app/mystery/[mysteryId]/page.tsx
import { notFound } from "next/navigation";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import BlurIn from "@/components/ui/blur-in";
import HyperText from "@/components/ui/hyper-text";
import { DotPattern } from "@/components/ui/dot-pattern";
import AvatarCircles from "@/components/ui/avatar-circles";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { SecretInput } from "@/components/ui/secret-input";
import { Badge } from "@/components/ui/badge";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { SecretButton } from "@/components/ui/secret-button";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import React, { type MutableRefObject, useRef, useState } from "react";
import ShineBorder from "./ui/shine-border";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Particles from "./ui/particles";
import { useTheme } from "next-themes";
import { Vortex } from "./ui/vortex";
import confetti from "canvas-confetti";
import NumberTicker from "./ui/number-ticker";

export const DragCards = () => {
  return (
    <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950">
      <h2 className="relative z-0 text-[20vw] font-black text-neutral-800 md:text-[200px]">
        BLACK HOLE<span className="text-indigo-500">.</span>
      </h2>
      <Cards />
    </section>
  );
};

const Cards = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      <Card
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1635373670332-43ea883bb081?q=80&w=2781&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Example image"
        rotate="6deg"
        top="20%"
        left="25%"
        className="w-36 md:w-56"
      />
      <Card
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Example image"
        rotate="12deg"
        top="45%"
        left="60%"
        className="w-24 md:w-48"
      />
      <Card
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Example image"
        rotate="-6deg"
        top="20%"
        left="40%"
        className="w-52 md:w-80"
      />
      <Card
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=2609&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Example image"
        rotate="8deg"
        top="50%"
        left="40%"
        className="w-48 md:w-72"
      />
      <Card
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1602212096437-d0af1ce0553e?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Example image"
        rotate="18deg"
        top="20%"
        left="65%"
        className="w-40 md:w-64"
      />
      <Card
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1622313762347-3c09fe5f2719?q=80&w=2640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Example image"
        rotate="-3deg"
        top="35%"
        left="55%"
        className="w-24 md:w-48"
      />
    </div>
  );
};

interface Props {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: string;
  className?: string;
}

const Card = ({
  containerRef,
  src,
  alt,
  top,
  left,
  rotate,
  className,
}: Props) => {
  const [zIndex, setZIndex] = useState(0);

  const updateZIndex = () => {
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
  };

  return (
    <motion.img
      onMouseDown={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge(
        "drag-elements absolute w-48 bg-neutral-200 p-1 pb-4",
        className,
      )}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      // Uncomment below and remove dragElastic to remove movement after release
      //   dragMomentum={false}
      dragElastic={0.65}
    />
  );
};

// const avatarUrls = [
//   "https://avatars.githubusercontent.com/u/16860528",
//   "https://avatars.githubusercontent.com/u/20110627",
//   "https://avatars.githubusercontent.com/u/106103625",
// ];

const avatars = [
  {
    id: 1,
    name: "John Doe",
    designation: "I'm the boss",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Sullaan",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "God of War",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
];

const badges = ["Space", "Dark", "Science"];
const expectedInput = "Testi Done";

export function MysteryForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [secretInput, setSecretInput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const end = Date.now() + 3 * 1000; // 3 seconds
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
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
     
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
      }

      setTimeout(somePoppers, 1500);
    }, 2000);
  }

  return (
    <div className="relative grid h-full auto-rows-min grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7 md:gap-3">
      {/* <div className='relative flex'>
          <BlurIn
          word="The Mystery of Black Hole"
          className="absolute left-1/2 transform -translate-x-1/2 h-8 md:h-12 text-2xl md:text-3xl font-bold text-black dark:text-white"
          />
          <AvatarCircles className='ml-auto' numPeople={99} avatarUrls={avatarUrls} />
          </div> */}
      <BlurIn
        word="The Mystery of Black Hole"
        className="col-span-full mx-auto block min-h-8 text-2xl font-bold text-black dark:text-white md:min-h-12 md:text-3xl"
      />
      {/* <div className="col-span-full flex"> */}
      <div className="flex flex-wrap content-center col-span-1 md:col-span-2 items-center gap-1">
        {badges.map((badge) => (
          <Badge
            key={`badge-${badge}`}
            className="h-4 px-1 text-[10px] md:px-2"
          >
            {badge}
          </Badge>
        ))}
      </div>
      <div className="flex flex-col col-start-2 md:col-start-3 col-span-1 sm:col-span-2 md:col-span-3 items-center justify-center gap-1">
        <span className="text-xs md:text-sm">Unlock Attempts</span>
        <NumberTicker className="text-sm md:text-base font-bold" value={7777777} />
      </div>
        {/* <AvatarCircles className="ml-auto" avatarUrls={avatarUrls} /> */}
        <div className="ml-auto col-start-3 sm:col-start-4 md:col-start-6 col-span-1 md:col-span-2 flex flex-row-reverse items-center pr-5">
          <AnimatedTooltip items={avatars} />
        </div>
      {/* </div> */}
      <div className="col-span-full">
        <HyperText
          wrapperClassName="justify-center"
          className="text-lg text-black dark:text-white md:text-xl"
          text="Beyond the stars, where light is bound, In the heart of shadows, a secret’s found. Dare to seek where none return, the void will show what you must learn."
        />
      </div>

      <ShineBorder
              color={resolvedTheme === "dark" ? "white" : "black"}
              className="relative col-span-full grid h-[500px] w-full place-content-center overflow-hidden bg-[rgb(255,255,255)]/[.50] dark:bg-[rgb(0,0,0)]/[.50] rounded-lg border md:shadow-xl"
              borderClassName="z-[15]">
        {/* <h2 className="relative z-0 text-[20vw] font-black text-neutral-800 md:text-[200px]">
            BLACK HOLE<span className="text-indigo-500">.</span>
          </h2> */}
        <Vortex
          backgroundColor="transparent"
          // rangeY={150}
          baseHue={210}
          particleCount={300}
        ></Vortex>
        <Cards />
        {/* <Particles
            className="absolute inset-0"
            quantity={100}
            ease={80}
            color={resolvedTheme === "dark" ? "#fff" : "#000"}
            refresh
          /> */}
      </ShineBorder>
      <div className="col-span-full flex justify-center">
        <ShineBorder
          className="relative flex w-fit flex-col items-center justify-center overflow-hidden rounded-lg border bg-background p-5 md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <SecretInput value={secretInput} onChange={(v) => setSecretInput(v)} expectedInput={expectedInput} className="col-span-full" />
        </ShineBorder>
      </div>

      <div className="col-span-full flex justify-center">
        <SecretButton
          disabled={secretInput.length !== expectedInput.split(" ").join("").length}
          onClick={onSubmit}
          inputText="Decode Secret"
          loading={loading}
        />
      </div>

      {/* <AnimatedBeam
          duration={3}
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div2Ref}
        /> */}
      {/* <div className="relative self-end h-[200px] col-span-full sm:col-start-2 sm:col-span-1 md:col-start-3 md:col-span-2 rounded-lg w-full bg-background overflow-hidden border">
          <FlickeringGrid
            className="z-0 absolute inset-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
            height={800}
            width={800}
          />
        </div> */}
    </div>
  );
}
