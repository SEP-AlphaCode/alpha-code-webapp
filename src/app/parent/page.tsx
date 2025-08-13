'use client';

import { ParentLayout } from '@/components/layouts';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { BookOpen, Calendar, Trophy, MessageCircle, Clock, Star } from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuth();

  // Mock data for demonstration
  const children = [
    {
      id: '1',
      name: 'Emma Johnson',
      age: 5,
      class: 'Preschool A',
      teacher: 'Ms. Chen',
      progress: 85,
      lastActivity: '2 hours ago',
      achievements: 12
    },
    {
      id: '2',
      name: 'Liam Johnson',
      age: 4,
      class: 'Preschool B',
      teacher: 'Ms. Garcia',
      progress: 72,
      lastActivity: '1 day ago',
      achievements: 8
    }
  ];

  const recentActivities = [
    {
      child: 'Emma',
      activity: 'Completed "Robot Navigation" lesson',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      child: 'Liam',
      activity: 'Earned "Problem Solver" badge',
      time: '1 day ago',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      child: 'Emma',
      activity: 'Interacted with Alpha Mini for 30 minutes',
      time: '2 days ago',
      icon: Clock,
      color: 'text-green-600'
    }
  ];

  return (
    <ParentLayout user={user || undefined}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what your children have been learning with AlphaCode
          </p>
        </div>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {children.map((child) => (
            <div key={child.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {child.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {child.class} • Teacher: {child.teacher}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{child.achievements}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Learning Progress
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {child.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${child.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last activity: {child.lastActivity}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-600 ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.child}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Parent-Teacher Conference
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Tomorrow, 3:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    AlphaCode Demo Day
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Friday, 10:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
