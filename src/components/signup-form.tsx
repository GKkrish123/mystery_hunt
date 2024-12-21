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
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState, useTransition } from "react";
import { auth } from "firebase-user";
import Loader from "./ui/loader";
import { toast } from "sonner";
import { AvatarUpload } from "./avatar-upload";
import { PhoneInput } from "./ui/phone-input";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import ThemeToggle from "./ui/theme-toggle";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { CalendarIcon, Eye, EyeClosed, Rainbow } from "lucide-react";
import GenderTrans from "@/components/icons/gender-trans.svg";
import GenderMale from "@/components/icons/gender-male.svg";
import GenderFemale from "@/components/icons/gender-female.svg";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn, compressBase64Image } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/trpc/react";
import { FirebaseError } from "firebase/app";
import { setCookie } from "cookies-next";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "So, You are Nobody?",
      })
      .min(3, {
        message: "Name is tooo LONG",
      })
      .max(50, {
        message: "Ok, That's too much",
      }),
    dob: z.date(),
    gender: z.string().min(1, {
      message: "So, You are Nobody?",
    }),
    email: z
      .string()
      .min(1, {
        message: "Are you from 1200BC?",
      })
      .email({ message: "That doesn't look like a good email address." }),
    country: z.string().min(1, {
      message: "Area 51?",
    }),
    state: z.string().min(1, {
      message: "Backrooms?",
    }),
    city: z.string().min(1, {
      message: "Undercover?",
    }),
    password: z
      .string()
      .min(1, {
        message: "Do you really think you can pass without this?",
      })
      .refine((password) => password.length >= 8, {
        message:
          "Your key is too short; the portal demands at least 8 characters.",
      })
      .refine((password) => /[A-Z]/.test(password), {
        message: "One uppercase character is missing from your password.",
      })
      .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: "One special character is required to unlock.",
      })
      .refine((password) => /\d/.test(password), {
        message: "At least single numeral is needed to complete the cipher.",
      }),
    confirmPassword: z.string().min(1, {
      message: "Do you really think you can pass without this?",
    }),
    profilePic: z.string().min(1, {
      message: "Do you really think you can pass without this?",
    }),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" })
      .refine((value) => parsePhoneNumber(value)?.country === "IN", {
        message: "Currently, no mysteries in places other than India",
      }),
  })
  .refine((schema) => schema.confirmPassword === schema.password, {
    path: ["confirmPassword"],
    message: "Passwords are not matching",
  });

export function SignupForm() {
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      phone: "",
      country: "India",
      state: "",
      city: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePic: "",
    },
  });

  const state = form.watch("state");
  const { data: statesData, isLoading: isStatesLoading } =
    api.user.getCountryStates.useQuery({
      country: "India",
    });
  const { data: citiesData, isLoading: isCitiesLoading } =
    api.user.getStateCities.useQuery(
      { state: state ?? "", country: "India" },
      { enabled: !!state },
    );
  const { mutateAsync } = api.user.createUser.useMutation();
  const { mutateAsync: checkDuplicateUser } =
    api.user.isAnyDuplicateUser.useMutation();

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

  const verifyPhoneNumber = async (phoneNumber: string) => {
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier!,
    );
    const otp = prompt("Enter the OTP sent to your phone") ?? "";
    if (!otp) {
      throw new Error("OTP not provided");
    }
    return { verificationCode: otp, verificationId };
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        form.clearErrors();
        await checkDuplicateUser({
          email: values.email,
          phoneNo: values.phone,
        });
        const { verificationCode, verificationId } = await verifyPhoneNumber(
          values.phone,
        );
        const signedUpUser = await mutateAsync({
          name: values.name,
          dob: values.dob,
          city: values.city,
          state: values.state,
          country: values.country,
          email: values.email,
          gender: values.gender,
          password: values.password,
          confirmPassword: values.confirmPassword,
          phoneNo: values.phone,
          verificationCode,
          verificationId,
          profilePic: await compressBase64Image(values.profilePic, {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: "image/jpeg",
          }),
        });
        if (!signedUpUser?.success) {
          throw signedUpUser?.error;
        }
        await setCookie("token", "temp-token");
        await setCookie("token-boom", Date.now() + 60 * 60 * 1000);
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast("Welcome to the Mystery Hunter Club!", {
          description: "You are now a part of the mystery hunters.",
        });
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
            case "auth/weak-password":
              toast.error("Weak credentials detected!", {
                description: "Try with a stronger one",
              });
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
          const err = error as Error;
          if (/email already/i.exec(err.message)) {
            toast("Email already in use", {
              description: "Please try with a different email.",
            });
          } else if (/phone number already/i.exec(err.message)) {
            toast("Phone number already in use", {
              description: "Please try with a different phone number.",
            });
          } else if (/file size exceeds/i.exec(err.message)) {
            toast("Profile picture size exceeds 300 KB limit", {
              description: "Please try with a smaller image.",
            });
          } else {
            console.error(
              `Error during signing up user - ${JSON.stringify(error)}`,
            );
            toast("Something went wrong while adding you!", {
              description: "Please try again later.",
            });
          }
        }
      }
    });
  }

  return (
    <>
      <ThemeToggle className="absolute right-2 top-2 bg-accent" />
      <Card className="z-10 mx-auto max-w-sm">
        <CardHeader className="pb-5">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            The mystery portal is waiting to know you to begin
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="scrollbar-shadow h-[500px] px-4 pb-3 smh:h-[350px]">
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 px-1"
                >
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
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : ""}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              autoFocus
                              startMonth={new Date("1900-01-01")}
                              endMonth={new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            className="justify-start"
                            size="lg"
                            variant="outline"
                            type="single"
                            {...field}
                            onValueChange={field.onChange}
                          >
                            <ToggleGroupItem
                              className="data-[state=on]:bg-sky-200 data-[state=on]:dark:bg-sky-500"
                              value="male"
                              aria-label="Toggle bold"
                            >
                              <GenderMale className="dark:fill-white" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              className="data-[state=on]:bg-rose-200 data-[state=on]:dark:bg-rose-500"
                              value="female"
                              aria-label="Toggle italic"
                            >
                              <GenderFemale className="dark:fill-white" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-sky-200 data-[state=on]:to-rose-200 data-[state=on]:dark:from-sky-500 data-[state=on]:dark:to-rose-500"
                              value="trans"
                              aria-label="Toggle strikethrough"
                            >
                              <GenderTrans className="dark:fill-white" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-red-300 data-[state=on]:via-blue-300 data-[state=on]:via-green-300 data-[state=on]:via-yellow-300 data-[state=on]:to-purple-300 data-[state=on]:dark:bg-gradient-to-r data-[state=on]:dark:from-red-500 data-[state=on]:dark:via-blue-500 data-[state=on]:dark:via-green-500 data-[state=on]:dark:via-yellow-500 data-[state=on]:dark:to-purple-500"
                              value="rainbow"
                              aria-label="Toggle strikethrough"
                            >
                              <Rainbow
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                }}
                              />
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
                      <FormItem className="flex flex-col items-center justify-center">
                        <FormLabel className="start w-full">
                          Profile Picture
                        </FormLabel>
                        <FormControl>
                          <AvatarUpload {...field} />
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
                  <div className="flex gap-1">
                    <FormField
                      control={form.control}
                      name="country"
                      render={() => (
                        <FormItem className="w-1/3">
                          <FormLabel>Country</FormLabel>
                          <Select value="India">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="India">India</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="w-1/3">
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isStatesLoading || !statesData?.length}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {!isStatesLoading ? (
                                  <SelectValue
                                    placeholder={
                                      statesData?.length ? "" : "N/A"
                                    }
                                  />
                                ) : (
                                  <Loader className="mx-auto my-0 h-7 w-7" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statesData?.map((state) => (
                                <SelectItem
                                  key={`select-${state.state_code}`}
                                  value={state.name}
                                >
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="w-1/3">
                          <FormLabel>City</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isCitiesLoading || !citiesData?.length}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {!isCitiesLoading ? (
                                  <SelectValue
                                    placeholder={
                                      citiesData?.length ? "" : "N/A"
                                    }
                                  />
                                ) : (
                                  <Loader className="mx-auto my-0 h-7 w-7" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {citiesData?.map((city) => (
                                <SelectItem key={`select-${city}`} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={!hideConfirmPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              variant="ghost"
                              className="absolute right-2 top-1 h-7 w-7 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                setHideConfirmPassword(!hideConfirmPassword);
                              }}
                            >
                              {hideConfirmPassword ? (
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
                      "Sign Up"
                    )}
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
  );
}
