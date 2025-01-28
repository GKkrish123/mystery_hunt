"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ShineBorder from "./ui/shine-border";
import { type Category } from "@/server/model/categories";
import Loader from "./ui/loader";

export function NavMain({
  items,
  categoriesData,
  isCategoriesLoading,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      special?: boolean;
      title: string;
      url: string;
    }[];
  }[];
  categoriesData?: Category[];
  isCategoriesLoading: boolean;
}) {
  const { toggleSidebar } = useSidebar();
  const currentPath = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="z-10">Mystery Arena</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                onClick={() => toggleSidebar()}
                isActive={currentPath === item.url}
              >
                <Link className="relative z-10" href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger className="z-10" asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem
                          key={`${item.title}-${subItem.title}`}
                        >
                          {subItem.special ? (
                            <ShineBorder
                              className="min-h-0 w-full min-w-0 bg-transparent p-1 dark:bg-transparent"
                              borderRadius={10}
                              borderWidth={1.5}
                              duration={10}
                              color={
                                item.title === "Explorer"
                                  ? undefined
                                  : ["#A07CFE", "#FE8FB5", "#FFBE7B"]
                              }
                            >
                              <SidebarMenuSubButton
                                asChild
                                className="w-full"
                                onClick={() => toggleSidebar()}
                                isActive={currentPath === subItem.url}
                              >
                                <Link
                                  className="relative z-10"
                                  href={subItem.url}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </ShineBorder>
                          ) : (
                            <SidebarMenuSubButton
                              asChild
                              className="w-full"
                              onClick={() => toggleSidebar()}
                              isActive={currentPath === subItem.url}
                            >
                              <Link
                                className="relative z-10"
                                href={subItem.url}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                      {item.title === "Explorer" ? (
                        isCategoriesLoading ? (
                          <Loader className="mx-auto my-0 h-7 w-7 text-black dark:text-white" />
                        ) : (
                          categoriesData?.map((subItem) => (
                            <SidebarMenuSubItem
                              key={`${item.title}-${subItem.name}`}
                            >
                              <SidebarMenuSubButton
                                asChild
                                className="w-full"
                                onClick={() => toggleSidebar()}
                                isActive={
                                  currentPath === `/explore/${subItem.tag}`
                                }
                              >
                                <Link
                                  className="relative z-10"
                                  href={`/explore/${subItem.tag}`}
                                >
                                  <span>{subItem.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))
                        )
                      ) : null}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
