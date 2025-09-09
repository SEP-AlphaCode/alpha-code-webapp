"use client"

import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { OrganizationSidebar } from "./organization-sidebar"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

// Function to format path segments into a display name
function formatPathToDisplayName(path: string): string {
  return path
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function OrganizationBreadcrumb() {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Create breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbItems = []

  // If it's the admin main page, show Admin -> Dashboard
  if (pathname === "/organization") {
    breadcrumbItems.push({
      href: "/organization",
      label: "Organization",
      isLast: false,
    })
    breadcrumbItems.push({
      href: "/organization",
      label: "Dashboard",
      isLast: true,
    })
  } else {
    // If it's a subpage, show Admin -> Current Page
    breadcrumbItems.push({
      href: "/organization",
      label: "Organization",
      isLast: false,
    })

    // Extract the name of the page from the last path segment and format it
    const lastSegment = pathSegments[pathSegments.length - 1]
    const currentPageName = formatPathToDisplayName(lastSegment)
    breadcrumbItems.push({
      href: pathname,
      label: currentPageName,
      isLast: true,
    })
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={`${item.href}-${item.label}-${index}`}>
                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                  {item.isLast ? (
                    <BreadcrumbPage className="font-semibold text-foreground">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!item.isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <Badge variant="outline" className="hidden sm:flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Online
        </Badge>
      </div>
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
      <SidebarProvider>
        <OrganizationSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
            <div className="flex items-center gap-2 px-6 w-full">
              <SidebarTrigger className="-ml-1 hover:bg-accent hover:text-accent-foreground transition-colors" />
              <Separator orientation="vertical" className="mr-4 data-[orientation=vertical]:h-4" />
              <OrganizationBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col">
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
              <div className="space-y-6">{children}</div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
