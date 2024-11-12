import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import BlurFade from "@/components/ui/blur-fade"
import LetterPullup from "@/components/ui/letter-pullup"
import Meteors from "@/components/ui/meteors"
import RetroGrid from "@/components/ui/retro-grid"
import Ripple from "@/components/ui/ripple"

export default async function LoginPage({ searchParams }: { searchParams: { signup?: string } }) {  
  const { signup } = await searchParams;
  const isSignup = signup === "true";

  return (
    <div className="relative overflow-hidden flex flex-col gap-2 h-screen w-full items-center justify-center px-4">
      <Meteors key="login-meteors" number={30} />
      <LetterPullup
        className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-5xl sm:text-7xl font-bold leading-none tracking-tighter text-transparent dark:text-transparent"
        words="Mysteryverse"
      />
      <BlurFade key={isSignup ? 'signup' : 'login'} className="z-10" yOffset={0} delay={0.25}>
        {isSignup ? <SignupForm /> : <LoginForm />}
      </BlurFade>
      <Ripple key="login-ripple" />
      <RetroGrid key="login-retro" />
    </div>
  )
}
