"use client"

import {
  BookOpen,
  Command,
  Heart,
  LifeBuoy,
  Map,
  Puzzle,
  Send,
  Sparkles,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import RetroGrid from "./ui/retro-grid"
import Meteors from "./ui/meteors"
import { useRef } from "react"
import LetterPullup from "./ui/letter-pullup"

const data = {
  user: {
    name: "GK",
    email: "123456789010101",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Mysteries",
      url: "#",
      icon: Puzzle,
      isActive: true,
      items: [
        {
          title: "Current Challenges",
          url: "#",
        },
        {
          title: "My Progress",
          url: "#",
        },
        {
          title: "Leaderboard",
          url: "#",
        },
      ],
    },
    {
      title: "Explorer",
      url: "#",
      icon: Map,
      items: [
        {
          title: "Hunt Grounds",
          url: "#", // Area where users find new mysteries
        },
        {
          title: "Clue Board",
          url: "#", // For viewing clues or hints
        },
        {
          title: "Mystery Vault",
          url: "#", // Archive of past mysteries
        },
      ],
    },
    // {
    //   title: "Community",
    //   url: "#",
    //   icon: Users2, // For social engagement
    //   items: [
    //     {
    //       title: "Discussions",
    //       url: "#", // Forum or chat for users
    //     },
    //     {
    //       title: "Collaborations",
    //       url: "#", // Users working together to solve mysteries
    //     },
    //     {
    //       title: "Events",
    //       url: "#", // Live events or competitions
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
    {
      title: "Help & Docs",
      url: "#",
      icon: BookOpen,
    },
  ],
  projects: [
    {
      name: "Achievements",
      url: "#",
      icon: Sparkles,
    },
    {
      name: "Favorites",
      url: "#",
      icon: Heart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarRef = useRef(null);

  return (
    <Sidebar ref={sidebarRef} variant="inset" {...props}>
      <Meteors key="sidebar-meteors" number={30}/>
      <SidebarHeader>
          <LetterPullup
            wrapperClassName="justify-start pl-4 pt-2"
            className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-xl md:text-2xl font-bold leading-none tracking-tighter text-transparent dark:text-transparent"
            words="Mysteryverse"
          />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <RetroGrid key="sidebar-retro" />
    </Sidebar>
  )
}
