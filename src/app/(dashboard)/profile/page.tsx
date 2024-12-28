"use client";

import { cn, compressBase64Image } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mysteryFont } from "@/lib/fonts";

import { default as dynamicImport } from "next/dynamic";

const AvatarUpload = dynamicImport(() => import("@/components/avatar-upload").then(mod => mod.AvatarUpload), { ssr: false });
const AnimatedGradientText = dynamicImport(() => import("@/components/ui/animated-gradient-text").then(mod => mod.AnimatedGradientText), { ssr: false });
const AppLoader = dynamicImport(() => import("@/components/ui/app-loader").then(mod => mod.default), { ssr: false });
const BlurIn = dynamicImport(() => import("@/components/ui/blur-in").then(mod => mod.default), { ssr: false });
const Button = dynamicImport(() => import("@/components/ui/button").then(mod => mod.Button), { ssr: false });
const Dialog = dynamicImport(() => import("@/components/ui/dialog").then(mod => mod.Dialog), { ssr: false });
const DialogContent = dynamicImport(() => import("@/components/ui/dialog").then(mod => mod.DialogContent), { ssr: false });
const DialogDescription = dynamicImport(() => import("@/components/ui/dialog").then(mod => mod.DialogDescription), { ssr: false });
const DialogFooter = dynamicImport(() => import("@/components/ui/dialog").then(mod => mod.DialogFooter), { ssr: false });
const DialogHeader = dynamicImport(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader), { ssr: false });
const DialogTitle = dynamicImport(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle), { ssr: false });
const DialogTrigger = dynamicImport(() => import("@/components/ui/dialog").then(mod => mod.DialogTrigger), { ssr: false });
const GradualSpacing = dynamicImport(() => import("@/components/ui/gradual-spacing").then(mod => mod.GradualSpacing), { ssr: false });
const Input = dynamicImport(() => import("@/components/ui/input").then(mod => mod.Input), { ssr: false });
const Label = dynamicImport(() => import("@/components/ui/label").then(mod => mod.Label), { ssr: false });
const LampContainer = dynamicImport(() => import("@/components/ui/lamp").then(mod => mod.LampContainer), { ssr: false });
const Loader = dynamicImport(() => import("@/components/ui/loader").then(mod => mod.default), { ssr: false });
const Tag3d = dynamicImport(() => import("@/components/ui/three-d-Tag").then(mod => mod.default), {
  ssr: false,
});

const InfoBlock = ({
  title,
  text,
  className,
}: {
  title: string;
  text: string;
  className?: string;
}) => (
  <div
    className={cn("z-[1] col-span-1 flex flex-col gap-1 md:gap-2", className)}
  >
    <AnimatedGradientText>
      <span
        className={cn(
          "inline animate-gradient text-[0.8rem] tracking-wide text-black dark:text-white md:text-base",
          mysteryFont.className,
        )}
      >
        {title}
      </span>
    </AnimatedGradientText>
    <GradualSpacing
      key={text}
      className={cn(
        "text-center text-xs -tracking-widest text-black dark:text-white md:text-sm",
      )}
      text={text}
    />
  </div>
);

const EditableNameBlock = ({
  name,
  setName,
  userData,
  isLoading,
  onNameChange,
  modalOpen,
  setModalOpen,
}: {
  name: string;
  setName: (name: string) => void;
  userData: { name: string };
  isLoading: boolean;
  onNameChange: () => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}) => (
  <div className="z-[1] col-span-1 flex flex-col gap-1 md:gap-2">
    <AnimatedGradientText>
      <span
        className={cn(
          "inline animate-gradient text-[0.8rem] tracking-wide text-black dark:text-white md:text-base",
          mysteryFont.className,
        )}
      >
        Name
      </span>
      <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
        <DialogTrigger asChild onClick={() => setModalOpen(true)}>
          <Pencil className="z-[1] ml-2 inline h-3 w-3 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
            <DialogDescription>
              Choose wisely, names have power!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                name === userData.name ||
                !name ||
                name.length < 3 ||
                name.length > 50
              }
              onClick={onNameChange}
            >
              {isLoading ? (
                <>
                  <Loader className="text-white dark:text-black" /> Changing
                  name...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedGradientText>
    <GradualSpacing
      key={userData.name}
      className={cn(
        "text-center text-xs -tracking-widest text-black dark:text-white md:text-sm",
      )}
      text={userData.name}
    />
  </div>
);

export default function ProfilePage() {
  const {
    data: userData,
    isPending: userDataLoading,
    refetch,
  } = api.user.getUser.useQuery(undefined, {
    enabled: false,
  });

  const [name, setName] = useState("");
  const [proPic, setProPic] = useState<string | undefined>("");
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [proPicModalOpen, setProPicModalOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setProPic(userData.proPicUrl);
    }
  }, [userData]);

  const { mutateAsync: nameMutate, isPending: isNameSaving } =
    api.user.setUserName.useMutation();
  const { mutateAsync: proPicMutate, isPending: isProPicSaving } =
    api.user.setProfilePic.useMutation();
  const proPicUpdateCooldown = !userData?.proPicUpdatedAt
    ? 0
    : userData?.proPicUpdatedAt - Date.now() + 86400000;

  const onNameChange = async () => {
    if (name === userData?.name) {
      return;
    }

    try {
      await nameMutate({ name });
      setNameModalOpen(false);
      await refetch();
      toast.success("Name updated successfully!", {
        description:
          "Remember, a name's just a name if you don't bring your game!",
      });
    } catch (error) {
      console.error("Error in updating name", error);
      toast.error("Oops, Something went wrong while updating your name!", {
        description: "This shouldn’t have happened but please try again later.",
      });
    }
  };

  const onProPicChange = async () => {
    if (!proPic) {
      return;
    }

    try {
      await proPicMutate({
        profilePic: await compressBase64Image(proPic, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/jpeg",
        }),
      });
      setProPicModalOpen(false);
      await refetch();
      toast.success("Profile picture updated successfully!", {
        description: "Remember, a single frame can rewrite your tale!",
      });
    } catch (error) {
      console.error("Error in updating profile picture", error);
      toast.error(
        "Oops, Something went wrong while updating your profile picture!",
        {
          description:
            "Please try again later with a different picture or try again later.",
        },
      );
    }
  };

  return (
    <>
      <div className="relative grid h-full w-full auto-rows-min grid-cols-2 gap-x-14 gap-y-10 overflow-hidden px-3 pb-3 pt-0 md:gap-x-32 md:px-4 md:pb-4">
        <BlurIn
          word="Profile"
          className={cn(
            "col-span-full mx-auto h-8 text-3xl font-bold text-black dark:text-white md:h-10 md:text-4xl",
            mysteryFont.className,
          )}
        />
        {!userData || userDataLoading ? (
          <AppLoader className="absolute" />
        ) : (
          <>
            <EditableNameBlock
              name={name}
              modalOpen={nameModalOpen}
              setModalOpen={setNameModalOpen}
              setName={setName}
              userData={userData}
              isLoading={isNameSaving}
              onNameChange={onNameChange}
            />
            <InfoBlock
              title="Date of Birth"
              text={new Date(userData.dob.seconds * 1000).toDateString()}
            />
            <InfoBlock title="Phone Number" text={userData.phoneNo} />
            <InfoBlock
              title="Gender"
              text={
                userData.gender.slice(0, 1).toUpperCase() +
                userData.gender.slice(1)
              }
            />
            <InfoBlock
              title="Email Address"
              text={userData.email}
              className="col-span-2 md:col-span-1"
            />
            <InfoBlock title="Country" text={userData.country} />
            <InfoBlock title="State" text={userData.state} />
            <InfoBlock title="City" text={userData.city} />
            <InfoBlock
              title="Score"
              text={`${userData.scoreBoard.totalScore}`}
            />
          </>
        )}
      </div>
      <div className="absolute h-full w-full">
        {!userData || userDataLoading ? null : (
          <>
            <Tag3d
              key={userData.proPicUrl}
              image={userData.proPicUrl}
              onDoubleClick={() => setProPicModalOpen(true)}
            />
            <Dialog
              open={proPicModalOpen}
              onOpenChange={(open) => setProPicModalOpen(open)}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile Picture</DialogTitle>
                  <DialogDescription>
                    A single frame can rewrite your tale, choose cautiously!
                  </DialogDescription>
                  <DialogDescription>
                    <small>
                      <strong>Note:</strong> Profile picture can be updated only
                      once in 24 hours.
                    </small>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-2 py-4">
                  <Label className="text-center">Profile Picture</Label>
                  <AvatarUpload
                    value={proPic}
                    onChange={(value) => setProPic(value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={
                      !proPic ||
                      proPic === userData.proPicUrl ||
                      isProPicSaving ||
                      proPicUpdateCooldown > 0
                    }
                    onClick={onProPicChange}
                  >
                    {isProPicSaving ? (
                      <>
                        <Loader className="text-white dark:text-black" />{" "}
                        Changing picture...
                      </>
                    ) : proPicUpdateCooldown > 0 ? (
                      `Not Now...`
                    ) : (
                      "Save"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
      <LampContainer />
    </>
  );
}


export const dynamic = "force-dynamic";
