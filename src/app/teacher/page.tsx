'use client';

import { TeacherLayout } from '@/components/layouts';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Bot, Calendar, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();

  const todayClasses = [
    {
      id: '1',
      name: 'Preschool A',
      time: '9:00 AM - 10:30 AM',
      students: 12,
      lesson: 'Introduction to Sequences',
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Preschool B',
      time: '11:00 AM - 12:30 PM',
      students: 15,
      lesson: 'Robot Movement Basics',
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Preschool C',
      time: '2:00 PM - 3:30 PM',
      students: 10,
      lesson: 'Problem Solving Games',
      status: 'upcoming'
    }
  ];

  const recentActivities = [
    {
      type: 'lesson',
      message: 'Completed "Conditional Logic" with Preschool A',
      time: '30 minutes ago',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      type: 'robot',
      message: 'Alpha Mini successfully connected to classroom network',
      time: '1 hour ago',
      icon: Bot,
      color: 'text-purple-600'
    },
    {
      type: 'assessment',
      message: 'Graded 12 coding block assignments',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <TeacherLayout user={user || undefined}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Good morning, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You have 3 classes scheduled for today. Alpha Mini is ready for interactive learning.
          </p>
        </div>

        {/* Today's Schedule */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todayClasses.map((class_) => (
              <div key={class_.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {class_.name}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                    {class_.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {class_.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {class_.students} students
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {class_.lesson}
                  </div>
                </div>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Class
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                <Bot className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Control Robot
                </span>
              </button>
              <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Create Lesson
                </span>
              </button>
              <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  View Students
                </span>
              </button>
              <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Schedule
                </span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-600 ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
