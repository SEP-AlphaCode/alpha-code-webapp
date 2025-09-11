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

function HorizontalNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-around w-full">
      {navigationItems.map((item) => {
        const isActive = pathname === item.url
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.url}
            className={`
                flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-primary-foreground hover:bg-accent/80"
              }
              `}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function MobileNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2">
        <Menu className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg z-50">
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.url
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
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
                  <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                    Organization Dashboard
                  </Badge>
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
                <MobileNavigation />
              </div>
            </div>

            <div className="hidden lg:flex h-12 items-center border-t w-full px-4 lg:px-6">
              <HorizontalNavigation />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-4 md:px-6 py-4 md:py-8">{children}</main>
      </div>
    </AuthGuard>
  )
}
