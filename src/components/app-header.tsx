"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import ThemeToggle from "./ui/theme-toggle";
import LetterPullup from "./ui/letter-pullup";
import { AnimatePresence } from "motion/react";
import { getBreadcrumb } from "./nav-data";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const { open, openMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const splittedPathname = pathname.split("/");
  const breadcrumbPaths =
    splittedPathname.length > 2
      ? [
          splittedPathname.slice(0, 2).join("/"),
          splittedPathname.slice(0, 3).join("/"),
        ]
      : [pathname, pathname];
  const breadcrumbParent = getBreadcrumb(breadcrumbPaths[0]!);
  const breadcrumbChild = getBreadcrumb(breadcrumbPaths[1]!);
  const isSingleBreadcrumb =
    breadcrumbPaths[0] === breadcrumbPaths[1] || !breadcrumbChild;

  return (
    <header className="relative z-[1] flex h-12 shrink-0 items-center gap-2 px-3 md:h-16 md:px-4">
      <div className="flex items-center md:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {!isSingleBreadcrumb ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink url={breadcrumbPaths[0]!}>
                    {breadcrumbParent?.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            ) : null}
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isSingleBreadcrumb
                  ? breadcrumbParent?.title
                  : breadcrumbChild?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AnimatePresence mode="wait">
        {!(isMobile ? openMobile : open) ? (
          <LetterPullup
            wrapperClassName="z-[-1] m-auto absolute left-1/2 right-1/2 transform -translate-x-1/2 w-[calc(100%-5.5rem)] md:w-full justify-end md:justify-center"
            className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text text-base font-bold text-transparent dark:text-transparent md:text-2xl"
            words="Mysteryverse"
            forHeader={true}
          />
        ) : null}
      </AnimatePresence>
      <ThemeToggle />
    </header>
  );
}
