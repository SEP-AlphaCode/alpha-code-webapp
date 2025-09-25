"use client"

import * as React from "react"
import {
  BarChart3,
  Bot,
  CreditCard,
  Home,
  LifeBuoy,
  School,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  BookMarkedIcon,
  QrCode,
  Bell,
  BookOpen,
  FileText
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo1 from '../../public/logo1.png';
import logo2 from '../../public/logo2.png';
import Image from "next/image"
import { getTokenPayload } from "@/utils/tokenUtils"
import { useCourseTranslation } from "@/lib/i18n/hooks/use-translation"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function CourseSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { t, isLoading } = useCourseTranslation()
  const [userData, setUserData] = React.useState({
    name: "Admin",
    email: "",
    avatar: "/avatars/default.jpg",
  });
  const navigationItems = React.useMemo(
    () => [
      {
        name: t("navigation.home"),
        url: "/courses",
        icon: Home,
      },
      {
        name: t("navigation.learningPath"),
        url: "/courses/learning-path",
        icon: BookOpen,
      },
      {
        name: t("navigation.articles"),
        url: "/courses/articles",
        icon: FileText,
      },
    ],
    [t],
  )

  if (isLoading) {
    return (
      <Sidebar variant="inset" {...props} className="w-40">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/courses">
                  <div className="text-sidebar-primary-foreground flex aspect-square size-30 items-center justify-center rounded-lg">
                    <Image src={logo1} alt="Logo" className="object-contain w-30 h-30" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 space-y-2">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar variant="inset" {...props} className="w-40 bg-blue-500"> {/* narrower sidebar */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/courses">
                <div className="flex items-center justify-center py-4">
                  <Image src={logo1} alt="Logo" className="h-10 object-contain" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ul className="flex flex-col items-center gap-4 mt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url
            return (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-lg transition-colors 
                ${isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium text-center">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </SidebarContent>

      <SidebarFooter className="mt-auto flex justify-center pb-4">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}