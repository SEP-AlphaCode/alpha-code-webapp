"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { AccountData } from "@/types/account";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
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
            roleName: userInfo.roleName || "teacher",
            roleId: userInfo.roleId || "teacher",
          });
        }
      }
    }
  }, []);

  const navigationItems = [
    { name: "Dashboard", href: "/teacher", icon: "📊" },
    { name: "Robots", href: "/teacher/robot", icon: "🤖" },
    { name: "Joysticks Control", href: "/teacher/joystick", icon: "🕹️" },
    { name: "Students", href: "/teacher/student", icon: "👥" },
    { name: "Programming", href: "/teacher/programming", icon: "💻" },
    { name: "Classroom", href: "/teacher/classroom", icon: "🏫" },
    { name: "Activities", href: "/teacher/activities", icon: "🎯" },
    { name: "Music", href: "/teacher/music", icon: "🎵" },
    { name: "Courses", href: "/teacher/courses", icon: "📖" },
    { name: "Videos", href: "/teacher/videos", icon: "🎬" },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/teacher") {
      return pathname === "/teacher";
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
    // <AuthGuard allowedRoles={['teacher']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <TeacherHeader
          onToggleSidebar={handleToggleSidebar}
          navigationItems={navigationItems}
          isActiveRoute={isActiveRoute}
          accountData={accountData}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Sidebar */}
        <TeacherSidebar
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
          <div className="mt-10 bg-white min-h-screen">
            {children}
          </div>
        </main>
      </div>
    // </AuthGuard>
  );
}
