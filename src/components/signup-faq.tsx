"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

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
            <div className="px-6 pb-4 pt-2">
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
  const faqs: Omit<FAQItemProps, "index" | "openIndex" | "setOpenIndex">[] = [
    {
      question: "Why Phone Number?",
      answer:
        "Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something.",
    },
    {
      question: "Why Profile Picture?",
      answer:
        "Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something",
    },
    {
      question: "Why Email Address?",
      answer:
        "Something Something Something Something Something Something Something Something Something Something Something..",
    },
    {
      question: "Why Mysteryverse?",
      answer:
        "Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="container mx-auto max-w-sm">
      <h2 className="mb-3 text-center text-xl font-semibold text-black dark:text-white">
        The Trust Code
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
      <div className="mx-auto max-w-sm pt-3 text-center">
        {/* <div className="mb-4 inline-flex items-center justify-center rounded-full">
          <Mail className="h-4 w-4" />
        </div> */}
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Still have second thoughts?
        </p>
        <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">
          I am ahh ahh blah...
        </p>
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
          Continue SignUp...
        </Button>
      </div>
    </div>
  );
}

export default SignUpFaq;
