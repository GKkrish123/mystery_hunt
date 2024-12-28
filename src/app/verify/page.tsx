"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/components/auth-provider";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useInterval } from "@mantine/hooks";
import { ArrowRightIcon } from "lucide-react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { auth } from "firebase-user";
import dynamic from "next/dynamic";

const BlurFade = dynamic(() => import("@/components/ui/blur-fade"), {
  ssr: false,
});
const RainbowButton = dynamic(
  () =>
    import("@/components/ui/rainbow-button").then((mod) => mod.RainbowButton),
  { ssr: false },
);
const HyperText = dynamic(() => import("@/components/ui/hyper-text"), {
  ssr: false,
});
const AppLoader = dynamic(() => import("@/components/ui/app-loader"), {
  ssr: false,
});
const Loader = dynamic(() => import("@/components/ui/loader"), { ssr: false });
const AnimatedShinyText = dynamic(
  () =>
    import("@/components/ui/animated-shiny-text").then(
      (mod) => mod.AnimatedShinyText,
    ),
  { ssr: false },
);
const LoginEffects = dynamic(() => import("@/components/effects/login"), {
  ssr: false,
});

const RETRY_INTERVAL = 30;

const VerifyEmailPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { mutateAsync } = api.user.verifiedUser.useMutation();
  const [completionStatus, startCompletion] = useTransition();
  const [sendingStatus, startSending] = useTransition();
  const [retryCountdown, setRetryCountdown] = useState(RETRY_INTERVAL);
  const retryInterval = useInterval(
    () => setRetryCountdown((s) => s - 1),
    1000,
  );

  useEffect(() => {
    if (retryCountdown === 0) {
      retryInterval.stop();
      setRetryCountdown(RETRY_INTERVAL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCountdown]);

  async function verifyEmailWithLink() {
    try {
      if (user && retryCountdown === RETRY_INTERVAL) {
        await user.reload();
        if (user.emailVerified) {
          await handleVerifiedEmail();
          return;
        }
        startSending(async () => {
          await sendEmailVerification(user, {
            url: new URL("/verify", window.location.href).toString(),
            handleCodeInApp: true,
          });
          toast.success("Email verification link sent", {
            description: "Check your inbox for the verification link.",
          });
          retryInterval.start();
        });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Handle Firebase-specific errors
        switch (error.code) {
          case "auth/too-many-requests":
            toast.error("Doors have been tried too many times", {
              description:
                "Too many attempts. Take a breath and try again later.",
            });
            break;
          default:
            console.error("Error during user email verification", error);
            toast.error("Unknown forces of the universe have interrupted", {
              description: "Something went wrong. Please try again later.",
            });
            break;
        }
      } else {
        // Fallback for generic errors
        console.error("Error during email verification", error);
        toast.error("Something went wrong while verifying you!", {
          description: "Please try again later.",
        });
      }
    }
  }

  async function handleVerifiedEmail() {
    if (user && !user?.displayName) {
      startCompletion(async () => {
        await mutateAsync();
        const token = await user?.getIdTokenResult(true);
        const expirationTime = new Date(token.expirationTime).getTime();
        await setCookie("token", token.token);
        await setCookie("token-boom", expirationTime);
        router.replace("/");
      });
    } else {
      router.replace("/");
    }
  }

  const onCheckClick = async () => {
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        await handleVerifiedEmail();
        toast.success("You are verified!", {
          description: "You can continue to the realm of mysteries.",
        });
      } else {
        toast.error("You are not verified", {
          description:
            "If you think you are verified please check again later.",
        });
      }
    }
  };

  const handleTokenExpiry = async () => {
    const token = await getCookie("token");
    const tokenBoom = await getCookie("token-boom");
    if (
      (user && !token) ||
      !tokenBoom ||
      Date.now() >= parseInt(tokenBoom, 10)
    ) {
      await deleteCookie("token");
      await deleteCookie("token-boom");
      await auth.signOut();
      toast.error("Your Access Token got BOOM!", {
        description: "Please login again to continue.",
      });
      router.replace("/login");
      return false;
    }
    return true;
  };

  const handleVerification = async () => {
    const isValid = await handleTokenExpiry();
    if (isValid && user?.emailVerified) {
      await handleVerifiedEmail();
    }
  };

  useEffect(() => {
    void handleVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden px-4">
      <LoginEffects />
      {user?.emailVerified || !user ? (
        <AppLoader />
      ) : (
        <>
          <BlurFade className="z-10" yOffset={0} delay={0.25}>
            {completionStatus ? (
              <AppLoader />
            ) : (
              <>
                <HyperText
                  wrapperClassName="justify-center lowercase pb-4"
                  text={user?.email ?? ""}
                />
                <RainbowButton
                  disabled={retryCountdown !== RETRY_INTERVAL}
                  className="w-full"
                  onClick={verifyEmailWithLink}
                >
                  {sendingStatus ? (
                    <Loader className="h-7 w-7 text-black" />
                  ) : retryCountdown !== RETRY_INTERVAL ? (
                    `Retry after ${retryCountdown} seconds`
                  ) : (
                    "Verify Email to Continue"
                  )}
                </RainbowButton>
                <div className="mt-5 flex w-full justify-center">
                  <div
                    onClick={onCheckClick}
                    className="group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  >
                    <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 text-sm text-neutral-700 transition ease-out hover:text-neutral-800 hover:duration-300 dark:text-neutral-300 hover:dark:text-neutral-200 md:text-base">
                      <span>✨ Check if you are already verified</span>
                      <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    </AnimatedShinyText>
                  </div>
                </div>
              </>
            )}
          </BlurFade>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
