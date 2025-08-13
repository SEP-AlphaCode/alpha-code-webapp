'use client';

import { LayoutProps } from '@/types/user';
import Header from './Header';
import Sidebar from './Sidebar';
import { 
  Home, 
  Users, 
  Building2, 
  BarChart3,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  Target,
  Briefcase,
  Globe,
  Award
} from 'lucide-react';

const managerNavigation = [
  { name: 'Dashboard', href: '/manager', icon: Home },
  { name: 'Organizations', href: '/manager/organizations', icon: Building2 },
  { name: 'Performance', href: '/manager/performance', icon: BarChart3 },
  { name: 'Financial', href: '/manager/financial', icon: DollarSign },
  { name: 'Growth Analytics', href: '/manager/growth', icon: TrendingUp },
  { name: 'Strategic Planning', href: '/manager/strategy', icon: Target },
  { name: 'Team Management', href: '/manager/teams', icon: Users },
  { name: 'Reports', href: '/manager/reports', icon: FileText },
  { name: 'Calendar', href: '/manager/calendar', icon: Calendar },
  { name: 'Business Dev', href: '/manager/business', icon: Briefcase },
  { name: 'Global Expansion', href: '/manager/expansion', icon: Globe },
  { name: 'Quality Assurance', href: '/manager/quality', icon: Award },
];

export default function ManagerLayout({ children, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user} 
        title="Management Dashboard" 
        showNotifications={true} 
      />
      
      <div className="flex">
        <Sidebar navigation={managerNavigation} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Monthly Revenue
                    </h3>
                    <p className="text-3xl font-bold text-green-600">$124.5K</p>
                    <p className="text-sm text-green-600">+15.2% vs last month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Partner Schools
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">342</p>
                    <p className="text-sm text-green-600">+28 this quarter</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Active Users
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">15.2K</p>
                    <p className="text-sm text-green-600">+8.7% growth</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Market Growth
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">23.8%</p>
                    <p className="text-sm text-green-600">Above target</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Performance Indicators */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Q4 2024 Performance</h3>
                  <p className="text-blue-100">Exceeding targets across all metrics</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">127%</p>
                    <p className="text-sm text-blue-200">Revenue Target</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">95%</p>
                    <p className="text-sm text-blue-200">Customer Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">312%</p>
                    <p className="text-sm text-blue-200">User Growth</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Strategic Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Regional Performance
                  </h3>
                  <Globe className="h-6 w-6 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">North America</span>
                    <span className="text-sm text-green-600">+24.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Europe</span>
                    <span className="text-sm text-green-600">+18.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Asia Pacific</span>
                    <span className="text-sm text-green-600">+31.7%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Strategic Initiatives
                  </h3>
                  <Target className="h-6 w-6 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AI Enhancement</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">On Track</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Global Expansion</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Product Innovation</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Ahead</span>
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
