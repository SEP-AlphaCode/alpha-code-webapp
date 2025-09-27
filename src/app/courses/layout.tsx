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

  const formatSlugToDisplayName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const breadcrumbItems = [{
    href: '/courses',
    label: 'Trang chủ',
    isLast: false
  }]

  if (pathname === '/courses') {
    breadcrumbItems.push({
      href: '/courses',
      label: 'All Courses',
      isLast: true
    })
  } else if (pathSegments.length === 2 && pathSegments[0] === 'courses') {
    // Course detail page - you could add category here if you have the data
    const courseSlug = pathSegments[1]
    const courseName = formatSlugToDisplayName(courseSlug)

    breadcrumbItems.push({
      href: '/courses',
      label: 'All Courses',
      isLast: false
    })

    breadcrumbItems.push({
      href: pathname,
      label: courseName,
      isLast: true
    })
  } else {
    // Handle other pages
    const lastSegment = pathSegments[pathSegments.length - 1]
    const pageName = formatSlugToDisplayName(lastSegment)

    breadcrumbItems.push({
      href: pathname,
      label: pageName,
      isLast: true
    })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}-${item.href.replace(/\//g, '-')}`}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
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
    // <AuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "10rem",
            "--sidebar-width-mobile": "10rem",
          } as React.CSSProperties
        }
      >
        <CourseSidebar />
        <SidebarInset className="min-h-screen overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <CourseBreadcrumb />
            </div>
          </header>
          <div className="flex-1 flex flex-col">
            <div className="w-full max-w-full overflow-hidden p-10">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    // </AuthGuard>
  )
}