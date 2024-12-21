"use client";

import Ripple from "@/components/ui/ripple";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import confetti from "canvas-confetti";
import { useRef } from "react";
import { FeedbackDisplay } from "./feedback-display";

export const FeedbackForm = () => {
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
        x: (buttonOrigin?.left ?? 0) / window.innerWidth + 0.02,
        y: (buttonOrigin?.top ?? 0) / window.innerHeight + 0.02,
      },
    };

    const shoot = () => {
      void confetti({
        ...defaults,
        particleCount: 1,
      });

      void confetti({
        ...defaults,
        particleCount: 1,
      });

      void confetti({
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
    <>
      <div className="relative col-span-full col-start-1 row-span-6 flex w-full flex-col items-center justify-center rounded-lg border bg-background p-4 md:col-span-3 md:col-start-2 md:shadow-xl">
        <Textarea
          className="z-10 h-full w-full resize-none border-none border-transparent pt-6 text-center text-base font-medium text-zinc-700 shadow-none placeholder:pt-24 placeholder:text-lg focus-visible:ring-0 focus-visible:placeholder:text-transparent dark:text-slate-100 md:text-lg md:placeholder:pt-32 md:placeholder:text-xl smh:placeholder:pt-[50px]"
          placeholder="Here's your space to tell me anything you would like to..."
        />
        <Ripple />
        <Button
          ref={sendButtonRef}
          variant="outline"
          className="br- absolute -bottom-7 z-10 h-14 w-14 rounded-full md:h-16 md:w-16"
          size="icon"
          onClick={handleSendClick}
        >
          <Send
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
          />
        </Button>
      </div>
      <FeedbackDisplay />
    </>
  );
};
