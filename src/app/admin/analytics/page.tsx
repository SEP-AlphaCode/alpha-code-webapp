"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Bot, 
  Activity,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SystemAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with real API calls
  const analyticsData = {
    userActivity: {
      totalSessions: 1247,
      averageSessionDuration: '24m 15s',
      activeUsers: 89,
      newUsers: 23
    },
    robotUsage: {
      totalInteractions: 3456,
      averageInteractionTime: '12m 30s',
      mostUsedRobot: 'Alpha-01',
      robotUptime: '98.5%'
    },
    classroomActivity: {
      totalLessons: 156,
      completedActivities: 234,
      averageClassSize: 12,
      engagement: '94%'
    },
    systemPerformance: {
      uptime: '99.8%',
      responseTime: '1.2s',
      errorRate: '0.02%',
      dataTransfer: '2.4 TB'
    }
  };

  const weeklyData = [
    { day: 'Mon', users: 45, robots: 12, activities: 28 },
    { day: 'Tue', users: 52, robots: 14, activities: 31 },
    { day: 'Wed', users: 48, robots: 13, activities: 29 },
    { day: 'Thu', users: 61, robots: 15, activities: 35 },
    { day: 'Fri', users: 55, robots: 14, activities: 32 },
    { day: 'Sat', users: 23, robots: 8, activities: 15 },
    { day: 'Sun', users: 19, robots: 6, activities: 12 }
  ];

  const robotUsageData = [
    { robot: 'Alpha-01', usage: 85, status: 'active' },
    { robot: 'Alpha-02', usage: 78, status: 'active' },
    { robot: 'Alpha-03', usage: 72, status: 'maintenance' },
    { robot: 'Alpha-04', usage: 91, status: 'active' },
    { robot: 'Alpha-05', usage: 66, status: 'active' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // Handle export logic here
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600">Monitor system usage and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.userActivity.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Robot Interactions</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.robotUsage.totalInteractions}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.classroomActivity.completedActivities}</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.systemPerformance.uptime}</div>
            <p className="text-xs text-muted-foreground">
              Excellent performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Weekly Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="w-full flex flex-col items-center space-y-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(day.users / 70) * 100}px` }}
                      title={`Users: ${day.users}`}
                    />
                    <div 
                      className="w-full bg-green-500"
                      style={{ height: `${(day.robots / 20) * 50}px` }}
                      title={`Robots: ${day.robots}`}
                    />
                    <div 
                      className="w-full bg-purple-500 rounded-b"
                      style={{ height: `${(day.activities / 40) * 80}px` }}
                      title={`Activities: ${day.activities}`}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Robots</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span>Activities</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Robot Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Robot Usage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {robotUsageData.map((robot) => (
                <div key={robot.robot} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{robot.robot}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      robot.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {robot.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${robot.usage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{robot.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Details */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium">{analyticsData.userActivity.activeUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Users</span>
                <span className="text-sm font-medium">{analyticsData.userActivity.newUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Session Duration</span>
                <span className="text-sm font-medium">{analyticsData.userActivity.averageSessionDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="text-sm font-medium">{analyticsData.userActivity.totalSessions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Robot Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Robot Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Most Used Robot</span>
                <span className="text-sm font-medium">{analyticsData.robotUsage.mostUsedRobot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Robot Uptime</span>
                <span className="text-sm font-medium">{analyticsData.robotUsage.robotUptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Interaction Time</span>
                <span className="text-sm font-medium">{analyticsData.robotUsage.averageInteractionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Interactions</span>
                <span className="text-sm font-medium">{analyticsData.robotUsage.totalInteractions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">System Uptime</span>
                <span className="text-sm font-medium text-green-600">{analyticsData.systemPerformance.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium">{analyticsData.systemPerformance.responseTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-medium text-green-600">{analyticsData.systemPerformance.errorRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data Transfer</span>
                <span className="text-sm font-medium">{analyticsData.systemPerformance.dataTransfer}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
