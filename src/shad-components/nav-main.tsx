"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { 
  type Icon 
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shad-components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeGame = searchParams.get("game")

  const toggleGame = (title: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (activeGame === title) {
      params.delete("game")
    } else {
      params.set("game", title)
    }
    const query = params.toString()
    router.push(query ? `/home?${query}` : "/home")
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="cursor-pointer"
                isActive={activeGame === item.title}
                onClick={() => toggleGame(item.title)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
