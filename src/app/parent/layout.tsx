"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { AccountData } from "@/types/account";
import { UserHeader } from "@/components/parent/user-header";
import { UserSidebar } from "@/components/parent/user-sidebar";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  
  const pathname = usePathname();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Lấy thông tin account từ token
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        if (userInfo) {
          setAccountData({
            id: userInfo.id || "",
            username: userInfo.username || "",
            fullName: userInfo.fullName || "",
            email: userInfo.email || "",
            roleName: userInfo.roleName || "user",
            roleId: userInfo.roleId || "user",
          });
        }
      }
    }
  }, []);

  const navigationItems = [
    { name: "Dashboard", href: "/user", icon: "📊" },
    { name: "Robots", href: "/user/robot", icon: "🤖" },
    { name: "Joysticks Control", href: "/user/joystick", icon: "🕹️" },
    { name: "Students", href: "/user/student", icon: "👥" },
    { name: "Programming", href: "/user/programming", icon: "💻" },
    { name: "Classroom", href: "/user/classroom", icon: "🏫" },
    { name: "Activities", href: "/user/activities", icon: "🎯" },
    { name: "Music", href: "/user/music", icon: "🎵" },
    { name: "Courses", href: "/user/courses", icon: "📖" },
    { name: "Videos", href: "/user/videos", icon: "🎬" },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/user") {
      return pathname === "/user";
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Robot change handler is now handled by Redux
  // const handleRobotChange = (robot: Robot) => {
  //   setCurrentRobot(robot);
  // };

  return (
    <AuthGuard allowedRoles={['Parent']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <UserHeader
          onToggleSidebar={handleToggleSidebar}
          navigationItems={navigationItems}
          isActiveRoute={isActiveRoute}
          accountData={accountData}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Sidebar */}
        <UserSidebar
          isSidebarOpen={isSidebarOpen}
          navigationItems={navigationItems}
          isActiveRoute={isActiveRoute}
          accountData={accountData}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ease-in-out pt-13 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="mt-10 bg-white min-h-screen pt-10">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
