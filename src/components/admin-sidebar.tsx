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
  QrCode
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
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t, isLoading } = useAdminTranslation()
  const [userData, setUserData] = React.useState({
    name: "Admin",
    email: "",
    avatar: "/avatars/default.jpg",
  });

  // Create projects array with translations - must be called before any early returns
  const projects = React.useMemo(() => [
    {
      name: t('navigation.dashboard'),
      url: "/admin",
      icon: Home,
    },
    {
      name: t('navigation.users'),
      url: "/admin/users",
      icon: Users,
    },
    {
      name: t('navigation.systemAnalytics'),
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: t('navigation.robots'),
      url: "/admin/robots",
      icon: Bot,
    },
    {
      name: t('navigation.classrooms'),
      url: "/admin/classrooms",
      icon: School,
    },
    {
      name: t('navigation.qrcodes'),
      url: "/admin/qrcodes",
      icon: QrCode
    },
    {
      name: t('navigation.osmoCards'),
      url: "/admin/osmo-cards",
      icon: CreditCard
    },
    {
      name: t('navigation.markers'),
      url: "/admin/markers",
      icon: BookMarkedIcon
    }
  ], [t]);

  React.useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      const accountData = getTokenPayload(accessToken);
      if (accountData) {
        setUserData({
          name: accountData.fullName || accountData.username || "User",
          email: accountData.email || "",
          avatar: logo2.src || "/avatars/default.jpg",
        });
      }
    }
  }, []);

  // Don't render sidebar while translations are loading to prevent flickering
  if (isLoading) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="text-sidebar-primary-foreground flex aspect-square size-30 items-center justify-center rounded-lg">
                    <Image src={logo1} alt="Logo" className="object-contain w-30 h-30"/>
                  </div>
                </a>
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

  const data = {
    user: userData,
    navMain: [
      {
        title: t('navigation.activities'),
        url: "/admin",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: t('activities.action'),
            url: "/admin/activities/actions",
          },
          {
            title: t('activities.dance'),
            url: "/admin/activities/dances",
          },
          {
            title: t('activities.expression'),
            url: "/admin/activities/expressions",
          },
        ],
      },
      {
        title: t('navigation.settings'),
        url: "#",
        icon: Settings2,
        items: [
          {
            title: t('settings.robots'),
            url: "/admin/settings",
          },
          {
            title: t('settings.team'),
            url: "#",
          },
          {
            title: t('settings.billing'),
            url: "#",
          },
          {
            title: t('settings.limits'),
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: t('navigation.support'),
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: t('navigation.feedback'),
        url: "#",
        icon: Send,
      },
    ],
    projects: projects,
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="text-sidebar-primary-foreground flex aspect-square size-30 items-center justify-center rounded-lg">
                  <Image src={logo1} alt="Logo" className="object-contain w-30 h-30" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
