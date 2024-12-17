import {
  BookOpen,
  Heart,
  LifeBuoy,
  Map,
  Puzzle,
  Send,
  Sparkles,
} from "lucide-react";

export const navData = {
  user: {
    name: "GK",
    email: "123456789010101",
    avatar: "",
  },
  navMain: [
    {
      title: "Colosseum",
      url: "/",
      icon: Puzzle,
      isActive: true,
      items: [
        {
          title: "Mysteries",
          url: "/mysteries",
        },
        {
          title: "Categories",
          url: "/categories",
        },
        {
          title: "My Progress",
          url: "/progress",
        },
        {
          title: "Leaderboard",
          url: "/leaderboard",
        },
      ],
    },
    {
      title: "Explorer",
      url: "/explore",
      icon: Map,
      items: [
        {
          title: "Space",
          url: "/explore/space", // Area where users find new mysteries
        },
        {
          title: "Internet",
          url: "/explore/internet", // For viewing clues or hints
        },
        {
          title: "Nature",
          url: "/explore/nature", // Archive of past mysteries
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
      url: "/support",
      icon: LifeBuoy,
      items: [],
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
      items: [],
    },
    {
      title: "Help & Docs",
      url: "/help",
      icon: BookOpen,
      items: [],
    },
  ],
  projects: [
    {
      name: "Achievements",
      url: "/achievements",
      icon: Sparkles,
    },
    {
      name: "Favourites",
      url: "/favourites",
      icon: Heart,
    },
  ],
};

interface NavItem {
  title: string;
  url: string;
}

const getAllNavLinks = () => {
  const navLinks: NavItem[] = [];
  [...navData.navMain, ...navData.navSecondary].forEach((item) => {
    navLinks.push({
      title: item.title,
      url: item.url,
    });
    if (item.items) {
      item.items.forEach((subItem) => {
        navLinks.push({
          title: subItem.title,
          url: subItem.url,
        });
      });
    }
  });
  navData.projects.forEach((item) => {
    navLinks.push({
      title: item.name,
      url: item.url,
    });
  });
  navLinks.push({
    title: "Profile",
    url: "/profile",
  });
  return navLinks;
};

export const allNavLinks = getAllNavLinks();

export const getBreadcrumb = (url: string) => {
  return allNavLinks.find((item) => item.url === url) ?? null;
};
