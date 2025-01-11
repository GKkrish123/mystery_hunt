"use client";

import confetti from "canvas-confetti";
import { useRef } from "react";

import { default as dynamicImport } from "next/dynamic";
import { api } from "@/trpc/react";
import { useDebouncedState } from "@mantine/hooks";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Ripple = dynamicImport(
  () => import("@/components/ui/ripple").then((mod) => mod.default),
  { ssr: false },
);
const Textarea = dynamicImport(
  () => import("@/components/ui/textarea").then((mod) => mod.Textarea),
  { ssr: false },
);
const Button = dynamicImport(
  () => import("@/components/ui/button").then((mod) => mod.Button),
  { ssr: false },
);
const Send = dynamicImport(
  () => import("lucide-react").then((mod) => mod.Send),
  { ssr: false },
);
const FeedbackDisplay = dynamicImport(
  () => import("./feedback-display").then((mod) => mod.FeedbackDisplay),
  { ssr: false },
);

export const FeedbackForm = () => {
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [feedback, setFeedback] = useDebouncedState("", 200);
  const { data, isPending } = api.user.isFeedbackValid.useQuery(undefined, {
    refetchOnMount: false,
  });
  const {
    mutateAsync,
    isPending: isFeedbackSaving,
    isSuccess,
  } = api.user.addFeedback.useMutation();

  const handleSendClick = async () => {
    try {
      const { success } = await mutateAsync({
        feedback: feedback.trim(),
      });
      if (!success) {
        toast.info("No frequent feedbacks!", {
          description:
            "Seems you've already provided feedback within 24 hours, Please try again later.",
        });
        return null;
      }
    } catch (error) {
      console.error("Error in sending feedback", JSON.stringify(error));
      toast.error("Something broke the feedback system!", {
        description: "Checking the feedback system, Please try again later.",
      });
      return null;
    }
    if (textAreaRef.current) textAreaRef.current.value = "";
    toast.success("Feedback sent successfully", {
      description: "Thanks for your feedback!",
    });
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

  const feedbackDisabled =
    isPending ||
    !data?.success ||
    isFeedbackSaving ||
    !feedback.trim() ||
    isSuccess;

  const feedbackButton = (
    <Button
      ref={sendButtonRef}
      disabled={feedbackDisabled}
      variant="outline"
      className="br- absolute -bottom-7 z-10 h-14 w-14 rounded-full md:h-16 md:w-16"
      size="icon"
      onClick={handleSendClick}
    >
      {isFeedbackSaving || isPending ? (
        <Loader className="h-7 w-7 text-black dark:text-white" />
      ) : (
        <Send
          style={{
            width: "1.5rem",
            height: "1.5rem",
          }}
        />
      )}
    </Button>
  );

  return (
    <>
      <div className="relative col-span-full col-start-1 row-span-6 flex w-full flex-col items-center justify-center rounded-lg border bg-background p-4 md:col-span-3 md:col-start-2 md:shadow-xl">
        <Textarea
          ref={textAreaRef}
          className="z-10 h-full w-full resize-none border-none border-transparent pt-6 text-center text-base font-medium text-zinc-700 shadow-none placeholder:pt-24 placeholder:text-lg focus-visible:ring-0 focus-visible:placeholder:text-transparent dark:text-slate-100 md:text-lg md:placeholder:pt-32 md:placeholder:text-xl smh:placeholder:pt-[50px]"
          placeholder="Here's your space to tell me anything you would like to..."
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Ripple />
        {feedbackDisabled && !!feedback.trim() ? (
          <Tooltip>
            <TooltipTrigger asChild className="!pointer-events-auto">
              {feedbackButton}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Too much feedback within 24 hours is injurious, Please try again
                later.
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          feedbackButton
        )}
      </div>
      <FeedbackDisplay />
    </>
  );
};
