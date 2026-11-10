"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconFlame,
  IconListDetails,
  IconUsers,
  IconSun,
  IconMoon,
  IconShield
} from "@tabler/icons-react"
import Link from "next/link"

import { NavMain } from "@/shad-components/nav-main"
import { NavUser } from "@/shad-components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shad-components/ui/sidebar"
import { ThemeSwitcher } from "./theme-switcher"

const data = {
  navMain: [
    {
      title: "Elden Ring",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Bloodborne",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Dark Souls 3",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Dark Souls 2",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Dark Souls 1",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Demon Souls",
      url: "#",
      icon: IconUsers,
    }
  ],
  themeSwitcher: [
    {
      title: "Light",
      action: "light",
      icon: IconSun,
    },
    {
      title: "Dark",
      action: "dark",
      icon: IconMoon,
    }
  ],
}

export function AppSidebar({
  user,
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: { name: string; email: string; avatar: string | null } | null
  isAdmin?: boolean
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <IconFlame className="!size-5" />
                <span className="font-bold select-none">Souls Armory</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isAdmin && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin">
                  <Link href="/admin">
                    <IconShield />
                    <span>Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        <ThemeSwitcher items={data.themeSwitcher} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? null} />
      </SidebarFooter>
    </Sidebar>
  )
}
