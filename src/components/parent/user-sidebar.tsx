"use client";

import React from "react";
import Link from "next/link";
import { LogOut, UserCircle, Settings, Home as HomeIcon } from "lucide-react";
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
import { AccountData } from "@/types/account";
import { NavigationItem } from "@/types/user";

interface UserSidebarProps {
  isSidebarOpen: boolean;
  navigationItems: NavigationItem[];
  isActiveRoute: (href: string) => boolean;
  accountData: AccountData | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

export function UserSidebar({
  isSidebarOpen,
  navigationItems,
  isActiveRoute,
  accountData,
  onLogout,
  isLogoutPending = false,
}: UserSidebarProps) {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 flex flex-col ${isSidebarOpen ? "w-64" : "w-24"
        }`}
    >
      {/* Scrollable navigation */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden
        px-3 mt-10 pb-20
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400
      `}
      >
        {/* Home shortcut */}
        <div className="mb-3">
          <Link
            href="/"
            className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group relative text-gray-700 hover:bg-gray-50 hover:text-gray-900`}
          >
            <div className={`text-xl flex items-center justify-center ${isSidebarOpen ? "mr-3" : "mx-auto"}`}>
              🏠
            </div>
            {isSidebarOpen && <span className="truncate">Trang chủ</span>}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Trang chủ
              </div>
            )}
          </Link>
        </div>
        <div className="space-y-1 w-full">
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

                {/* Text hiển thị khi mở rộng */}
                {isSidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Tooltip khi thu nhỏ */}
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

      {/* Fixed user profile section at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        {isSidebarOpen ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full focus:outline-none">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 transition-colors cursor-pointer">
                  <Avatar className="h-11 w-11 border border-gray-300 shadow">
                    <AvatarImage src="/your-profile-image.jpg" alt="Profile" />
                    <AvatarFallback className="bg-blue-600 text-white font-medium">
                      {accountData?.fullName ? accountData.fullName.charAt(0).toUpperCase() : "T"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center">
                    <span className="font-semibold text-gray-900 text-base leading-tight truncate max-w-[140px] block">
                      {accountData?.fullName || "User"}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[120px] block">
                      {accountData?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            {/* Đổi vị trí modal tại đây: side="top" | "bottom" | "left" | "right" */}
            <DropdownMenuContent className="w-56" side="top" align="center" sideOffset={12} forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{accountData?.fullName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{accountData?.email || "N/A"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/user/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/parent/courses/mycourse" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>My Course</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} disabled={isLogoutPending}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex justify-center items-center py-3 focus:outline-none">
                <div className="flex items-center justify-center">
                  <Avatar className="h-11 w-11 border border-gray-300 shadow-sm">
                    <AvatarImage src="/your-profile-image.jpg" alt="Profile" />
                    <AvatarFallback className="bg-blue-600 text-white font-medium text-lg flex items-center justify-center">
                      {accountData?.fullName
                        ? accountData.fullName.charAt(0).toUpperCase()
                        : "T"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {accountData?.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {accountData?.email || "N/A"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/user/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} disabled={isLogoutPending}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  );
}
