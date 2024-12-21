import BlurFade from "@/components/ui/blur-fade";
import LetterPullup from "@/components/ui/letter-pullup";
import Meteors from "@/components/ui/meteors";
import RetroGrid from "@/components/ui/retro-grid";
import Ripple from "@/components/ui/ripple";
import { default as dynamicImport } from "next/dynamic";

const SignupForm = dynamicImport(() =>
  import("@/components/signup-form").then((mod) => mod.SignupForm),
);
const LoginForm = dynamicImport(() =>
  import("@/components/login-form").then((mod) => mod.LoginForm),
);

interface LoginPageProps {
  searchParams: Promise<{ signup?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { signup } = await searchParams;
  const isSignup = signup === "true";

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden px-4">
      <Meteors key="login-meteors" number={30} />
      <LetterPullup
        className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text py-5 text-center text-4xl font-bold text-transparent dark:text-transparent md:py-0"
        words="Mysteryverse"
      />
      <BlurFade
        key={isSignup ? "signup" : "login"}
        className="z-10"
        yOffset={0}
        delay={0.25}
      >
        {isSignup ? <SignupForm /> : <LoginForm />}
      </BlurFade>
      <Ripple key="login-ripple" />
      <RetroGrid key="login-retro" />
    </div>
  );
}

export const revalidate = 3600;
export const fetchCache = "force-cache";
export const metadata = {
  title: "Mysteryverse Login",
  description: "This is the login page for Mysteryverse.",
};
