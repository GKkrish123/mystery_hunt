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
import LetterPullup from "./ui/letter-pullup";

const RetroGrid = dynamic(
  () => import("./ui/retro-grid").then((mod) => mod.default),
  { ssr: false },
);
const Meteors = dynamic(
  () => import("./ui/meteors").then((mod) => mod.default),
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

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    refetch: categoriesFetch,
  } = api.category.getCategories.useQuery(
    {},
    {
      enabled: false,
    },
  );

  useEffect(() => {
    void (async () => {
      await refetch();
      await categoriesFetch();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOpen = isMobile ? openMobile : open;

  return (
    <Sidebar ref={sidebarRef} variant="inset" {...props}>
      {isOpen ? (
        <>
          <Meteors key="sidebar-meteors" number={12} sidebar={true} />
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
            <NavMain
              items={navData.navMain}
              categoriesData={categoriesData}
              isCategoriesLoading={isCategoriesLoading}
            />
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
