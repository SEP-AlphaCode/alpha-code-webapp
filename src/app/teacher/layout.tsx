"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useLogout } from "@/hooks/use-logout";
import { AccountData } from "@/types/account";
import { Robot } from "@/types/teacher";
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
  
  // Giả lập robot đang kết nối
  const [currentRobot, setCurrentRobot] = useState<Robot>({
    name: "AlphaMini",
    status: "online",
    avatar: "/connect_robot.png",
    id: "EAA007UBT10000341",
    battery: 76
  });
  
  // Danh sách robot đã kết nối
  const [robotList] = useState<Robot[]>([
    {
      name: "AlphaMini",
      status: "online",
      avatar: "/connect_robot.png",
      id: "EAA007UBT10000341",
      battery: 76
    },
    {
      name: "AlphaMini",
      status: "offline",
      avatar: "/unconnect_robot.png",
      id: "EAA007UBT10000339",
      battery: 76
    },
    {
      name: "AlphaMini",
      status: "offline",
      avatar: "/unconnect_robot.png",
      id: "EAA007UBT10000332",
      battery: 76
    }
  ]);
  
  const pathname = usePathname();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Logic để lấy dữ liệu account từ storage
    // const data = getAccountDataFromStorage();
    // setAccountData(data);
  }, []);

  const navigationItems = [
    { name: "Dashboard", href: "/teacher", icon: "📊" },
    { name: "Robot Management", href: "/teacher/robot", icon: "🤖" },
    { name: "Students", href: "/teacher/student", icon: "👥" },
    { name: "Programming", href: "/teacher/programming", icon: "💻" },
    { name: "Classroom", href: "/teacher/classroom", icon: "🏫" },
    { name: "Activities", href: "/teacher/activities", icon: "🎯" },
    { name: "Music", href: "/teacher/music", icon: "🎵" },
    { name: "Courses", href: "/teacher/courses", icon: "📖" },
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

  const handleRobotChange = (robot: Robot) => {
    setCurrentRobot(robot);
  };

  return (
    <AuthGuard allowedRoles={["teacher"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <TeacherHeader
          onToggleSidebar={handleToggleSidebar}
          currentRobot={currentRobot}
          robotList={robotList}
          onRobotChange={handleRobotChange}
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
