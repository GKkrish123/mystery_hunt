"use client";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { navData } from "./nav-data";
import { api } from "@/trpc/react";
import AppLoader from "./ui/app-loader";

import dynamic from "next/dynamic";

const RetroGrid = dynamic(
  () => import("./ui/retro-grid").then((mod) => mod.default),
  { ssr: false },
);
const Meteors = dynamic(
  () => import("./ui/meteors").then((mod) => mod.default),
  { ssr: false },
);
const LetterPullup = dynamic(
  () => import("./ui/letter-pullup").then((mod) => mod.default),
  { ssr: false },
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarRef = useRef(null);
  const { open, openMobile } = useSidebar();
  const isMobile = useIsMobile();

  const {
    data: userData,
    isLoading: userDataLoading,
    refetch,
  } = api.user.getUser.useQuery(undefined, {
    enabled: false,
  });

  useEffect(() => {
    void (async () => await refetch())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOpen = isMobile ? openMobile : open;

  return (
    <Sidebar ref={sidebarRef} variant="inset" {...props}>
      {isOpen ? (
        <>
          <Meteors key="sidebar-meteors" number={12} />
          <RetroGrid key="sidebar-retro" />
        </>
      ) : null}
      <SidebarHeader>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <LetterPullup
              wrapperClassName="justify-start pl-4 pt-2"
              className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text text-2xl font-bold text-transparent dark:text-transparent"
              words="Mysteryverse"
              forSidebar={true}
            />
          ) : null}
        </AnimatePresence>
      </SidebarHeader>
      {!userData || userDataLoading ? (
        <AppLoader />
      ) : (
        <>
          <SidebarContent>
            <NavMain items={navData.navMain} />
            <NavProjects projects={navData.projects} />
            <NavSecondary items={navData.navSecondary} className="mt-auto" />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={userData} />
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}
