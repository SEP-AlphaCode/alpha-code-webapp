"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
// Cập nhật import icon cho các mục navigation
import {
  ArrowRight,
  LogOut,
  User,
  LayoutDashboard,
  ToyBrick,
  Users,
  Code,
  School,
  Target,
  Music,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { clearAuthData, getUserInfoFromToken } from "@/utils/tokenUtils";
import { getUserRoleFromToken } from "@/utils/tokenUtils";

interface HeaderProps {
  currentSection: number;
  onNavigate: (sectionIndex: number) => void;
}

export function Header({ currentSection, onNavigate }: HeaderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
  // Chỉ chạy khi ở phía client (trình duyệt)
    if (typeof window !== "undefined") {
      clearAuthData();
      window.dispatchEvent(new Event("authStateChange"));
      window.location.href = "/";
    }
  };

  const getUserInfo = () => {
  // Chỉ chạy khi ở phía client (trình duyệt)
    if (typeof window !== "undefined") {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) return getUserInfoFromToken(accessToken);
    }
    return null;
  };

  const getUserRole = () => {
  // Chỉ chạy khi ở phía client (trình duyệt)
    if (typeof window !== "undefined") {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) return getUserRoleFromToken(accessToken);
    }
    return null;
  };

  // Sử dụng các icon từ lucide-react thay vì emoji
  const navigationItems = [
    { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { name: "Robots", href: "/teacher/robot", icon: ToyBrick },
    { name: "Students", href: "/teacher/student", icon: Users },
    { name: "Programming", href: "/teacher/programming", icon: Code },
    { name: "Classroom", href: "/teacher/classroom", icon: School },
    { name: "Activities", href: "/teacher/activities", icon: Target },
    { name: "Music", href: "/teacher/music", icon: Music },
  ];

  // Close dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInfo = getUserInfo();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 border-b border-gray-100 shadow-md bg-white/90" // Đổi shadow và thêm opacity
      style={{
        backdropFilter: `blur(${currentSection > 0 ? 12 : 6}px)`, // Giảm blur để tinh tế hơn
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Đổi kích thước logo và căn chỉnh lại để cân đối hơn */}
        <div className="w-36 h-8 flex items-center justify-center">
          <Image src="/logo1.png" alt="Logo" width={144} height={32} priority />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <button onClick={() => onNavigate(0)} className="hover:text-blue-600 transition-colors">Trang chủ</button>
          <button onClick={() => onNavigate(1)} className="hover:text-blue-600 transition-colors">Robot</button>
          <button onClick={() => onNavigate(2)} className="hover:text-blue-600 transition-colors">Tính năng</button>
          <button onClick={() => onNavigate(3)} className="hover:text-blue-600 transition-colors">Giới thiệu</button>
          <button onClick={() => onNavigate(4)} className="hover:text-blue-600 transition-colors">Liên hệ</button>
        </nav>

        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              <Button
                // Thay đổi variant thành 'ghost' hoặc không dùng variant để có kiểu dáng tối giản
                variant="ghost"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 h-auto text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline font-semibold">
                  {userInfo?.fullName || userInfo?.username || "User"}
                </span>
              </Button>

              {isDropdownOpen && getUserRole() === "teacher" && (
                // Tinh chỉnh thiết kế dropdown
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  
                  {/* Phần thông tin người dùng */}
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-bold text-gray-800 truncate">{userInfo?.fullName || userInfo?.username || "Giáo viên"}</p>
                    <p className="text-sm text-blue-600">{userInfo?.email || "Teacher"}</p>
                  </div>
                  
                  {/* Các mục navigation */}
                  <div className="p-1">
                    {navigationItems.map(item => {
                        const Icon = item.icon;
                        return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                        );
                    })}
                  </div>

                  {/* Mục đăng xuất */}
                  <div className="border-t border-gray-100 p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-150"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                Đăng nhập
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Đổi hiệu ứng động từ slideDown sang fade-in mượt mà hơn */
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </header>
  );
}