"use client"

import type React from "react"
import { AuthGuard } from "@/components/auth-guard"
import { OrganizationSidebar } from "./organization-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={["organization"]}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          {/* Sidebar */}
          <OrganizationSidebar />

          {/* Main content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
