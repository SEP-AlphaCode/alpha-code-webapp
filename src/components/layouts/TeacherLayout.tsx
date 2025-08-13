'use client';

import { LayoutProps } from '@/types/user';
import Header from './Header';
import Sidebar from './Sidebar';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  ClipboardList,
  Bot,
  MessageCircle, 
  BarChart3,
  Settings,
  Lightbulb
} from 'lucide-react';

const teacherNavigation = [
  { name: 'Dashboard', href: '/teacher', icon: Home },
  { name: 'My Classes', href: '/teacher/classes', icon: Users },
  { name: 'Lesson Plans', href: '/teacher/lessons', icon: BookOpen },
  { name: 'Alpha Mini Control', href: '/teacher/robot', icon: Bot },
  { name: 'Schedule', href: '/teacher/schedule', icon: Calendar },
  { name: 'Assignments', href: '/teacher/assignments', icon: ClipboardList },
  { name: 'Student Progress', href: '/teacher/progress', icon: BarChart3 },
  { name: 'Communication', href: '/teacher/messages', icon: MessageCircle, badge: 5 },
  { name: 'Activities', href: '/teacher/activities', icon: Lightbulb },
  { name: 'Settings', href: '/teacher/settings', icon: Settings },
];

export default function TeacherLayout({ children, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user} 
        title="Teacher Dashboard" 
        showNotifications={true} 
      />
      
      <div className="flex">
        <Sidebar navigation={teacherNavigation} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Quick Stats for Teachers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Total Students
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">28</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Active Lessons
                    </h3>
                    <p className="text-3xl font-bold text-green-600">12</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Bot className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Robot Sessions
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">45</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClipboardList className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Assignments
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">8</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Robot Status Banner */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bot className="h-10 w-10" />
                  <div>
                    <h3 className="text-xl font-bold">Alpha Mini Robot Status</h3>
                    <p className="text-purple-100">Connected and ready for interaction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
