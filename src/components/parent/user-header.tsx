"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo2 from "../../../public/logo2.png";
import { RobotSelector } from "./robot-selector";
import { UserSidebar } from "./user-sidebar";
import { AccountData } from "@/types/account";
import { NavigationItem } from "@/types/user";

interface UserHeaderProps {
  onToggleSidebar: () => void;
  // Sidebar props for mobile
  navigationItems: NavigationItem[];
  isActiveRoute: (href: string) => boolean;
  accountData: AccountData | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

export function UserHeader({
  onToggleSidebar,
  navigationItems,
  isActiveRoute,
  accountData,
  onLogout,
  isLogoutPending = false
}: UserHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Menu Toggle for Desktop */}
          <button
            onClick={onToggleSidebar}
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
              <UserSidebar
                isSidebarOpen={true}
                navigationItems={navigationItems}
                isActiveRoute={isActiveRoute}
                accountData={accountData}
                onLogout={onLogout}
                isLogoutPending={isLogoutPending}
              />
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
                User Portal
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
          <RobotSelector className="" />
        </div>
      </div>
    </header>
  );
}