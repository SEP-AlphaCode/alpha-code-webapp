"use client"

import React from "react"
import { AppSidebar } from "@/components/admin-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { I18nProvider } from "@/lib/i18n/provider"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

// Function to format path segments into a display name
function formatPathToDisplayName(path: string): string {
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function AdminBreadcrumb() {
  const pathname = usePathname()
  const { t, isLoading } = useAdminTranslation()

  // Don't render breadcrumb while loading translations to prevent flickering
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  // Create breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = []

  // If it's the admin main page, show Admin -> Dashboard
  if (pathname === '/admin') {
    breadcrumbItems.push({
      href: '/admin',
      label: t('navigation.admin'),
      isLast: false
    })
    breadcrumbItems.push({
      href: '/admin',
      label: t('navigation.dashboard'),
      isLast: true
    })
  } else {
    // If it's a subpage, show Admin -> Current Page
    breadcrumbItems.push({
      href: '/admin',
      label: t('navigation.admin'),
      isLast: false
    })
    
    // Extract the name of the page from the last path segment and get translation
    const lastSegment = pathSegments[pathSegments.length - 1]
    const translationKey = `navigation.${lastSegment.replace('-', '')}`
    const currentPageName = t(translationKey) || formatPathToDisplayName(lastSegment)
    breadcrumbItems.push({
      href: pathname,
      label: currentPageName,
      isLast: true
    })
  }
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}-${item.href.replace(/\//g, '-')}`}>
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator className="hidden md:block" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider page="admin">
      <AuthGuard allowedRoles={['admin']}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <AdminBreadcrumb />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </I18nProvider>
  )
}
