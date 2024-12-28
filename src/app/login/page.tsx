import dynamic from "next/dynamic";

const SignupForm = dynamic(() =>
  import("@/components/signup-form").then((mod) => mod.SignupForm),
);
const LoginForm = dynamic(() =>
  import("@/components/login-form").then((mod) => mod.LoginForm),
);

const BlurFade = dynamic(() => import("@/components/ui/blur-fade"));
const LoginEffects = dynamic(() => import("@/components/effects/login"));

interface LoginPageProps {
  searchParams: Promise<{ signup?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { signup } = await searchParams;
  const isSignup = signup === "true";

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden px-4">
      <LoginEffects />
      <BlurFade
        key={isSignup ? "signup" : "login"}
        className="z-10"
        yOffset={0}
        delay={0.25}
      >
        {isSignup ? <SignupForm /> : <LoginForm />}
      </BlurFade>
    </div>
  );
}
