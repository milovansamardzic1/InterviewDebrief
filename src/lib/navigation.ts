import {
  ClipboardList,
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
];
