import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dark Souls",
    url: "#",
  },
  {
    title: "Dark Souls 2",
    url: "#",
  },
  {
    title: "Dark Souls 3",
    url: "#",
  },
  {
    title: "Blood Borne",
    url: "#",
  },
  {
    title: "Elden Ring",
    url: "#",
  },
]
 
export function AppSidebar() {
  return (
    <Sidebar>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Souls Foundry</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>
  )
}