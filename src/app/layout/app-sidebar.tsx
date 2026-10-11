import { Link, useMatchRoute } from "@tanstack/react-router";
import { useCurrentUser, hasPermission } from "@/modules/auth";
import { Logo, LogoMark } from "@/shared/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import { NAV_ITEMS } from "./navigation";
import { UserMenu } from "./user-menu";

export function AppSidebar() {
  const user = useCurrentUser();
  const matchRoute = useMatchRoute();
  const items = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(user, item.permission)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link to="/">
                <span className="flex items-center text-foreground">
                  <Logo className="h-8! w-auto! group-data-[collapsible=icon]:hidden" />
                  <LogoMark className="hidden size-6! group-data-[collapsible=icon]:block" />
                </span>
                <span className="sr-only">Brritto admin home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={Boolean(
                      matchRoute({ to: item.to, fuzzy: item.to !== "/" })
                    )}
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
