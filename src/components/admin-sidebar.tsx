"use client"

import * as React from "react"
import {
  BarChart3,
  Bot,
  CreditCard,
  Home,
  QrCode,
  School,
  Users,
  MapPin,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
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
import logo2 from '@/public/logo2.png';
import logo1 from '@/public/logo1.png';
import Image from "next/image"
import { getTokenPayload } from "@/utils/tokenUtils"

const defaultProjects = [
  {
    name: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    name: "User Management",
    url: "/admin/users",
    icon: Users,
  },
  {
    name: "Robot Management",
    url: "/admin/robots",
    icon: Bot,
  },
  {
    name: "Activity Management",
    url: "/admin/activity-cards",
    icon: BarChart3,
  },
  {
    name: "Osmo Card Management",
    url: "/admin/classrooms",
    icon: School,
  },
  {
    name: "QR Card Management", 
    url: "/admin/qrcodes",
    icon: QrCode,
  },
  {
    name: "Marker Management",
    url: "/admin/markers",
    icon: MapPin,
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState({
    name: "Admin",
    email: "",
    avatar: "/avatars/default.jpg",
  });

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

  const data = {
    user: userData,
    projects: defaultProjects,
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-30 items-center justify-center rounded-lg">
                  <Image src={logo1} alt="Logo" className="object-contain w-30 h-30"/>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
