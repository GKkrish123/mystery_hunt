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
  navMain: [
    {
      title: "Colosseum",
      url: "/",
      icon: Puzzle,
      isActive: true,
      items: [
        {
          title: "Events",
          url: "/events",
          special: true,
        },
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
      isActive: true,
      icon: Map,
      items: [
        {
          title: "Extension",
          url: "/explore/extension",
          special: true,
        },
      ],
    },
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
