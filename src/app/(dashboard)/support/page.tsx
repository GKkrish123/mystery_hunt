import { MyProfile } from "@/components/my-profile";
import Particles from "@/components/ui/particles";
import { PinContainer } from "@/components/ui/td-pin";

export default function SupportPage() {
  return (
    <>
      <div className="relative grid h-full auto-rows-min grid-cols-1 gap-3 overflow-hidden px-3 pb-3 pt-0 sm:grid-cols-2 md:grid-cols-5 md:px-4 md:pb-4">
        <div className="col-span-full flex h-[23rem] w-full items-center justify-center md:h-[30rem]">
          <PinContainer
            title="/gkkrish123.git"
            href="https://github.com/gkkrish123"
          >
            <div className="flex h-[17rem] w-[15rem] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 md:h-[20rem] md:w-[20rem]">
              <h3 className="!m-0 max-w-xs !pb-2 text-base font-bold text-black dark:text-slate-100 md:text-lg">
                Treasure Chest of Funds
              </h3>
              <div className="!m-0 !p-0 text-sm font-normal md:text-base">
                <span className="text-slate-600 dark:text-slate-400">
                  Be Part of the Mysteryverse: Your Support Powers the Journey!
                </span>
              </div>
              <div className="mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
            </div>
          </PinContainer>
        </div>
        <MyProfile className="col-span-full justify-self-center" />
      </div>
      <Particles
        className="absolute inset-0 z-[-1]"
        quantity={100}
        ease={80}
        size={4}
        refresh
      />
    </>
  );
}
