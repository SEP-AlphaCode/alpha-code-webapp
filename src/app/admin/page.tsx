'use client';

import { AdminLayout } from '@/components/layouts';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Building2, Bot, AlertTriangle, TrendingUp, Database } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const systemHealth = {
    servers: { status: 'healthy', count: 12, issues: 0 },
    database: { status: 'healthy', performance: '98%', connections: 245 },
    robots: { status: 'warning', online: 85, offline: 4, maintenance: 2 },
    users: { active: 1247, growth: '+12%', newToday: 23 }
  };

  const recentAlerts = [
    {
      id: '1',
      type: 'warning',
      message: 'Robot ID #234 requires maintenance',
      time: '15 minutes ago',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'info',
      message: 'New school registration: Sunshine Elementary',
      time: '1 hour ago',
      severity: 'low'
    },
    {
      id: '3',
      type: 'error',
      message: 'Server load spike detected in US-East region',
      time: '2 hours ago',
      severity: 'high'
    }
  ];

  const schoolStats = [
    { name: 'Sunshine Elementary', students: 342, teachers: 28, robots: 3, status: 'active' },
    { name: 'Green Valley School', students: 198, teachers: 15, robots: 2, status: 'active' },
    { name: 'Rainbow Academy', students: 267, teachers: 22, robots: 3, status: 'active' },
    { name: 'Little Learners', students: 156, teachers: 12, robots: 2, status: 'pending' }
  ];

  return (
    <AdminLayout user={user || undefined}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            System Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage the AlphaCode platform infrastructure
          </p>
        </div>

        {/* System Health Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Server Health
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {systemHealth.servers.count}
                </p>
                <p className="text-sm text-green-600">All systems operational</p>
              </div>
              <Database className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Database Performance
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {systemHealth.database.performance}
                </p>
                <p className="text-sm text-blue-600">{systemHealth.database.connections} connections</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Robot Fleet
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {systemHealth.robots.online}
                </p>
                <p className="text-sm text-yellow-600">{systemHealth.robots.offline} offline, {systemHealth.robots.maintenance} maintenance</p>
              </div>
              <Bot className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Users
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {systemHealth.users.active.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">{systemHealth.users.growth} growth</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Alerts and Schools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Alerts */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Alerts
            </h3>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School Management */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              School Overview
            </h3>
            <div className="space-y-3">
              {schoolStats.map((school, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {school.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {school.students} students • {school.teachers} teachers • {school.robots} robots
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    school.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {school.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
              <Bot className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Robot Fleet</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
              <Building2 className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Add School</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
              <Database className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Database</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
