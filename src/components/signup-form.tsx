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
import { RecaptchaVerifier, signInWithEmailAndPassword} from "firebase/auth";
import { useEffect, useState, useTransition } from "react";
import { auth } from "firebase";
import Loader from "./ui/loader";
import { toast } from "sonner";
import { AvatarUpload } from "./avatar-upload";
import { PhoneInput } from "./ui/phone-input";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import ThemeToggle from "./ui/theme-toggle";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { CalendarIcon, Rainbow } from "lucide-react";
import GenderTrans from "@/components/icons/gender-trans.svg";
import GenderMale from "@/components/icons/gender-male.svg";
import GenderFemale from "@/components/icons/gender-female.svg";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "So, You are Nobody?"
  }),
  dob: z.date(),
  gender: z.string().min(1, {
    message: "So, You are Nobody?"
  }),
  email: z.string().min(1, {
    message: "Are you from 1200BC?"
  }),
  password: z.string().min(1, {
    message: "Do you really think you can pass without this?"
  }),
  confirmPassword: z.string().min(1, {
    message: "Do you really think you can pass without this?"
  }),
  profilePic: z.string().min(1, {
    message: "Do you really think you can pass without this?"
  }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .refine((value) => parsePhoneNumber(value)?.country === "IN", { message: "Currently, no mysteries in places other than India" })
}).refine(schema => schema.confirmPassword === schema.password, { message: "Passwords are not matching" })

export function SignupForm() {
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      phone: "",
      email: "",
      password: "",
      profilePic: ""
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
        console.log("Error during signing up user", error);
        toast("Something went wrong while adding you!", {
          description: "Please try again later."
        })
      }
    })
  };

  return (
    <>
      <ThemeToggle className="absolute top-2 right-2 bg-accent" />
      <Card className="mx-auto max-w-sm z-10">
        <CardHeader className="pb-5">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] smh:h-[350px] px-4 pb-3 scrollbar-shadow">
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : ""}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>)}
                  />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <ToggleGroup className="justify-start" size="lg" variant="outline" type="single" {...field} onValueChange={field.onChange}>
                          <ToggleGroupItem className="data-[state=on]:bg-sky-200 data-[state=on]:dark:bg-sky-500" value="male" aria-label="Toggle bold">
                            <GenderMale className="dark:fill-white" />
                          </ToggleGroupItem>
                          <ToggleGroupItem className="data-[state=on]:bg-rose-200 data-[state=on]:dark:bg-rose-500" value="female" aria-label="Toggle italic">
                            <GenderFemale className="dark:fill-white" />
                          </ToggleGroupItem>
                          <ToggleGroupItem className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-sky-200 data-[state=on]:to-rose-200 data-[state=on]:dark:from-sky-500 data-[state=on]:dark:to-rose-500" value="trans" aria-label="Toggle strikethrough">
                            <GenderTrans className="dark:fill-white" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            className="
                              data-[state=on]:bg-gradient-to-r data-[state=on]:from-red-300 data-[state=on]:via-yellow-300 data-[state=on]:via-blue-300 data-[state=on]:via-green-300 data-[state=on]:to-purple-300
                              data-[state=on]:dark:bg-gradient-to-r data-[state=on]:dark:from-red-500 data-[state=on]:dark:via-yellow-500 data-[state=on]:dark:via-blue-500 data-[state=on]:dark:via-green-500 data-[state=on]:dark:to-purple-500
                            "
                            value="rainbow"
                            aria-label="Toggle strikethrough"
                          >
                            <Rainbow style={{
                              width: "1.25rem",
                              height: "1.25rem",
                            }} />
                          </ToggleGroupItem>
                      </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profilePic"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-center items-center">
                      <FormLabel className="w-full start">Profile Picture</FormLabel>
                      <FormControl>
                        <AvatarUpload {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl className="z-10">
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                  </> : "Sign Up"}
                </Button>
              </form>
            </Form>
          </div>
          <ScrollBar />
          </ScrollArea>
          <div className="pb-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
        <div id="recaptcha-container"></div>
      </Card>
    </>
  )
}
