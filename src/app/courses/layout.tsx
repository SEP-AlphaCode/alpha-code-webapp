"use client"
import { AuthGuard } from "@/components/auth-guard"
import { CourseSidebar } from "@/components/course-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { I18nProvider } from "@/lib/i18n/provider"
import { usePathname } from "next/navigation"
import React from "react"

function formatPathToDisplayName(path: string): string {
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function CourseBreadcrumb() {
  const pathname = usePathname()

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = []

  if (pathname === '/courses') {
    breadcrumbItems.push({
      href: '/courses',
      label: 'Home',
      isLast: false
    })
    breadcrumbItems.push({
      href: '/courses/learning-path',
      label: 'Learning Path',
      isLast: true
    })
  } else {
    breadcrumbItems.push({
      href: '/courses',
      label: 'Home',
      isLast: false
    })

    // Extract the name of the page from the last path segment and get translation
    const lastSegment = pathSegments[pathSegments.length - 1]
    const translationKey = `navigation.${lastSegment.replace('-', '')}`
    const currentPageName = translationKey || formatPathToDisplayName(lastSegment)
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

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={[]}>
      <SidebarProvider style={
        {
          "--sidebar-width": "10rem",
          "--sidebar-width-mobile": "10rem",
        } as React.CSSProperties
      }>
        <CourseSidebar />
        <SidebarInset className="bg-blue-200">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <CourseBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1  flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}