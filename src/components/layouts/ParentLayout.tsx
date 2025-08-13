'use client';

import { LayoutProps } from '@/types/user';
import Header from './Header';
import Sidebar from './Sidebar';
import { 
  Home, 
  Baby, 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  Calendar,
  Settings,
  HelpCircle
} from 'lucide-react';

const parentNavigation = [
  { name: 'Dashboard', href: '/parent', icon: Home },
  { name: 'My Children', href: '/parent/children', icon: Baby },
  { name: 'Learning Progress', href: '/parent/progress', icon: BookOpen },
  { name: 'Achievements', href: '/parent/achievements', icon: Trophy },
  { name: 'Communication', href: '/parent/messages', icon: MessageCircle, badge: 3 },
  { name: 'Schedule', href: '/parent/schedule', icon: Calendar },
  { name: 'Settings', href: '/parent/settings', icon: Settings },
  { name: 'Help & Support', href: '/parent/support', icon: HelpCircle },
];

export default function ParentLayout({ children, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user} 
        title="Parent Portal" 
        showNotifications={true} 
      />
      
      <div className="flex">
        <Sidebar navigation={parentNavigation} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Quick Stats for Parents */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Baby className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Active Children
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">2</p>
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
                      Learning Hours
                    </h3>
                    <p className="text-3xl font-bold text-green-600">24.5</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Achievements
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600">15</p>
                  </div>
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
