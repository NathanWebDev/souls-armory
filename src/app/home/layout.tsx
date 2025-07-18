import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/sidebar";

import "../globals.css";

import * as React from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <SidebarProvider open={true}>
            <SidebarTrigger />
            <AppSidebar />
            {children}
        </SidebarProvider>
    </>
  );
}
