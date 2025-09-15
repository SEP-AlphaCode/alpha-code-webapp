"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useLogout } from "@/hooks/use-logout";
import { LogOut, Bell, Menu, UserCircle, Settings } from "lucide-react";
import { AccountData } from "@/types/account";
import Logo2 from "../../../public/logo2.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// 👉 import language switcher
import { LanguageSwitcher } from "@/components/language-switcher";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accountData, setAccountData] = useState<AccountData | null>({
    id: "1",
    username: "teacher",
    fullName: "Teacher",
    email: "teacher@example.com",
    roleName: "teacher",
    roleId: "teacher",
  }); // Dữ liệu giả định
  // Giả lập robot đang kết nối
  const [currentRobot, setCurrentRobot] = useState({
    name: "AlphaMini",
    status: "online",
    avatar: "/connect_robot.png",
    id: "EAA007UBT10000341",
    battery: 76
  });
  // Danh sách robot đã kết nối
  const [robotList] = useState([
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

  const Sidebar = () => (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${isSidebarOpen ? "w-64" : "w-24"
        }`}
    >
      <nav className="p-4 mt-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group relative ${isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <div
                  className={`text-xl flex items-center justify-center ${isSidebarOpen ? "mr-3" : "mx-auto"
                    }`}
                >
                  {item.icon}
                </div>
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
        {isSidebarOpen ? (
          <>
            <div className="flex justify-start w-full mb-2 ml-5">
              <LanguageSwitcher variant="minimal" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full focus:outline-none">
                  <div className="flex items-center gap-3 p-2 mx-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 transition-colors cursor-pointer">
                    <Avatar className="h-11 w-11 border border-gray-300 shadow">
                      <AvatarImage src="/your-profile-image.jpg" alt="Profile" />
                      <AvatarFallback className="bg-blue-600 text-white font-medium">
                        {accountData?.fullName ? accountData.fullName.charAt(0).toUpperCase() : "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                      <span className="font-semibold text-gray-900 text-base leading-tight">{accountData?.fullName || "Teacher"}</span>
                      <span className="text-xs text-gray-500">{accountData?.email || "N/A"}</span>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              {/* Đổi vị trí modal tại đây: side="top" | "bottom" | "left" | "right" */}
              <DropdownMenuContent className="w-56" side="top" align="center" sideOffset={12} forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{accountData?.fullName || "Teacher"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{accountData?.email || "N/A"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/teacher/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/teacher/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-10 w-10 border border-gray-200 mx-auto">
                  <AvatarImage src="/your-profile-image.jpg" alt="Profile" />
                  <AvatarFallback className="bg-blue-600 text-white font-medium">
                    {accountData?.fullName ? accountData.fullName.charAt(0).toUpperCase() : "T"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{accountData?.fullName || "Teacher"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{accountData?.email || "N/A"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/teacher/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/teacher/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  );

  return (
    <AuthGuard allowedRoles={["teacher"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Menu Toggle for Desktop */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Sidebar Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 sm:max-w-xs">
                  <Sidebar />
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Image src={Logo2} alt="AlphaCode" width={32} height={32} />
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    AlphaCode
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 -mt-1">
                    Teacher Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">

              {/* Notifications */}
              {/* <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-white">3</span>
                </span>
              </Button> */}

              {/* Robot Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none min-w-[260px]">
                    <Image src="/2-min.webp" alt="AlphaMini" width={70} height={70} className="object-cover object-top rounded-lg" />
                    <div className="flex flex-row ml-2 flex-1 gap-4">
                      <div className="flex flex-col justify-center items-start">
                        <span className="font-semibold text-base text-gray-900 leading-tight">{currentRobot.name}</span>
                        <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5">{currentRobot.id}</span>
                      </div>
                      <div className="flex flex-col justify-center items-start gap-2 mt-1 px-1 py-0.5">
                        {/* Battery status with true battery icon, always colored bg */}
                        {(() => {
                          const battery = currentRobot.battery ?? 40;
                          let batteryBg = "bg-green-100";
                          let batteryText = "text-green-600";
                          if (battery <= 20) { batteryBg = "bg-red-100"; batteryText = "text-red-600"; }
                          else if (battery <= 50) { batteryBg = "bg-yellow-100"; batteryText = "text-yellow-700"; }
                          return (
                            <span className={`flex items-center gap-1 text-xs font-medium rounded ${batteryText} ${batteryBg}`}> 
                              {/* Battery icon */}
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
                                <rect x="20" y="10" width="2" height="4" rx="1" />
                                <rect x="4" y="9" width={Math.max(1, Math.floor((battery/100)*14))} height="6" rx="1" fill="currentColor" />
                              </svg>
                              {battery}%
                            </span>
                          );
                        })()}
                        {/* SIM card icon, always gray bg */}
                        <span className="flex items-center gap-1 text-xs font-medium rounded text-gray-600 bg-gray-100">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <rect x="8" y="12" width="8" height="4" rx="1" />
                          </svg>
                          No SIM card
                        </span>
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" side="bottom" align="end" sideOffset={8} forceMount>
                  <DropdownMenuLabel className="font-semibold text-base mb-2">Select AlphaMini</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {robotList.map((robot) => (
                      <DropdownMenuItem
                        key={robot.id}
                        onClick={() => setCurrentRobot(robot)}
                        className={`flex items-center gap-3 py-2 px-2 rounded-lg ${robot.id === currentRobot.id ? 'bg-blue-50' : ''}`}
                      >
                        <Avatar className="h-9 w-9 rounded-none overflow-hidden">
                          <AvatarImage src={robot.avatar} alt={robot.name} className="object-cover w-full h-full rounded-none" />
                          <AvatarFallback className="bg-gray-300 text-gray-700 font-medium rounded-none">
                            🤖
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                          <div className="flex flex-row items-center gap-2">
                            <span className="font-medium text-gray-900 text-sm">{robot.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${robot.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{robot.status === 'online' ? 'Online' : 'Offline'}</span>
                          </div>
                          <span className="text-xs text-gray-400 mt-1">{robot.id}</span>
                        </div>
                        {robot.id === currentRobot.id && (
                          <span className="ml-2 text-blue-600 font-bold">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 py-2 px-2 text-blue-600 hover:bg-blue-50 cursor-pointer">
                    <span className="text-lg">＋</span>
                    <span className="font-medium">Bind New Robots</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ease-in-out pt-16 ${isSidebarOpen ? "ml-64" : "ml-16"
            }`}
        >
          <div className="mt-5">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
