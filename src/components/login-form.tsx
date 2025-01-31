"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RecaptchaVerifier,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState, useTransition } from "react";
import { auth } from "firebase-user";
import Loader from "./ui/loader";
import { toast } from "sonner";
import ThemeToggle from "./ui/theme-toggle";
import { FirebaseError } from "firebase/app";
import { setCookie } from "cookies-next";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Eye, EyeClosed } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Are you a ghost?",
    })
    .email({ message: "That doesn't look like a good email address." }),
  password: z.string().min(1, {
    message: "Do you really think you can pass without this?",
  }),
});

export function LoginForm() {
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [hidePassword, setHidePassword] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = form.watch("email");
  const isEmailValid = !form.formState.errors.email && email.trim() !== "";

  useEffect(() => {
    const newRecaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      },
    );

    setRecaptchaVerifier(newRecaptchaVerifier);

    return () => {
      recaptchaVerifier?.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        form.clearErrors();
        const user = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
        const token = await user.user.getIdTokenResult();
        await setCookie("token", token.token);
        await setCookie("token-boom", new Date(token.expirationTime).getTime());
      } catch (error) {
        if (error instanceof FirebaseError) {
          // Handle Firebase-specific errors
          switch (error.code) {
            case "auth/invalid-credential":
              toast.error("Entry refused. Credentials don’t match", {
                description: "Please check your credentials to enter.",
              });
              break;
            case "auth/invalid-email":
              toast.error("Email is not formatted for this world", {
                description: "Please check your email address.",
              });
              break;
            case "auth/invalid-password":
              toast.error("Password doesn’t align with the cryptic forces.", {
                description: "Please check your password.",
              });
              break;
            case "auth/too-many-requests":
              toast.error("Doors have been tried too many times", {
                description:
                  "Too many attempts. Take a breath and try again later.",
              });
              break;
            default:
              console.error(
                "Authentication error during logging in user",
                error,
              );
              toast.error("Unknown forces of the universe have interrupted", {
                description: "Something went wrong. Please try again later.",
              });
              break;
          }
        } else {
          // Fallback for generic errors
          console.error("Error during logging in user", error);
          toast.error("Something went wrong while checking you!", {
            description: "Please try again later.",
          });
        }
      }
    });
  }

  const handleForgotPassword = async () => {
    if (!isEmailValid) {
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email, {
        url: new URL("/login", window.location.href).toString(),
        handleCodeInApp: true,
      });
      toast.success("Email sent successfully", {
        description: "Check your email for the reset link.",
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Error during sending password reset email", error);
        switch (error.code) {
          case "auth/invalid-email":
            toast.error("Email is not formatted for this world", {
              description: "Please check your email address.",
            });
            break;
          case "auth/user-not-found":
            toast.error("No one with this email exists", {
              description: "Please check your email address.",
            });
            break;
          default:
            console.error("Error during sending password reset email", error);
            toast.error("Unknown forces of the universe have interrupted", {
              description: "Something went wrong. Please try again later.",
            });
            break;
        }
      } else {
        console.error("Error during sending password reset email", error);
        toast.error("Something went wrong while sending the email!", {
          description: "Please try again later.",
        });
      }
    }
  };

  return (
    <>
      <Card className="relative z-10 mx-auto max-w-sm">
        <ThemeToggle className="absolute right-2 top-2 bg-accent" />
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your secret to open the mystery gateway
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl className="z-10">
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={!hidePassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-2 top-1 h-7 w-7 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              setHidePassword(!hidePassword);
                            }}
                          >
                            {hidePassword ? (
                              <EyeClosed className="h-7 w-7 opacity-40" />
                            ) : (
                              <Eye className="h-7 w-7" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? (
                    <>
                      <Loader className="text-white" /> Checking you...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 flex w-full justify-center text-sm">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="cursor-pointer underline"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                hidden={isEmailValid}
                className="mb-4 rounded-md border-2 border-red-300 bg-red-100 p-2 px-8 text-red-700"
              >
                Enter a valid email to reset password
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-3 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/login?signup=true"
              className="underline decoration-double underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
        <div id="recaptcha-container"></div>
      </Card>
    </>
  );
}
