"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useRobotStore } from "@/hooks/use-robot-store";
import { AccountData } from "@/types/account";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accountData/*, setAccountData*/] = useState<AccountData | null>({
    id: "1",
    username: "teacher",
    fullName: "Teacher",
    email: "teacher@example.com",
    roleName: "teacher",
    roleId: "teacher",
  }); // Dữ liệu giả định
  
  // Redux Robot Store
  const { initializeMockData } = useRobotStore();
  
  const pathname = usePathname();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Logic để lấy dữ liệu account từ storage
    // const data = getAccountDataFromStorage();
    // setAccountData(data);
    
    // Initialize robot mock data
    initializeMockData();
  }, [initializeMockData]);

  const navigationItems = [
    { name: "Dashboard", href: "/teacher", icon: "📊" },
    { name: "Robots", href: "/teacher/robot", icon: "🤖" },
    { name: "Joysticks Control", href: "/teacher/joystick", icon: "🕹️" },
    { name: "Students", href: "/teacher/student", icon: "👥" },
    { name: "Programming", href: "/teacher/programming", icon: "💻" },
    { name: "Classroom", href: "/teacher/classroom", icon: "🏫" },
    { name: "Activities", href: "/teacher/activities", icon: "🎯" },
    { name: "Music", href: "/teacher/music", icon: "🎵" },
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
    <AuthGuard allowedRoles={["teacher"]}>
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
          className={`transition-all duration-300 ease-in-out pt-16 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="mt-10 bg-white min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
