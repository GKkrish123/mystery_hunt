"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { fetchSimpleIcons, renderSimpleIcon } from "react-icon-cloud";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const faqs: Omit<FAQItemProps, "index" | "openIndex" | "setOpenIndex">[] = [
  {
    question: "Why is my phone number mandatory?",
    answer:
      "The only reason is to keep the game fair! Your phone number helps prevent spam and cheating. Google's OTP verification is used for added security. Rest assured, your number stays private—only visible on your profile page and nowhere else.",
  },
  {
    question: "Why a profile picture is needed?",
    answer:
      "Because every mystery hunter deserves an identity! Your profile picture makes the leaderboard feel alive and for a `little magic` in your profile page. Feel free to use any image you like—Also Be Mindful! It will be showcased in your victory moments.",
  },
  {
    question: "What’s the deal with my email address?",
    answer:
      "Your email is your key to the Mysteryverse—it’s how you log in, stay updated, and the only way you will receive notifications about events, updates and prizes. No spam, just the essentials.",
  },
  {
    question: "Why Mysteryverse?",
    answer:
      "I’m a big fan of mysteries and I want you to experience the thrill of solving them! I want Mysteryverse to be one of the most trustworthy, challenging, intriguing, rewarding and informative applications.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely! I made cautious decisions on user privacy and data. Your data is handled securely through Google’s authentication and management services and will not misused at any cause. Any concerns or feedback? I’m just below...",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  openIndex: number;
  setOpenIndex: Dispatch<SetStateAction<number>>;
}

function FAQItem({
  question,
  answer,
  index,
  openIndex,
  setOpenIndex,
}: FAQItemProps) {
  const isOpen = openIndex === index;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      className={cn(
        "group rounded-lg border-[0.5px] border-gray-200/50 dark:border-gray-800/50",
        "!transition-all duration-200 !ease-in-out",
        isOpen
          ? "dark:via-white/2 bg-gradient-to-br from-white to-white dark:from-white/5 dark:to-white/5"
          : "bg-[rgb(255,255,255)]/[.50] hover:bg-gray-50/50 dark:bg-[rgb(0,0,0)]/[.30] dark:hover:bg-white/[0.02]",
      )}
    >
      <button
        type="button"
        onClick={() => setOpenIndex(index)}
        className="flex w-full items-center justify-between gap-4 px-4 py-2"
      >
        <h3
          className={cn(
            "text-left text-sm font-medium transition-colors duration-200 lg:text-base",
            "text-gray-700 dark:text-gray-300",
            isOpen && "text-gray-900 dark:text-white",
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "flex-shrink-0 rounded-full p-0.5",
            "transition-colors duration-200",
            isOpen ? "text-primary" : "text-gray-400 dark:text-gray-500",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <div className="px-6 pb-4">
              <motion.p
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="text-sm leading-relaxed text-gray-600 dark:text-gray-400"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SignUpFaq({ onSubmit }: { onSubmit: () => void }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [icons, setIconsData] =
    useState<Awaited<ReturnType<typeof fetchSimpleIcons>>>();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    void fetchSimpleIcons({ slugs: ["discord", "instagram"] }).then(
      setIconsData,
    );
  }, []);

  const bgHex = resolvedTheme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = resolvedTheme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = resolvedTheme === "dark" ? 2 : 1.2;

  return (
    <div className="container mx-auto -mt-4 max-w-sm">
      <h2 className="mb-3 text-center text-xl text-black drop-shadow-[0.05em_0.05em_1px_#000000] dark:text-white dark:drop-shadow-[0.05em_0.05em_1px_#cbd5e1]">
        CODE OF TRUST
      </h2>

      <div className="mx-auto max-w-2xl space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            {...faq}
            index={index}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
          />
        ))}
      </div>
      <p className="mt-2 text-center font-mono text-xs font-semibold text-muted-foreground lg:text-sm">
        Trust finds its way, in its own time...
      </p>
      <div className="mx-auto flex max-w-sm items-center gap-2 px-3 pt-2">
        <Image
          alt="GKkrish"
          width={64}
          height={64}
          priority
          src="https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/gk.jpeg"
          className="h-14 w-14 rounded-full"
        />
        <div className="flex flex-1 flex-col items-center">
          <h3 className="text-sm text-foreground lg:text-base">
            Gokulakrishnan{" "}
            <span className="align-super text-[0.65rem] text-foreground drop-shadow-[0.05em_0.03em_0.5px_#000000] dark:drop-shadow-[0.05em_0.03em_0.5px_#cbd5e1] lg:text-xs">
              [GK]
            </span>
          </h3>
          <p className="text-xs font-light text-muted-foreground lg:text-sm">
            Kanchipuram, TN
          </p>
        </div>
        <div className="flex items-center justify-evenly gap-2">
          <a
            href="mailto:mysteryverse.co@gmail.com"
            onClick={async () => {
              await navigator.clipboard.writeText("mysteryverse.co@gmail.com");
              toast.info("Mail copied to your clipboard!", {
                duration: 1500,
              });
            }}
          >
            <Mail
              size={22}
              className="transition-transform duration-300 hover:scale-110"
            />
          </a>
          {icons?.simpleIcons.instagram
            ? renderSimpleIcon({
                icon: icons.simpleIcons.instagram,
                size: 20,
                bgHex,
                fallbackHex,
                minContrastRatio,
                aProps: {
                  href: "https://www.instagram.com/gkkrish_16/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "transition-transform duration-300 hover:scale-110",
                },
              })
            : null}
          {icons?.simpleIcons.discord
            ? renderSimpleIcon({
                icon: icons.simpleIcons.discord,
                size: 22,
                bgHex,
                fallbackHex,
                minContrastRatio,
                aProps: {
                  href: "https://discord.gg/4spYKVDe",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "transition-transform duration-300 hover:scale-110",
                },
              })
            : null}
        </div>
      </div>
      <div className="flex w-full justify-center pt-2">
        <Button
          onClick={onSubmit}
          className={cn(
            "rounded-md px-4 py-2 text-sm",
            "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
            "hover:bg-gray-800 dark:hover:bg-gray-100",
            "transition-colors duration-200",
            "font-medium",
          )}
        >
          Continue Sign Up...
        </Button>
      </div>
    </div>
  );
}

export default SignUpFaq;
