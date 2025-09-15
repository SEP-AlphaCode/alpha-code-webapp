"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Bell, Menu } from "lucide-react"
import Link from "next/link"
import { navigationItems } from "./navigation-items"
import { useState } from "react"


import { useRouter } from "next/navigation"

function NavigationDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="relative">
      <select
        className="px-2 py-1 rounded border bg-background text-sm font-medium"
        value={pathname}
        onChange={e => router.push(e.target.value)}
      >
        {navigationItems.map(item => (
          <option key={item.url} value={item.url}>{item.name}</option>
        ))}
      </select>
    </div>
  );
}

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["organization"]}>
      <div className="min-h-screen bg-background">
        {/* Top Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full">
            {/* Brand Row */}
            <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
              {/* Logo and Brand */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary text-primary-foreground font-bold text-xs md:text-sm">
                  A
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base md:text-lg">AlphaCode</span>
                  <NavigationDropdown />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-1 lg:gap-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Settings className="h-4 w-4" />
                </Button>
                <div className="hidden lg:flex items-center gap-2 ml-4">
                  <Badge variant="outline" className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </Badge>
                </div>
                {/* MobileNavigation removed, navigation handled by dropdown */}
              </div>
            </div>

            {/* Navigation bar removed, replaced by dropdown above */}
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-4 md:px-6 py-4 md:py-8">{children}</main>
      </div>
    </AuthGuard>
  )
}
