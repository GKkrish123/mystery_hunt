import { cn } from "@/lib/utils";
import { Dribbble, Facebook, Linkedin, X } from "lucide-react";
import Image from "next/image";

export function MyProfile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group flex h-52 w-52 flex-col items-center justify-center rounded-3xl bg-slate-200 p-4 shadow-sm transition-all duration-300 hover:shadow-black/25 dark:bg-zinc-800",
        className,
      )}
    >
      <Image
        alt="Avatar"
        width={64}
        height={64}
        priority
        src="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
        className="h-16 w-16 rounded-full duration-300 ease-in-out hover:scale-125"
      />
      <div className="mt-2 flex flex-col items-center justify-center">
        <h3 className="font-sans font-semibold text-foreground">GK</h3>
        <p className="text-sm font-light text-muted-foreground">
          Gokulakrishnan
        </p>
      </div>
      <div className="mt-2 flex w-full flex-row justify-evenly rounded-3xl bg-background/70 p-2 text-foreground dark:bg-background/25">
        <a
          href="https://x.com/?lang=en&mx=2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <X
            size={18}
            className="transition-transform duration-300 hover:scale-110"
          />
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin
            size={16}
            className="transition-transform duration-300 hover:scale-110"
          />
        </a>
        <a
          href="https://dribbble.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Dribbble
            size={16}
            className="transition-transform duration-300 hover:scale-110"
          />
        </a>
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook size={16} className="duration-300 hover:scale-110" />
        </a>
      </div>
    </div>
  );
}
