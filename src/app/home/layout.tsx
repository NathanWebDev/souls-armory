import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { AppSidebar } from "@/shad-components/app-sidebar"
import { SiteHeader } from "@/shad-components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/shad-components/ui/sidebar"

export default async function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session && {
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image ?? null,
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
