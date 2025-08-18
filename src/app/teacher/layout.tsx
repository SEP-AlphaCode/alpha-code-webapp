"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/teacher',
      icon: '📊',
      description: 'Overview and quick stats'
    },
    {
      name: 'Robot Management',
      href: '/teacher/robot',
      icon: '🤖',
      description: 'Manage robots and devices'
    },
    {
      name: 'Student',
      href: '/teacher/student',
      icon: '👥',
      description: 'Student management'
    },
    {
      name: 'Programming',
      href: '/teacher/programming',
      icon: '💻',
      description: 'Code and assignments'
    },
    {
      name: 'Classroom',
      href: '/teacher/classroom',
      icon: '🏫',
      description: 'Virtual classroom'
    },
    // {
    //   name: 'Analytics',
    //   href: '/teacher/analytics',
    //   icon: '📈',
    //   description: 'Performance analytics'
    // },
    // {
    //   name: 'Settings',
    //   href: '/teacher/settings',
    //   icon: '⚙️',
    //   description: 'Account settings'
    // }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/teacher') {
      return pathname === '/teacher';
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    // Add logout logic here
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/alphacodelogo.png"
                alt="AlphaCode Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <h1 className="text-xl font-bold text-gray-900">AlphaCode Teacher</h1>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </Button>

            {/* Profile Dropdown */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">T</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Teacher</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActiveRoute(item.href)
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && (
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {isSidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white">
              <div className="text-sm font-medium mb-1">Need Help?</div>
              <div className="text-xs opacity-90 mb-2">Check our documentation</div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs bg-white text-gray-800 hover:bg-gray-100"
              >
                View Docs
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        } pt-16`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}