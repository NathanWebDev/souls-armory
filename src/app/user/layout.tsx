import { Toaster } from "@/shad-components/ui/sonner";

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
