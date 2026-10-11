import type { LinkProps } from "@tanstack/react-router";
import { LayoutDashboardIcon, UsersIcon, type LucideIcon } from "lucide-react";
import type { Permission } from "@/modules/auth";

export type NavItem = {
  title: string;
  to: NonNullable<LinkProps["to"]>;
  icon: LucideIcon;
  permission?: Permission;
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    to: "/",
    icon: LayoutDashboardIcon,
    permission: "dashboard:view",
  },
  { title: "Users", to: "/users", icon: UsersIcon, permission: "users:read" },
];
