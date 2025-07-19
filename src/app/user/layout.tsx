import { Toaster } from "@/components/ui/sonner";

import "../globals.css";

import * as React from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
        <Toaster />
    </>
  );
}
