"use client"
import { AuthGuard } from "@/components/auth-guard"
import { CourseSidebar } from "@/components/course-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useCourseTranslation } from "@/lib/i18n/hooks/use-translation"
import { I18nProvider } from "@/lib/i18n/provider"
import { usePathname } from "next/navigation"

function formatPathToDisplayName(path: string): string {
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function CourseBreadcrumb() {
  const pathname = usePathname()
  const { t, isLoading } = useCourseTranslation()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = []

  if (pathname === '/courses') {
    breadcrumbItems.push({
      href: '/courses',
      label: t('navigation.home'),
      isLast: false
    })
    breadcrumbItems.push({
      href: '/courses',
      label: t('navigation.myCourse'),
      isLast: true
    })
  } else {
    breadcrumbItems.push({
      href: '/courses',
      label: t('navigation.home'),
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
}

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider page="courses">
      {/* <AuthGuard allowedRoles={['user']}> */}
        <SidebarProvider className="flex h-screen">
          <CourseSidebar/>
          <SidebarInset className="flex-1">
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
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      {/* </AuthGuard> */}
    </I18nProvider>
  )
}