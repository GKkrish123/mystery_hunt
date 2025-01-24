"use client";

import { useEffect, useRef, useState } from "react";
import { button as MotionButton, span as MotionSpan } from "motion/react-m";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

const CHARS = "!@#$%^&*():{};|,.<>/?";

interface SecretButtonProps {
  disabled?: boolean;
  loading?: boolean;
  inputText: string;
  onClick: () => void;
}

const SecretButton = ({
  disabled = false,
  inputText,
  loading = false,
  onClick,
}: SecretButtonProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [text, setText] = useState(inputText);

  useEffect(() => {
    if (loading) scramble();
    else stopScramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = inputText
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= inputText.length * CYCLES_PER_LETTER) {
        pos = 0;
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current ?? undefined);
    setText(inputText);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence propagate>
        <MotionButton
          disabled={disabled}
          whileHover={{
            scale: disabled ? 1 : 1.025,
          }}
          whileTap={{
            scale: disabled ? 1 : 0.975,
          }}
          onTap={() => {
            if (!disabled && !loading) {
              onClick();
            }
          }}
          className={cn(
            "group relative overflow-hidden rounded-lg border-[1px] border-neutral-500 bg-neutral-700 px-4 py-2 font-mono font-medium uppercase text-neutral-300 transition-colors",
            !disabled && "cursor-pointer hover:text-indigo-300",
          )}
        >
          <div className="relative z-10 flex items-center gap-2">
            {disabled ? <Lock /> : <span>{text}</span>}
          </div>
          <LazyMotion features={domAnimation} strict>
            <AnimatePresence propagate>
              <MotionSpan
                initial={{
                  y: "100%",
                }}
                animate={{
                  y: "-100%",
                }}
                transition={
                  disabled
                    ? {}
                    : {
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 1,
                        ease: "linear",
                      }
                }
                className={cn(
                  "absolute inset-0 z-0 scale-125 bg-gradient-to-t from-indigo-400/0 from-40% via-indigo-400/100 to-indigo-400/0 to-60% opacity-0 transition-opacity duration-300",
                  loading && "opacity-100",
                )}
              />
            </AnimatePresence>
          </LazyMotion>
        </MotionButton>
      </AnimatePresence>
    </LazyMotion>
  );
};

export { SecretButton };
