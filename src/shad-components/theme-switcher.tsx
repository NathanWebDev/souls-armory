"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel
} from "@/shad-components/ui/sidebar"

import { useTheme } from "next-themes"

export function ThemeSwitcher({
  items,
  ...props
}: {
  items: {
    title: string
    action: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setTheme } = useTheme()

  const changeTheme = (theme: string) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!document.startViewTransition || reduceMotion) return setTheme(theme)
    document.startViewTransition(() => flushSync(() => setTheme(theme)))
  }

  return (
    <SidebarGroup {...props}>
    <SidebarGroupLabel>Change Theme</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href="#" onClick={(e) => { e.preventDefault(); changeTheme(item.action) }}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
