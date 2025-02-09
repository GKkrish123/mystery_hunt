"use client";

import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchSimpleIcons, renderSimpleIcon } from "react-icon-cloud";
import { toast } from "sonner";

export function MyProfile({ className }: { className?: string }) {
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
    <div
      className={cn(
        "group flex h-52 w-52 flex-col items-center justify-center rounded-3xl bg-slate-200 p-4 shadow-sm transition-all duration-300 hover:shadow-black/25 dark:bg-zinc-800",
        className,
      )}
    >
      <Image
        alt="GKkrish"
        width={64}
        height={64}
        priority
        src="https://storage.googleapis.com/gkrish-mystery-hunt.firebasestorage.app/gk.jpeg"
        className="h-16 w-16 rounded-full duration-300 ease-in-out hover:scale-125"
      />
      <div className="mt-2 flex flex-col items-center justify-center">
        <h3 className="text-sm text-foreground lg:text-base">
          Gokulakrishnan{" "}
          <span className="align-super text-[0.65rem] text-foreground drop-shadow-[0.05em_0.03em_0.5px_#000000] dark:drop-shadow-[0.05em_0.03em_0.5px_#cbd5e1] lg:text-xs">
            [GK]
          </span>
        </h3>
        <p className="text-sm font-light text-muted-foreground">
          Kanchipuram, Tamil Nadu
        </p>
      </div>
      <div className="mt-2 flex w-full flex-row justify-evenly rounded-3xl bg-background/70 p-2 text-foreground dark:bg-background/25">
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
                className: "transition-transform duration-300 hover:scale-110",
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
                href: "https://discord.gg/st8HvpczDR",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "transition-transform duration-300 hover:scale-110",
              },
            })
          : null}
      </div>
    </div>
  );
}
