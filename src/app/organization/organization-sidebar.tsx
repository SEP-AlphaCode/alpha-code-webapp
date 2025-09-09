"use client"

import * as React from "react"
import { Bot, LifeBuoy, School, Send, Users, GraduationCap, Server, Monitor, Building, Activity } from "lucide-react"

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
import logo1 from "../../../public/logo1.png"
import logo2 from "../../../public/logo2.png"
import Image from "next/image"
import { getTokenPayload } from "@/utils/tokenUtils"

const defaultProjects = [
  {
    name: "Organization",
    url: "/organization",
    icon: Building,
  },
  {
    name: "Classrooms",
    url: "/organization/classrooms",
    icon: School,
  },
  {
    name: "Teachers",
    url: "/organization/teachers",
    icon: GraduationCap,
  },
  {
    name: "Students",
    url: "/organization/students",
    icon: Users,
  },
  {
    name: "Spaces",
    url: "/organization/spaces",
    icon: Server,
  },
  {
    name: "Robots",
    url: "/organization/robots",
    icon: Bot,
  },
  {
    name: "Devices",
    url: "/organization/devices",
    icon: Monitor,
  },
  {
    name: "Activities",
    url: "/organization/activities",
    icon: Activity,
  },
]

export function OrganizationSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState({
    name: "Organization",
    email: "",
    avatar: "/avatars/default.jpg",
  })

  React.useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken")
    if (accessToken) {
      const accountData = getTokenPayload(accessToken)
      if (accountData) {
        setUserData({
          name: accountData.fullName || accountData.username || "User",
          email: accountData.email || "",
          avatar: logo2.src || "/avatars/default.jpg",
        })
      }
    }
  }, [])

  const data = {
    user: userData,
    navMain: [
      // {
      //   title: "Activities",
      //   url: "/admin",
      //   icon: SquareTerminal,
      //   isActive: true,
      //   items: [
      //     {
      //       title: "Action",
      //       url: "/admin/activities/actions",
      //     },
      //     {
      //       title: "Dance",
      //       url: "/admin/activities/dances",
      //     },
      //     {
      //       title: "Expression",
      //       url: "/admin/activities/expressions",
      //     },
      //   ],
      // },
      // {
      //   title: "Settings",
      //   url: "#",
      //   icon: Settings2,
      //   items: [
      //     {
      //       title: "Robots",
      //       url: "/admin/settings",
      //     },
      //     {
      //       title: "Team",
      //       url: "#",
      //     },
      //     {
      //       title: "Billing",
      //       url: "#",
      //     },
      //     {
      //       title: "Limits",
      //       url: "#",
      //     },
      //   ],
      // },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: defaultProjects,
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="group">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:shadow-lg transition-all duration-200">
                  <Image src={logo1 || "/placeholder.svg"} alt="Logo" className="object-contain w-8 h-8" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">Organization Hub</span>
                  <span className="truncate text-xs text-muted-foreground">Management Portal</span>
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
