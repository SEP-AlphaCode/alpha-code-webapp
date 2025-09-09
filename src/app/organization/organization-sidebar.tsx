"use client"

import * as React from "react"
import {
  Bot,
  LifeBuoy,
  School,
  Send,
  Users,
  GraduationCap,
  Server,
  Monitor,
  Building,
  Activity,
  ChevronRight,
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import logo1 from "../../../public/logo1.png"
import logo2 from "../../../public/logo2.png"
import Image from "next/image"
import { getTokenPayload } from "@/utils/tokenUtils"
import { usePathname } from "next/navigation"
import Link from "next/link"

const defaultProjects = [
  {
    name: "Organization",
    url: "/organization",
    icon: Building,
    description: "Overview & Settings",
    color: "bg-yellow-500",
  },
  {
    name: "Classrooms",
    url: "/organization/classrooms",
    icon: School,
    description: "Manage Learning Spaces",
    color: "bg-green-500",
  },
  {
    name: "Teachers",
    url: "/organization/teachers",
    icon: GraduationCap,
    description: "Educator Management",
    color: "bg-purple-500",
  },
  {
    name: "Students",
    url: "/organization/students",
    icon: Users,
    description: "Student Profiles",
    color: "bg-orange-500",
  },
  {
    name: "Spaces",
    url: "/organization/spaces",
    icon: Server,
    description: "Physical Locations",
    color: "bg-teal-500",
  },
  {
    name: "Robots",
    url: "/organization/robots",
    icon: Bot,
    description: "Robot Fleet",
    color: "bg-indigo-500",
  },
  {
    name: "Devices",
    url: "/organization/devices",
    icon: Monitor,
    description: "Hardware Management",
    color: "bg-gray-500",
  },
  {
    name: "Activities",
    url: "/organization/activities",
    icon: Activity,
    description: "Learning Activities",
    color: "bg-red-500",
  },
]

function EnhancedNavProjects({ projects }: { projects: typeof defaultProjects }) {
  const pathname = usePathname()

  return (
    <div className="space-y-1 px-3">
      <div className="px-2 py-1.5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Control</h2>
      </div>
      {projects.map((project) => {
        const isActive = pathname === project.url
        const Icon = project.icon

        return (
          <Link
            key={project.name}
            href={project.url}
            className={`
              group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
              ${isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }
            `}
          >
            <div
              className={`
              flex h-8 w-8 items-center justify-center rounded-md text-white transition-all duration-200 ${project.color}
              group-hover:scale-105
            `}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{project.name}</div>
              <div className="text-xs opacity-70 truncate">{project.description}</div>
            </div>
            {isActive && <ChevronRight className="h-4 w-4 opacity-60" />}
          </Link>
        )
      })}
    </div>
  )
}

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
    navMain: [],
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
      <SidebarHeader className="border-b border-border/50">
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
      <SidebarContent className="py-4">
        <EnhancedNavProjects projects={data.projects} />
        <div className="mt-8">
          <div className="px-5 py-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Manage</h2>
          </div>
          <NavSecondary items={data.navSecondary} />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
