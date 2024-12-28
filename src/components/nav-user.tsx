"use client";

import { ChevronsUpDown, LogOut, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { auth } from "firebase-user";
import ShineBorder from "@/components/ui/shine-border";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { type HunterEssentials } from "@/server/model/hunters";

interface NavUserProps {
  user: HunterEssentials;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile, toggleSidebar } = useSidebar();
  const router = useRouter();
  const currentPath = usePathname();

  const onLogout = async () => {
    try {
      toggleSidebar();
      await deleteCookie("token");
      await deleteCookie("token-boom");
      await auth.signOut();
    } catch (error) {
      console.error("Error in signing out user", error);
      toast.error("Oops, Something went wrong while checking you out!", {
        description: "This shouldn’t have happened but please try again later.",
      });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-full w-full p-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <ShineBorder className="flex min-w-full gap-2">
                <Avatar className="z-10 h-8 w-8 rounded-lg">
                  <AvatarImage src={user.proPicUrl} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="z-10 grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="z-10 ml-auto size-4" />
              </ShineBorder>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup className="flex-row">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  toggleSidebar();
                  router.push("/profile");
                }}
                isActive={currentPath === "/profile"}
              >
                <User2 />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
