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
  IconMoon
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
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
import { ThemeSwitcher } from "./theme-switcher"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <ThemeSwitcher items={data.themeSwitcher} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
