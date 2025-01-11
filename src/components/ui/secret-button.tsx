"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
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
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current ?? undefined);

    setText(inputText);
  };

  return (
    <motion.button
      disabled={disabled}
      whileHover={{
        scale: disabled ? 1 : 1.025,
      }}
      whileTap={{
        scale: disabled ? 1 : 0.975,
      }}
      onTapStart={() => !disabled && scramble()}
      onTap={() => !disabled && onClick()}
      onMouseDownCapture={() => !disabled && scramble()}
      className={cn(
        "group relative overflow-hidden rounded-lg border-[1px] border-neutral-500 bg-neutral-700 px-4 py-2 font-mono font-medium uppercase text-neutral-300 transition-colors",
        !disabled && "hover:text-indigo-300 cursor-pointer",
      )}
    >
      <div className="relative z-10 flex items-center gap-2">
        {disabled ? <Lock /> : <span>{text}</span>}
      </div>
      <motion.span
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
    </motion.button>
  );
};

export { SecretButton };
