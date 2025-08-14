"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherDashboard() {
    return (
        <div className="space-y-8 p-6" suppressHydrationWarning>
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" suppressHydrationWarning>
                {/* Total Robots */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Robots
                        </CardTitle>
                        <div className="h-4 w-4 text-muted-foreground" suppressHydrationWarning>
                            🤖
                        </div>
                    </CardHeader>
                    <CardContent suppressHydrationWarning>
                        <div className="text-2xl font-bold" suppressHydrationWarning>12</div>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>4 online, 8 offline</p>
                    </CardContent>
                </Card>

                {/* Active Students */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Students
                        </CardTitle>
                        <div className="h-4 w-4 text-muted-foreground" suppressHydrationWarning>
                            👥
                        </div>
                    </CardHeader>
                    <CardContent suppressHydrationWarning>
                        <div className="text-2xl font-bold" suppressHydrationWarning>24</div>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>from last year</p>
                    </CardContent>
                </Card>

                {/* Lessons Completed */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Lessons Completed
                        </CardTitle>
                        <div className="h-4 w-4 text-muted-foreground" suppressHydrationWarning>
                            📚
                        </div>
                    </CardHeader>
                    <CardContent suppressHydrationWarning>
                        <div className="text-2xl font-bold" suppressHydrationWarning>156</div>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>across 8 courses</p>
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            System Health
                        </CardTitle>
                        <div className="h-4 w-4 text-muted-foreground" suppressHydrationWarning>
                            💚
                        </div>
                    </CardHeader>
                    <CardContent suppressHydrationWarning>
                        <div className="text-2xl font-bold text-green-600" suppressHydrationWarning>98%</div>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" suppressHydrationWarning>
                {/* Recent Student Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Recent Student Activity</CardTitle>
                        <p className="text-sm text-muted-foreground">Latest interactions with Alpha Mini robots</p>
                    </CardHeader>
                    <CardContent suppressHydrationWarning>
                        <div className="space-y-4" suppressHydrationWarning>
                            {[
                                { name: 'Emma', action: 'Completed "Move Forward" lesson', time: '2 min ago', avatar: 'E' },
                                { name: 'Liam', action: 'Started servo sequence', time: '5 min ago', avatar: 'L' },
                                { name: 'Sofia', action: 'LED light command', time: '8 min ago', avatar: 'S' },
                                { name: 'Noah', action: 'Sensors DE read', time: '12 min ago', avatar: 'N' }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50" suppressHydrationWarning>
                                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center" suppressHydrationWarning>
                                        <span className="text-xs font-medium" suppressHydrationWarning>{activity.avatar}</span>
                                    </div>
                                    <div className="flex-1 min-w-0" suppressHydrationWarning>
                                        <p className="text-sm font-medium text-foreground" suppressHydrationWarning>{activity.name}</p>
                                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>{activity.action}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground" suppressHydrationWarning>{activity.time}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Robot Fleet Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Robot Fleet Status</CardTitle>
                        <p className="text-sm text-muted-foreground">Real-time status of all Alpha Mini robots</p>
                    </CardHeader>
                    <CardContent suppressHydrationWarning>
                        <div className="grid grid-cols-2 gap-4" suppressHydrationWarning>
                            {[
                                { id: 'Alpha-01', status: 'Online', battery: 85, classroom: 'Classroom A' },
                                { id: 'Alpha-02', status: 'Online', battery: 73, classroom: 'Classroom B' },
                                { id: 'Alpha-03', status: 'Online', battery: 69, classroom: 'Classroom C' },
                                { id: 'Alpha-04', status: 'Online', battery: 61, classroom: 'Classroom D' },
                                { id: 'Alpha-05', status: 'Online', battery: 53, classroom: 'Classroom B' },
                                { id: 'Alpha-06', status: 'Online', battery: 40, classroom: 'Classroom C' },
                                { id: 'Alpha-07', status: 'Offline', battery: 37, classroom: 'Charging Station' },
                                { id: 'Alpha-08', status: 'Offline', battery: 29, classroom: 'Charging Station' }
                            ].map((robot, index) => (
                                <div key={index} className="p-3 border border-border rounded-lg" suppressHydrationWarning>
                                    <div className="flex items-center justify-between mb-2" suppressHydrationWarning>
                                        <span className="text-sm font-medium" suppressHydrationWarning>{robot.id}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${robot.status === 'Online'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                            }`} suppressHydrationWarning>
                                            {robot.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1" suppressHydrationWarning>
                                        <div className="flex justify-between text-xs" suppressHydrationWarning>
                                            <span className="text-muted-foreground" suppressHydrationWarning>Battery</span>
                                            <span suppressHydrationWarning>{robot.battery}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5" suppressHydrationWarning>
                                            <div
                                                className={`h-1.5 rounded-full ${robot.battery > 60 ? 'bg-green-600' :
                                                        robot.battery > 30 ? 'bg-yellow-600' : 'bg-red-600'
                                                    }`}
                                                style={{ width: `${robot.battery}%` }}
                                                suppressHydrationWarning
                                            ></div>
                                        </div>
                                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>{robot.classroom}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
