import * as React from "react";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { toggleSidebar } = useSidebar();
  const currentPath = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="relative">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} onClick={() => toggleSidebar()}>
              <SidebarMenuButton
                asChild
                size="sm"
                isActive={currentPath === item.url}
              >
                <Link className="relative z-10" href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
