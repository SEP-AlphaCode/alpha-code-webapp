"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
// Cập nhật import icon cho tất cả các mục navigation
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
  BarChart2, // Phân tích hệ thống
  QrCode,     // Mã QR
  CreditCard, // Thẻ Osmo (dùng icon thẻ tín dụng)
  Bookmark,   // Dấu đánh dấu
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { clearAuthData, getUserInfoFromToken } from "@/utils/tokenUtils";
import { getUserRoleFromToken } from "@/utils/tokenUtils";

interface HeaderProps {
  currentSection: number;
  onNavigate: (sectionIndex: number) => void;
}

// ---------------------------------------------------
// ĐỊNH NGHĨA CÁC MỤC ĐIỀU HƯỚNG THEO VAI TRÒ (ROLE-BASED NAVIGATION)
// ---------------------------------------------------

// Dựa trên ảnh: Bảng điều khiển, Người dùng, Phân tích hệ thống, Robot, Lớp học, Mã QR, Thẻ Osmo, Dấu đánh dấu
const adminNavigationItems = [
  { name: "Bảng điều khiển", href: "/admin", icon: LayoutDashboard },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Phân tích hệ thống", href: "/admin/analysis", icon: BarChart2 },
  { name: "Robot", href: "/admin/robot", icon: ToyBrick },
  { name: "Lớp học", href: "/admin/classroom", icon: School },
  { name: "Mã QR", href: "/admin/qrcode", icon: QrCode },
  { name: "Thẻ Osmo", href: "/admin/osmocard", icon: CreditCard },
  { name: "Dấu đánh dấu", href: "/admin/bookmark", icon: Bookmark },
];

// Navigation items hiện tại của Parent (Giữ nguyên hoặc tùy chỉnh)
const parentNavigationItems = [
  { name: "Bảng điều khiển", href: "/parent", icon: LayoutDashboard },
  { name: "Robot", href: "/parent/robot", icon: ToyBrick },
  { name: "Học sinh", href: "/parent/student", icon: Users },
  { name: "Lập trình", href: "/parent/programming", icon: Code },
  { name: "Lớp học", href: "/parent/classroom", icon: School },
  { name: "Hoạt động", href: "/parent/activities", icon: Target },
  { name: "Âm nhạc", href: "/parent/music", icon: Music },
];

// Navigation items cho Child (Ví dụ)
const childNavigationItems = [
  { name: "Bảng điều khiển của tôi", href: "/child", icon: LayoutDashboard },
  { name: "Lớp học của tôi", href: "/child/classroom", icon: School },
  { name: "Lập trình của tôi", href: "/child/programming", icon: Code },
];


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
  
  const userRole = getUserRole();

  // Hàm chọn mảng điều hướng dựa trên Role
  const getNavigationItems = (role: string | null) => {
    switch (role) {
      case "Admin":
        return adminNavigationItems;
      case "Child":
        return childNavigationItems;
      case "Parent":
        return parentNavigationItems;
      default:
        return parentNavigationItems; // Mặc định nếu role không xác định
    }
  };

  const currentNavigationItems = getNavigationItems(userRole);


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
              
              {/* CẬP NHẬT LOGIC: Hiển thị nếu đã đăng nhập và có Role */}
              {isDropdownOpen && userRole && ( 
                // Tinh chỉnh thiết kế dropdown
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  
                  {/* Phần thông tin người dùng */}
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-bold text-gray-800 truncate">
                        {userInfo?.fullName || userInfo?.username || "Người dùng"}
                    </p>
                    <p className="text-sm text-blue-600">
                        {userRole}
                        {userInfo?.email ? ` | ${userInfo.email}` : ""}
                    </p>
                  </div>
                  
                  {/* Các mục navigation */}
                  <div className="p-1">
                    {currentNavigationItems.map(item => { // DÙNG MẢNG ĐÃ ĐƯỢC CHỌN TỪ ROLE
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
              <Button className="modern-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
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