"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Moon, Sun } from "lucide-react"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { useTheme } from "next-themes"

export function Navigation() {
  const { setTheme } = useTheme()
  return (
      <NavigationMenu>
        <ClerkProvider>
          <NavigationMenuList>
              <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/">Home</Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/user/profile">Profile</Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>View</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-4">
                        <li>
                            <NavigationMenuLink asChild>
                                <Link href="#" onClick={() => setTheme("light")}>
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">Light Mode</div>
                                        <div>
                                            <Sun />
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link href="#" onClick={() => setTheme("dark")}>
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">Dark Mode</div>
                                        <div>
                                            <Moon />
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </li>
                    </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                    <Link href="/user/sign-in" className={navigationMenuTriggerStyle()}>
                        Login
                    </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
          </NavigationMenuList>
        </ClerkProvider>
      </NavigationMenu>
  )
}