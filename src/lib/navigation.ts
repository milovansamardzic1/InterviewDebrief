import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  FlaskConical,
  Home,
  MessageCircleQuestion,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Prijave",
    href: "/applications",
    icon: ClipboardList,
  },
  {
    title: "Pitanja",
    href: "/questions",
    icon: MessageCircleQuestion,
  },
  {
    title: "Učenje",
    href: "/learning",
    icon: BookOpen,
  },
  {
    title: "Uvidi",
    href: "/insights/rejections",
    icon: ChartNoAxesColumnIncreasing,
  },
  ...(process.env.NODE_ENV === "development"
    ? [
        {
          title: "Demo",
          href: "/preview",
          icon: FlaskConical,
        } satisfies NavItem,
      ]
    : []),
];
