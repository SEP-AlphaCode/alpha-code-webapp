"use client"
import { RobotSelector } from "@/components/parent/robot-selector"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getUserInfoFromToken } from "@/utils/tokenUtils";

export default function KidsLayout({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        const userData = getUserInfoFromToken(accessToken);
        if (userData) {
          setUserInfo({
            fullName: userData.fullName || "User",
            email: userData.email || "N/A",
          });
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white fixed top-0 left-0 right-0 z-40 shadow-lg">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="/logo2.png" alt="AlphaCode" className="h-12 w-12" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  AlphaCode Kids
                </h1>
                <p className="text-xs sm:text-sm text-white opacity-80">
                  Fun and Learning
                </p>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <RobotSelector />
            {/* Profile Section */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 transition-colors cursor-pointer">
              <Avatar className="h-11 w-11 border border-gray-300 shadow">
                <AvatarImage src="/your-profile-image.jpg" alt="Profile" />
                <AvatarFallback className="bg-blue-600 text-white font-medium">
                  {userInfo?.fullName.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-gray-900 text-base leading-tight">
                  {userInfo?.fullName || "User Name"}
                </span>
                <span className="text-xs text-gray-500">{userInfo?.email || "user@example.com"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Adjusted Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white py-8 mt-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl font-bold mb-2">
            Keep Exploring and Learning! 🌟
          </p>
          <p className="text-lg">Crafted with ❤️ for curious minds</p>
        </div>
      </footer>
    </div>
  )
}
