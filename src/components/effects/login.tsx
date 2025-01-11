"use client";

import dynamic from "next/dynamic";

const Meteors = dynamic(() => import("@/components/ui/meteors"), {
  ssr: false,
});
const RetroGrid = dynamic(() => import("@/components/ui/retro-grid"), {
  ssr: false,
});
const Ripple = dynamic(() => import("@/components/ui/ripple"), {
  ssr: false,
});

const LetterPullup = dynamic(() => import("@/components/ui/letter-pullup"), {
  ssr: false,
});

export default function LoginEffects() {
  return (
    <>
      <Meteors key="login-meteors" number={30} />
      <Ripple key="login-ripple" />
      <RetroGrid key="login-retro" />
      <LetterPullup
        className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text py-5 text-center text-4xl font-bold text-transparent dark:text-transparent md:py-0"
        words="Mysteryverse"
      />
    </>
  );
}

export function VerifyEffects() {
  return (
    <>
      <Meteors key="login-meteors" number={30} />
      <Ripple key="login-ripple" />
      <RetroGrid key="login-retro" />
    </>
  );
}
