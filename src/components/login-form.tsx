"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RecaptchaVerifier, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState, useTransition } from "react";
import { auth } from "firebase";
import Loader from "./ui/loader";
import { toast } from "sonner";
import { useAuth } from "./auth-provider";
import ThemeToggle from "./ui/theme-toggle";
import { FirebaseError } from "firebase/app";
 
const formSchema = z.object({
  email: z.string().min(1, {
    message: "Are you a ghost?"
  }),
  password: z.string().min(1, {
    message: "Do you really think you can pass without this?"
  }),
})

export function LoginForm() {
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isLoading, startTransition] = useTransition();
  const { user } = useAuth();

  console.log("user", user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const newRecaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible"
      }
    );

    setRecaptchaVerifier(newRecaptchaVerifier);

    return () => {
      recaptchaVerifier?.clear()
    }
  }, [auth]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        form.clearErrors();
        await signInWithEmailAndPassword(auth, values.email, values.password);        
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
                description: "Too many attempts. Take a breath and try again later.",
              });
              break;
            default:
              console.error("Authentication error during logging in user", error);
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
    })
  };

  return (
    <>
      <ThemeToggle className="absolute top-2 right-2 bg-accent" />
      <Card className="mx-auto max-w-sm z-10">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? <>
                    <Loader className="text-white"/> Checking you...
                  </> : "Login"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/login?signup=true" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
        <div id="recaptcha-container"></div>
      </Card>
    </>
  )
}
