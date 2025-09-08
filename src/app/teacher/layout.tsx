"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { useLogout } from '@/hooks/use-logout';
import { LogOut, Bell, Menu } from 'lucide-react';
import { AccountData } from '@/types/account';
import Logo2 from '../../../public/logo2.png'

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accountData] = useState<AccountData | null>(null);
  const pathname = usePathname();
  const logoutMutation = useLogout();

  useEffect(() => {
    // const data = getAccountDataFromStorage();
    // setAccountData(data);
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/teacher',
      icon: '📊',
    },
    {
      name: 'Robot Management',
      href: '/teacher/robot',
      icon: '🤖',
    },
    {
      name: 'Students',
      href: '/teacher/student',
      icon: '👥',
    },
    {
      name: 'Programming',
      href: '/teacher/programming',
      icon: '💻',
    },
    {
      name: 'Classroom',
      href: '/teacher/classroom',
      icon: '🏫',
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/teacher') {
      return pathname === '/teacher';
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthGuard allowedRoles={['teacher']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-6">
              {/* Menu Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">AlphaCode</h1>
                  <p className="text-sm text-gray-500 -mt-1">Teacher Portal</p>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-white">3</span>
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {accountData?.fullName ? accountData.fullName.charAt(0).toUpperCase() : 'T'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {accountData?.fullName || 'Teacher'}
                  </p>
                  <p className="text-xs text-green-600">Online</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${
            isSidebarOpen ? 'w-64' : 'w-16'
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
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`text-xl flex items-center justify-center ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`}>
                      {item.icon}
                    </div>
                    {isSidebarOpen && (
                      <span className="truncate">{item.name}</span>
                    )}
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

          {/* Help Section */}
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

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ease-in-out pt-16 ${
            isSidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
}