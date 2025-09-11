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
    fullName: "Teacher",
    email: "teacher@example.com",
  }); // Dữ liệu giả định
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
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${
        isSidebarOpen ? "w-64" : "w-24"
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
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group relative ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div
                  className={`text-xl flex items-center justify-center ${
                    isSidebarOpen ? "mr-3" : "mx-auto"
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
      {isSidebarOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 p-2">
              <Image
                src={Logo2}
                alt="AlphaCode"
                width={40}
                height={40}
                className="opacity-60"
              />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Need Help?</h4>
                <p className="text-xs text-gray-500">Contact support</p>
              </div>
            </div>
          </div>
        </div>
      )}
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
              {/* Language Switcher */}
              <LanguageSwitcher variant="minimal" />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-white">3</span>
                </span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage
                        src="/your-profile-image.jpg"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-blue-600 text-white font-medium">
                        {accountData?.fullName
                          ? accountData.fullName.charAt(0).toUpperCase()
                          : "T"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {accountData?.fullName || "Teacher"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {accountData?.email || "N/A"}
                      </p>
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
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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
          className={`transition-all duration-300 ease-in-out pt-16 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
