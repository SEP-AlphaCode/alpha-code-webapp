'use client';

import { LayoutProps } from '@/types/user';
import Header from './Header';
import Sidebar from './Sidebar';
import { 
  Home, 
  Users, 
  GraduationCap, 
  Building2, 
  Settings,
  Shield,
  BarChart3,
  Database,
  FileText,
  Bot,
  AlertTriangle,
  Globe
} from 'lucide-react';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Schools', href: '/admin/schools', icon: Building2 },
  { name: 'Teachers', href: '/admin/teachers', icon: GraduationCap },
  { name: 'Robot Fleet', href: '/admin/robots', icon: Bot },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Content Management', href: '/admin/content', icon: FileText },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Database', href: '/admin/database', icon: Database },
  { name: 'System Health', href: '/admin/health', icon: AlertTriangle, badge: 2 },
  { name: 'Global Settings', href: '/admin/global', icon: Globe },
];

export default function AdminLayout({ children, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user} 
        title="System Administration" 
        showNotifications={true} 
      />
      
      <div className="flex">
        <Sidebar navigation={adminNavigation} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Total Users
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-green-600">+12% this month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Active Schools
                    </h3>
                    <p className="text-3xl font-bold text-green-600">156</p>
                    <p className="text-sm text-green-600">+3 new</p>
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
                      Robot Fleet
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">89</p>
                    <p className="text-sm text-green-600">85 online</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      System Load
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">68%</p>
                    <p className="text-sm text-yellow-600">Normal</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* System Alerts */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                    System Alerts
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    2 robots require maintenance, 1 server experiencing high load
                  </p>
                </div>
                <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Daily Active Users
                </h3>
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Chart Placeholder</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Robot Usage Statistics
                </h3>
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Chart Placeholder</p>
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
